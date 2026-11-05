
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowDownToLine,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  X
} from 'lucide-react';
import Brand from '../components/Brand.jsx';
import api from '../services/api.js';

const blankStats = {
  totalRegistrations: 0,
  participatingColleges: 0,
  bySport: { Volleyball: 0, Throwball: 0, Carrom: 0 }
};

const date = (value) =>
  value
    ? new Date(value).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '—';

export default function AdminDashboard() {
  const [stats, setStats] = useState(blankStats);
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({
    search: '',
    sport: '',
    college: '',
    sort: 'desc',
    page: 1
  });
  const [colleges, setColleges] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  async function loadStats() {
    const { data } = await api.get('/admin/dashboard/stats');
    setStats(data);
  }

  async function loadRows(next = filters) {
    setLoading(true);
    setError('');

    try {
      const { data } = await api.get('/admin/registrations', {
        params: { ...next, limit: 10 }
      });

      setRows(data.registrations);
      setMeta(data.pagination);
      setColleges(data.colleges || []);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/admin/login');
      } else {
        setError('Registration list could not be loaded. Please retry.');
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    api.get('/admin/me')
      .then(() => Promise.all([loadStats(), loadRows()]))
      .catch(() => navigate('/admin/login'));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadStats().catch(() => {});
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadRows({ ...filters, page: 1 });
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.search, filters.sport, filters.college, filters.sort]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen || selected ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, selected]);

  const logout = async () => {
    try {
      await api.post('/admin/logout');
    } finally {
      navigate('/admin/login');
    }
  };

  const exportRows = async () => {
    try {
      const response = await api.get('/admin/registrations/export', {
        params: filters,
        responseType: 'blob'
      });

      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');

      link.href = url;
      link.download = 'spectrum-registrations.csv';
      link.click();

      URL.revokeObjectURL(url);
    } catch {
      setError('Export failed. Please try again.');
    }
  };

  const openDetails = async (id) => {
    try {
      const { data } = await api.get(`/admin/registrations/${id}`);
      setSelected(data);
    } catch {
      setError('Registration details could not be loaded.');
    }
  };

  const changePage = (page) => {
    const next = { ...filters, page };
    setFilters(next);
    loadRows(next);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="admin-shell">
      {mobileMenuOpen && (
        <button
          className="mobile-menu-backdrop"
          aria-label="Close navigation menu"
          onClick={closeMobileMenu}
        />
      )}

      <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="mobile-sidebar-heading">
          <Brand />
          <button
            className="mobile-sidebar-close"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <X size={21} />
          </button>
        </div>

        <div className="admin-nav-label">WORKSPACE</div>

        <a
          className="admin-nav active"
          href="#overview"
          onClick={closeMobileMenu}
        >
          Overview
        </a>

        <a
          className="admin-nav"
          href="#registrations"
          onClick={closeMobileMenu}
        >
          Registrations <span>{stats.totalRegistrations}</span>
        </a>

        <div className="sidebar-spacer" />

        <div className="admin-user">
          <div className="admin-avatar">EW</div>
          <div>
            <b>Event Admin</b>
            <small>Read-only access</small>
          </div>
        </div>

        <button className="logout-button" onClick={logout}>
          <LogOut size={16} />
          Log out
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu size={22} />
            </button>

            <div>
              <span className="admin-breadcrumb">SPECTRUM 2026</span>
              <span className="crumb-divider">/</span>
              <span className="admin-workspace-label">Admin workspace</span>
            </div>
          </div>

          <div className="admin-top-right">
            <span>
              <ShieldCheck size={15} />
              Secure portal
            </span>

            <button onClick={logout}>
              <LogOut size={16} />
              Log out
            </button>
          </div>
        </header>

        <div className="admin-content">
          <section className="admin-welcome" id="overview">
            <div>
              <p className="eyebrow dark-eyebrow">EVENT OVERVIEW</p>
              <h1>
                Registration <em>dashboard.</em>
              </h1>
              <p>
                Live view of team applications received for SPECTRUM 2026.
              </p>
            </div>

            <div className="date-chip">23 NOVEMBER 2026</div>
          </section>

          <section className="stat-grid">
            <article className="stat-card stat-primary">
              <span>TOTAL REGISTRATIONS</span>
              <strong>{stats.totalRegistrations}</strong>
              <small>All applications received</small>
            </article>

            <article className="stat-card">
              <span>PARTICIPATING COLLEGES</span>
              <strong>{stats.participatingColleges}</strong>
              <small>Unique institutions</small>
            </article>

            <article className="stat-card">
              <span>VOLLEYBALL</span>
              <strong>{stats.bySport?.Volleyball || 0}</strong>
              <small>Team applications</small>
            </article>

            <article className="stat-card">
              <span>THROWBALL</span>
              <strong>{stats.bySport?.Throwball || 0}</strong>
              <small>Team applications</small>
            </article>

            <article className="stat-card">
              <span>CARROM</span>
              <strong>{stats.bySport?.Carrom || 0}</strong>
              <small>Team applications</small>
            </article>
          </section>

          <section className="registrations-section" id="registrations">
            <div className="table-heading">
              <div>
                <p className="eyebrow dark-eyebrow">APPLICATIONS</p>
                <h2>
                  Team registrations <span>{meta.total}</span>
                </h2>
              </div>

              <button
                className="button button-burgundy export-button"
                onClick={exportRows}
              >
                <ArrowDownToLine size={16} />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="table-filters">
              <div className="search-box">
                <Search size={16} />
                <input
                  placeholder="Search college, team or registration ID…"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters({ ...filters, search: e.target.value })
                  }
                />
              </div>

              <select
                aria-label="Filter by sport"
                value={filters.sport}
                onChange={(e) =>
                  setFilters({ ...filters, sport: e.target.value })
                }
              >
                <option value="">All sports</option>
                <option>Volleyball</option>
                <option>Throwball</option>
                <option>Carrom</option>
              </select>

              <select
                aria-label="Filter by college"
                value={filters.college}
                onChange={(e) =>
                  setFilters({ ...filters, college: e.target.value })
                }
              >
                <option value="">All colleges</option>
                {colleges.map((college) => (
                  <option key={college}>{college}</option>
                ))}
              </select>

              <button
                className="sort-button"
                onClick={() =>
                  setFilters({
                    ...filters,
                    sort: filters.sort === 'desc' ? 'asc' : 'desc'
                  })
                }
              >
                Date
                <ChevronDown size={15} />
                {filters.sort === 'asc' ? ' ↑' : ' ↓'}
              </button>
            </div>

            {error && <div className="form-notice">{error}</div>}

            {/* Desktop registration table */}
            <div className="table-wrap desktop-registration-table">
              <table>
                <thead>
                  <tr>
                    <th>REGISTRATION ID</th>
                    <th>COLLEGE</th>
                    <th>TEAM</th>
                    <th>SPORT</th>
                    <th>REPRESENTATIVE</th>
                    <th>PLAYERS</th>
                    <th>SUBMITTED</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="table-empty">
                        Loading registrations…
                      </td>
                    </tr>
                  ) : rows.length ? (
                    rows.map((row) => (
                      <tr key={row._id}>
                        <td className="id-cell">{row.registrationId}</td>
                        <td>{row.collegeName}</td>
                        <td>{row.teamName}</td>
                        <td>
                          <span className={`sport-pill ${row.sport.toLowerCase()}`}>
                            {row.sport}
                          </span>
                        </td>
                        <td>{row.representativeName}</td>
                        <td>{row.teamMembers.length}</td>
                        <td>{date(row.createdAt)}</td>
                        <td>
                          <button
                            className="view-button"
                            onClick={() => openDetails(row._id)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="table-empty">
                        No registrations match these filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile registration cards */}
            <div className="mobile-registration-list">
              {loading ? (
                <div className="mobile-list-empty">
                  Loading registrations…
                </div>
              ) : rows.length ? (
                rows.map((row) => (
                  <article className="mobile-registration-card" key={row._id}>
                    <div className="mobile-registration-card-top">
                      <span className="mobile-registration-id">
                        {row.registrationId}
                      </span>
                      <span className={`sport-pill ${row.sport.toLowerCase()}`}>
                        {row.sport}
                      </span>
                    </div>

                    <h3>{row.teamName}</h3>
                    <p className="mobile-college-name">{row.collegeName}</p>

                    <div className="mobile-registration-meta">
                      <div>
                        <span>REPRESENTATIVE</span>
                        <b>{row.representativeName}</b>
                      </div>
                      <div>
                        <span>PLAYERS</span>
                        <b>{row.teamMembers.length}</b>
                      </div>
                    </div>

                    <div className="mobile-registration-footer">
                      <span>{date(row.createdAt)}</span>
                      <button
                        className="view-button"
                        onClick={() => openDetails(row._id)}
                      >
                        View details →
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="mobile-list-empty">
                  No registrations match these filters.
                </div>
              )}
            </div>

            <div className="pagination">
              <span>
                Showing{' '}
                {rows.length ? (meta.page - 1) * 10 + 1 : 0}
                –{Math.min(meta.page * 10, meta.total)} of {meta.total}
              </span>

              <div>
                <button
                  disabled={meta.page <= 1}
                  onClick={() => changePage(meta.page - 1)}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={17} />
                </button>

                <span>
                  Page {meta.page} of {meta.pages || 1}
                </span>

                <button
                  disabled={meta.page >= meta.pages}
                  onClick={() => changePage(meta.page + 1)}
                  aria-label="Next page"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </section>

          <p className="read-only-note">
            <ShieldCheck size={15} />
            This dashboard is read-only. Registration records cannot be edited
            or deleted.
          </p>
        </div>
      </main>

      {selected && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <section
            className="details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="details-title"
          >
            <div className="modal-heading">
              <div>
                <p className="eyebrow dark-eyebrow">REGISTRATION DETAILS</p>
                <h2 id="details-title">{selected.teamName}</h2>
              </div>

              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                <X />
              </button>
            </div>

            <div className="detail-grid">
              <div>
                <span>REGISTRATION ID</span>
                <b>{selected.registrationId}</b>
              </div>
              <div>
                <span>COLLEGE</span>
                <b>{selected.collegeName}</b>
              </div>
              <div>
                <span>SPORT</span>
                <b>{selected.sport}</b>
              </div>
              <div>
                <span>REPRESENTATIVE</span>
                <b>{selected.representativeName}</b>
              </div>
              <div>
                <span>CONTACT NUMBER</span>
                <b>{selected.contactNumber}</b>
              </div>
              <div>
                <span>SUBMITTED</span>
                <b>{date(selected.createdAt)}</b>
              </div>
            </div>

            <div className="member-list">
              <span>TEAM MEMBERS · {selected.teamMembers.length}</span>

              {selected.teamMembers.map((member, index) => (
                <p key={`${member}-${index}`}>
                  <i>{String(index + 1).padStart(2, '0')}</i>
                  {member}
                </p>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
