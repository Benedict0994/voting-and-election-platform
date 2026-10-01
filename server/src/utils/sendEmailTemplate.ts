import { renderTemplate } from "./renderTemplate";
import { sendEmail } from "./sendEmail";
import { SendTemplateOptions, TemplateName } from "./types";

const VALID_TEMPLATES = new Set<TemplateName>([
  "welcome",
  "otp"
  
]);

/**
 * Reusable service hook for sending templated emails.
 * Drop this into any Express service and call it with the same args
 * that were previously passed to the Next.js API route.
 *
 * @example
 * await sendTemplateEmail({
 *   templateName: "ContactUsEmail",
 *   templateProps: { name: "Jane", message: "Hello!" },
 *   subject: "New Contact Form Submission",
 *   to: "admin@example.com",
 * });
 */
export async function sendTemplateEmail({
  templateName,
  templateProps,
  subject,
  to,
}: SendTemplateOptions): Promise<void> {
  if (!VALID_TEMPLATES.has(templateName as TemplateName)) {
    throw new Error(`Unknown email template: "${templateName}"`);
  }

  const html = await renderTemplate(templateName as TemplateName, templateProps);

  await sendEmail({ to, subject, html });
  console.log("sent waiting")
}