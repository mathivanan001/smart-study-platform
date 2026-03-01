import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createGroup,
  getActiveCall,
  getAnnouncements,
  joinGroup,
  listGroups,
  postAnnouncement,
  startGroupCall,
  updateGroupSettings
} from '../controllers/groupController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.get('/', auth, asyncHandler(listGroups));
router.post('/', auth, asyncHandler(createGroup));
router.post('/:groupId/join', auth, asyncHandler(joinGroup));
router.patch('/:groupId/settings', auth, asyncHandler(updateGroupSettings));
router.get('/:groupId/announcements', auth, asyncHandler(getAnnouncements));
router.post('/:groupId/announcements', auth, asyncHandler(postAnnouncement));
router.get('/:groupId/call', auth, asyncHandler(getActiveCall));
router.post('/:groupId/call/:callType', auth, asyncHandler(startGroupCall));

export default router;
