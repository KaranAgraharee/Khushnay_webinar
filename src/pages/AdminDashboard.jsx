import { useCallback, useEffect, useState } from 'react'
import { useAdmin } from '../context/AdminContext.jsx'
import {
  getDashboardStats,
  getRegistrations,
  getAdminWebinars,
  exportRegistrationsCSV,
} from '../api/admin.js'

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }) {
  return (
    <div className={`admin-stat-card admin-stat-card--${color}`}>
      <div className="admin-stat-card__icon">{icon}</div>
      <div className="admin-stat-card__body">
        <p className="admin-stat-card__label">{label}</p>
        <p className="admin-stat-card__value">{value ?? '—'}</p>
      </div>
    </div>
  )
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    paid: { label: 'Paid', cls: 'paid' },
    not_required: { label: 'Free', cls: 'free' },
    pending: { label: 'Pending', cls: 'pending' },
    failed: { label: 'Failed', cls: 'failed' },
  }
  const { label, cls } = map[status] || { label: status, cls: 'default' }
  return <span className={`admin-badge admin-badge--${cls}`}>{label}</span>
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { logout, adminEmail } = useAdmin()

  const [stats, setStats] = useState(null)
  const [registrations, setRegistrations] = useState([])
  const [webinars, setWebinars] = useState([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 })

  const [search, setSearch] = useState('')
  const [filterWebinar, setFilterWebinar] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [page, setPage] = useState(1)

  const [loadingStats, setLoadingStats] = useState(true)
  const [loadingRegs, setLoadingRegs] = useState(true)
  const [selectedReg, setSelectedReg] = useState(null)

  // ── Fetch stats ────────────────────────────────────────────────────────────
  useEffect(() => {
    setLoadingStats(true)
    getDashboardStats()
      .then((r) => {
        setStats(r.data)
        setWebinars(r.data?.webinarStats || [])
      })
      .catch(console.error)
      .finally(() => setLoadingStats(false))
  }, [])

  // ── Fetch registrations ────────────────────────────────────────────────────
  const fetchRegs = useCallback(() => {
    setLoadingRegs(true)
    getRegistrations({
      search,
      webinarId: filterWebinar,
      paymentStatus: filterStatus,
      page,
      limit: 20,
    })
      .then((r) => {
        setRegistrations(r.data || [])
        setPagination(r.pagination || { total: 0, page: 1, pages: 1 })
      })
      .catch(console.error)
      .finally(() => setLoadingRegs(false))
  }, [search, filterWebinar, filterStatus, page])

  useEffect(() => {
    fetchRegs()
  }, [fetchRegs])

  // ── Also fetch the full webinars list for filter dropdown ──────────────────
  useEffect(() => {
    getAdminWebinars()
      .then((r) => setWebinars(r.data || []))
      .catch(console.error)
  }, [])

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handleExport = () => {
    exportRegistrationsCSV({
      webinarId: filterWebinar,
      paymentStatus: filterStatus,
    })
  }

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

  return (
    <div className="admin-dash">
      {/* ── Header ── */}
      <header className="admin-dash__header">
        <div className="admin-dash__header-left">
          <span className="admin-dash__logo">🛡️</span>
          <div>
            <h1 className="admin-dash__title">Admin Dashboard</h1>
            <p className="admin-dash__sub">Webinar Registration Management</p>
          </div>
        </div>
        <div className="admin-dash__header-right">
          <span className="admin-dash__admin-email">{adminEmail}</span>
          <a href="/" className="admin-dash__link">View Site</a>
          <button className="admin-dash__logout" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="admin-dash__main">

        {/* ── Stats ── */}
        <section className="admin-stats">
          {loadingStats ? (
            <div className="admin-loader">Loading stats…</div>
          ) : (
            <>
              <StatCard icon="👥" label="Total Registrations" value={stats?.totalRegistrations} color="blue" />
              <StatCard icon="💳" label="Paid Registrations" value={stats?.totalPaid} color="green" />
              <StatCard icon="📅" label="Active Webinars" value={webinars.length} color="purple" />
              <StatCard
                icon="💰"
                label="Free Registrations"
                value={(stats?.totalRegistrations || 0) - (stats?.totalPaid || 0)}
                color="orange"
              />
            </>
          )}
        </section>

        {/* ── Webinar Breakdown ── */}
        {!loadingStats && webinars.length > 0 && (
          <section className="admin-section">
            <h2 className="admin-section__title">Webinar Breakdown</h2>
            <div className="admin-webinar-cards">
              {webinars.map((w) => (
                <div key={w._id} className="admin-webinar-card">
                  <h3 className="admin-webinar-card__name">{w.title}</h3>
                  <p className="admin-webinar-card__date">{formatDate(w.date)}</p>
                  <div className="admin-webinar-card__counts">
                    <span>📋 {w.registrations} total</span>
                    <span>💳 {w.paidRegistrations} paid</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Registrations Table ── */}
        <section className="admin-section">
          <div className="admin-section__toolbar">
            <h2 className="admin-section__title">Registrations</h2>
            <div className="admin-toolbar-right">
              <button className="admin-export-btn" onClick={handleExport}>
                ⬇️ Export CSV
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="admin-filters">
            <input
              className="admin-search"
              type="search"
              placeholder="Search by name, email, or phone…"
              value={search}
              onChange={handleSearch}
            />
            <select
              className="admin-filter-select"
              value={filterWebinar}
              onChange={(e) => { setFilterWebinar(e.target.value); setPage(1) }}
            >
              <option value="">All Webinars</option>
              {webinars.map((w) => (
                <option key={w._id} value={w._id}>{w.title}</option>
              ))}
            </select>
            <select
              className="admin-filter-select"
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(1) }}
            >
              <option value="">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="not_required">Free</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {loadingRegs ? (
            <div className="admin-loader">Loading registrations…</div>
          ) : registrations.length === 0 ? (
            <div className="admin-empty">No registrations found.</div>
          ) : (
            <>
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Webinar</th>
                      <th>Amount</th>
                      <th>Payment</th>
                      <th>Registered</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((r) => (
                      <tr key={r._id} className="admin-table__row">
                        <td>{r.name || '—'}</td>
                        <td className="admin-table__email">{r.email || '—'}</td>
                        <td>{r.phone || '—'}</td>
                        <td>{r.webinar?.title || '—'}</td>
                        <td>{r.amount > 0 ? `₹${r.amount}` : 'Free'}</td>
                        <td><StatusBadge status={r.paymentStatus} /></td>
                        <td>{formatDate(r.createdAt)}</td>
                        <td>
                          <button
                            className="admin-view-btn"
                            onClick={() => setSelectedReg(r)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="admin-pagination">
                <button
                  className="admin-page-btn"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Prev
                </button>
                <span className="admin-page-info">
                  Page {pagination.page} of {pagination.pages} ({pagination.total} total)
                </span>
                <button
                  className="admin-page-btn"
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next →
                </button>
              </div>
            </>
          )}
        </section>
      </main>

      {/* ── Detail Modal ── */}
      {selectedReg && (
        <div className="admin-detail-overlay" onClick={() => setSelectedReg(null)}>
          <div className="admin-detail-modal" onClick={(e) => e.stopPropagation()}>
            <button className="admin-detail-close" onClick={() => setSelectedReg(null)}>×</button>
            <h2 className="admin-detail-title">Registration Detail</h2>
            <dl className="admin-detail-list">
              <dt>Name</dt><dd>{selectedReg.name}</dd>
              <dt>Email</dt><dd>{selectedReg.email}</dd>
              <dt>Phone</dt><dd>{selectedReg.phone}</dd>
              <dt>Webinar</dt><dd>{selectedReg.webinar?.title}</dd>
              <dt>Amount</dt><dd>{selectedReg.amount > 0 ? `₹${selectedReg.amount}` : 'Free'}</dd>
              <dt>Payment Status</dt><dd><StatusBadge status={selectedReg.paymentStatus} /></dd>
              <dt>Registration Status</dt><dd>{selectedReg.status}</dd>
              <dt>Registered On</dt><dd>{formatDate(selectedReg.createdAt)}</dd>
              <dt>ID</dt><dd className="admin-detail-id">{selectedReg._id}</dd>
            </dl>
          </div>
        </div>
      )}
    </div>
  )
}
