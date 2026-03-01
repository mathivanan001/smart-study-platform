import { useEffect, useState } from 'react';
import api from '../api.js';
import ChatBox from '../components/ChatBox.jsx';
import TaskBoard from '../components/TaskBoard.jsx';
import Leaderboard from '../components/Leaderboard.jsx';

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [activeGroupId, setActiveGroupId] = useState('');
  const activeGroup = groups.find((g) => g._id === activeGroupId);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '', subjects: 'Math' });

  const load = async () => {
    try {
      setError('');
      const { data } = await api.get('/groups');
      setGroups(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load groups');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const createGroup = async () => {
    try {
      setError('');
      const { data } = await api.post('/groups', {
        ...form,
        rules: ['Be respectful', 'Join on time'],
        subjects: form.subjects.split(',').map((s) => s.trim())
      });
      setActiveGroupId(data._id);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create group');
    }
  };

  return (
    <div className="grid">
      <section className="card">
        <h2>Study Groups</h2>
        {error && <p className="error">{error}</p>}
        {groups.map((g) => (
          <div key={g._id} className="row">
            <button onClick={() => setActiveGroupId(g._id)}>{g.name}</button>
            <span>{g.members.length} members</span>
          </div>
        ))}
        <h3>Create Group</h3>
        <input placeholder="Group Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Description" onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Subjects CSV" onChange={(e) => setForm({ ...form, subjects: e.target.value })} />
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
