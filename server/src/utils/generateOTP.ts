import { randomInt } from "crypto";
export function generateOTP(): string { return randomInt(10000, 100000).toString(); }
