import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settingsController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getSettings);
router.put("/", protect, updateSettings);

export default router;
