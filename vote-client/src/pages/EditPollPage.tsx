import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api';

export default function EditPollPage() {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`/polls/${id}`).then(res => {
      setTitle(res.data.title);
      setOptions(res.data.options);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleOptionChange = (idx: number, value: string) => {
    setOptions((opts) => opts.map((opt, i) => (i === idx ? value : opt)));
  };

  const addOption = () => setOptions((opts) => [...opts, '']);
  const removeOption = (idx: number) => {
    if (options.length <= 2) return;
    setOptions((opts) => opts.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const filteredOptions = options.map((o) => o.trim()).filter((o) => o);
    if (!title.trim()) {
      setError('Введіть заголовок голосування');
      return;
    }
    if (filteredOptions.length < 2) {
      setError('Мінімум 2 варіанти відповіді');
      return;
    }
    setError('');
    try {
      await api.patch(`/polls/${id}`, {
        title: title.trim(),
        options: filteredOptions,
      });
      navigate(`/polls/${id}`);
    } catch (err) {
      setError('Помилка оновлення голосування');
    }
  };

  if (loading) return <div>Завантаження...</div>;

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        style={{
          background: 'rgba(255,255,255,0.7)',
          borderRadius: 18,
          boxShadow: '0 4px 24px #2563eb22',
          padding: 36,
          width: '100%',
          maxWidth: 500,
          margin: '0 auto',
          backdropFilter: 'blur(8px)',
          border: '1px solid #e0e7ef',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: 24, color: '#111', fontWeight: 700, fontSize: 28 }}>Редагувати голосування</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 600, color: 'rgb(88, 60, 159)', marginBottom: 6, display: 'block' }}>
              Заголовок:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', marginTop: 6, marginBottom: 0, padding: '10px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 16, outline: 'none', transition: 'border 0.2s', background: 'rgb(200, 184, 240)' }}
                required
              />
            </label>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontWeight: 600, color: 'rgb(88, 60, 159)', marginBottom: 6, display: 'block' }}>Варіанти відповіді:</label>
            {options.map((opt, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 10, transition: 'all 0.2s' }}>
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  style={{ flex: 1, padding: '9px 12px', borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 15, outline: 'none', transition: 'border 0.2s', background: 'rgb(200, 184, 240)' }}
                  required
                />
                {options.length > 2 && (
                  <button type="button" onClick={() => removeOption(idx)} style={{ marginLeft: 8, background: 'rgb(231, 68, 128)', color: 'white', border: 'none', borderRadius: 6, padding: '7px 12px', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>
                    Видалити
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addOption} style={{ marginTop: 8, background: 'linear-gradient(rgb(235, 37, 110) 0%,rgb(140, 96, 250) 100%)', color: 'white', border: 'none', borderRadius: 8, padding: '9px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer', boxShadow: '0 2px 8px #2563eb22', transition: 'background 0.2s' }}>
              Додати варіант
            </button>
          </div>
          {error && <div style={{ color: '#ef4444', background: '#fee2e2', borderRadius: 8, padding: '8px 12px', marginBottom: 12, textAlign: 'center', fontWeight: 500 }}>{error}</div>}
          <button type="submit" style={{ width: '100%', marginTop: 8, background: 'linear-gradient(rgb(235, 37, 110) 0%,rgb(140, 96, 250) 100%)', color: 'white', border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 700, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px #2563eb22', transition: 'background 0.2s' }}>
            Зберегти
          </button>
        </form>
      </div>
    </div>
  );
}