import { Link } from 'react-router-dom';

export default function Brand({ compact = false }) {
  return (
    <Link
      className={`brand ${compact ? 'brand-compact' : ''}`}
      to="/"
      aria-label="Spectrum 2026 home"
    >
      <div className="brand-mark">
        <img
          src="/images/spectrum-logo.png"
          alt="Spectrum 2026"
        />
      </div>

      <span className="brand-copy">
        <b>
          SPECTRUM <i>2026</i>
        </b>
        <small>THE STUDENT'S FORUM</small>
      </span>
    </Link>
  );
}