import { Router } from "express";
import { protect } from "../middlewares/auth.js";
import { getProfile, updatePushToken } from "../controllers/profileController.js";


const router = Router();

router.get('/', protect, getProfile);
router.post('/push-token', protect, updatePushToken);

export default router;