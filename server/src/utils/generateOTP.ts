import { randomInt } from "crypto";
/** Generate a cryptographically secure five-digit OTP. */
export function generateOTP(): string {
  return randomInt(10000, 100000).toString();
}
