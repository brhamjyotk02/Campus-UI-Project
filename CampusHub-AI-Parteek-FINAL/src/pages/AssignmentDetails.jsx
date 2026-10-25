import { Link, useParams } from "react-router-dom";
import { getAssignmentById } from "../services/assignmentService";
import useLocalStorage from "../hooks/useLocalStorage";

function AssignmentDetails() {
  const { assignmentId } = useParams();
  const original = getAssignmentById(assignmentId);
  const [assignments, setAssignments] = useLocalStorage("parteekAssignments", []);
  const assignment = assignments.find((a) => a.id === Number(assignmentId)) || original;

  if (!assignment) {
    return <main className="page"><div className="empty-state"><h2>Assignment not found</h2><Link to="/assignments">← Back</Link></div></main>;
  }

  const submit = () => {
    setAssignments((items) => items.length
      ? items.map((item) => item.id === assignment.id ? { ...item, status: "Submitted" } : item)
      : [ { ...assignment, status: "Submitted" } ]
    );
  };

  return (
    <main className="page detail-page">
      <Link className="back-link" to="/assignments">← Back to Assignments</Link>

      <article className="detail-card">
        <div className="detail-top">
          <div>
            <span className="subject-badge">{assignment.subject}</span>
            <h1>{assignment.title}</h1>
            <p className="muted">{assignment.description}</p>
          </div>
          <span className={`status ${assignment.status.toLowerCase()}`}>{assignment.status === "Submitted" ? "✓ Submitted" : "Pending"}</span>
        </div>

        <div className="detail-meta">
          <div><small>DEADLINE</small><strong>📅 {new Date(assignment.dueDate).toLocaleDateString("en-IN")}</strong></div>
          <div><small>PRIORITY</small><strong>🎯 {assignment.priority}</strong></div>
          <div><small>MARKS</small><strong>🏆 {assignment.marks}</strong></div>
        </div>

        <hr />

        <h2>Assignment Instructions</h2>
        <ul className="instruction-list">
          {assignment.instructions.map((item, index) => <li key={index}><span>✓</span>{item}</li>)}
        </ul>

        <div className="related-box">
          <strong>📖 Need help?</strong>
          <p>Open related study notes before starting this assignment.</p>
          <Link className="secondary-btn" to="/notes">Browse Notes →</Link>
        </div>

        {assignment.status !== "Submitted" ? (
          <button className="primary-btn submit-large" onClick={submit}>✓ Mark Assignment as Submitted</button>
        ) : (
          <div className="success-box">✓ This assignment has been marked as submitted.</div>
        )}
      </article>
    </main>
  );
}

export default AssignmentDetails;