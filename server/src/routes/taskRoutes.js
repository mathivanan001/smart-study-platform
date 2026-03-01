import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { assignTask, createTask, listTasks, updateTaskStatus } from '../controllers/taskController.js';
import { auth } from '../middleware/auth.js';

const router = Router();

router.get('/group/:groupId', auth, asyncHandler(listTasks));
router.post('/group/:groupId', auth, asyncHandler(createTask));
router.patch('/:taskId/status', auth, asyncHandler(updateTaskStatus));
router.patch('/:taskId/assign', auth, asyncHandler(assignTask));

export default router;
