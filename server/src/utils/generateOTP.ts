/**
 * Generate a random 5-digit OTP
 */
export function generateOTP(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}
