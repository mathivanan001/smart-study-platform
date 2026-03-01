import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', subjects: 'Math,Physics', goals: 'Exam prep' });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        ...form,
        subjects: form.subjects.split(',').map((s) => s.trim()),
        goals: form.goals.split(',').map((s) => s.trim()),
        availability: [{ day: 'Mon', from: '18:00', to: '20:00' }],
        studyStyle: 'discussion-heavy'
      };
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const { data } = await api.post(endpoint, payload);
      login(data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" onSubmit={onSubmit}>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>
      {error && <p className="error">{error}</p>}
      {isRegister && <input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} required />}
      <input placeholder="Email" type="email" onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      <input placeholder="Password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      {isRegister && (
        <>
          <input placeholder="Subjects CSV" onChange={(e) => setForm({ ...form, subjects: e.target.value })} defaultValue={form.subjects} />
          <input placeholder="Goals CSV" onChange={(e) => setForm({ ...form, goals: e.target.value })} defaultValue={form.goals} />
        </>
      )}
      <button type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Continue'}</button>
      <button type="button" onClick={() => setIsRegister(!isRegister)}>
        Switch to {isRegister ? 'Login' : 'Register'}
      </button>
    </form>
  );
}
