// server/src/routes/authRoutes.ts
import { Router } from "express";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  verifyOTP,
  resendOTP,
} from "../controllers/authController";

const router = Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
