import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Zap } from 'lucide-react';
import { useBookingStore } from '../store';

const DEMO_USERS = [
  { id: 'u1', name: 'Nguyễn Văn An', email: 'an.nv@vku.udn.vn', studentId: 'VKU21001' },
  { id: 'u2', name: 'Trần Thị Bích', email: 'bich.tt@vku.udn.vn', studentId: 'VKU21042' },
  { id: 'u3', name: 'Lê Quang Dũng', email: 'dung.lq@vku.udn.vn', studentId: 'VKU22015' },
];

export default function LoginPage() {
  const setSession = useBookingStore((s) => s.setSession);
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', studentId: '' });
  const [loading, setLoading] = useState(false);

  const handleQuickLogin = useCallback((user: typeof DEMO_USERS[0]) => {
    setSession(user);
    navigate('/');
  }, [setSession, navigate]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.studentId.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setSession({
        id: 'u' + Date.now(),
        name: form.name.trim(),
        email: form.email.trim(),
        studentId: form.studentId.trim(),
      });
      navigate('/');
    }, 600);
  }, [form, setSession, navigate]);

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
            <div className="brand-icon" style={{ width: 56, height: 56, borderRadius: 16, fontSize: '1.8rem' }}>🏫</div>
          </div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 6 }}>VKU Study Room</h1>
          <p style={{ color: 'var(--text2)', fontSize: '0.9rem' }}>Reserve campus rooms in real time</p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: '0.78rem', color: 'var(--text3)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Quick Demo Login
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {DEMO_USERS.map(u => (
              <button
                key={u.id}
                className="btn btn-ghost"
                style={{ justifyContent: 'flex-start', gap: 10, textAlign: 'left' }}
                onClick={() => handleQuickLogin(u)}
              >
                <div className="user-avatar" style={{ width: 32, height: 32, fontSize: '0.8rem', flexShrink: 0 }}>
                  {u.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{u.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{u.studentId}</div>
                </div>
                <Zap size={14} style={{ marginLeft: 'auto', color: 'var(--primary-light)' }} />
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border2)' }} />
          <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>or sign in manually</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border2)' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              id="login-name"
              className="form-input"
              placeholder="Nguyễn Văn A"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              autoComplete="name"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              id="login-email"
              className="form-input"
              type="email"
              placeholder="abc@vku.udn.vn"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Student ID</label>
            <input
              id="login-student-id"
              className="form-input"
              placeholder="VKU21001"
              value={form.studentId}
              onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))}
            />
          </div>
          <button
            id="login-submit-btn"
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={loading || !form.name || !form.email || !form.studentId}
          >
            <BookOpen size={16} />
            {loading ? 'Signing in…' : 'Enter Study Room'}
          </button>
        </form>
      </div>
    </div>
  );
}
