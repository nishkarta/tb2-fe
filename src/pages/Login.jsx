import { useState } from 'react';
import { login } from '../api';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await login(form);
      if (res.data.success) onLogin(res.data.admin);
      else setError(res.data.message);
    } catch {
      setError('Username atau password salah!');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="bg-surface border border-border rounded-2xl p-12 w-[400px] max-w-[90vw]">

        <span className="text-xs font-black tracking-[4px] text-accent bg-accent/10 px-3 py-1.5 rounded-md inline-block mb-6" style={{fontFamily:'var(--font-display)'}}>
          KMS
        </span>

        <h1 className="text-3xl font-black mb-1.5" style={{fontFamily:'var(--font-display)'}}>Selamat Datang</h1>
        <p className="text-muted text-sm mb-7">Login untuk masuk ke sistem</p>

        {error && (
          <div className="bg-danger/10 border border-danger/30 text-red-400 rounded-lg px-4 py-2.5 text-sm mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <label className="text-xs font-medium text-muted mt-2">Username</label>
          <input
            className="bg-surface2 border border-border rounded-lg px-3.5 py-3 text-text text-sm outline-none focus:border-accent/50 transition-colors"
            value={form.username}
            onChange={e => setForm(f => ({...f, username: e.target.value}))}
            placeholder="admin" required
          />
          <label className="text-xs font-medium text-muted mt-2">Password</label>
          <input
            className="bg-surface2 border border-border rounded-lg px-3.5 py-3 text-text text-sm outline-none focus:border-accent/50 transition-colors"
            type="password" value={form.password}
            onChange={e => setForm(f => ({...f, password: e.target.value}))}
            placeholder="••••••••" required
          />
          <button
            className="mt-5 bg-accent text-bg rounded-lg py-3.5 font-black text-sm cursor-pointer disabled:opacity-60 transition-opacity hover:opacity-90"
            style={{fontFamily:'var(--font-display)'}}
            disabled={loading}
          >
            {loading ? 'Masuk...' : 'Masuk →'}
          </button>
        </form>
      </div>
    </div>
  );
}
