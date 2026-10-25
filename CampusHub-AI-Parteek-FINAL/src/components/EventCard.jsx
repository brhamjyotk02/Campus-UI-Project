import { Link } from "react-router-dom";
import { Clock, MapPin, Users, Check } from "lucide-react";
import { monthShort, dayNumber, daysUntil, whenLabel } from "../utils/dates";

// Props:
//   event       { id, title, category, date, time, location }
//   clubName    string
//   registered  boolean
//   seatsLeft   number
//   onRegister / onUnregister   (eventId) => void
export default function EventCard({ event, clubName, registered, seatsLeft, onRegister, onUnregister }) {
  const full = seatsLeft === 0 && !registered;

  return (
    <article className="card">
      <div className="event-top">
        <div className="date-badge" aria-hidden="true">
          <span>{monthShort(event.date)}</span>
          <strong>{dayNumber(event.date)}</strong>
        </div>
        <div>
          <span className="chip-cat" data-cat={event.category}>{event.category}</span>
          <h3><Link to={`/events/${event.id}`}>{event.title}</Link></h3>
          {clubName && <p className="muted small">{clubName}</p>}
        </div>
      </div>

      <ul className="meta-list">
        <li><Clock size={15} /> {event.time}</li>
        <li><MapPin size={15} /> {event.location}</li>
        <li>
          <Users size={15} /> {full ? "Fully booked" : `${seatsLeft} seats left`}
          <span className="when">{whenLabel(daysUntil(event.date))}</span>
        </li>
      </ul>

      <div className="card-actions">
        {registered ? (
          <>
            <span className="badge badge--ok"><Check size={14} /> Registered</span>
            <button className="btn btn--ghost" onClick={() => onUnregister(event.id)}>Cancel</button>
          </>
        ) : (
          <button className="btn" disabled={full} onClick={() => onRegister(event.id)}>
            {full ? "Full" : "Register"}
          </button>
        )}
        <Link to={`/events/${event.id}`} className="btn btn--ghost">Details</Link>
      </div>
    </article>
  );
}
