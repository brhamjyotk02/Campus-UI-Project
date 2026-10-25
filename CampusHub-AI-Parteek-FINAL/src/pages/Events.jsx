import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import EventCard from "../components/EventCard";
import { LoadingGrid, ErrorState, EmptyState } from "../components/StatusViews";
import { useCommunity } from "../context/CommunityContext";
import { daysUntil } from "../utils/dates";

const WHEN_OPTIONS = [
  { value: "any", label: "Any time", max: Infinity },
  { value: "week", label: "Next 7 days", max: 7 },
  { value: "month", label: "Next 30 days", max: 30 },
];

export default function Events() {
  const { events, clubs, loading, error, retry, registeredIds, registerEvent, unregisterEvent, seatsLeft } = useCommunity();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [when, setWhen] = useState("any");
  const [onlyRegistered, setOnlyRegistered] = useState(false);

  const upcoming = useMemo(() => events.filter((e) => daysUntil(e.date) >= 0), [events]);
  const categories = useMemo(() => ["All", ...new Set(upcoming.map((e) => e.category))], [upcoming]);
  const clubName = (id) => (clubs.find((c) => c.id === id) || {}).name;

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    const max = WHEN_OPTIONS.find((o) => o.value === when).max;
    return upcoming.filter((e) => {
      const matchesTerm = !term || e.title.toLowerCase().includes(term) || e.location.toLowerCase().includes(term);
      const matchesCategory = category === "All" || e.category === category;
      const matchesWhen = daysUntil(e.date) <= max;
      const matchesRegistered = !onlyRegistered || registeredIds.includes(e.id);
      return matchesTerm && matchesCategory && matchesWhen && matchesRegistered;
    });
  }, [upcoming, search, category, when, onlyRegistered, registeredIds]);

  function clearFilters() {
    setSearch("");
    setCategory("All");
    setWhen("any");
    setOnlyRegistered(false);
  }

  return (
    <>
      <div className="page-head">
        <h1>Upcoming events</h1>
        <p>Something slow and fun is always happening. You’re registered for {registeredIds.length}.</p>
      </div>

      <div className="toolbar">
        <div className="search">
          <Search size={17} />
          <input
            type="search"
            placeholder="Search events or places"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search events"
          />
        </div>

        <select value={when} onChange={(e) => setWhen(e.target.value)} aria-label="When">
          {WHEN_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <label className="check">
          <input type="checkbox" checked={onlyRegistered} onChange={(e) => setOnlyRegistered(e.target.checked)} />
          <span>Registered only</span>
        </label>
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
        <EmptyState title="No events match" text="Try a wider time range or another category." actionLabel="Clear filters" onAction={clearFilters} />
      ) : (
        <div className="grid">
          {visible.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              clubName={clubName(event.clubId)}
              registered={registeredIds.includes(event.id)}
              seatsLeft={seatsLeft(event)}
              onRegister={registerEvent}
              onUnregister={unregisterEvent}
            />
          ))}
        </div>
      )}
    </>
  );
}
