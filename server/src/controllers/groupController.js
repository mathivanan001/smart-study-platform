import StudyGroup from '../models/StudyGroup.js';

const isMember = (group, userId) => group.members.some((id) => id.toString() === userId);
const isOwner = (group, userId) => group.owner.toString() === userId;

export const createGroup = async (req, res) => {
  const maxMembers = Number(req.body.maxMembers || 8);
  if (!Number.isFinite(maxMembers) || maxMembers < 2 || maxMembers > 50) {
    return res.status(400).json({ message: 'maxMembers must be between 2 and 50' });
  }
  const group = await StudyGroup.create({
    ...req.body,
    maxMembers,
    isClosed: false,
    owner: req.user.id,
    members: [req.user.id]
  });
  res.status(201).json(group);
};

export const listGroups = async (_req, res) => {
  const groups = await StudyGroup.find()
    .populate('members', 'name email')
    .populate('announcements.createdBy', 'name')
    .sort({ createdAt: -1 });
  res.json(groups);
};

export const joinGroup = async (req, res) => {
  const group = await StudyGroup.findById(req.params.groupId).populate('members', 'name email');
  if (!group) return res.status(404).json({ message: 'Group not found' });
  if (group.isClosed) return res.status(409).json({ message: 'Group is closed for new members' });

  if (!isMember(group, req.user.id)) {
    if (group.members.length >= group.maxMembers) {
      group.isClosed = true;
      await group.save();
      return res.status(409).json({ message: 'Group reached maximum members and is now closed' });
    }
    group.members.push(req.user.id);
  }

  if (group.members.length >= group.maxMembers) {
    group.isClosed = true;
  }

  await group.save();
  await group.populate('members', 'name email');
  return res.json(group);
};

export const updateGroupSettings = async (req, res) => {
  const group = await StudyGroup.findById(req.params.groupId);
  if (!group) return res.status(404).json({ message: 'Group not found' });
  if (!isOwner(group, req.user.id)) return res.status(403).json({ message: 'Only owner can update settings' });

  const maxMembers = Number(req.body.maxMembers || group.maxMembers);
  if (!Number.isFinite(maxMembers) || maxMembers < 2 || maxMembers > 50) {
    return res.status(400).json({ message: 'maxMembers must be between 2 and 50' });
  }
  if (maxMembers < group.members.length) {
    return res.status(400).json({ message: 'maxMembers cannot be less than current member count' });
  }

  group.maxMembers = maxMembers;
  group.isClosed = req.body.isClosed ?? group.members.length >= maxMembers;
  await group.save();
  res.json(group);
};

export const getAnnouncements = async (req, res) => {
  const group = await StudyGroup.findById(req.params.groupId).populate('announcements.createdBy', 'name');
  if (!group) return res.status(404).json({ message: 'Group not found' });
  if (!isMember(group, req.user.id)) return res.status(403).json({ message: 'Access denied' });

  res.json({ announcements: group.announcements || [] });
};

export const postAnnouncement = async (req, res) => {
  const group = await StudyGroup.findById(req.params.groupId);
  if (!group) return res.status(404).json({ message: 'Group not found' });
  if (!isOwner(group, req.user.id)) return res.status(403).json({ message: 'Only owner can post announcements' });

  const text = String(req.body.text || '').trim();
  if (!text) return res.status(400).json({ message: 'Announcement text is required' });

  group.announcements.unshift({ text, createdBy: req.user.id, createdAt: new Date() });
  group.announcements = group.announcements.slice(0, 25);
  await group.save();
  await group.populate('announcements.createdBy', 'name');

  res.status(201).json({ announcements: group.announcements });
};

export const startGroupCall = async (req, res) => {
  const { groupId, callType } = req.params;
  if (!['audio', 'video'].includes(callType)) {
    return res.status(400).json({ message: 'callType must be audio or video' });
  }

  const group = await StudyGroup.findById(groupId).populate('members', 'name email');
  if (!group) return res.status(404).json({ message: 'Group not found' });
  if (!isMember(group, req.user.id)) return res.status(403).json({ message: 'Only group members can start calls' });

  const roomId = `study-${group._id}-${Date.now()}`;
  const configFlags = callType === 'audio' ? '#config.startWithVideoMuted=true&config.startSilent=true' : '';
  const callUrl = `https://meet.jit.si/${roomId}${configFlags}`;

  group.callRoom = {
    roomId,
    callType,
    callUrl,
    startedBy: req.user.id,
    startedAt: new Date()
  };
  await group.save();

  res.status(201).json({
    roomId,
    callType,
    callUrl,
    startedAt: group.callRoom.startedAt
  });
};

export const getActiveCall = async (req, res) => {
  const group = await StudyGroup.findById(req.params.groupId).populate('members', 'name email');
  if (!group) return res.status(404).json({ message: 'Group not found' });
  if (!isMember(group, req.user.id)) return res.status(403).json({ message: 'Access denied' });

  res.json({ callRoom: group.callRoom || null });
};
