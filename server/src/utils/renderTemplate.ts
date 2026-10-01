import fs from "fs/promises";
import path from "path";
import { TemplateName } from "./types";

const TEMPLATES_DIR = path.resolve(__dirname, "../emails");

/**
 * Loads an HTML template file and interpolates {{key}} placeholders
 * with the provided props. Supports basic conditionals via <!--if:key-->...<!--endif-->.
 */
export async function renderTemplate(
  templateName: TemplateName,
  props: Record<string, any>
): Promise<string> {
  const templatePath = path.join(TEMPLATES_DIR, `${templateName}.html`);

  let html: string;
  try {
    html = await fs.readFile(templatePath, "utf-8");
  } catch {
    throw new Error(`Email template not found: ${templateName}`);
  }

  // Replace {{key}} and {{key.nested}} placeholders
  html = html.replace(/\{\{([\w.]+)\}\}/g, (_, key: string) => {
    const value = resolveNestedKey(props, key);
    return value !== undefined && value !== null ? String(value) : "";
  });

  // Handle simple conditionals: <!--if:key-->...<!--endif:key-->
  html = html.replace(
    /<!--if:([\w.]+)-->([\s\S]*?)<!--endif:\1-->/g,
    (_, key: string, content: string) => {
      const value = resolveNestedKey(props, key);
      return value ? content : "";
    }
  );

  return html;
}

function resolveNestedKey(obj: Record<string, any>, key: string): any {
  return key.split(".").reduce((acc, part) => acc?.[part], obj);
}