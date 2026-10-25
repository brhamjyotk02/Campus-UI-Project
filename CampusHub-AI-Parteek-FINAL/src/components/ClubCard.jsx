import { Link } from "react-router-dom";
import { Users, Check } from "lucide-react";

// Props:
//   club     { id, name, category, tagline, memberCount }
//   joined   boolean
//   onJoin / onLeave   (clubId) => void
export default function ClubCard({ club, joined, onJoin, onLeave }) {
  return (
    <article className="card">
      <span className="chip-cat" data-cat={club.category}>{club.category}</span>
      <h3><Link to={`/clubs/${club.id}`}>{club.name}</Link></h3>
      <p className="muted">{club.tagline}</p>
      <p className="meta"><Users size={15} /> {club.memberCount + (joined ? 1 : 0)} members</p>

      <div className="card-actions">
        {joined ? (
          <>
            <span className="badge badge--ok"><Check size={14} /> Joined</span>
            <button className="btn btn--ghost" onClick={() => onLeave(club.id)}>Leave</button>
          </>
        ) : (
          <button className="btn" onClick={() => onJoin(club.id)}>Join club</button>
        )}
        <Link to={`/clubs/${club.id}`} className="btn btn--ghost">Details</Link>
      </div>
    </article>
  );
}
