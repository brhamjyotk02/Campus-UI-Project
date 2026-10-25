import { useEffect, useMemo, useState } from 'react';
import AssignmentForm from '../components/AssignmentForm';
import NotificationBell from '../components/NotificationBell';
import useLocalStorage from '../hooks/useLocalStorage';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import '../styles/assignments.css';

const today = () => new Date().toISOString().slice(0, 10);
const starterAssignments = [
  { id: 'sample-1', title: 'Java Collections Practice', subject: 'Java', dueDate: today(), description: 'Complete the HashMap and TreeSet practice questions.', status: 'Pending', createdAt: new Date().toISOString() },
  { id: 'sample-2', title: 'React Hooks Worksheet', subject: 'React', dueDate: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10), description: 'Practice useState, useEffect and useReducer.', status: 'Pending', createdAt: new Date().toISOString() },
  { id: 'sample-3', title: 'SQL Queries', subject: 'DBMS', dueDate: new Date(Date.now() - 86400000).toISOString().slice(0, 10), description: 'Finish the aggregate queries worksheet.', status: 'Submitted', createdAt: new Date().toISOString() },
];

function makeNotification(title, message, assignmentId, type = 'assignment') {
  return { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title, message, assignmentId, type, read: false, createdAt: new Date().toISOString() };
}

function getDueLabel(dueDate, status) {
  if (status === 'Submitted') return { text: 'Submitted', className: 'submitted' };
  const days = Math.ceil((new Date(`${dueDate}T23:59:59`).getTime() - new Date().getTime()) / 86400000);
  if (days < 0) return { text: `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} overdue`, className: 'overdue' };
  if (days === 0) return { text: 'Due today', className: 'due-today' };
  if (days === 1) return { text: 'Due tomorrow', className: 'due-soon' };
  return { text: `${days} days left`, className: 'normal' };
}

export default function Assignments() {
  const { user } = useAuth();
  const isTeacher = String(user?.role || '').toLowerCase() === 'teacher';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assignments, setAssignments] = useLocalStorage('campushub_assignments', starterAssignments);
  const [notifications, setNotifications] = useLocalStorage('campushub_assignment_notifications', []);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('dueDate');
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState('');

  function showToast(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  }

  // Add one notification per assignment for approaching or missed deadlines.
  useEffect(() => {
    const now = new Date();
    const dueNotifications = [];
    assignments.forEach(item => {
      if (item.status === 'Submitted' || !item.dueDate) return;
      const due = new Date(`${item.dueDate}T23:59:59`);
      const days = Math.ceil((due.getTime() - now.getTime()) / 86400000);
      const kind = days < 0 ? 'overdue' : days <= 1 ? 'deadline' : '';
      if (!kind) return;
      dueNotifications.push(makeNotification(kind === 'overdue' ? 'Assignment overdue' : 'Deadline approaching', `${item.title} ${kind === 'overdue' ? 'is past its due date.' : days === 0 ? 'is due today.' : 'is due tomorrow.'}`, item.id, kind));
    });
    if (dueNotifications.length) setNotifications(current => {
      const fresh = dueNotifications.filter(next => !current.some(existing => existing.assignmentId === next.assignmentId && existing.type === next.type && new Date(existing.createdAt).toDateString() === now.toDateString()));
      return fresh.length ? [...fresh, ...current].slice(0, 100) : current;
    });
    // Check once when assignments or stored notifications change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignments]);

  const filteredAssignments = useMemo(() => {
    const text = query.trim().toLowerCase();
    return assignments.filter(item => {
      const matchesText = `${item.title} ${item.subject} ${item.description || ''}`.toLowerCase().includes(text);
      return matchesText && (filter === 'All' || item.status === filter);
    }).sort((a, b) => sort === 'title' ? a.title.localeCompare(b.title) : a.dueDate.localeCompare(b.dueDate));
  }, [assignments, query, filter, sort]);

  function saveAssignment(values) {
    if (editing) {
      setAssignments(current => current.map(item => item.id === editing.id ? { ...item, ...values, updatedAt: new Date().toISOString() } : item));
      showToast('Assignment updated');
    } else {
      const item = { ...values, id: `assignment-${Date.now()}`, status: 'Pending', createdAt: new Date().toISOString() };
      setAssignments(current => [item, ...current]);
      setNotifications(current => [makeNotification('New assignment added', `${item.title} has been added to your assignments.`, item.id), ...current].slice(0, 100));
      showToast('Assignment added successfully');
    }
    setEditing(null);
    setShowForm(false);
  }

  function markSubmitted(item) {
    if (item.status === 'Submitted') return;
    setAssignments(current => current.map(a => a.id === item.id ? { ...a, status: 'Submitted', submittedAt: new Date().toISOString() } : a));
    setNotifications(current => [makeNotification('Assignment submitted', `${item.title} marked as submitted.`, item.id, 'submitted'), ...current].slice(0, 100));
    showToast('Marked as submitted');
  }

  function deleteAssignment(item) {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    setAssignments(current => current.filter(a => a.id !== item.id));
    showToast('Assignment deleted');
  }

  const pendingCount = assignments.filter(a => a.status === 'Pending').length;
  const submittedCount = assignments.filter(a => a.status === 'Submitted').length;
  const overdueCount = assignments.filter(a => a.status === 'Pending' && a.dueDate < today()).length;

  return (
    <div className="dashboard-layout"><Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} /><main className="dashboard-main"><header className="dashboard-topbar"><div className="dashboard-title"><h1>{isTeacher ? 'Assignment Management' : 'Assignment Manager'}</h1><p>{isTeacher ? 'Create and manage assignments for students.' : 'Track your work, submissions and deadlines.'}</p></div><button className="mobile-menu-button" onClick={() => setSidebarOpen(true)}>☰</button></header><main className="as-page">
      <div className="as-topbar"><div className="as-brand"><span className="as-brand-mark">C</span><span>Campus<span className="as-brand-accent">Hub</span><small>{isTeacher ? 'FACULTY SPACE' : 'STUDENT SPACE'}</small></span></div><div className="as-topbar-right"><span className="as-topbar-caption">Study & Assignments</span><NotificationBell notifications={notifications} onMarkRead={id => setNotifications(current => current.map(n => n.id === id ? { ...n, read: true } : n))} onMarkAllRead={() => setNotifications(current => current.map(n => ({ ...n, read: true })))} /></div></div>
      <div className="as-content">
        <section className="as-welcome"><div><p className="as-eyebrow">YOUR ACADEMIC WORKSPACE</p><h1>Assignments <span>made simpler.</span></h1><p className="as-subtitle">Keep your tasks organised, stay ahead of deadlines, and track your progress.</p></div>{isTeacher && <button className="as-button as-button-primary as-add-main" onClick={() => { setEditing(null); setShowForm(true); }}>＋ New assignment</button>}</section>
        <section className="as-stats" aria-label="Assignment summary">
          <div className="as-stat-card"><span className="as-stat-icon purple">▤</span><span className="as-stat-label">Total assignments</span><strong>{assignments.length}</strong><small>Across all subjects</small></div>
          <div className="as-stat-card"><span className="as-stat-icon orange">◷</span><span className="as-stat-label">Pending</span><strong>{pendingCount}</strong><small>Still to complete</small></div>
          <div className="as-stat-card"><span className="as-stat-icon green">✓</span><span className="as-stat-label">Submitted</span><strong>{submittedCount}</strong><small>Work completed</small></div>
          <div className="as-stat-card"><span className="as-stat-icon red">!</span><span className="as-stat-label">Overdue</span><strong>{overdueCount}</strong><small>Needs your attention</small></div>
        </section>
        {showForm && isTeacher && <section className="as-form-section"><AssignmentForm assignment={editing} onSave={saveAssignment} onCancel={() => { setShowForm(false); setEditing(null); }} /></section>}
        <section className="as-assignment-section"><div className="as-section-title"><div><p className="as-eyebrow">STAY ON TRACK</p><h2>Your assignments</h2></div><span className="as-results-count">{filteredAssignments.length} {filteredAssignments.length === 1 ? 'item' : 'items'}</span></div>
          <div className="as-toolbar"><label className="as-search"><span aria-hidden="true">⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search assignments or subjects..." aria-label="Search assignments" /></label><div className="as-toolbar-filters"><div className="as-filter-tabs">{['All', 'Pending', 'Submitted'].map(value => <button type="button" key={value} className={filter === value ? 'active' : ''} onClick={() => setFilter(value)}>{value}</button>)}</div><select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort assignments"><option value="dueDate">Sort: Due date</option><option value="title">Sort: Title</option></select></div></div>
          {filteredAssignments.length === 0 ? <div className="as-empty"><span>✦</span><h3>No assignments found</h3><p>{query || filter !== 'All' ? 'Try changing your search or filter.' : 'Add your first assignment to get started.'}</p>{isTeacher && !query && filter === 'All' && <button className="as-button as-button-primary" onClick={() => setShowForm(true)}>＋ Add assignment</button>}</div> : <div className="as-assignment-list">{filteredAssignments.map(item => { const due = getDueLabel(item.dueDate, item.status); return <article className="as-assignment-card" key={item.id}><div className="as-card-symbol">{item.status === 'Submitted' ? '✓' : '▤'}</div><div className="as-card-main"><div className="as-card-heading"><h3>{item.title}</h3><span className={`as-status ${item.status.toLowerCase()}`}>{item.status}</span></div><p className="as-card-subject">{item.subject}</p>{item.description && <p className="as-card-description">{item.description}</p>}<div className="as-card-meta"><span>▦ {new Date(`${item.dueDate}T12:00:00`).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span><span className={`as-due-label ${due.className}`}>{due.text}</span></div></div><div className="as-card-actions">{!isTeacher && item.status === 'Pending' && <button className="as-button as-button-primary as-small-button" onClick={() => markSubmitted(item)}>Mark submitted</button>}{isTeacher && <><button className="as-button as-button-light as-small-button" onClick={() => { setEditing(item); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Edit</button><button className="as-delete-button" aria-label={`Delete ${item.title}`} title="Delete assignment" onClick={() => deleteAssignment(item)}>×</button></>}</div></article>; })}</div>}
        </section>
        <footer className="as-footer">CampusHub <span>·</span> One step closer to done.</footer>
      </div>
      {toast && <div className="as-toast" role="status"><span>✓</span>{toast}</div>}
      </main></main></div>
  );
}
