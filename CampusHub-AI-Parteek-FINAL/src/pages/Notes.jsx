import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import NoteCard from "../components/NoteCard";
import { getNotes } from "../services/notesService";
import useLocalStorage from "../hooks/useLocalStorage";

function Notes() {
  const notes = getNotes();
  const [search, setSearch] = useState("");
  const [subject, setSubject] = useState("All");
  const [view, setView] = useState("all");
  const [bookmarks, setBookmarks] = useLocalStorage("parteekBookmarks", []);
  const [recent, setRecent] = useLocalStorage("parteekRecentNotes", []);

  const subjects = ["All", ...new Set(notes.map((note) => note.subject))];

  const toggleBookmark = (id) => {
    setBookmarks((items) => items.includes(id) ? items.filter((x) => x !== id) : [...items, id]);
  };

  const visible = useMemo(() => notes.filter((note) => {
    const matchesSearch = `${note.title} ${note.subject} ${note.description} ${note.tags.join(" ")}`
      .toLowerCase().includes(search.toLowerCase());
    const matchesSubject = subject === "All" || note.subject === subject;
    const matchesView = view === "all" || (view === "bookmarked" && bookmarks.includes(note.id)) || (view === "recent" && recent.includes(note.id));
    return matchesSearch && matchesSubject && matchesView;
  }), [notes, search, subject, view, bookmarks, recent]);

  const folders = [...new Set(notes.map((n) => `${n.subject} • ${n.folder}`))];

  return (
    <main className="page">
      <section className="hero-panel notes-hero">
        <div>
          <div className="section-label">STUDY MATERIAL</div>
          <h1>Notes Library <span>📝</span></h1>
          <p>Detailed subject notes, quick revision, bookmarks and viva preparation — all in one place.</p>
        </div>
        <div className="hero-mini">Topics<br /><strong>{notes.length}+</strong></div>
      </section>

      <section className="folder-strip">
        {folders.map((folder) => {
          const [sub, name] = folder.split(" • ");
          return <button key={folder} onClick={() => { setSubject(sub); setView("all"); }}>📁 {name}<small>{sub}</small></button>;
        })}
      </section>

      <section className="toolbar-card">
        <div className="search-box">🔍
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search topic, keyword or subject..." />
        </div>
        <select value={subject} onChange={(e) => setSubject(e.target.value)}>
          {subjects.map((s) => <option key={s}>{s}</option>)}
        </select>
      </section>

      <div className="tab-row">
        <button className={view === "all" ? "active-tab" : ""} onClick={() => setView("all")}>All Notes</button>
        <button className={view === "bookmarked" ? "active-tab" : ""} onClick={() => setView("bookmarked")}>★ Bookmarked ({bookmarks.length})</button>
        <button className={view === "recent" ? "active-tab" : ""} onClick={() => setView("recent")}>🕘 Recently Viewed</button>
      </div>

      <div className="notes-grid">
        {visible.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            bookmarked={bookmarks.includes(note.id)}
            onBookmark={toggleBookmark}
          />
        ))}
      </div>

      {visible.length === 0 && (
        <div className="empty-state">
          <h3>No notes found</h3>
          <p>Try another keyword or switch the filter.</p>
          <Link to="/notes">Clear filters</Link>
        </div>
      )}
    </main>
  );
}

export default Notes;