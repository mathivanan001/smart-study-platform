import Feedback from '../models/Feedback.js';

export const submitFeedback = async (req, res) => {
  const feedback = await Feedback.create({ ...req.body, fromUser: req.user.id });
  res.status(201).json(feedback);
};

export const getFeedbackForUser = async (req, res) => {
  const items = await Feedback.find({ toUser: req.params.userId }).populate('fromUser', 'name').sort({ createdAt: -1 });
  res.json(items);
};
