import nodemailer from "nodemailer";
import { env } from "../config/env";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (!to) throw new Error("Recipient email is required");
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS || !env.SMTP_FROM) {
    throw new Error("Email SMTP is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS and SMTP_FROM in server/.env");
  }

  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });

  return transporter.sendMail({
    from: env.SMTP_FROM,
    to,
    subject,
    html,
  });
}
