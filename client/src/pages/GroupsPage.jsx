import { useEffect, useMemo, useState } from 'react';
import api from '../api.js';
import ChatBox from '../components/ChatBox.jsx';
import TaskBoard from '../components/TaskBoard.jsx';
import Leaderboard from '../components/Leaderboard.jsx';

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [activeGroupId, setActiveGroupId] = useState('');
  const activeGroup = groups.find((g) => g._id === activeGroupId);
  const [error, setError] = useState('');
  const [clock, setClock] = useState(new Date());
  const [callInfo, setCallInfo] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementText, setAnnouncementText] = useState('');
  const [form, setForm] = useState({ name: '', description: '', subjects: 'Math', maxMembers: 8 });

  const localTime = useMemo(
    () =>
      clock.toLocaleString([], {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
    [clock]
  );

  const load = async () => {
    try {
      setError('');
      const { data } = await api.get('/groups');
      setGroups(data);
      if (!activeGroupId && data.length) setActiveGroupId(data[0]._id);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load groups');
    }
  };

  useEffect(() => {
    load();
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadGroupExtras = async () => {
      if (!activeGroupId) return;
      try {
        const [callRes, annRes] = await Promise.all([
          api.get(`/groups/${activeGroupId}/call`),
          api.get(`/groups/${activeGroupId}/announcements`)
        ]);
        setCallInfo(callRes.data.callRoom);
        setAnnouncements(annRes.data.announcements || []);
      } catch {
        setCallInfo(null);
        setAnnouncements([]);
      }
    };
    loadGroupExtras();
  }, [activeGroupId]);

  const createGroup = async () => {
    try {
      setError('');
      const { data } = await api.post('/groups', {
        ...form,
        maxMembers: Number(form.maxMembers || 8),
        rules: ['Be respectful', 'Join on time'],
        subjects: form.subjects.split(',').map((s) => s.trim())
      });
      setActiveGroupId(data._id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group');
    }
  };

  const joinGroup = async (groupId) => {
    try {
      setError('');
      await api.post(`/groups/${groupId}/join`);
      setActiveGroupId(groupId);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join group');
    }
  };

  const startCall = async (callType) => {
    if (!activeGroupId) return;
    try {
      setError('');
      const { data } = await api.post(`/groups/${activeGroupId}/call/${callType}`);
      setCallInfo(data);
      window.open(data.callUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setError(err.response?.data?.message || `Failed to start ${callType} call`);
    }
  };

  const postAnnouncement = async () => {
    if (!announcementText.trim() || !activeGroupId) return;
    try {
      setError('');
      const { data } = await api.post(`/groups/${activeGroupId}/announcements`, { text: announcementText.trim() });
      setAnnouncements(data.announcements || []);
      setAnnouncementText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post announcement');
    }
  };

  return (
    <div className="grid">
      <section className="card">
        <h2>Study Groups</h2>
        <p className="muted">Current Time: {localTime}</p>
        {error && <p className="error">{error}</p>}
        {groups.map((g) => (
          <div key={g._id} className="row wrap group-row">
            <button onClick={() => setActiveGroupId(g._id)}>{g.name}</button>
            <span>
              {g.members.length}/{g.maxMembers} members
            </span>
            <span className={g.isClosed ? 'badge closed' : 'badge open'}>{g.isClosed ? 'Closed' : 'Open'}</span>
            <button onClick={() => joinGroup(g._id)} disabled={g.isClosed}>
              Join
            </button>
          </div>
        ))}

        {activeGroupId && (
          <div className="card call-card">
            <h3>Group Calls</h3>
            <div className="row wrap">
              <button onClick={() => startCall('audio')}>Start Audio Call</button>
              <button onClick={() => startCall('video')}>Start Video Call</button>
            </div>
            {callInfo?.callUrl && (
              <p className="muted">
                Active {callInfo.callType} call started at {new Date(callInfo.startedAt).toLocaleTimeString()} —{' '}
                <a href={callInfo.callUrl} target="_blank" rel="noreferrer">
                  Join now
                </a>
              </p>
            )}
          </div>
        )}

        {activeGroupId && (
          <div className="card call-card">
            <h3>Announcement Board (New Feature)</h3>
            <div className="row wrap">
              <input
                placeholder="Post announcement"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
              />
              <button onClick={postAnnouncement}>Post</button>
            </div>
            <div className="announcement-list">
              {announcements.map((a, idx) => (
                <p key={`${a.createdAt}-${idx}`}>
                  <strong>{a.createdBy?.name || 'Owner'}:</strong> {a.text}
                </p>
              ))}
              {!announcements.length && <p className="muted">No announcements yet.</p>}
            </div>
          </div>
        )}

        <h3>Create Group</h3>
        <input placeholder="Group Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Subjects CSV" onChange={(e) => setForm({ ...form, subjects: e.target.value })} />
        <input
          type="number"
          min="2"
          max="50"
          placeholder="Max members"
          value={form.maxMembers}
          onChange={(e) => setForm({ ...form, maxMembers: e.target.value })}
        />
        <button onClick={createGroup}>Create</button>
      </section>
      <div>
        {activeGroupId && <ChatBox groupId={activeGroupId} />}
        {activeGroupId && <TaskBoard groupId={activeGroupId} members={activeGroup?.members || []} />}
        {activeGroupId && <Leaderboard groupId={activeGroupId} />}
      </div>
    </div>
  );
}
