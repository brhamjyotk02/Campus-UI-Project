import { COMPLAINT_STATUSES } from "../data/complaintData";
import { MapPin } from "lucide-react";

// Props:
//   complaint        { id, category, location, description, status, createdAt }
//   onStatusChange   (complaintId, newStatus) => void   (demo only)
export default function ComplaintCard({ complaint, onStatusChange }) {
  const statusKey = complaint.status.toLowerCase().replace(" ", "-");

  return (
    <article className="card">
      <div className="complaint-top">
        <h3>Complaint #{complaint.id}</h3>
        <span className={`status status--${statusKey}`}>{complaint.status}</span>
      </div>
      <span className="chip-cat" data-cat="Complaint">{complaint.category}</span>
      <p className="meta"><MapPin size={15} /> {complaint.location} · filed {complaint.createdAt}</p>
      <p className="muted">{complaint.description}</p>

      <div className="field field--inline">
        <label htmlFor={`status-${complaint.id}`}>Update status (demo)</label>
        <select
          id={`status-${complaint.id}`}
          value={complaint.status}
          onChange={(e) => onStatusChange(complaint.id, e.target.value)}
        >
          {COMPLAINT_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </article>
  );
}
