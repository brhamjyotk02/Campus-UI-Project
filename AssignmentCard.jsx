import { Link } from "react-router-dom";

function AssignmentCard({ assignment, onSubmit }) {
  const today = new Date();
  const due = new Date(`${assignment.dueDate}T23:59:59`);
  const daysLeft = Math.ceil((due - today) / 86400000);
  const overdue = daysLeft < 0 && assignment.status !== "Submitted";

  return (
    <article className={`assignment-card ${overdue ? "overdue-card" : ""}`}>
      <div className="card-top">
        <div>
          <span className="subject-badge">{assignment.subject}</span>
          <h3>{assignment.title}</h3>
        </div>
        <span className={`status ${assignment.status.toLowerCase()}`}>
          {assignment.status === "Submitted" ? "✓ Submitted" : overdue ? "⚠ Overdue" : "Pending"}
        </span>
      </div>

      <p className="description">{assignment.description}</p>

      <div className="assignment-meta">
        <span>📅 Due {new Date(assignment.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}</span>
        <span>🎯 {assignment.priority} priority</span>
        <span>🏆 {assignment.marks} marks</span>
      </div>

      <div className="card-bottom">
        <span className={daysLeft <= 2 && assignment.status !== "Submitted" ? "deadline danger-text" : "deadline"}>
          {assignment.status === "Submitted"
            ? "Submission complete"
            : overdue
              ? `${Math.abs(daysLeft)} day(s) overdue`
              : daysLeft === 0
                ? "Due today"
                : `${daysLeft} day(s) left`}
        </span>

        <div className="card-actions">
          <Link className="secondary-btn" to={`/assignments/${assignment.id}`}>View Details</Link>
          {assignment.status !== "Submitted" && (
            <button className="primary-btn small-btn" onClick={() => onSubmit(assignment.id)}>
              ✓ Mark Submitted
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default AssignmentCard;