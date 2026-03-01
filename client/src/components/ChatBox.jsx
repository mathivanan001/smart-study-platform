import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

export default function ChatBox({ groupId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    api.get(`/chat/${groupId}/messages`).then(({ data }) => setMessages(data));
    socket.emit('join-group', groupId);
    const handler = (msg) => setMessages((prev) => [...prev, msg]);
    socket.on('group-message', handler);
    return () => socket.off('group-message', handler);
  }, [groupId]);

  const send = () => {
    socket.emit('group-message', { groupId, content, sender: user.id || user._id });
    setContent('');
  };

  return (
    <div className="card">
      <h3>Group Chat</h3>
      <div className="chat-list">
        {messages.map((m) => (
          <p key={m._id || `${m.sender}-${m.createdAt}`}>{m.content}</p>
        ))}
      </div>
      <div className="row">
        <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Type message" />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
