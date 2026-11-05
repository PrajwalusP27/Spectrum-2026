import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import Brand from './Brand.jsx';

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return <header className="site-header"><div className="container nav-wrap"><Brand /><button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X /> : <Menu />}</button><nav className={open ? 'nav-links open' : 'nav-links'}><a href="/#home" onClick={close}>Home</a><a href="/#about" onClick={close}>About</a><a href="/#sports" onClick={close}>Sports</a><a href="/#contact" onClick={close}>Contact</a><Link className="button button-gold nav-cta" to="/register" onClick={close}>Register your team <ArrowUpRight size={16} /></Link></nav></div></header>;
}
