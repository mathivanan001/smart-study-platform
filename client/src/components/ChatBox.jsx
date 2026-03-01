import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

export default function ChatBox({ groupId }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    api.get(`/chat/${groupId}/messages`).then(({ data }) => setMessages(data));
    socket.emit('join-group', groupId);
    const handler = (msg) => setMessages((prev) => [...prev, msg]);
    socket.on('group-message', handler);
    return () => socket.off('group-message', handler);
  }, [groupId]);

  const send = () => {
    if (!content.trim()) return;
    socket.emit('group-message', { groupId, content, sender: user.id || user._id });
    setContent('');
  };

  const uploadFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadError('');
      setUploading(true);
      const formData = new FormData();
      formData.append('resource', file);
      formData.append('groupId', groupId);
      const { data } = await api.post('/chat/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      socket.emit('group-message', {
        groupId,
        content: `Shared file: ${file.name}`,
        fileUrl: data.url,
        sender: user.id || user._id
      });
    } catch (err) {
      setUploadError(err.response?.data?.message || 'File upload failed');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="card">
      <h3>Group Chat</h3>
      <div className="chat-list">
        {messages.map((m) => (
          <p key={m._id || `${m.sender}-${m.createdAt}`}>
            {m.content}
            {m.fileUrl && (
              <>
                {' '}
                <a href={m.fileUrl} target="_blank" rel="noreferrer">
                  Open file
                </a>
              </>
            )}
          </p>
        ))}
      </div>
      <div className="row wrap">
        <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Type message" />
        <button onClick={send}>Send</button>
        <label className="file-upload-btn">
          {uploading ? 'Uploading...' : 'Upload File'}
          <input type="file" onChange={uploadFile} disabled={uploading} hidden />
        </label>
      </div>
      {uploadError && <p className="error">{uploadError}</p>}
    </div>
  );
}
