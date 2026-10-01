import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || "supersecretkey",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  SUPABASE_URL: process.env.SUPABASE_URL || "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  SUPABASE_STORAGE_BUCKET: process.env.SUPABASE_STORAGE_BUCKET || "candidate-images",
  PAYSTACK_SECRET_KEY: process.env.PAYSTACK_SECRET_KEY || "",
  VOTE_PRICE_MINOR: Number(process.env.VOTE_PRICE_MINOR || 100),
  PAYMENT_CURRENCY: process.env.PAYMENT_CURRENCY || "GHS",
};
