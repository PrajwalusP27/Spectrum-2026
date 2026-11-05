import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ArrowUpRight, Check } from 'lucide-react';
import Brand from '../components/Brand.jsx';
import api from '../services/api.js';

export default function RegistrationSuccess() {
  const { registrationId } = useParams(); const location = useLocation(); const [registration, setRegistration] = useState(location.state || null); const [error, setError] = useState('');
  useEffect(() => { if (!registration) api.get(`/registrations/${encodeURIComponent(registrationId)}`).then(({ data }) => setRegistration(data)).catch(() => setError('We could not retrieve this confirmation. Please check the registration ID or contact the organizers.')); }, [registration, registrationId]);
  return <main className="success-shell"><header className="form-header"><div className="container form-header-inner"><Brand compact/><Link to="/" className="back-link">SPECTRUM 2026</Link></div></header><section className="success-card"><div className="success-check"><Check size={30}/></div><p className="eyebrow dark-eyebrow">APPLICATION RECEIVED</p><h1>Thank you for<br/><em>bringing your team.</em></h1><p className="success-lede">Your registration application has been received. Keep your registration ID for your records.</p>{registration ? <><div className="confirmation-id"><span>REGISTRATION ID</span><strong>{registration.registrationId || registrationId}</strong></div><div className="confirmation-details"><div><span>COLLEGE</span><b>{registration.collegeName}</b></div><div><span>TEAM</span><b>{registration.teamName}</b></div><div><span>SPORT</span><b>{registration.sport}</b></div><div><span>EVENT DATE</span><b>23 November 2026</b></div></div></> : error ? <div className="form-notice">{error}</div> : <div className="loading-copy">Loading confirmation…</div>}<p className="approval-note">This confirms receipt of your application. It does not mean the team has been selected or approved.</p><Link to="/" className="button button-burgundy">Return to SPECTRUM <ArrowUpRight size={16}/></Link></section></main>;
}
