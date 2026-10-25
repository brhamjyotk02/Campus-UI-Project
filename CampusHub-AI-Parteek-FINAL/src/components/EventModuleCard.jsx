import { Link } from "react-router-dom";
import { MapPin, Clock, Users, CheckCircle2 } from "lucide-react";
import { monthShort, dayNumber, daysUntil, whenLabel } from "../utils/dates";

// Props:
//   event        { id, title, club, category, date, time, location, capacity }
//   registered   boolean
//   seatsLeft    number
//   onUnregister (eventId) => void
export default function EventCard({ event, registered, seatsLeft, onUnregister }) {
  const full = seatsLeft === 0 && !registered;
  const days = daysUntil(event.date);

  return (
    <article className="ev-card">
      <div className="ev-card-top">
        <div className="ev-date-badge" aria-label={event.date}>
          <span>{monthShort(event.date)}</span>
          <strong>{dayNumber(event.date)}</strong>
        </div>
        <div className="ev-card-heading">
          <span className={`ev-cat ev-cat--${event.category.toLowerCase()}`}>{event.category}</span>
          <h3>
            <Link to={`/events/${event.id}`}>{event.title}</Link>
          </h3>
          <p className="ev-club">{event.club}</p>
        </div>
      </div>

      <ul className="ev-meta-list">
        <li><Clock size={14} /> {event.time}</li>
        <li><MapPin size={14} /> {event.location}</li>
        <li>
          <Users size={14} />
          {full ? "Fully booked" : `${seatsLeft} seats left`}
          <span className="ev-when">{whenLabel(days)}</span>
        </li>
      </ul>

      <div className="ev-card-actions">
        {registered ? (
          <>
            <span className="ev-registered-badge"><CheckCircle2 size={14} /> Registered</span>
            <button className="ev-btn ev-btn--ghost" onClick={() => onUnregister(event.id)}>
              Unregister
            </button>
          </>
        ) : full ? (
          <button className="ev-btn" disabled>Full</button>
        ) : (
          <Link to={`/events/${event.id}`} className="ev-btn">Register</Link>
        )}
        <Link to={`/events/${event.id}`} className="ev-btn ev-btn--ghost">Details</Link>
      </div>
    </article>
  );
}
