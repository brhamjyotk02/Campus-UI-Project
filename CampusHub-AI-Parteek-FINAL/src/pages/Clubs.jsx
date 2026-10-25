import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import ClubCard from "../components/ClubCard";
import { LoadingGrid, ErrorState, EmptyState } from "../components/StatusViews";
import { useCommunity } from "../context/CommunityContext";

export default function Clubs() {
  const { clubs, loading, error, retry, joinedClubIds, joinClub, leaveClub } = useCommunity();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => ["All", ...new Set(clubs.map((c) => c.category))], [clubs]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return clubs.filter((c) => {
      const matchesTerm = !term || c.name.toLowerCase().includes(term) || c.tagline.toLowerCase().includes(term);
      const matchesCategory = category === "All" || c.category === category;
      return matchesTerm && matchesCategory;
    });
  }, [clubs, search, category]);

  function clearFilters() {
    setSearch("");
    setCategory("All");
  }

  return (
    <>
      <div className="page-head">
        <h1>Clubs</h1>
        <p>Find your people. You’ve joined {joinedClubIds.length} so far.</p>
      </div>

      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input
            type="search"
            placeholder="Search clubs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search clubs"
          />
        </div>
      </div>

      <div className="chips" role="group" aria-label="Filter by category">
        {categories.map((c) => (
          <button
            key={c}
            className={`chip${category === c ? " chip--on" : ""}`}
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingGrid />
      ) : error ? (
        <ErrorState message={error} onRetry={retry} />
      ) : visible.length === 0 ? (
        <EmptyState title="No clubs found" text="Try a different word or category." actionLabel="Clear filters" onAction={clearFilters} />
      ) : (
        <div className="grid">
          {visible.map((club) => (
            <ClubCard
              key={club.id}
              club={club}
              joined={joinedClubIds.includes(club.id)}
              onJoin={joinClub}
              onLeave={leaveClub}
            />
          ))}
        </div>
      )}
    </>
  );
}
