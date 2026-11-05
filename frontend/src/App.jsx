import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import RegistrationSuccess from './pages/RegistrationSuccess.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

export default function App() {
  return <Routes><Route path="/" element={<Home />} /><Route path="/register" element={<Register />} /><Route path="/registration-success/:registrationId" element={<RegistrationSuccess />} /><Route path="/admin/login" element={<AdminLogin />} /><Route path="/admin" element={<AdminDashboard />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>;
}
