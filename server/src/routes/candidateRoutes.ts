import { Router } from "express";
import {
  getCandidates,
  getCandidateById,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  getCandidateBySlug,
} from "../controllers/candidateController";
import { adjustVotes } from "../controllers/voteController";
import { protect } from "../middleware/authMiddleware";
import { upload } from "../middleware/uploadMiddleware";

const router = Router();

// 🔓 Public route (no auth)
router.get("/public/:slug", getCandidateBySlug);

// 🔒 Protected routes
router.get("/", protect, getCandidates);
router.get("/:id", protect, getCandidateById);
router.post("/", protect, upload.single("image"), createCandidate);
router.put("/:id", protect, upload.single("image"), updateCandidate);
router.post("/:id/adjust-votes", protect, adjustVotes);
router.delete("/:id", protect, deleteCandidate);

export default router;
