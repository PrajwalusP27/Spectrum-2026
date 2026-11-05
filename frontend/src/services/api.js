import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'https://spectrum-2026-jet.vercel.app/', withCredentials: true, headers: { 'Content-Type': 'application/json' } });
export default api;
