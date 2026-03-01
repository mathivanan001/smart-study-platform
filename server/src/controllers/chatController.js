import Message from '../models/Message.js';
import cloudinary from '../config/cloudinary.js';

export const history = async (req, res) => {
  const messages = await Message.find({ groupId: req.params.groupId }).populate('sender', 'name').sort({ createdAt: 1 }).limit(200);
  res.json(messages);
};

export const uploadResource = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  if (!process.env.CLOUDINARY_CLOUD_NAME) return res.status(501).json({ message: 'Cloudinary not configured' });
  const upload = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' });
  res.status(201).json({ url: upload.secure_url });
};
