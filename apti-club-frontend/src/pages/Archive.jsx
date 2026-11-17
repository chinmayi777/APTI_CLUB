import React, { useState } from 'react'
import { Download, FileText, ChevronRight, BookOpen, Briefcase, Filter } from 'lucide-react'

/* ─── PDF BASE PATH ─────────────────────────────────────────────
   Place all PDFs inside your project's /public/reports/ folder.
   e.g. public/reports/Thoughtworks.pdf
   They will be served at /reports/Thoughtworks.pdf at runtime.
   For the handbook: public/handbooks/Career_Catalyst_2026.pdf
─────────────────────────────────────────────────────────────── */
const REPORT_BASE = '/reports/'
const HANDBOOK_BASE = '/handbooks/'

function reportUrl(filename) {
  return `${REPORT_BASE}${filename}`
}

function handbookUrl(filename) {
  return `${HANDBOOK_BASE}${filename}`
}

/* ─── HANDBOOKS DATA ────────────────────────────────────────── */
const handbooks = [
  {
    id: 'cc2',
    title: 'Career Catalyst Vol. 2',
    subtitle: 'Placement Prep Handbook 2026',
    desc: 'A complete roadmap covering aptitude, technical mastery, resume crafting, interview behaviour, and virtual hiring readiness. Created by the 2026 batch.',
    year: '2026',
    pages: 23,
    file: 'Career_Catalyst_2026_pdf_20251222_131431_0000.pdf',
    available: true,
    color: '#6C5DD3',
  },
  {
    id: 'cc1',
    title: 'Career Catalyst Vol. 1',
    subtitle: 'Placement Prep Handbook 2025',
    desc: 'The first edition of the Career Catalyst handbook — foundational placement guidance from the 2025 batch seniors.',
    year: '2025',
    pages: null,
    file: null,
    available: false,
    color: '#4f8ef7',
  },
  {
    id: 'report25',
    title: '2025 Batch Placement Report',
    subtitle: 'Annual Placement Statistics',
    desc: 'Comprehensive placement statistics, company-wise data, branch breakdowns and insights from the 2025 graduating batch.',
    year: '2025',
    pages: null,
    file: null,
    available: false,
    color: '#3ecf8e',
  },
]

/* ─── COMPANIES DATA ────────────────────────────────────────── */
const companies = [
  {
    id: 'ltts',
    name: 'L&T Technology Services',
    short: 'LTTS',
    role: 'Associate Engineer (Trainee)',
    domain: 'Engineering & R&D Services',
    rounds: ['Online Test', 'Technical Interview', 'HR Interview'],
    tags: ['ECE', 'CSE'],
    ctc: null,
    highlight: 'Focus on core subject basics (OS, CN, DBMS), projects on resume, and arrays/strings coding questions.',
    accent: '#4f8ef7',
    reports: [
      { name: 'Manisha Angadi (ECE)', file: 'L_T_report_-_2025_batch.pdf' },
      { name: 'Vaishnavi Bhat (CSE)', file: 'L_T_Report_VaishnaviBhat.pdf' },
      { name: 'Shravanthi G U (ECE)', file: 'L_T.pdf' },
      { name: 'Sahana S. Hiremath (ECE)', file: 'LTTS_Report.pdf' },
      { name: 'Sinchana Aradhya B J (ECE)', file: 'LTTS.pdf' },
      { name: 'Samatha S (ECE)', file: 'LTTS-1.pdf' },
    ],
  },
  {
    id: 'applied',
    name: 'Applied Materials',
    short: 'AMAT',
    role: 'IT Solutions Management',
    domain: 'Semiconductor Equipment',
    rounds: ['Online MCQ Test', 'Pre-Placement Talk', 'Technical Interview', 'HR Interview'],
    tags: ['CSE'],
    ctc: null,
    highlight: 'Focus on DBMS, DSA, OOPs, OS and CN. Technical round is more communication-focused than deep coding.',
    accent: '#3ecf8e',
    reports: [
      { name: 'Monisha B G (CSE)', file: 'Applied_Materials_Interview_Report_MonishaBG.pdf' },
    ],
  },
  {
    id: 'dover',
    name: 'Dover India Pvt Ltd',
    short: 'DOVER',
    role: 'Software Engineer',
    domain: 'Industrial Manufacturing',
    rounds: ['Online Test', 'Technical Interview', 'Managerial + HR Interview'],
    tags: ['ISE'],
    ctc: null,
    highlight: 'OOPs, DBMS, code output questions, and project explanation with live execution. Communication is key.',
    accent: '#f59e0b',
    reports: [
      { name: 'Sanjana C R (ISE)', file: 'dover_report.pdf' },
    ],
  },
  {
    id: 'mindsprint',
    name: 'MindSprint',
    short: 'MS',
    role: 'Junior Engineer',
    domain: 'IT Services',
    rounds: ['Online Assessment', 'Technical Interview', 'HR Interview'],
    tags: ['ISE'],
    ctc: '5.2 LPA',
    highlight: 'SDLC, DevOps, CN, Microservices and Java are asked. HirePro platform. Eligibility: 7.5 CGPA, no arrears.',
    accent: '#a78bfa',
    reports: [
      { name: 'Poornima M (ISE)', file: 'MindSprint_Report_Poornima_.pdf' },
    ],
  },
  {
    id: 'hsbc',
    name: 'HSBC Technology India',
    short: 'HSBC',
    role: 'Trainee Software Engineer',
    domain: 'Banking & Financial Services',
    rounds: ['Simulate Assessment', 'Codility Assessment', 'Technical Interview', 'HR Interview'],
    tags: ['CSE', 'ISE'],
    ctc: '15 LPA',
    highlight: 'Codility has 3 coding questions (mapping, frequency, patterns). Tech round includes live coding in chosen language. Eligibility: 7 CGPA, no backlogs.',
    accent: '#22c55e',
    reports: [
      { name: 'Aashitha (CSE)', file: 'Aashitha_HSBC_Report.pdf' },
      { name: 'Poornima M (ISE)', file: 'Poornima_M_HSBC_Technology_India_.pdf' },
    ],
  },
  {
    id: 'tw',
    name: 'Thoughtworks',
    short: 'TW',
    role: 'Software Engineer',
    domain: 'Technology Consulting',
    rounds: ['Online Coding Assessment', 'Code Pairing Round', 'Technical Interview', 'Social Cultural Connectivity'],
    tags: ['ISE'],
    ctc: null,
    highlight: 'Unique code pairing round using GitHub project. Deep OOPs, DBMS, SQL queries and OS knowledge needed. 75-min coding test with 4 questions.',
    accent: '#f97316',
    reports: [
      { name: 'Indushree K N (ISE)', file: 'Thoughtworks.pdf' },
    ],
  },
]

/* ─── TAG BADGE ─────────────────────────────────────────────── */
function Tag({ label, color }) {
  return (
    <span
      className="archive-tag"
      style={{ '--tag-color': color || '#6C5DD3' }}
    >
      {label}
    </span>
  )
}

/* ─── HANDBOOK CARD ──────────────────────────────────────────── */
function HandbookCard({ book }) {
  return (
    <div className={`handbook-card ${!book.available ? 'handbook-card--locked' : ''}`}
      style={{ '--hb-color': book.color }}
    >
      <div className="hb-glow" />
      <div className="hb-top">
        <div className="hb-icon">
          <BookOpen size={22} />
        </div>
        <span className="hb-year">{book.year}</span>
      </div>
      <h3 className="hb-title">{book.title}</h3>
      <p className="hb-subtitle">{book.subtitle}</p>
      <p className="hb-desc">{book.desc}</p>
      {book.pages && <p className="hb-pages">{book.pages} pages</p>}
      {book.available ? (
        <a
          href={handbookUrl(book.file)}
          download={book.file}
          target="_blank"
          rel="noopener noreferrer"
          className="hb-btn hb-btn--available"
          style={{ '--hb-color': book.color }}
        >
          <Download size={15} />
          Download PDF
        </a>
      ) : (
        <div className="hb-btn hb-btn--locked">
          <FileText size={15} />
          Coming Soon
        </div>
      )}
    </div>
  )
}

/* ─── COMPANY CARD ───────────────────────────────────────────── */
function CompanyCard({ company }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="company-card"
      style={{ '--co-accent': company.accent }}
    >
      {/* Header */}
      <div
        className="cc-header"
        role="button"
        tabIndex={0}
        aria-expanded={open}
        aria-label={`${open ? 'Hide' : 'View'} ${company.name} interview details`}
        onClick={() => setOpen(o => !o)}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setOpen(o => !o)
          }
        }}
      >
        <div className="cc-logo" style={{ borderColor: company.accent }}>
          <span>{company.short}</span>
        </div>
        <div className="cc-info">
          <div className="cc-name-row">
            <h3 className="cc-name">{company.name}</h3>
            {company.ctc && (
              <span className="cc-ctc">
                {company.ctc}
              </span>
            )}
          </div>
          <p className="cc-role">{company.role}</p>
          <p className="cc-domain">{company.domain}</p>
        </div>
        <ChevronRight
          size={18}
          className={`cc-chevron ${open ? 'cc-chevron--open' : ''}`}
        />
      </div>

      {/* Tags */}
      <div className="cc-tags">
        {company.tags.map(t => (
          <span key={t} className="cc-branch" style={{ borderColor: company.accent }}>
            {t}
          </span>
        ))}
        <span className="cc-rounds-count">{company.rounds.length} rounds</span>
      </div>

      {/* Expandable section */}
      {open && (
        <div
          className="cc-expanded"
          id={`company-details-${company.id}`}
        >
          {/* Rounds */}
          <div className="cc-section">
            <span className="cc-section-label">Hiring Rounds</span>
            <div className="cc-rounds">
              {company.rounds.map((r, i) => (
                <div key={i} className="cc-round">
                  <span className="cc-round-num">{i + 1}</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div className="cc-section">
            <span className="cc-section-label">What to focus on</span>
            <p className="cc-highlight">{company.highlight}</p>
          </div>

          {/* Reports */}
          <div className="cc-section">
            <span className="cc-section-label">Interview Reports from students</span>
            <div className="cc-reports">
              {company.reports.map((r, i) => (
                <a
                  key={i}
                  href={reportUrl(r.file)}
                  download={r.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cc-report-link"
                  style={{ '--co-accent': company.accent }}
                >
                  <FileText size={13} />
                  <span>{r.name}</span>
                  <Download size={12} className="cc-ext" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── MAIN PAGE ──────────────────────────────────────────────── */
export default function Archive() {
  const [filter, setFilter] = useState('All')
  const branches = ['All', 'CSE', 'ISE', 'ECE']
  const reportCount = companies.reduce((total, company) => total + company.reports.length, 0)

  const filtered = filter === 'All'
    ? companies
    : companies.filter(c => c.tags.includes(filter))

  return (
    <div className="archive-page">

      {/* ── HERO ── */}
      <header className="archive-hero">
        <span className="archive-eyebrow">APTI CLUB / RESOURCE ARCHIVE</span>
        <h1 className="archive-h1">Prepare with<br /><em>confidence.</em></h1>
        <p className="archive-sub">
          Placement handbooks and first-hand interview experiences to help you take the next step in your career.
        </p>
        <div className="archive-highlights" aria-label="Archive contents">
          <span><b>{handbooks.length}</b> handbooks & reports</span>
          <span><b>{companies.length}</b> companies</span>
          <span><b>{reportCount}</b> student experiences</span>
        </div>
      </header>

      {/* ── HANDBOOKS ── */}
      <section className="archive-section">
        <div className="archive-section-header">
          <BookOpen size={20} />
          <div>
            <h2>Handbooks & Reports</h2>
            <p>Placement preparation guides and batch reports — download and share with your batch.</p>
          </div>
        </div>
        <div className="handbooks-grid">
          {handbooks.map(book => (
            <HandbookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      {/* ── COMPANY REPORTS ── */}
      <section className="archive-section">
        <div className="archive-section-header">
          <Briefcase size={20} />
          <div>
            <h2>Company Interview Reports</h2>
            <p>First-hand accounts from students who cleared each stage — read their experience, then download the full PDF.</p>
          </div>
        </div>

        {/* Filter */}
        <div className="company-filter" role="group" aria-label="Filter reports by branch">
          <Filter size={14} />
          {branches.map(b => (
            <button
              key={b}
              className={`filter-btn ${filter === b ? 'filter-btn--active' : ''}`}
              aria-pressed={filter === b}
              onClick={() => setFilter(b)}
            >
              {b}
            </button>
          ))}
        </div>

        <div className="companies-grid">
          {filtered.map(c => (
            <CompanyCard key={c.id} company={c} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="archive-empty">No company reports for this branch yet — check back soon.</p>
        )}
      </section>

    </div>
  )
}