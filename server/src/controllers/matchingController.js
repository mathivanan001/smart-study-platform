import User from '../models/User.js';
import StudyGroup from '../models/StudyGroup.js';
import { compatibilityScore } from '../utils/matching.js';

export const findMatches = async (req, res) => {
  const me = await User.findById(req.user.id);
  const others = await User.find({ _id: { $ne: req.user.id } }).limit(50);
  const matches = others
    .map((candidate) => ({ user: candidate, score: compatibilityScore(me, candidate) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const groups = await StudyGroup.find({ subjects: { $in: me.subjects } }).limit(10);
  return res.json({ matches, suggestedGroups: groups });
};
