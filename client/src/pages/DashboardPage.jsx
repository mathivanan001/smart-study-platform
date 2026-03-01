import { useEffect, useState } from 'react';
import api from '../api.js';

export default function DashboardPage() {
  const [matches, setMatches] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [matchingRes, analyticsRes] = await Promise.all([api.get('/matching'), api.get('/sessions/analytics/me')]);
        setMatches(matchingRes.data.matches);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      }
    };

    load();
  }, []);

  return (
    <div className="grid">
      <section className="card">
        <h2>Best Study Matches</h2>
        {error && <p className="error">{error}</p>}
        {matches.map((m) => (
          <p key={m.user._id}>{m.user.name} — score: {m.score}</p>
        ))}
      </section>
      <section className="card">
        <h2>Progress Tracking</h2>
        <p>Total study hours: {analytics.totalHours || 0}</p>
        <p>Session count: {analytics.sessionCount || 0}</p>
        <p>Weekly achievements: {analytics.weeklyAchievements || 0}</p>
      </section>
    </div>
  );
}
