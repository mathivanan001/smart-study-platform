import fs from 'fs/promises';
import Message from '../models/Message.js';
import StudyGroup from '../models/StudyGroup.js';
import cloudinary from '../config/cloudinary.js';

const ensureGroupMember = async (groupId, userId) => {
  const group = await StudyGroup.findById(groupId);
  if (!group) return { error: { code: 404, message: 'Group not found' } };
  const isMember = group.members.some((id) => id.toString() === userId);
  if (!isMember) return { error: { code: 403, message: 'Access denied' } };
  return { group };
};

export const history = async (req, res) => {
  const membership = await ensureGroupMember(req.params.groupId, req.user.id);
  if (membership.error) return res.status(membership.error.code).json({ message: membership.error.message });

  const messages = await Message.find({ groupId: req.params.groupId })
    .populate('sender', 'name')
    .sort({ createdAt: 1 })
    .limit(200);
  res.json(messages);
};

export const uploadResource = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  if (!req.body.groupId) return res.status(400).json({ message: 'groupId is required' });

  const membership = await ensureGroupMember(req.body.groupId, req.user.id);
  if (membership.error) {
    await fs.unlink(req.file.path).catch(() => {});
    return res.status(membership.error.code).json({ message: membership.error.message });
  }

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    await fs.unlink(req.file.path).catch(() => {});
    return res.status(501).json({ message: 'Cloudinary not configured' });
  }

  const upload = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' });
  await fs.unlink(req.file.path).catch(() => {});
  res.status(201).json({ url: upload.secure_url });
};
