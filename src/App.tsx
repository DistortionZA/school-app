import { useMemo, useState } from 'react'
import { currentUser, demoProjects, syncStatus } from './data'
import type { Audience, Project, ProjectDraft } from './types'

const formatDate = (date: string) => new Intl.DateTimeFormat('en-ZA', { day: 'numeric', month: 'short' }).format(new Date(`${date}T12:00:00`))
const daysUntil = (date: string) => Math.max(0, Math.ceil((new Date(`${date}T12:00:00`).getTime() - new Date('2026-07-31T12:00:00').getTime()) / 86400000))

function Icon({ children }: { children: string }) {
  return <span className="icon" aria-hidden="true">{children}</span>
}

function ProjectRow({ project, onStart, audience }: { project: Project; onStart: (id: string) => void; audience: Audience }) {
  const days = daysUntil(project.dueDate)
  const isStarted = project.startedBy.includes('amina')
  return (
    <article className="project-row">
      <div className="date-block"><strong>{formatDate(project.dueDate).split(' ')[0]}</strong><span>{formatDate(project.dueDate).split(' ')[1]}</span></div>
      <div className="project-copy">
        <div className="project-heading"><h3>{project.title}</h3><span className={`status status-${days <= 7 ? 'soon' : 'ready'}`}>{days} days left</span></div>
        <p className="meta">{project.subject} <span>·</span> {project.grade} {project.className}</p>
        <p>{project.description}</p>
        <div className="materials"><span>Bring:</span> {project.materials.join(' · ')}</div>
        {audience === 'parent' && <button className={`text-button ${isStarted ? 'started' : ''}`} onClick={() => onStart(project.id)}><Icon>{isStarted ? '✓' : '↗'}</Icon>{isStarted ? 'You’ve started this project' : 'Mark as started'}</button>}
      </div>
      <div className="project-actions"><button className="more-button" aria-label={`More options for ${project.title}`}>•••</button></div>
    </article>
  )
}

function NewProject({ onClose, onCreate }: { onClose: () => void; onCreate: (draft: ProjectDraft) => void }) {
  const [draft, setDraft] = useState<ProjectDraft>({ title: '', subject: 'Natural Sciences', grade: 'Grade 5', className: '5A', dueDate: '2026-08-29', description: '', materials: [] })
  const [materials, setMaterials] = useState('')
  const update = (key: keyof ProjectDraft, value: string) => setDraft((current) => ({ ...current, [key]: value }))
  const submit = (event: React.FormEvent) => { event.preventDefault(); onCreate({ ...draft, materials: materials.split(',').map((item) => item.trim()).filter(Boolean) }) }
  return <div className="modal-backdrop" role="presentation"><section className="modal" role="dialog" aria-modal="true" aria-labelledby="new-project-title">
    <div className="modal-header"><div><span className="eyebrow">New classroom update</span><h2 id="new-project-title">Create a project</h2></div><button className="close-button" onClick={onClose} aria-label="Close">×</button></div>
    <form onSubmit={submit}><label>Project name<input required value={draft.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Water filtration model" /></label><div className="form-grid"><label>Subject<select value={draft.subject} onChange={(e) => update('subject', e.target.value)}><option>Natural Sciences</option><option>Mathematics</option><option>Life Skills</option><option>English Home Language</option></select></label><label>Due date<input type="date" required value={draft.dueDate} onChange={(e) => update('dueDate', e.target.value)} /></label></div><label>What should learners do?<textarea required value={draft.description} onChange={(e) => update('description', e.target.value)} placeholder="Give families enough detail to get started..." /></label><label>Materials <span className="label-hint">Separate with commas</span><input value={materials} onChange={(e) => setMaterials(e.target.value)} placeholder="Cardboard, glue, coloured paper" /></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button">Publish project <span>→</span></button></div></form>
  </section></div>
}

export function App() {
  const [audience, setAudience] = useState<Audience>('teacher')
  const [projects, setProjects] = useState(demoProjects)
  const [showNewProject, setShowNewProject] = useState(false)
  const [filter, setFilter] = useState('All projects')
  const [toast, setToast] = useState('')
  const visibleProjects = useMemo(() => projects.filter((project) => filter === 'All projects' || project.subject === filter), [projects, filter])
  const createProject = (draft: ProjectDraft) => { setProjects((current) => [{ ...draft, id: `project-${Date.now()}`, status: 'published', createdAt: '2026-07-31', startedBy: [] }, ...current]); setShowNewProject(false); setToast('Project published — families will be notified today.') }
  const startProject = (id: string) => { setProjects((current) => current.map((project) => project.id === id ? { ...project, startedBy: project.startedBy.includes('amina') ? project.startedBy.filter((name) => name !== 'amina') : [...project.startedBy, 'amina'] } : project)) }
  return <div className="app-shell">
    <aside className="sidebar"><div className="brand"><span className="brand-mark">✳</span><span>NoPanic<small>projects</small></span></div><div className="school-switcher"><span className="school-avatar">FS</span><span><strong>Ficksburg Primary</strong><small>2026 · Term 3</small></span><span className="chevron">⌄</span></div><nav><span className="nav-label">Workspace</span><button className="nav-item active"><Icon>▦</Icon>Projects <span className="nav-count">3</span></button><button className="nav-item"><Icon>♧</Icon>My classes</button><button className="nav-item"><Icon>♧</Icon>Families</button><span className="nav-label second">School tools</span><button className="nav-item"><Icon>◒</Icon>SA-SAMS sync <span className="connected-dot" /></button><button className="nav-item"><Icon>⚙</Icon>Settings</button></nav><div className="sidebar-footer"><div className="sync-mini"><span className="connected-dot" /><span><strong>SA-SAMS connected</strong><small>Last sync {syncStatus.lastSyncedAt}</small></span></div><div className="profile"><span className="profile-avatar">{currentUser.initials}</span><span><strong>{currentUser.name}</strong><small>{currentUser.role}</small></span><span className="chevron">⌄</span></div></div></aside>
    <main className="main-content"><header className="topbar"><div className="mobile-brand"><span className="brand-mark">✳</span>NoPanic</div><div className="view-switcher"><button className={audience === 'teacher' ? 'selected' : ''} onClick={() => setAudience('teacher')}>Teacher view</button><button className={audience === 'parent' ? 'selected' : ''} onClick={() => setAudience('parent')}>Parent preview</button></div><button className="help-button" aria-label="Help">?</button></header>
      <div className="content-wrap"><div className="page-intro"><div><span className="eyebrow">Tuesday, 31 July 2026</span><h1>{audience === 'teacher' ? 'Keep families a step ahead.' : 'A calm week starts here.'}</h1><p>{audience === 'teacher' ? 'Give parents the runway they need for what’s coming up.' : 'Everything Amina needs for the weeks ahead, in one place.'}</p></div>{audience === 'teacher' && <button className="primary-button create-button" onClick={() => setShowNewProject(true)}><span className="plus">+</span> New project</button>}</div>
        {audience === 'teacher' ? <div className="insight-strip"><div className="insight-icon">⌁</div><div><strong>Nice work, Ms. Mokoena.</strong><span>All 24 families in 5A have seen your latest project.</span></div><button onClick={() => setToast('Engagement report coming soon.')}>View engagement <span>→</span></button></div> : <div className="parent-welcome"><span className="parent-spark">✳</span><div><strong>Hi, Amina’s family</strong><span>Here’s what to put on the kitchen calendar.</span></div><span className="family-avatar">AF</span></div>}
        <section className="projects-section"><div className="section-toolbar"><div><h2>{audience === 'teacher' ? 'Upcoming projects' : 'Amina’s upcoming projects'}</h2><span className="section-count">{visibleProjects.length} projects · {audience === 'teacher' ? 'Grade 5 · Class 5A' : 'Grade 5'}</span></div><div className="toolbar-controls"><select value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter projects"><option>All projects</option><option>Natural Sciences</option><option>Life Skills</option><option>Mathematics</option></select><button className="view-button" aria-label="List view">☷</button></div></div><div className="project-list">{visibleProjects.map((project) => <ProjectRow key={project.id} project={project} onStart={startProject} audience={audience} />)}</div></section>
        <div className="bottom-note"><span className="note-icon">↗</span><span><strong>{audience === 'teacher' ? 'Small steps, no last-minute scrambles.' : 'Need a hand getting started?'}</strong><br />{audience === 'teacher' ? 'Projects are sent to families on WhatsApp when you publish them, then gently resurfaced as the due date gets closer.' : 'Ask your teacher a question directly through the school office.'}</span></div>
      </div>
    </main>{showNewProject && <NewProject onClose={() => setShowNewProject(false)} onCreate={createProject} />}{toast && <button className="toast" onClick={() => setToast('')}>✓ {toast}</button>}
  </div>
}
