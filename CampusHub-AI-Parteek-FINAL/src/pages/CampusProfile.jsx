import { Award, Lock } from "lucide-react";
import { LoadingGrid, ErrorState } from "../components/StatusViews";
import { useCommunity } from "../context/CommunityContext";
import { useAuth } from "../context/AuthContext";

function initials(name) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}

export default function Profile() {
  const { profile, stats, loading, error, retry } = useCommunity();
  const { user } = useAuth();

  if (loading) return <LoadingGrid count={1} />;
  if (error || !profile) return <ErrorState message={error || "Profile data isn’t available."} onRetry={retry} />;

  const name = user ? user.name : profile.name;
  const percent = Math.round((stats.intoLevel / stats.perLevel) * 100);

  return (
    <>
      <div className="page-head">
        <h1>Profile</h1>
      </div>

      <div className="panel">
        <div className="profile-head">
          <span className="avatar">{initials(name)}</span>
          <div>
            <h2 className="panel-title">{name}</h2>
            <p className="muted">{profile.department} · {profile.semester}</p>
          </div>
        </div>

        <div className="xp">
          <div className="xp-row">
            <strong>Level {stats.level}</strong>
            <span className="muted">{stats.xp} XP · {stats.perLevel - stats.intoLevel} to next level</span>
          </div>
          <div className="progress" role="img" aria-label={`${percent}% to next level`}>
            <div style={{ width: `${percent}%` }} />
          </div>
        </div>

        <h2 className="section-title">Skills</h2>
        <div className="tag-row">
          {profile.skills.map((s) => <span key={s} className="tag">{s}</span>)}
        </div>

        <h2 className="section-title">Projects</h2>
        <ul className="plain-list">
          {profile.projects.map((p) => (
            <li key={p.name}><strong>{p.name}</strong> <span className="muted">{p.description}</span></li>
          ))}
        </ul>

        <h2 className="section-title">Certificates</h2>
        <ul className="plain-list">
          {profile.certificates.map((c) => <li key={c}>{c}</li>)}
        </ul>

        <h2 className="section-title">Achievements</h2>
        <div className="achievements">
          {stats.achievements.map((a) => (
            <div key={a.id} className={`achievement${a.earned ? " achievement--on" : ""}`}>
              {a.earned ? <Award size={20} /> : <Lock size={18} />}
              <div>
                <strong>{a.label}</strong>
                <span>{a.earned ? "Earned" : a.hint}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
