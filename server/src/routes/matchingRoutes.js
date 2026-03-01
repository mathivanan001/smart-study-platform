import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { findMatches } from '../controllers/matchingController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.get('/', auth, asyncHandler(findMatches));
export default router;
