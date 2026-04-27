import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { getProfile } from "../controllers/profileController.js";


const router = Router();

router.get('/', protect, getProfile);

export default router;