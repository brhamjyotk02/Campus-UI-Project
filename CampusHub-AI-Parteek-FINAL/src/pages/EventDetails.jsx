import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock, MapPin, Users, Check } from "lucide-react";
import { LoadingGrid, ErrorState, EmptyState } from "../components/StatusViews";
import { useCommunity } from "../context/CommunityContext";
import { formatDate, daysUntil, whenLabel } from "../utils/dates";

export default function EventDetails() {
  const { eventId } = useParams(); // dynamic route: /events/:eventId
  const { events, clubs, loading, error, retry, registeredIds, registerEvent, unregisterEvent, seatsLeft } = useCommunity();

  if (loading) return <LoadingGrid count={1} />;
  if (error) return <ErrorState message={error} onRetry={retry} />;

  const event = events.find((e) => e.id === eventId);
  if (!event) {
    return (
      <>
        <EmptyState title="Event not found" text="It may have been removed, or the link is wrong." />
        <Link to="/events" className="back"><ArrowLeft size={15} /> Back to events</Link>
      </>
    );
  }

  const club = clubs.find((c) => c.id === event.clubId);
  const registered = registeredIds.includes(event.id);
  const left = seatsLeft(event);
  const days = daysUntil(event.date);
  const full = left === 0 && !registered;
  const filledPercent = Math.min(100, Math.round(((event.seatsTaken + (registered ? 1 : 0)) / event.capacity) * 100));

  return (
    <>
      <Link to="/events" className="back"><ArrowLeft size={15} /> Back to events</Link>

      <div className="panel">
        <span className="chip-cat" data-cat={event.category}>{event.category}</span>
        <h1 className="panel-title">{event.title}</h1>
        {club && <p className="lead">Hosted by <Link to={`/clubs/${club.id}`}>{club.name}</Link></p>}

        <ul className="meta-list meta-list--big">
          <li><CalendarDays size={17} /> {formatDate(event.date)} <span className="when">{whenLabel(days)}</span></li>
          <li><Clock size={17} /> {event.time}</li>
          <li><MapPin size={17} /> {event.location}</li>
          <li><Users size={17} /> {full ? "Fully booked" : `${left} of ${event.capacity} seats left`}</li>
        </ul>

        <div className="progress" role="img" aria-label={`${filledPercent}% booked`}>
          <div style={{ width: `${filledPercent}%` }} />
        </div>

        <p>{event.description}</p>

        {days < 0 ? (
          <p className="muted">This event has ended.</p>
        ) : registered ? (
          <div className="notice notice--ok">
            <Check size={20} />
            <div>
              <strong>You’re registered</strong>
              <p>Your spot is saved. You can cancel any time.</p>
            </div>
            <button className="btn btn--ghost" onClick={() => unregisterEvent(event.id)}>Cancel registration</button>
          </div>
        ) : full ? (
          <p className="muted">This event is fully booked.</p>
        ) : (
          <button className="btn" onClick={() => registerEvent(event.id)}>Register for this event</button>
        )}
      </div>
    </>
  );
}
