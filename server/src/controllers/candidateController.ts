import { Response } from "express";
import path from "path";
import { supabase } from "../lib/supabase";
import { env } from "../config/env";
import type { AuthRequest } from "../middleware/authMiddleware";
import { generateSlug } from "../utils/generateSlug";

function getSingleString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value) && typeof value[0] === "string" && value[0].trim()) return value[0].trim();
  return null;
}

async function histories(candidateIds: string[]) {
  if (!candidateIds.length) return new Map<string, any[]>();
  const { data, error } = await supabase.from("vote_history").select("candidate_id,votes,recorded_at").in("candidate_id", candidateIds).order("recorded_at", { ascending: true });
  if (error) throw error;
  const map = new Map<string, any[]>();
  for (const row of data ?? []) map.set(row.candidate_id, [...(map.get(row.candidate_id) ?? []), { date: row.recorded_at, votes: row.votes }]);
  return map;
}

function shape(c: any, history: any[] = []) {
  return { _id: c.id, id: c.id, name: c.name, image: c.image, category: c.category, department: c.department, votes: c.votes, slug: c.slug, bio: c.bio, voteHistory: history, awardSpace: c.award_space_id, createdAt: c.created_at, updatedAt: c.updated_at };
}

async function uploadImage(file: Express.Multer.File, awardSpace: string) {
  const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
  const objectPath = `${awardSpace}/${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const { error } = await supabase.storage.from(env.SUPABASE_STORAGE_BUCKET).upload(objectPath, file.buffer, { contentType: file.mimetype, upsert: false });
  if (error) throw error;
  return supabase.storage.from(env.SUPABASE_STORAGE_BUCKET).getPublicUrl(objectPath).data.publicUrl;
}

async function deleteImage(publicUrl: string) {
  const marker = `/storage/v1/object/public/${env.SUPABASE_STORAGE_BUCKET}/`;
  const i = publicUrl.indexOf(marker); if (i < 0) return;
  const objectPath = decodeURIComponent(publicUrl.slice(i + marker.length));
  await supabase.storage.from(env.SUPABASE_STORAGE_BUCKET).remove([objectPath]);
}

export async function getCandidates(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.awardSpace) return res.status(401).json({ message: "Unauthorized" });
    const result = await supabase.from("candidates").select("*").eq("award_space_id", req.user.awardSpace).order("created_at", { ascending: false });
    if (result.error) throw result.error;
    const hm = await histories((result.data ?? []).map((c: any) => c.id));
    return res.json((result.data ?? []).map((c: any) => shape(c, hm.get(c.id) ?? [])));
  } catch (error) { console.error(error); return res.status(500).json({ message: "Failed to fetch candidates" }); }
}

export async function getCandidateById(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.awardSpace) return res.status(401).json({ message: "Unauthorized" });
    const id = getSingleString(req.params.id); if (!id) return res.status(400).json({ message: "Invalid candidate id" });
    const result = await supabase.from("candidates").select("*").eq("id", id).eq("award_space_id", req.user.awardSpace).maybeSingle();
    if (result.error) throw result.error; if (!result.data) return res.status(404).json({ message: "Candidate not found" });
    const hm = await histories([id]); return res.json(shape(result.data, hm.get(id) ?? []));
  } catch (error) { console.error(error); return res.status(500).json({ message: "Failed to fetch candidate" }); }
}

export async function createCandidate(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.awardSpace) return res.status(401).json({ message: "Unauthorized" });
    const name = getSingleString(req.body.name), category = getSingleString(req.body.category), department = getSingleString(req.body.department), bio = getSingleString(req.body.bio) || "";
    if (!name || !category || !department) return res.status(400).json({ message: "Name, category, and department are required" });
    if (!req.file) return res.status(400).json({ message: "Candidate image is required" });
    const image = await uploadImage(req.file, req.user.awardSpace);
    const result = await supabase.from("candidates").insert({ name, image, category, department, bio, slug: generateSlug(`${name}-${Date.now()}`), votes: 0, award_space_id: req.user.awardSpace }).select("*").single();
    if (result.error) { await deleteImage(image); throw result.error; }
    const h = await supabase.from("vote_history").insert({ candidate_id: result.data.id, votes: 0 }); if (h.error) throw h.error;
    return res.status(201).json(shape(result.data, [{ date: new Date().toISOString(), votes: 0 }]));
  } catch (error) { console.error(error); return res.status(500).json({ message: "Failed to create candidate" }); }
}

export async function updateCandidate(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.awardSpace) return res.status(401).json({ message: "Unauthorized" });
    const id = getSingleString(req.params.id); if (!id) return res.status(400).json({ message: "Invalid candidate id" });
    const current = await supabase.from("candidates").select("*").eq("id", id).eq("award_space_id", req.user.awardSpace).maybeSingle();
    if (current.error) throw current.error; if (!current.data) return res.status(404).json({ message: "Candidate not found" });
    const payload: any = { updated_at: new Date().toISOString() };
    for (const key of ["name", "category", "department", "bio"]) { const v = getSingleString(req.body[key]); if (v !== null) payload[key] = v; }
    if (req.file) payload.image = await uploadImage(req.file, req.user.awardSpace);
    const updated = await supabase.from("candidates").update(payload).eq("id", id).eq("award_space_id", req.user.awardSpace).select("*").single();
    if (updated.error) throw updated.error;
    if (payload.image && current.data.image) await deleteImage(current.data.image);
    const hm = await histories([id]); return res.json(shape(updated.data, hm.get(id) ?? []));
  } catch (error) { console.error(error); return res.status(500).json({ message: "Failed to update candidate" }); }
}

export async function deleteCandidate(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.awardSpace) return res.status(401).json({ message: "Unauthorized" });
    const id = getSingleString(req.params.id); if (!id) return res.status(400).json({ message: "Invalid candidate id" });
    const current = await supabase.from("candidates").select("image").eq("id", id).eq("award_space_id", req.user.awardSpace).maybeSingle();
    if (current.error) throw current.error; if (!current.data) return res.status(404).json({ message: "Candidate not found" });
    const result = await supabase.from("candidates").delete().eq("id", id).eq("award_space_id", req.user.awardSpace); if (result.error) throw result.error;
    if (current.data.image) await deleteImage(current.data.image);
    return res.json({ message: "Candidate deleted successfully" });
  } catch (error) { console.error(error); return res.status(500).json({ message: "Failed to delete candidate" }); }
}

export async function getCandidateBySlug(req: AuthRequest, res: Response) {
  try {
    const slug = getSingleString(req.params.slug); if (!slug) return res.status(400).json({ message: "Invalid candidate slug" });
    const result = await supabase.from("candidates").select("*").eq("slug", slug).maybeSingle();
    if (result.error) throw result.error; if (!result.data) return res.status(404).json({ message: "Candidate not found" });
    const settingsResult = await supabase.from("settings").select("*").eq("award_space_id", result.data.award_space_id).maybeSingle(); if (settingsResult.error) throw settingsResult.error;
    const categoryResult = await supabase.from("candidates").select("*").eq("award_space_id", result.data.award_space_id).eq("category", result.data.category).order("votes", { ascending: false }).order("created_at", { ascending: true }); if (categoryResult.error) throw categoryResult.error;
    const ids = [result.data.id, ...(categoryResult.data ?? []).map((c: any) => c.id)]; const hm = await histories(ids);
    const settings = settingsResult.data ? { _id: settingsResult.data.id, votingStart: settingsResult.data.voting_start, votingEnd: settingsResult.data.voting_end, candidateCanViewVotes: settingsResult.data.candidate_can_view_votes, awardSpace: settingsResult.data.award_space_id } : null;
    return res.json({ candidate: shape(result.data, hm.get(result.data.id) ?? []), settings, categoryCandidates: (categoryResult.data ?? []).map((c: any) => shape(c, hm.get(c.id) ?? [])) });
  } catch (error) { console.error(error); return res.status(500).json({ message: "Failed to fetch candidate" }); }
}
