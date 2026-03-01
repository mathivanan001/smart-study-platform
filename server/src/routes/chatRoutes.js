import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import multer from 'multer';
import { history, uploadResource } from '../controllers/chatController.js';
import { auth } from '../middleware/auth.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });
router.get('/:groupId/messages', auth, asyncHandler(history));
router.post('/upload', auth, upload.single('resource'), asyncHandler(uploadResource));
export default router;
