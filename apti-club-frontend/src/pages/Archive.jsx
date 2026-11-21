import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  ArrowUpDown, BookOpen, Briefcase, ChevronRight, Download, ExternalLink,
  FileText, Filter, Pencil, Plus, Settings, Trash2, X
} from 'lucide-react'
import { useApp } from '../context'
import { apiRequest, getApiAssetUrl } from '../api'

const companyDetails = {
  'L&T Technology Services': {
    short: 'LTTS',
    role: 'Associate Engineer (Trainee)',
    domain: 'Engineering & R&D Services',
    rounds: ['Online Test', 'Technical Interview', 'HR Interview'],
    tags: ['ECE', 'CSE'],
    highlight: 'Focus on core subject basics (OS, CN, DBMS), projects on resume, and arrays/strings coding questions.',
    accent: '#4f8ef7'
  },
  'Applied Materials': {
    short: 'AMAT',
    role: 'IT Solutions Management',
    domain: 'Semiconductor Equipment',
    rounds: ['Online MCQ Test', 'Pre-Placement Talk', 'Technical Interview', 'HR Interview'],
    tags: ['CSE'],
    highlight: 'Focus on DBMS, DSA, OOPs, OS and CN. Technical round is more communication-focused than deep coding.',
    accent: '#3ecf8e'
  },
  'Dover India Pvt Ltd': {
    short: 'DOVER',
    role: 'Software Engineer',
    domain: 'Industrial Manufacturing',
    rounds: ['Online Test', 'Technical Interview', 'Managerial + HR Interview'],
    tags: ['ISE'],
    highlight: 'OOPs, DBMS, code output questions, and project explanation with live execution. Communication is key.',
    accent: '#f59e0b'
  },
  MindSprint: {
    short: 'MS',
    role: 'Junior Engineer',
    domain: 'IT Services',
    rounds: ['Online Assessment', 'Technical Interview', 'HR Interview'],
    tags: ['ISE'],
    highlight: 'SDLC, DevOps, CN, Microservices and Java are asked. HirePro platform. Eligibility: 7.5 CGPA, no arrears.',
    accent: '#a78bfa'
  },
  'HSBC Technology India': {
    short: 'HSBC',
    role: 'Trainee Software Engineer',
    domain: 'Banking & Financial Services',
    rounds: ['Simulate Assessment', 'Codility Assessment', 'Technical Interview', 'HR Interview'],
    tags: ['CSE', 'ISE'],
    highlight: 'Codility has 3 coding questions (mapping, frequency, patterns). Tech round includes live coding in chosen language. Eligibility: 7 CGPA, no backlogs.',
    accent: '#22c55e'
  },
  Thoughtworks: {
    short: 'TW',
    role: 'Software Engineer',
    domain: 'Technology Consulting',
    rounds: ['Online Coding Assessment', 'Code Pairing Round', 'Technical Interview', 'Social Cultural Connectivity'],
    tags: ['ISE'],
    highlight: 'Unique code pairing round using GitHub project. Deep OOPs, DBMS, SQL queries and OS knowledge needed. 75-min coding test with 4 questions.',
    accent: '#f97316'
  }
}

const initialForm = {
  type: 'report',
  title: '',
  student_name: '',
  company: '',
  year: '',
  package: '',
  description: '',
  file: null
}

function PdfViewer({ item, onClose }) {
  useEffect(() => {
    const closeOnEscape = event => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  return (
    <div className="pdf-viewer-overlay" role="presentation" onClick={onClose}>
      <section
        className="pdf-viewer-modal"
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        onClick={event => event.stopPropagation()}
      >
        <header className="pdf-viewer-header">
          <div className="pdf-viewer-title">
            <FileText size={17} />
            <span>{item.title}</span>
          </div>
          <div className="pdf-viewer-actions">
            <a className="pdf-viewer-btn" href={item.file_url} target="_blank" rel="noreferrer" aria-label="Open PDF in new tab">
              <ExternalLink size={17} />
            </a>
            <button className="pdf-viewer-btn pdf-viewer-close" type="button" onClick={onClose} aria-label="Close PDF">
              <X size={19} />
            </button>
          </div>
        </header>
        <div className="pdf-viewer-body">
          <iframe className="pdf-iframe" src={item.file_url} title={item.title} />
        </div>
      </section>
    </div>
  )
}

function HandbookCard({ book, isAdmin, onEdit, onDelete, onOpen }) {
  return (
    <article className={`handbook-card ${!book.file_url ? 'handbook-card--locked' : ''}`} style={{ '--hb-color': '#6C5DD3' }}>
      <div className="hb-glow" />
      <div className="hb-top">
        <div className="hb-icon"><BookOpen size={22} /></div>
        <span className="hb-year">{book.year}</span>
      </div>
      <h3 className="hb-title">{book.title}</h3>
      <p className="hb-subtitle">{book.type === 'report' ? 'Placement report' : 'Placement handbook'}</p>
      {book.description && <p className="hb-desc">{book.description}</p>}
      {book.file_url ? (
        <button className="hb-btn hb-btn--available" type="button" onClick={() => onOpen(book)}>
          <Download size={15} /> View / Download PDF
        </button>
      ) : (
        <div className="hb-btn hb-btn--locked"><FileText size={15} /> PDF not uploaded</div>
      )}
      {isAdmin && (
        <button className="archive-edit-button" type="button" onClick={() => onEdit(book)}>
          <Pencil size={14} /> Edit
        </button>
      )}
      {isAdmin && (
        <button
          className="archive-delete-button"
          type="button"
          onClick={() => onDelete(book)}
          aria-label={`Delete ${book.title}`}
        >
          <Trash2 size={14} /> Delete
        </button>
              )}
    </article>
  )
}

function CompanyCard({ company, isAdmin, onEdit, onDelete, onOpen }) {
  const [open, setOpen] = useState(false)
  const details = companyDetails[company.name] || {
    short: company.name.slice(0, 5).toUpperCase(),
    role: 'Interview experience',
    domain: 'Company interview',
    rounds: [],
    tags: [],
    highlight: '',
    accent: '#6C5DD3'
  }

  return (
    <article className="company-card" style={{ '--co-accent': details.accent }}>
      <div
        className="cc-header"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-label={`${open ? 'Hide' : 'View'} ${company.name} interview reports`}
        onClick={() => setOpen(value => !value)}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setOpen(value => !value)
          }
        }}
      >
        <div className="cc-logo" style={{ borderColor: details.accent }}><span>{details.short}</span></div>
        <div className="cc-info">
          <div className="cc-name-row"><h3 className="cc-name">{company.name}</h3></div>
          <p className="cc-role">{details.role}</p>
          <p className="cc-domain">{details.domain}</p>
        </div>
        <ChevronRight size={18} className={`cc-chevron ${open ? 'cc-chevron--open' : ''}`} />
      </div>

      <div className="cc-tags">
        {details.tags.map(tag => (
          <span key={tag} className="cc-branch" style={{ borderColor: details.accent }}>{tag}</span>
        ))}
        <span className="cc-rounds-count">{company.reports.length} reports</span>
      </div>

      {open && (
        <div className="cc-expanded">
          {details.rounds.length > 0 && (
            <div className="cc-section">
              <span className="cc-section-label">Hiring Rounds</span>
              <div className="cc-rounds">
                {details.rounds.map((round, index) => (
                  <div key={round} className="cc-round">
                    <span className="cc-round-num">{index + 1}</span><span>{round}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {details.highlight && (
            <div className="cc-section">
              <span className="cc-section-label">What to focus on</span>
              <p className="cc-highlight">{details.highlight}</p>
            </div>
          )}
          <div className="cc-section">
            <span className="cc-section-label">Interview Reports from Students</span>
            <div className="cc-reports">
              {company.reports.map(report => (
                <div className="archive-report-row" key={report.id}>
                  <button
                    className="cc-report-link"
                    type="button"
                    disabled={!report.file_url}
                    onClick={() => onOpen(report)}
                    style={{ '--co-accent': details.accent }}
                  >
                    <FileText size={13} />
                    <span>{report.student_name} · {report.year}{report.package ? ` · ${report.package}` : ''}</span>
                    <Download size={12} className="cc-ext" />
                  </button>
                  {isAdmin && (
                    <button
                      className="archive-edit-button"
                      type="button"
                      onClick={() => onEdit(report)}
                      aria-label={`Edit ${report.student_name}'s report`}
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                  {isAdmin && (
                    <button
                      className="archive-delete-button"
                      type="button"
                      onClick={() => onDelete(report)}
                      aria-label={`Delete ${report.student_name}'s report`}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

/* ─── ADMIN PANEL (form only – right list removed) ───────────── */
function AdminPanel({
  saving, error, message, onClose, onSubmit, onCancelEdit,
  form, setForm, editingItem
}) {
  const isReport = form.type === 'report'

  const change = event => {
    const { name, value, files } = event.target
    setForm(current => ({
      ...current,
      [name]: name === 'file' ? files[0] || null : value
    }))
  }

  return (
    <div className="archive-admin-overlay" role="presentation" onClick={onClose}>
      <section
        className="archive-admin-dialog archive-admin-dialog--form-only"
        role="dialog"
        aria-modal="true"
        aria-labelledby="archive-admin-title"
        onClick={event => event.stopPropagation()}
      >
        <header className="archive-admin-header">
          <div>
            <span className="archive-eyebrow">ADMIN / ARCHIVE MANAGER</span>
            <h2 id="archive-admin-title">Add or edit archive items</h2>
          </div>
          <button type="button" className="pdf-viewer-btn" onClick={onClose} aria-label="Close archive manager">
            <X size={20} />
          </button>
        </header>

        <div className="archive-admin-content">
          <form className="admin-form archive-admin-form" onSubmit={onSubmit}>
            <label>
              Item type
              <select name="type" value={form.type} onChange={change} disabled={Boolean(editingItem)}>
                <option value="report">Student interview report</option>
                <option value="handbook">Handbook / batch report</option>
              </select>
            </label>

            {isReport ? (
              <>
                <label>
                  Student name
                  <input name="student_name" required value={form.student_name} onChange={change} />
                </label>
                <label>
                  Company
                  <input name="company" required value={form.company} onChange={change} />
                </label>
                <div className="form-two">
                  <label>
                    Year
                    <input type="number" name="year" min="1900" max="2100" required value={form.year} onChange={change} />
                  </label>
                  <label>
                    Package / CTC
                    <input name="package" value={form.package} onChange={change} placeholder="e.g. 8 LPA" />
                  </label>
                </div>
              </>
            ) : (
              <>
                <label>
                  Handbook title
                  <input name="title" required value={form.title} onChange={change} />
                </label>
                <label>
                  Year
                  <input type="number" name="year" min="1900" max="2100" required value={form.year} onChange={change} />
                </label>
                <label>
                  Description
                  <textarea name="description" value={form.description} onChange={change} rows="3" />
                </label>
              </>
            )}

            <label>
              PDF file {editingItem && <small>Leave blank to keep the current file</small>}
              <input type="file" name="file" accept="application/pdf,.pdf" required={!editingItem} onChange={change} />
            </label>

            {editingItem?.file_url && (
              <a className="text-link" href={editingItem.file_url} target="_blank" rel="noreferrer">
                View current PDF
              </a>
            )}

            {error && <div className="form-error" role="alert">{error}</div>}
            {message && <div className="form-success" role="status">{message}</div>}

            <div className="archive-admin-form-actions">
              <button className="btn btn-acid" type="submit" disabled={saving}>
                <Plus size={16} />
                {saving ? 'Saving...' : editingItem ? 'Save changes' : 'Add to archive'}
              </button>
              {editingItem && (
                <button className="btn btn-ghost" type="button" onClick={onCancelEdit}>
                  Cancel edit
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}

export default function Archive() {
  const { user, token } = useApp()
  const isAdmin = user?.role === 'admin'

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [sortOrder, setSortOrder] = useState('newest')

  // Separate filters
  const [handbookYearFilter, setHandbookYearFilter] = useState('All')
  const [reportYearFilter, setReportYearFilter] = useState('All')
  const [branchFilter, setBranchFilter] = useState('All')

  const [viewer, setViewer] = useState(null)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form, setForm] = useState({ ...initialForm })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const loadItems = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const data = await apiRequest('/archive', { token })
      setItems((data.items || []).map(item => (
        item.file_url?.startsWith('/archive-files/')
          ? { ...item, file_url: getApiAssetUrl(item.file_url) }
          : item
      )))
    } catch (requestError) {
      setLoadError(requestError.message || 'Could not load archive items.')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  // Years available for handbooks
  const handbookYears = useMemo(() => (
    [...new Set(
      items.filter(i => i.type === 'handbook').map(i => String(i.year))
    )].sort((a, b) => Number(b) - Number(a))
  ), [items])

  // Years available for student reports
  const reportYears = useMemo(() => (
    [...new Set(
      items.filter(i => i.type === 'report').map(i => String(i.year))
    )].sort((a, b) => Number(b) - Number(a))
  ), [items])

  const handbooks = useMemo(() => {
    return items
      .filter(item => item.type === 'handbook')
      .filter(item => handbookYearFilter === 'All' || String(item.year) === handbookYearFilter)
      .sort((a, b) => sortOrder === 'newest' ? b.year - a.year : a.year - b.year)
  }, [items, sortOrder, handbookYearFilter])

  const companies = useMemo(() => {
    const grouped = items
      .filter(item => item.type === 'report')
      .reduce((groups, report) => {
        const group = groups.get(report.company) || []
        group.push(report)
        groups.set(report.company, group)
        return groups
      }, new Map())

    return Array.from(grouped, ([name, reports]) => ({
      name,
      reports: reports
        .filter(report => reportYearFilter === 'All' || String(report.year) === reportYearFilter)
        .sort((a, b) => sortOrder === 'newest' ? b.year - a.year : a.year - b.year)
    }))
      .filter(company => company.reports.length > 0)
      .filter(company => branchFilter === 'All' || companyDetails[company.name]?.tags.includes(branchFilter))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [items, branchFilter, sortOrder, reportYearFilter])

  const editItem = item => {
    setEditingItem(item)
    setError('')
    setMessage('')
    setForm({
      type: item.type,
      title: item.title || '',
      student_name: item.student_name || '',
      company: item.company || '',
      year: String(item.year),
      package: item.package || '',
      description: item.description || '',
      file: null
    })
  }

  const openEdit = item => {
    editItem(item)
    setShowAdminPanel(true)
  }

  const cancelEdit = () => {
    setEditingItem(null)
    setError('')
    setMessage('')
    setForm({ ...initialForm })
  }

  const submitItem = async event => {
    event.preventDefault()
    setError('')
    setMessage('')
    setSaving(true)

    const body = new FormData()
    body.append('type', form.type)
    body.append('year', form.year)

    if (form.type === 'report') {
      body.append('student_name', form.student_name.trim())
      body.append('company', form.company.trim())
      body.append('package', form.package.trim())
    } else {
      body.append('title', form.title.trim())
      body.append('description', form.description.trim())
    }
    if (form.file) body.append('file', form.file)

    try {
      const result = await apiRequest(
        editingItem ? `/archive/${editingItem.id}` : '/archive',
        { method: editingItem ? 'PUT' : 'POST', body, token }
      )
      setMessage(result.message || 'Archive item saved.')
      setEditingItem(null)
      setForm({ ...initialForm })
      await loadItems()
    } catch (saveError) {
      setError(saveError.message || 'Could not save this archive item.')
    } finally {
      setSaving(false)
    }
  }

  const deleteItem = async item => {
    const itemName = item.title || `${item.student_name}'s ${item.company} report`
    const confirmed = window.confirm(`Are you sure you want to delete "${itemName}"? This action cannot be undone.`)

    if (!confirmed) return

    setLoadError('')
    try {
      const result = await apiRequest(`/archive/${item.id}`, {
        method: 'DELETE',
        token
      })
      setMessage(result.message || 'Archive item deleted successfully.')
      await loadItems()
    } catch (deleteError) {
      setLoadError(deleteError.message || 'Could not delete this archive item.')
    }
  }

  const reports = items.filter(item => item.type === 'report')
  const reportCount = reports.length
  const companyCount = new Set(reports.map(item => item.company)).size

  return (
    <div className="archive-page">
      <header className="archive-hero">
        <div className="archive-hero-top">
          <span className="archive-eyebrow">APTI CLUB / RESOURCE ARCHIVE</span>
          {isAdmin && (
            <button className="admin-toggle-btn" type="button" onClick={() => setShowAdminPanel(true)}>
              <Settings size={16} /> Manage Archive
            </button>
          )}
        </div>
        <h1 className="archive-h1">Prepare with<br /><em>confidence.</em></h1>
        <p className="archive-sub">
          Placement handbooks and first-hand interview experiences to help you take the next step in your career.
        </p>
        <div className="archive-highlights" aria-label="Archive contents">
          <span><b>{handbooks.length}</b> handbooks & reports</span>
          <span><b>{companyCount}</b> companies</span>
          <span><b>{reportCount}</b> student experiences</span>
        </div>
      </header>

      {/* Global sort only */}
      <div className="archive-controls">
        <button
          className="sort-btn"
          type="button"
          onClick={() => setSortOrder(value => value === 'newest' ? 'oldest' : 'newest')}
        >
          <ArrowUpDown size={14} />
          Sort by Year: {sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}
        </button>
      </div>

      {loading && <div className="empty-state">Loading archive...</div>}
      {!loading && loadError && (
        <div className="empty-state" role="alert">
          {loadError}
          <button type="button" className="text-link" onClick={loadItems}>Retry</button>
        </div>
      )}

      {!loading && !loadError && (
        <>
          {/* ── HANDBOOKS ── */}
          <section className="archive-section">
            <div className="archive-section-header">
              <BookOpen size={20} />
              <div>
                <h2>Handbooks & Reports</h2>
                <p>Placement preparation guides and batch reports.</p>
              </div>
            </div>

            {/* Separate year filter for handbooks */}
            <div className="year-filter">
              <span className="filter-label">Filter by Year:</span>
              <button
                type="button"
                className={`filter-btn ${handbookYearFilter === 'All' ? 'filter-btn--active' : ''}`}
                onClick={() => setHandbookYearFilter('All')}
              >
                All
              </button>
              {handbookYears.map(year => (
                <button
                  key={year}
                  type="button"
                  className={`filter-btn ${handbookYearFilter === year ? 'filter-btn--active' : ''}`}
                  onClick={() => setHandbookYearFilter(year)}
                >
                  {year}
                </button>
              ))}
            </div>

            <div className="handbooks-grid">
              {handbooks.map(book => (
                <HandbookCard
                  key={book.id}
                  book={book}
                  isAdmin={isAdmin}
                  onEdit={openEdit}
                  onDelete={deleteItem}
                  onOpen={setViewer}
                />
              ))}
            </div>
            {handbooks.length === 0 && (
              <p className="archive-empty">No handbooks match this year.</p>
            )}
          </section>

          {/* ── COMPANY INTERVIEW REPORTS ── */}
          <section className="archive-section">
            <div className="archive-section-header">
              <Briefcase size={20} />
              <div>
                <h2>Company Interview Reports</h2>
                <p>First-hand accounts from students who cleared each stage.</p>
              </div>
            </div>

            {/* Branch filter */}
            <div className="company-filter" role="group" aria-label="Filter reports by branch">
              <Filter size={14} />
              {['All', 'CSE', 'ISE', 'ECE'].map(branch => (
                <button
                  key={branch}
                  type="button"
                  className={`filter-btn ${branchFilter === branch ? 'filter-btn--active' : ''}`}
                  aria-pressed={branchFilter === branch}
                  onClick={() => setBranchFilter(branch)}
                >
                  {branch}
                </button>
              ))}
            </div>

            {/* Separate year filter for student reports */}
            <div className="year-filter">
              <span className="filter-label">Filter by Year:</span>
              <button
                type="button"
                className={`filter-btn ${reportYearFilter === 'All' ? 'filter-btn--active' : ''}`}
                onClick={() => setReportYearFilter('All')}
              >
                All
              </button>
              {reportYears.map(year => (
                <button
                  key={year}
                  type="button"
                  className={`filter-btn ${reportYearFilter === year ? 'filter-btn--active' : ''}`}
                  onClick={() => setReportYearFilter(year)}
                >
                  {year}
                </button>
              ))}
            </div>

            <div className="companies-grid">
              {companies.map(company => (
                <CompanyCard
                  key={company.name}
                  company={company}
                  isAdmin={isAdmin}
                  onEdit={openEdit}
                  onDelete={deleteItem}
                  onOpen={setViewer}
                />
              ))}
            </div>
            {companies.length === 0 && (
              <p className="archive-empty">No company reports match these filters yet.</p>
            )}
          </section>
        </>
      )}

      {viewer && <PdfViewer item={viewer} onClose={() => setViewer(null)} />}

      {isAdmin && showAdminPanel && (
        <AdminPanel
          saving={saving}
          error={error}
          message={message}
          onClose={() => setShowAdminPanel(false)}
          onSubmit={submitItem}
          onCancelEdit={cancelEdit}
          form={form}
          setForm={setForm}
          editingItem={editingItem}
        />
      )}
    </div>
  )
}