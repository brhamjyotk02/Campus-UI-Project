import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, CalendarClock, Check, Clock } from "lucide-react";
import { LoadingGrid, ErrorState, EmptyState } from "../components/StatusViews";
import { useCommunity } from "../context/CommunityContext";
import { useAuth } from "../context/AuthContext";
import { formatDate, whenLabel, daysUntil } from "../utils/dates";

export default function ClubDetails() {
  const { clubId } = useParams(); // dynamic route: /clubs/:clubId
  const { clubs, events, loading, error, retry, joinedClubIds, joinClub, leaveClub, registeredIds } = useCommunity();
  const { user } = useAuth();

  if (loading) return <LoadingGrid count={1} />;
  if (error) return <ErrorState message={error} onRetry={retry} />;

  const club = clubs.find((c) => c.id === clubId);
  if (!club) {
    return (
      <>
        <EmptyState title="Club not found" text="The link may be old, or the club was removed." />
        <Link to="/clubs" className="back"><ArrowLeft size={15} /> Back to clubs</Link>
      </>
    );
  }

  const joined = joinedClubIds.includes(club.id);
  const clubEvents = events.filter((e) => e.clubId === club.id && daysUntil(e.date) >= 0);
  const members = joined ? [...club.members, { name: `${user ? user.name : "You"} (you)`, role: "Member" }] : club.members;

  return (
    <>
      <Link to="/clubs" className="back"><ArrowLeft size={15} /> Back to clubs</Link>

      <div className="panel">
        <span className="chip-cat" data-cat={club.category}>{club.category}</span>
        <h1 className="panel-title">{club.name}</h1>
        <p className="lead">{club.tagline}</p>
        <p>{club.description}</p>
        <ul className="meta-list">
          <li><Users size={16} /> {club.memberCount + (joined ? 1 : 0)} members</li>
          <li><Clock size={16} /> {club.meets}</li>
        </ul>

        <div className="card-actions">
          {joined ? (
            <>
              <span className="badge badge--ok"><Check size={14} /> You’re a member</span>
              <button className="btn btn--ghost" onClick={() => leaveClub(club.id)}>Leave club</button>
            </>
          ) : (
            <button className="btn" onClick={() => joinClub(club.id)}>Join {club.name}</button>
          )}
        </div>

        <h2 className="section-title">Members</h2>
        <ul className="people">
          {members.map((m) => (
            <li key={m.name}>
              <span className="avatar avatar--sm">{m.name[0]}</span>
              <span>{m.name}</span>
              <span className="muted small">{m.role}</span>
            </li>
          ))}
        </ul>

        <h2 className="section-title">Club events</h2>
        {clubEvents.length === 0 ? (
          <p className="muted">No upcoming events from this club right now.</p>
        ) : (
          <ul className="event-list">
            {clubEvents.map((e) => (
              <li key={e.id}>
                <CalendarClock size={17} />
                <Link to={`/events/${e.id}`}>{e.title}</Link>
                <span className="muted small">{formatDate(e.date)} · {whenLabel(daysUntil(e.date))}</span>
                {registeredIds.includes(e.id) && <span className="badge badge--ok"><Check size={13} /> Registered</span>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
