import StudyGroup from '../models/StudyGroup.js';

export const createGroup = async (req, res) => {
  const group = await StudyGroup.create({ ...req.body, owner: req.user.id, members: [req.user.id] });
  res.status(201).json(group);
};

export const listGroups = async (_req, res) => {
  const groups = await StudyGroup.find().populate('members', 'name email');
  res.json(groups);
};

export const joinGroup = async (req, res) => {
  const group = await StudyGroup.findByIdAndUpdate(
    req.params.groupId,
    { $addToSet: { members: req.user.id } },
    { new: true }
  ).populate('members', 'name email');
  if (!group) return res.status(404).json({ message: 'Group not found' });
  return res.json(group);
};
