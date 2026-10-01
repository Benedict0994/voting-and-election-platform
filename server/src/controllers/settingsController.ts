import { Response } from "express";
import { supabase } from "../lib/supabase";
import type { AuthRequest } from "../middleware/authMiddleware";

const shape = (s: any) => ({ _id: s.id, votingStart: s.voting_start, votingEnd: s.voting_end, candidateCanViewVotes: s.candidate_can_view_votes, awardSpace: s.award_space_id, createdAt: s.created_at, updatedAt: s.updated_at });

export async function getSettings(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.awardSpace) return res.status(401).json({ message: "Unauthorized" });
    let { data, error } = await supabase.from("settings").select("*").eq("award_space_id", req.user.awardSpace).maybeSingle();
    if (error) throw error;
    if (!data) {
      const created = await supabase.from("settings").insert({ award_space_id: req.user.awardSpace, voting_start: null, voting_end: null, candidate_can_view_votes: true }).select("*").single();
      if (created.error) throw created.error; data = created.data;
    }
    return res.json(shape(data));
  } catch (error) { console.error(error); return res.status(500).json({ message: "Failed to fetch settings" }); }
}

export async function updateSettings(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.awardSpace) return res.status(401).json({ message: "Unauthorized" });
    const { votingStart, votingEnd, candidateCanViewVotes } = req.body;
    const payload: any = { award_space_id: req.user.awardSpace, voting_start: votingStart ?? null, voting_end: votingEnd ?? null, updated_at: new Date().toISOString() };
    if (typeof candidateCanViewVotes === "boolean") payload.candidate_can_view_votes = candidateCanViewVotes;
    const result = await supabase.from("settings").upsert(payload, { onConflict: "award_space_id" }).select("*").single();
    if (result.error) throw result.error;
    return res.json(shape(result.data));
  } catch (error) { console.error(error); return res.status(500).json({ message: "Failed to update settings" }); }
}
