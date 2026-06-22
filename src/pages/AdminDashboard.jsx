import { useCallback, useEffect, useRef, useState } from 'react'
import { useAdmin } from '../context/AdminContext.jsx'
import {
  getDashboardStats,
  getRegistrations,
  getAdminWebinars,
  exportRegistrationsCSV,
  createWebinar,
  updateWebinar,
  deleteWebinar,
  togglePublish,
} from '../api/admin.js'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—'

const BLANK_FORM = {
  title: '',
  description: '',
  date: '',
  time: '',
  venue: '',
  meetingLink: '',
  price: '',
  isPublished: false,
}

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

// ─── Publish Badge ────────────────────────────────────────────────────────────
function PublishBadge({ published }) {
  return (
    <span className={`admin-badge ${published ? 'admin-badge--paid' : 'admin-badge--pending'}`}>
      {published ? '● Live' : '○ Draft'}
    </span>
  )
}

// ─── Webinar Form Modal ───────────────────────────────────────────────────────
function WebinarFormModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(
    initial
      ? {
          title: initial.title ?? '',
          description: initial.description ?? '',
          date: initial.date ? initial.date.slice(0, 10) : '',
          time: initial.time ?? '',
          venue: initial.venue ?? '',
          meetingLink: initial.meetingLink ?? '',
          price: initial.price ?? '',
          isPublished: initial.isPublished ?? false,
        }
      : BLANK_FORM
  )
  const [saving, setSaving] = useState(false)
  const [formErr, setFormErr] = useState('')

  const set = (field) => (e) => {
    const val =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((p) => ({ ...p, [field]: val }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormErr('')
    if (!form.title.trim() || !form.description.trim() || !form.date || !form.time || !form.venue.trim()) {
      setFormErr('Title, description, date, time, and venue are required.')
      return
    }
    setSaving(true)
    try {
      await onSave({ ...form, price: Number(form.price) || 0 })
      onClose()
    } catch (err) {
      setFormErr(err.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h2 className="admin-modal__title">
            {initial ? '✏️ Edit Webinar' : '➕ Create Webinar'}
          </h2>
          <button className="admin-modal__close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form className="admin-wf" onSubmit={handleSubmit} noValidate>
          <div className="admin-wf__row">
            <div className="admin-wf__field admin-wf__field--full">
              <label>Title <span className="admin-wf__req">*</span></label>
              <input value={form.title} onChange={set('title')} placeholder="Webinar title" disabled={saving} />
            </div>
          </div>

          <div className="admin-wf__row">
            <div className="admin-wf__field admin-wf__field--full">
              <label>Description <span className="admin-wf__req">*</span></label>
              <textarea rows={3} value={form.description} onChange={set('description')} placeholder="Short description…" disabled={saving} />
            </div>
          </div>

          <div className="admin-wf__row">
            <div className="admin-wf__field">
              <label>Date <span className="admin-wf__req">*</span></label>
              <input type="date" value={form.date} onChange={set('date')} disabled={saving} />
            </div>
            <div className="admin-wf__field">
              <label>Time <span className="admin-wf__req">*</span></label>
              <input type="time" value={form.time} onChange={set('time')} disabled={saving} />
            </div>
          </div>

          <div className="admin-wf__row">
            <div className="admin-wf__field">
              <label>Venue <span className="admin-wf__req">*</span></label>
              <input value={form.venue} onChange={set('venue')} placeholder="e.g. Google Meet / Zoom" disabled={saving} />
            </div>
            <div className="admin-wf__field">
              <label>Meeting Link</label>
              <input type="url" value={form.meetingLink} onChange={set('meetingLink')} placeholder="https://…" disabled={saving} />
            </div>
          </div>

          <div className="admin-wf__row">
            <div className="admin-wf__field">
              <label>Price (₹) — 0 for free</label>
              <input type="number" min="0" value={form.price} onChange={set('price')} placeholder="0" disabled={saving} />
            </div>
            <div className="admin-wf__field admin-wf__field--check">
              <label className="admin-wf__check-label">
                <input type="checkbox" checked={form.isPublished} onChange={set('isPublished')} disabled={saving} />
                <span>Publish immediately</span>
              </label>
            </div>
          </div>

          {formErr && <p className="admin-wf__error">{formErr}</p>}

          <div className="admin-wf__actions">
            <button type="button" className="admin-btn admin-btn--ghost" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
              {saving ? <span className="admin-spinner" /> : (initial ? 'Save Changes' : 'Create Webinar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Delete Confirm Dialog ────────────────────────────────────────────────────
function DeleteConfirm({ webinar, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false)

  const handle = async () => {
    setDeleting(true)
    try {
      await onConfirm()
      onClose()
    } catch {
      setDeleting(false)
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal admin-modal--sm" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h2 className="admin-modal__title">🗑️ Delete Webinar</h2>
          <button className="admin-modal__close" onClick={onClose}>×</button>
        </div>
        <p className="admin-delete-msg">
          Are you sure you want to delete <strong>"{webinar.title}"</strong>?
          This action cannot be undone.
        </p>
        <div className="admin-wf__actions">
          <button className="admin-btn admin-btn--ghost" onClick={onClose} disabled={deleting}>Cancel</button>
          <button className="admin-btn admin-btn--danger" onClick={handle} disabled={deleting}>
            {deleting ? <span className="admin-spinner" /> : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ stats, webinars, loadingStats }) {
  return (
    <>
      {/* Stats */}
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

      {/* Webinar breakdown */}
      {!loadingStats && webinars.length > 0 && (
        <section className="admin-section">
          <h2 className="admin-section__title">Webinar Breakdown</h2>
          <div className="admin-webinar-cards">
            {webinars.map((w) => (
              <div key={w._id} className="admin-webinar-card">
                <h3 className="admin-webinar-card__name">{w.title}</h3>
                <p className="admin-webinar-card__date">{formatDate(w.date)}</p>
                <div className="admin-webinar-card__counts">
                  <span>📋 {w.registrations ?? 0} total</span>
                  <span>💳 {w.paidRegistrations ?? 0} paid</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

// ─── Registrations Tab ────────────────────────────────────────────────────────
function RegistrationsTab({ webinars }) {
  const [registrations, setRegistrations] = useState([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 })
  const [search, setSearch] = useState('')
  const [filterWebinar, setFilterWebinar] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [page, setPage] = useState(1)
  const [loadingRegs, setLoadingRegs] = useState(true)
  const [selectedReg, setSelectedReg] = useState(null)

  const fetchRegs = useCallback(() => {
    setLoadingRegs(true)
    getRegistrations({ search, webinarId: filterWebinar, paymentStatus: filterStatus, page, limit: 20 })
      .then((r) => {
        setRegistrations(r.data || [])
        setPagination(r.pagination || { total: 0, page: 1, pages: 1 })
      })
      .catch(console.error)
      .finally(() => setLoadingRegs(false))
  }, [search, filterWebinar, filterStatus, page])

  useEffect(() => { fetchRegs() }, [fetchRegs])

  return (
    <>
      <section className="admin-section">
        <div className="admin-section__toolbar">
          <h2 className="admin-section__title">Registrations</h2>
          <div className="admin-toolbar-right">
            <button
              className="admin-export-btn"
              onClick={() => exportRegistrationsCSV({ webinarId: filterWebinar, paymentStatus: filterStatus })}
            >
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
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
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
                        <button className="admin-view-btn" onClick={() => setSelectedReg(r)}>
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
              <button className="admin-page-btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                ← Prev
              </button>
              <span className="admin-page-info">
                Page {pagination.page} of {pagination.pages} ({pagination.total} total)
              </span>
              <button className="admin-page-btn" disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)}>
                Next →
              </button>
            </div>
          </>
        )}
      </section>

      {/* Detail Modal */}
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
    </>
  )
}

// ─── Webinars Tab ─────────────────────────────────────────────────────────────
function WebinarsTab() {
  const [webinars, setWebinars] = useState([])
  const [loading, setLoading] = useState(true)
  const [formModal, setFormModal] = useState(null) // null | 'create' | webinar object
  const [deleteTarget, setDeleteTarget] = useState(null) // null | webinar object
  const [togglingId, setTogglingId] = useState(null)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  const showToast = (msg, type = 'success') => {
    clearTimeout(toastTimer.current)
    setToast({ msg, type })
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(() => {
    setLoading(true)
    getAdminWebinars()
      .then((r) => setWebinars(r.data || []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const handleSave = async (data) => {
    if (formModal && typeof formModal === 'object') {
      await updateWebinar(formModal._id, data)
      showToast('Webinar updated successfully ✅')
    } else {
      await createWebinar(data)
      showToast('Webinar created successfully 🎉')
    }
    load()
  }

  const handleDelete = async () => {
    await deleteWebinar(deleteTarget._id)
    showToast('Webinar deleted 🗑️', 'error')
    load()
  }

  const handleTogglePublish = async (webinar) => {
    setTogglingId(webinar._id)
    try {
      await togglePublish(webinar._id, !webinar.isPublished)
      showToast(webinar.isPublished ? 'Webinar unpublished' : 'Webinar published ✅')
      load()
    } catch (err) {
      showToast(err.message || 'Toggle failed', 'error')
    } finally {
      setTogglingId(null)
    }
  }

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className={`admin-toast admin-toast--${toast.type}`}>{toast.msg}</div>
      )}

      <section className="admin-section">
        <div className="admin-section__toolbar">
          <h2 className="admin-section__title">Webinar Management</h2>
          <button className="admin-btn admin-btn--primary" onClick={() => setFormModal('create')}>
            ➕ New Webinar
          </button>
        </div>

        {loading ? (
          <div className="admin-loader">Loading webinars…</div>
        ) : webinars.length === 0 ? (
          <div className="admin-empty">
            No webinars yet.{' '}
            <button className="admin-empty-link" onClick={() => setFormModal('create')}>
              Create the first one →
            </button>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Venue</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {webinars.map((w) => (
                  <tr key={w._id} className="admin-table__row">
                    <td className="admin-table__bold">{w.title}</td>
                    <td>{formatDate(w.date)}</td>
                    <td>{w.time || '—'}</td>
                    <td className="admin-table__muted">{w.venue || '—'}</td>
                    <td>{w.price > 0 ? `₹${w.price}` : 'Free'}</td>
                    <td><PublishBadge published={w.isPublished} /></td>
                    <td>
                      <div className="admin-action-group">
                        <button
                          className={`admin-toggle-btn ${w.isPublished ? 'admin-toggle-btn--unpublish' : 'admin-toggle-btn--publish'}`}
                          onClick={() => handleTogglePublish(w)}
                          disabled={togglingId === w._id}
                          title={w.isPublished ? 'Unpublish' : 'Publish'}
                        >
                          {togglingId === w._id ? <span className="admin-spinner admin-spinner--sm" /> : (w.isPublished ? '⏸ Unpublish' : '▶ Publish')}
                        </button>
                        <button className="admin-edit-btn" onClick={() => setFormModal(w)} title="Edit">
                          ✏️ Edit
                        </button>
                        <button className="admin-delete-btn" onClick={() => setDeleteTarget(w)} title="Delete">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Create / Edit Modal */}
      {formModal && (
        <WebinarFormModal
          initial={formModal === 'create' ? null : formModal}
          onClose={() => setFormModal(null)}
          onSave={handleSave}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <DeleteConfirm
          webinar={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  )
}

// ─── Admin Dashboard ──────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { logout, adminEmail } = useAdmin()
  const [tab, setTab] = useState('overview')

  // Pre-fetch stats for overview tab
  const [stats, setStats] = useState(null)
  const [overviewWebinars, setOverviewWebinars] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    setLoadingStats(true)
    getDashboardStats()
      .then((r) => {
        setStats(r.data)
        setOverviewWebinars(r.data?.webinarStats || [])
      })
      .catch(console.error)
      .finally(() => setLoadingStats(false))
  }, [])

  // We also need webinars list for the registrations filter dropdown
  const [allWebinars, setAllWebinars] = useState([])
  useEffect(() => {
    getAdminWebinars()
      .then((r) => setAllWebinars(r.data || []))
      .catch(console.error)
  }, [])

  const TABS = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'registrations', icon: '👥', label: 'Registrations' },
    { id: 'webinars', icon: '🎯', label: 'Webinars' },
  ]

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

      {/* ── Body: Sidebar + Content ── */}
      <div className="admin-body">
        {/* Sidebar */}
        <nav className="admin-sidebar">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`admin-sidebar__item ${tab === t.id ? 'admin-sidebar__item--active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span className="admin-sidebar__icon">{t.icon}</span>
              <span className="admin-sidebar__label">{t.label}</span>
            </button>
          ))}
        </nav>

        {/* Main content */}
        <main className="admin-dash__main">
          {tab === 'overview' && (
            <OverviewTab
              stats={stats}
              webinars={overviewWebinars}
              loadingStats={loadingStats}
            />
          )}
          {tab === 'registrations' && <RegistrationsTab webinars={allWebinars} />}
          {tab === 'webinars' && <WebinarsTab />}
        </main>
      </div>
    </div>
  )
}
