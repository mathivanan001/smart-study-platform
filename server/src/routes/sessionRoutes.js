import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { analytics, groupLeaderboard, markAttendance, scheduleSession } from '../controllers/sessionController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.post('/', auth, asyncHandler(scheduleSession));
router.patch('/:sessionId/attendance', auth, asyncHandler(markAttendance));
router.get('/analytics/me', auth, asyncHandler(analytics));
router.get('/leaderboard/:groupId', auth, asyncHandler(groupLeaderboard));
export default router;
