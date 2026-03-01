import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createGroup, joinGroup, listGroups } from '../controllers/groupController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.get('/', auth, asyncHandler(listGroups));
router.post('/', auth, asyncHandler(createGroup));
router.post('/:groupId/join', auth, asyncHandler(joinGroup));
export default router;
