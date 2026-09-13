import { useMemo, useState } from "react";
import AssignmentCard from "../components/AssignmentCard";
import { getAssignments } from "../services/assignmentService";
import useLocalStorage from "../hooks/useLocalStorage";

function Assignments() {
  const [assignments, setAssignments] = useLocalStorage("parteekAssignments", getAssignments());
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("deadline");

  const subjects = ["All", ...new Set(assignments.map((a) => a.subject))];

  const submitAssignment = (id) => {
    setAssignments((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, status: "Submitted", submittedOn: new Date().toISOString() }
          : item
      )
    );
  };

  const filtered = useMemo(() => {
    return [...assignments]
      .filter((item) => {
        const text = `${item.title} ${item.subject} ${item.description}`.toLowerCase();
        return text.includes(search.toLowerCase()) &&
          (subject === "All" || item.subject === subject) &&
          (status === "All" || item.status === status);
      })
      .sort((a, b) => sort === "deadline"
        ? new Date(a.dueDate) - new Date(b.dueDate)
        : a.title.localeCompare(b.title)
      );
  }, [assignments, search, subject, status, sort]);

  const total = assignments.length;
  const submitted = assignments.filter((a) => a.status === "Submitted").length;
  const pending = total - submitted;
  const overdue = assignments.filter((a) => a.status !== "Submitted" && new Date(a.dueDate) < new Date()).length;

  return (
    <main className="page">
      <section className="hero-panel">
        <div>
          <div className="section-label">MY ACADEMIC WORKSPACE</div>
          <h1>Assignment Manager <span>📚</span></h1>
          <p>Track deadlines, manage submissions and keep every subject under control.</p>
        </div>
        <div className="hero-mini">Semester Progress<br /><strong>{Math.round((submitted / total) * 100)}%</strong></div>
      </section>

      <div className="stats-grid">
        <div className="stat-card"><span>📋</span><div><small>Total</small><strong>{total}</strong></div></div>
        <div className="stat-card"><span>⏳</span><div><small>Pending</small><strong>{pending}</strong></div></div>
        <div className="stat-card"><span>✓</span><div><small>Submitted</small><strong>{submitted}</strong></div></div>
        <div className="stat-card"><span>⚠</span><div><small>Overdue</small><strong>{overdue}</strong></div></div>
      </div>

      <section className="toolbar-card">
        <div className="search-box">🔍
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assignment, subject or topic..." />
        </div>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          {subjects.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>Submitted</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="deadline">Sort: Deadline</option>
          <option value="name">Sort: Name</option>
        </select>
      </section>

      <div className="section-heading">
        <div>
          <div className="section-label">YOUR WORK</div>
          <h2>Assignments</h2>
        </div>
        <span className="result-count">{filtered.length} shown</span>
      </div>

      <div className="assignment-list">
        {filtered.map((assignment) => (
          <AssignmentCard key={assignment.id} assignment={assignment} onSubmit={submitAssignment} />
        ))}
      </div>

      {filtered.length === 0 && <div className="empty-state">No assignments match your filters.</div>}
    </main>
  );
}

export default Assignments;