import GroupTask from '../models/GroupTask.js';
import StudyGroup from '../models/StudyGroup.js';

const ensureMembership = (group, userId) => group.members.some((memberId) => memberId.toString() === userId);

export const listTasks = async (req, res) => {
  const group = await StudyGroup.findById(req.params.groupId);
  if (!group) return res.status(404).json({ message: 'Group not found' });
  if (!ensureMembership(group, req.user.id)) return res.status(403).json({ message: 'Access denied' });

  const tasks = await GroupTask.find({ groupId: req.params.groupId })
    .populate('assignee', 'name')
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });
  res.json(tasks);
};

export const createTask = async (req, res) => {
  const group = await StudyGroup.findById(req.params.groupId);
  if (!group) return res.status(404).json({ message: 'Group not found' });
  if (!ensureMembership(group, req.user.id)) {
    return res.status(403).json({ message: 'Only group members can create tasks' });
  }

  const task = await GroupTask.create({
    ...req.body,
    groupId: req.params.groupId,
    createdBy: req.user.id,
    assignee: req.body.assignee || null
  });

  res.status(201).json(task);
};

export const updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  const task = await GroupTask.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  const group = await StudyGroup.findById(task.groupId);
  if (!group || !ensureMembership(group, req.user.id)) return res.status(403).json({ message: 'Access denied' });

  task.status = status;
  await task.save();
  await task.populate('assignee', 'name');
  await task.populate('createdBy', 'name');

  res.json(task);
};

export const assignTask = async (req, res) => {
  const { assignee } = req.body;
  const task = await GroupTask.findById(req.params.taskId);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  const group = await StudyGroup.findById(task.groupId);
  if (!group || !ensureMembership(group, req.user.id)) return res.status(403).json({ message: 'Access denied' });

  if (assignee && !group.members.some((memberId) => memberId.toString() === assignee)) {
    return res.status(400).json({ message: 'Assignee must be a group member' });
  }

  task.assignee = assignee || null;
  await task.save();
  await task.populate('assignee', 'name');
  await task.populate('createdBy', 'name');

  res.json(task);
};
