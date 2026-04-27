import { Router } from "express";
import { protect } from '../middlewares/auth.js'
import { createNeed, getMyNeeds, getNeedById } from "../controllers/needsController.js";

const router = Router();

router.get("/", protect, getMyNeeds);
router.post("/", protect, createNeed);
router.get('/:id', protect, getNeedById);

export default router;