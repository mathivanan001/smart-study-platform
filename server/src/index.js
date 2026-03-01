import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { connectDB } from './config/db.js';
import { configureCloudinary } from './config/cloudinary.js';
import Message from './models/Message.js';
import StudyGroup from './models/StudyGroup.js';
import authRoutes from './routes/authRoutes.js';
import matchingRoutes from './routes/matchingRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/tasks', taskRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  socket.on('join-group', (groupId) => {
    if (groupId) socket.join(groupId);
  });

  socket.on('group-message', async (payload = {}) => {
    try {
      const { groupId, sender, content, fileUrl } = payload;
      if (!groupId || !sender) return;
      if (!content && !fileUrl) return;

      const group = await StudyGroup.findById(groupId);
      if (!group) return;
      const allowed = group.members.some((id) => id.toString() === String(sender));
      if (!allowed) return;

      const message = await Message.create({ groupId, sender, content, fileUrl });
      io.to(groupId).emit('group-message', message);
    } catch (error) {
      console.error('Socket group-message error:', error.message);
    }
  });
});

const PORT = process.env.PORT || 5000;
const bootstrap = async () => {
  await connectDB();
  configureCloudinary();
  server.listen(PORT, () => console.log(`Server running on ${PORT}`));
};

bootstrap();
