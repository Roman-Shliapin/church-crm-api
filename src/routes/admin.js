import { Router } from "express";
import { getActiveNeeds, getArchivedNeeds, getCandidates, getMembers, replyToNeed, updateNeedStatus } from "../controllers/adminController.js";
import { adminOnly, protect } from "../middlewares/auth.js";


const router = Router();

router.use(protect, adminOnly);

router.get('/needs/active', getActiveNeeds);
router.get('/needs/archived', getArchivedNeeds);
router.patch('/needs/:id/status', updateNeedStatus);
router.post('/needs/:id/reply', replyToNeed);
router.get('/members', getMembers);
router.get('/candidates', getCandidates);


export default router;