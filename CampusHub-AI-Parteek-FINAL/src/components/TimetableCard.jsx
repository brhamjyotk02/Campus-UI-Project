import { Link } from "react-router-dom";

export default function TimetableCard({ subject, teacher, room, time, type, showDetails = true }) {
  const id = subject.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="timetable-card">
      <div className="time-section">
        <strong>{time}</strong>
        <span>{type}</span>
      </div>
      <div className="class-info">
        <h3>{subject}</h3>
        <p>{teacher}</p>
        <p>📍 {room}</p>
      </div>
      {showDetails && <Link to={`/timetable/${id}`} className="details-button">View</Link>}
    </div>
  );
}
