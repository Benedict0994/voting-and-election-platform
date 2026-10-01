import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { supabase } from "../lib/supabase";
import { generateToken } from "../utils/generateToken";
import { sendTemplateEmail } from "../utils/sendEmailTemplate";
import { generateSlug } from "../utils/generateSlug";
import { generateOTP } from "../utils/generateOTP";

function getSingleString(value: unknown): string | null {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value) && typeof value[0] === "string" && value[0].trim()) return value[0].trim();
  return null;
}

function tokenFor(admin: any) {
  return generateToken({ id: admin.id, email: admin.email, name: admin.name, awardSpace: admin.award_space_id });
}

function userFor(admin: any) {
  return { id: admin.id, name: admin.name, email: admin.email, awardSpace: admin.award_space_id };
}

export async function signup(req: Request, res: Response) {
  try {
    const name = getSingleString(req.body.name);
    const rawEmail = getSingleString(req.body.email);
    const password = getSingleString(req.body.password);
    const awardName = getSingleString(req.body.awardName);
    const email = rawEmail?.toLowerCase() ?? null;
    if (!name || !email || !password || !awardName) return res.status(400).json({ message: "All fields are required" });

    const { data: existing } = await supabase.from("admins").select("id").eq("email", email).maybeSingle();
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    const awardSlug = generateSlug(awardName);
    let { data: awardSpace, error: awardError } = await supabase.from("award_spaces").select("*").eq("slug", awardSlug).maybeSingle();
    if (awardError) throw awardError;

    if (!awardSpace) {
      const created = await supabase.from("award_spaces").insert({ name: awardName, slug: awardSlug, is_active: true }).select("*").single();
      if (created.error) throw created.error;
      awardSpace = created.data;
      const settings = await supabase.from("settings").insert({ award_space_id: awardSpace.id, voting_start: null, voting_end: null, candidate_can_view_votes: true });
      if (settings.error) throw settings.error;
    }

    const otp = generateOTP();
    const { data: admin, error } = await supabase.from("admins").insert({
      name, email, password: await bcrypt.hash(password, 10), is_verified: false, otp,
      otp_expires: new Date(Date.now() + 10 * 60 * 1000).toISOString(), award_space_id: awardSpace.id,
    }).select("*").single();
    if (error) throw error;

    await sendTemplateEmail({ templateName: "otp", templateProps: { otp }, subject: "Verify Your Email - AwardVote", to: email });
    return res.status(201).json({ message: "Signup successful. OTP sent to your email.", adminId: admin.id, email: admin.email, requiresVerification: true });
  } catch (error) { console.error(error); return res.status(500).json({ message: "Signup failed" }); }
}

export async function verifyOTP(req: Request, res: Response) {
  try {
    const adminId = getSingleString(req.body.adminId); const otp = getSingleString(req.body.otp);
    if (!adminId || !otp) return res.status(400).json({ message: "Admin ID and OTP are required" });
    const { data: admin, error } = await supabase.from("admins").select("*").eq("id", adminId).maybeSingle();
    if (error) throw error; if (!admin) return res.status(404).json({ message: "Admin not found" });
    if (!admin.otp_expires || new Date() > new Date(admin.otp_expires)) return res.status(400).json({ message: "OTP has expired" });
    if (admin.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    const updated = await supabase.from("admins").update({ is_verified: true, otp: null, otp_expires: null, updated_at: new Date().toISOString() }).eq("id", adminId).select("*").single();
    if (updated.error) throw updated.error;
    return res.json({ message: "Email verified successfully", token: tokenFor(updated.data), user: userFor(updated.data) });
  } catch (error) { console.error(error); return res.status(500).json({ message: "OTP verification failed" }); }
}

export async function resendOTP(req: Request, res: Response) {
  try {
    const adminId = getSingleString(req.body.adminId); if (!adminId) return res.status(400).json({ message: "Admin ID is required" });
    const { data: admin, error } = await supabase.from("admins").select("*").eq("id", adminId).maybeSingle();
    if (error) throw error; if (!admin) return res.status(404).json({ message: "Admin not found" });
    if (admin.is_verified) return res.status(400).json({ message: "Account is already verified" });
    const otp = generateOTP();
    const update = await supabase.from("admins").update({ otp, otp_expires: new Date(Date.now() + 10 * 60 * 1000).toISOString() }).eq("id", adminId);
    if (update.error) throw update.error;
    await sendTemplateEmail({ templateName: "otp", templateProps: { otp }, subject: "Verify Your Email - AwardVote", to: admin.email });
    return res.json({ message: "OTP resent to your email" });
  } catch (error) { console.error(error); return res.status(500).json({ message: "Failed to resend OTP" }); }
}

export async function login(req: Request, res: Response) {
  try {
    const email = getSingleString(req.body.email)?.toLowerCase(); const password = getSingleString(req.body.password);
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" });
    const { data: admin, error } = await supabase.from("admins").select("*").eq("email", email).maybeSingle();
    if (error) throw error; if (!admin || !(await bcrypt.compare(password, admin.password))) return res.status(401).json({ message: "Invalid email or password" });
    if (!admin.is_verified) return res.status(403).json({ message: "Admin account not verified" });
    return res.json({ token: tokenFor(admin), user: userFor(admin) });
  } catch (error) { console.error(error); return res.status(500).json({ message: "Login failed" }); }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const email = getSingleString(req.body.email)?.toLowerCase(); if (!email) return res.status(400).json({ message: "Email is required" });
    const { data: admin, error } = await supabase.from("admins").select("id").eq("email", email).maybeSingle();
    if (error) throw error; if (!admin) return res.status(404).json({ message: "No admin found with that email" });
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const update = await supabase.from("admins").update({ reset_password_token: hashedToken, reset_password_expires: new Date(Date.now() + 15 * 60 * 1000).toISOString() }).eq("id", admin.id);
    if (update.error) throw update.error;
    return res.json({ message: "Reset token generated", resetToken });
  } catch (error) { console.error(error); return res.status(500).json({ message: "Forgot password failed" }); }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const token = getSingleString(req.params.token); const password = getSingleString(req.body.password);
    if (!token) return res.status(400).json({ message: "Invalid reset token" }); if (!password) return res.status(400).json({ message: "Password is required" });
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const { data: admin, error } = await supabase.from("admins").select("id,reset_password_expires").eq("reset_password_token", hashedToken).maybeSingle();
    if (error) throw error; if (!admin || !admin.reset_password_expires || new Date(admin.reset_password_expires) <= new Date()) return res.status(400).json({ message: "Token is invalid or expired" });
    const update = await supabase.from("admins").update({ password: await bcrypt.hash(password, 10), reset_password_token: null, reset_password_expires: null }).eq("id", admin.id);
    if (update.error) throw update.error; return res.json({ message: "Password reset successful" });
  } catch (error) { console.error(error); return res.status(500).json({ message: "Reset password failed" }); }
}
