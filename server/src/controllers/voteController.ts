import crypto from "crypto";
import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/authMiddleware";
import { supabase } from "../lib/supabase";
import { env } from "../config/env";

function hash(value: string) {
  return crypto.createHmac("sha256", env.JWT_SECRET).update(value).digest("hex");
}

export async function castVote(req: Request, res: Response) {
  try {
    const candidateId = typeof req.body.candidateId === "string" ? req.body.candidateId.trim() : "";
    const voterToken = typeof req.body.voterToken === "string" ? req.body.voterToken.trim() : "";
    if (!candidateId || !voterToken || voterToken.length < 16 || voterToken.length > 200) {
      return res.status(400).json({ message: "Candidate and valid voter token are required" });
    }
    const forwarded = req.headers["x-forwarded-for"];
    const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0]) || req.ip || "";
    const { data, error } = await supabase.rpc("cast_vote", {
      p_candidate_id: candidateId,
      p_voter_hash: hash(voterToken),
      p_ip_hash: ip ? hash(ip.trim()) : null,
      p_user_agent: req.get("user-agent") || null,
    });
    if (error) {
      const msg = error.message || "Vote could not be recorded";
      if (msg.includes("already voted")) return res.status(409).json({ message: msg });
      if (msg.includes("not started") || msg.includes("ended") || msg.includes("not configured")) return res.status(403).json({ message: msg });
      if (msg.includes("Candidate not found")) return res.status(404).json({ message: msg });
      throw error;
    }
    return res.status(201).json({ message: "Vote recorded successfully", vote: data?.[0] ?? null });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to record vote" });
  }
}

export async function adjustVotes(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });
    const candidateId = typeof req.params.id === "string" ? req.params.id : "";
    const delta = Number(req.body.delta);
    const reason = typeof req.body.reason === "string" ? req.body.reason.trim() : "";
    if (!candidateId || !Number.isInteger(delta) || delta === 0 || reason.length < 3) {
      return res.status(400).json({ message: "A non-zero whole-number adjustment and reason are required" });
    }
    const { data, error } = await supabase.rpc("adjust_candidate_votes", {
      p_candidate_id: candidateId,
      p_admin_id: req.user.id,
      p_delta: delta,
      p_reason: reason,
    });
    if (error) throw error;
    return res.json({ message: "Vote adjustment recorded", adjustment: data?.[0] ?? null });
  } catch (error: any) {
    console.error(error);
    return res.status(400).json({ message: error?.message || "Failed to adjust votes" });
  }
}

export async function getVoteAudit(req: AuthRequest, res: Response) {
  try {
    if (!req.user?.awardSpace) return res.status(401).json({ message: "Unauthorized" });
    const [votes, adjustments] = await Promise.all([
      supabase.from("votes").select("id,candidate_id,category,quantity,status,payment_provider,payment_reference,amount_minor,currency,created_at,confirmed_at").eq("award_space_id", req.user.awardSpace).order("created_at", { ascending: false }).limit(500),
      supabase.from("vote_adjustments").select("id,candidate_id,admin_id,delta,reason,previous_total,new_total,created_at").eq("award_space_id", req.user.awardSpace).order("created_at", { ascending: false }).limit(500),
    ]);
    if (votes.error) throw votes.error;
    if (adjustments.error) throw adjustments.error;
    return res.json({ votes: votes.data ?? [], adjustments: adjustments.data ?? [] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to load vote audit" });
  }
}
