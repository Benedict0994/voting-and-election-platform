export interface SendTemplateOptions {
  templateName: string;
  templateProps: Record<string, any>;
  subject: string;
  to: string;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export type TemplateName =
  | "welcome" |
  "otp"

 ;