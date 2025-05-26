// src/pages/HomePage.tsx
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

type Poll = {
  id: number;
  title: string;
  created_at: string;
  options: string[];
};

function HomePage() {
  const [polls, setPolls] = useState<Poll[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/polls")
      .then((res) => res.json())
      .then((data) => setPolls(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          background: 'rgba(210, 219, 255, 0.7)',
          borderRadius: 16,
          boxShadow: '0 4px 24pxrgba(183, 202, 243, 0.07)',
          padding: 32,
          width: '100%',
          maxWidth: 'min(900px, 100vw - 32px)',
          margin: '0 auto',
          backdropFilter: 'blur(8px)',
          border: '1px solid #e0e7ef',
          boxSizing: 'border-box',
          overflowX: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 className="text-2xl font-bold mb-4" style={{ fontSize: 28, fontWeight: 700, color: 'rgb(88, 60, 159)', margin: 0 }}>🗳️ Всі голосування</h1>

          <Link to="/polls/new">
            <button style={{ padding: '10px 22px', fontSize: 18, background: 'linear-gradient(90deg,rgb(235, 37, 110) 0%,rgb(140, 96, 250) 100%)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', boxShadow: '0 2px 8px #2563eb22', fontWeight: 600, letterSpacing: 1 }}>➕ Додати голосування</button>
          </Link>
        </div>
        <div
          style={{
            background: 'white',
            borderRadius: 16,
            boxShadow: '0 4px 24px #2563eb11',
            padding: 32,
            width: '100%',
            maxWidth: 900,
            margin: '0 auto',
          }}
        >
          <table className="table-auto border w-full" style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr style={{ background: '#f1f5f9' }}>
                <th style={{ border: 'none', padding: '12px 8px', fontWeight: 700, fontSize: 16, color: '#1e293b' }}>Назва</th>
                <th style={{ border: 'none', padding: '12px 8px', fontWeight: 700, fontSize: 16, color: '#1e293b' }}>Дата створення</th>
                <th style={{ border: 'none', padding: '12px 8px', fontWeight: 700, fontSize: 16, color: '#1e293b' }}>Кількість варіантів</th>
              </tr>
            </thead>
            <tbody>
              {polls.map((poll) => (
                <tr key={poll.id} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background 0.2s' }}>
                  <td style={{ padding: '10px 8px' }}>
                    <Link to={`/polls/${poll.id}`} style={{ color: '#2563eb', fontWeight: 500, textDecoration: 'none' }}>{poll.title}</Link>
                  </td>
                  <td style={{ padding: '10px 8px', color: '#64748b' }}>{new Date(poll.created_at).toLocaleString()}</td>
                  <td style={{ padding: '10px 8px', color: '#64748b' }}>{poll.options.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
