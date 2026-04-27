import { Router } from "express";
import { protect } from '../middlewares/auth.js'
import { createNeed, getMyNeeds } from "../controllers/needsController.js";

const router = Router();

router.get("/", protect, getMyNeeds);
router.post("/", protect, createNeed);

export default router;