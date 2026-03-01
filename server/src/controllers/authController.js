import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const tokenFor = (user) => jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  subjects: user.subjects,
  availability: user.availability,
  studyStyle: user.studyStyle,
  goals: user.goals,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt
});

export const register = async (req, res) => {
  const { name, email, password, subjects, availability, studyStyle, goals } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'User already exists' });
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, subjects, availability, studyStyle, goals });
  return res.status(201).json({ token: tokenFor(user), user: sanitizeUser(user) });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  return res.json({ token: tokenFor(user), user: sanitizeUser(user) });
};
