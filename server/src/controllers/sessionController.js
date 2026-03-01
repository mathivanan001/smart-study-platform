import StudySession from '../models/StudySession.js';
import StudyGroup from '../models/StudyGroup.js';
import User from '../models/User.js';
import Feedback from '../models/Feedback.js';
import { sendReminder } from '../services/notificationService.js';

export const scheduleSession = async (req, res) => {
  const { groupId, startTime, endTime } = req.body;
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start >= end) {
    return res.status(400).json({ message: 'Invalid start/end time' });
  }

  const group = await StudyGroup.findById(groupId);
  if (!group) return res.status(404).json({ message: 'Group not found' });

  const conflict = await StudySession.findOne({
    groupId,
    startTime: { $lt: end },
    endTime: { $gt: start }
  });

  if (conflict) return res.status(409).json({ message: 'Schedule conflict detected' });

  const session = await StudySession.create({ ...req.body, startTime: start, endTime: end });
  const members = await User.find({ _id: { $in: group.members } });

  await Promise.allSettled(
    members.map((m) => sendReminder({ to: m.email, subject: `Upcoming session: ${session.topic}`, text: `Starts at ${session.startTime}` }))
  );

  res.status(201).json(session);
};

export const markAttendance = async (req, res) => {
  const { sessionId } = req.params;
  const { attendees, studyHours } = req.body;
  const session = await StudySession.findByIdAndUpdate(sessionId, { attendees, studyHours }, { new: true });
  if (!session) return res.status(404).json({ message: 'Session not found' });
  res.json(session);
};

export const analytics = async (req, res) => {
  const sessions = await StudySession.find({ attendees: req.user.id });
  const totalHours = sessions.reduce((sum, s) => sum + (s.studyHours || 0), 0);
  const weekly = sessions.filter((s) => Date.now() - new Date(s.startTime).getTime() < 7 * 86400000).length;
  res.json({ totalHours, sessionCount: sessions.length, weeklyAchievements: weekly });
};

export const groupLeaderboard = async (req, res) => {
  const { groupId } = req.params;
  const group = await StudyGroup.findById(groupId);
  if (!group) return res.status(404).json({ message: 'Group not found' });

  const sessions = await StudySession.find({ groupId });
  const memberIds = group.members.map((id) => id.toString());
  const hoursByMember = Object.fromEntries(memberIds.map((id) => [id, 0]));

  sessions.forEach((session) => {
    const attended = (session.attendees || []).map((id) => id.toString());
    const perHeadHours = attended.length ? (session.studyHours || 0) / attended.length : 0;
    attended.forEach((memberId) => {
      if (hoursByMember[memberId] !== undefined) {
        hoursByMember[memberId] += perHeadHours;
      }
    });
  });

  const feedback = await Feedback.find({ toUser: { $in: group.members } });
  const feedbackMap = Object.fromEntries(memberIds.map((id) => [id, { score: 0, count: 0 }]));

  feedback.forEach((item) => {
    const toUser = item.toUser.toString();
    if (!feedbackMap[toUser]) return;
    feedbackMap[toUser].score += (item.productivityRating + item.cooperationRating) / 2;
    feedbackMap[toUser].count += 1;
  });

  const users = await User.find({ _id: { $in: group.members } }, 'name email');
  const leaderboard = users
    .map((user) => {
      const uid = user._id.toString();
      const feedbackAvg = feedbackMap[uid].count ? feedbackMap[uid].score / feedbackMap[uid].count : 0;
      const studyHours = Number((hoursByMember[uid] || 0).toFixed(1));
      const performanceScore = Number((studyHours * 0.65 + feedbackAvg * 0.35).toFixed(2));
      return {
        user,
        studyHours,
        feedbackAvg: Number(feedbackAvg.toFixed(2)),
        performanceScore
      };
    })
    .sort((a, b) => b.performanceScore - a.performanceScore);

  res.json({ leaderboard });
};
