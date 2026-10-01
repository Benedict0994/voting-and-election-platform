import { Router } from "express";
import { castVote, getVoteAudit } from "../controllers/voteController";
import { protect } from "../middleware/authMiddleware";
const router = Router();
router.post("/", castVote);
router.get("/audit", protect, getVoteAudit);
export default router;
