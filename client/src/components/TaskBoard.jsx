import { useEffect, useState } from 'react';
import api from '../api.js';

const statuses = ['todo', 'in-progress', 'done'];

export default function TaskBoard({ groupId, members }) {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '' });

  const loadTasks = () => api.get(`/tasks/group/${groupId}`).then(({ data }) => setTasks(data));

  useEffect(() => {
    loadTasks();
  }, [groupId]);

  const createTask = async () => {
    if (!form.title.trim()) return;
    await api.post(`/tasks/group/${groupId}`, form);
    setForm({ title: '', description: '', dueDate: '' });
    loadTasks();
  };

  const updateStatus = async (taskId, status) => {
    await api.patch(`/tasks/${taskId}/status`, { status });
    loadTasks();
  };

  const assignTask = async (taskId, assignee) => {
    await api.patch(`/tasks/${taskId}/assign`, { assignee });
    loadTasks();
  };

  return (
    <div className="card">
      <h3>Task Board</h3>
      <div className="row wrap">
        <input placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
        <button onClick={createTask}>Add task</button>
      </div>

      {tasks.map((task) => (
        <div key={task._id} className="task-row">
          <div>
            <strong>{task.title}</strong>
            <p>{task.description || 'No description'}</p>
            <small>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</small>
          </div>
          <div className="row wrap">
            <select value={task.status} onChange={(e) => updateStatus(task._id, e.target.value)}>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select value={task.assignee?._id || ''} onChange={(e) => assignTask(task._id, e.target.value)}>
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}
