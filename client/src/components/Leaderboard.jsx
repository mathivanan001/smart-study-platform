import { useEffect, useState } from 'react';
import api from '../api.js';

export default function Leaderboard({ groupId }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.get(`/sessions/leaderboard/${groupId}`).then(({ data }) => setRows(data.leaderboard || []));
  }, [groupId]);

  return (
    <div className="card">
      <h3>Group Leaderboard</h3>
      {rows.map((row, index) => (
        <div className="row" key={row.user._id}>
          <strong>#{index + 1}</strong>
          <span>{row.user.name}</span>
          <span>{row.studyHours}h</span>
          <span>Feedback: {row.feedbackAvg}</span>
          <span>Score: {row.performanceScore}</span>
        </div>
      ))}
      {!rows.length && <p>No activity yet.</p>}
    </div>
  );
}
