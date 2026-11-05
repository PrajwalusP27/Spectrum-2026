import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, LockKeyhole } from 'lucide-react';
import Brand from '../components/Brand.jsx';
import api from '../services/api.js';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' }); const [error, setError] = useState(''); const [loading, setLoading] = useState(false); const navigate = useNavigate();
  const submit = async (e) => { e.preventDefault(); setLoading(true); setError(''); try { await api.post('/admin/login', form); navigate('/admin'); } catch (err) { setError(err.response?.data?.message || 'Unable to sign in. Check your details and try again.'); } finally { setLoading(false); } };
  return <main className="login-shell"><div className="login-card"><Brand/><div className="login-icon"><LockKeyhole/></div><p className="eyebrow dark-eyebrow">PRIVATE PORTAL</p><h1>Administrator<br/><em>sign in.</em></h1><p>Sign in to view registration applications.</p><form onSubmit={submit}><div className="field-group"><label htmlFor="email">Admin email</label><input id="email" type="email" autoComplete="username" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}/></div><div className="field-group"><label htmlFor="password">Password</label><input id="password" type="password" autoComplete="current-password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}/></div>{error && <div className="form-notice" role="alert">{error}</div>}<button className="button button-burgundy login-submit" disabled={loading}>{loading ? <><span className="spinner light"/> Signing in…</> : 'Sign in securely'}</button></form><Link to="/" className="back-link"><ArrowLeft size={15}/> Back to event</Link></div></main>;
}
