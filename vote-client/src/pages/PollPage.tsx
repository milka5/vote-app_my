import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import { cable } from '../cable';
import { Poll, Vote } from '../types';

export default function PollPage() {
  const { id } = useParams<{ id: string }>();
  const [poll, setPoll] = useState<Poll | null>(null);

  useEffect(() => {
    api.get<Poll>(`/polls/${id}`).then((res) => setPoll(res.data));
  }, [id]);

  useEffect(() => {
    if (!poll) return;

    const subscription = cable.subscriptions.create(
      { channel: 'PollChannel', poll_id: poll.id },
      {
        received: (data: Vote) => {
          setPoll((prev) => {
            if (!prev) return prev;
            return { ...prev, votes: [...prev.votes, data] };
          });
        },
      }
    );

    return () => subscription.unsubscribe();
  }, [poll?.id]);

  const handleVote = (option: string) => {
    api.post('/votes', {
      vote: { poll_id: poll?.id, option },
    });
  };

  const getCount = (option: string) =>
    poll?.votes.filter((v) => v.option === option).length ?? 0;

  if (!poll) return <p>Loading...</p>;

  return (
    <div>
      <h1 style={{ color: '#111', fontWeight: 700, fontSize: '2.5rem', marginBottom: 32 }}>{poll.title}</h1>
      <div style={{ marginBottom: 32 }}>
        <a href={`/polls/${poll.id}/edit`} style={{
          display: 'inline-block',
          background: 'linear-gradient(rgb(235, 37, 110) 0%,rgb(140, 96, 250) 100%)',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          padding: '10px 22px',
          fontWeight: 600,
          fontSize: 16,
          textDecoration: 'none',
          boxShadow: '0 2px 8px #2563eb22',
          cursor: 'pointer',
          marginBottom: 8
        }}>Редагувати</a>
      </div>
<div style={{ display: 'flex', gap: '1rem' }}>
  {poll.options.map((option) => (
    <button
      key={option}
      onClick={() => handleVote(option)}
      style={{
        backgroundColor: 'rgb(231, 68, 128)',
        color: 'white',
        border: 'none',
        borderRadius: 8,
        padding: '10px 16px',
        fontSize: 16,
        cursor: 'pointer',
        fontWeight: 600,
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      {option} ({getCount(option)})
    </button>
  ))}
</div>

    </div>
  );
}

