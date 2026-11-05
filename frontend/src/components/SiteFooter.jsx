import { Link } from 'react-router-dom';
import Brand from './Brand.jsx';

export default function SiteFooter() {
  return <footer className="site-footer"><div className="container footer-main"><div><Brand /><p className="footer-intro">A celebration of talent, teamwork and the spirit of sport.</p></div><div className="footer-links"><b>Explore</b><a href="/#about">About</a><a href="/#sports">Sports</a><Link to="/register">Register</Link><Link to="/admin/login">Admin</Link></div><div className="footer-links"><b>Event</b><span>23 November 2026</span><span>East West PU College</span><span>Invited colleges only</span></div></div><div className="container footer-bottom"><span>© 2026 SPECTRUM – THE STUDENT'S FORUM</span><span>Organized by East West PU College</span></div></footer>;
}
