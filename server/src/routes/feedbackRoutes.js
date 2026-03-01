import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getFeedbackForUser, submitFeedback } from '../controllers/feedbackController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.post('/', auth, asyncHandler(submitFeedback));
router.get('/user/:userId', auth, asyncHandler(getFeedbackForUser));
export default router;
