import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getNoteById } from "../services/notesService";
import useLocalStorage from "../hooks/useLocalStorage";

function NoteDetails() {
  const { noteId } = useParams();
  const note = getNoteById(noteId);
  const [bookmarks, setBookmarks] = useLocalStorage("parteekBookmarks", []);
  const [recent, setRecent] = useLocalStorage("parteekRecentNotes", []);
  const [mode, setMode] = useState("full");
  const [insideSearch, setInsideSearch] = useState("");

  useEffect(() => {
    if (!note) return;
    setRecent((items) => [note.id, ...items.filter((id) => id !== note.id)].slice(0, 6));
  }, [note?.id]);

  const matches = useMemo(() => {
    if (!note || !insideSearch.trim()) return note?.content.sections || [];
    const query = insideSearch.toLowerCase();
    return note.content.sections.filter((section) =>
      `${section.heading} ${section.text} ${section.code || ""}`.toLowerCase().includes(query)
    );
  }, [note, insideSearch]);

  if (!note) {
    return <main className="page"><div className="empty-state"><h2>Note not found</h2><Link to="/notes">← Back to Notes</Link></div></main>;
  }

  const bookmarked = bookmarks.includes(note.id);

  return (
    <main className="page detail-page">
      <Link className="back-link" to="/notes">← Back to Notes</Link>

      <article className="detail-card note-detail">
        <div className="note-detail-header">
          <div>
            <span className="subject-badge">{note.icon} {note.subject}</span>
            <h1>{note.title}</h1>
            <p className="muted">{note.description}</p>
            <div className="note-meta">📁 {note.folder} &nbsp; • &nbsp; ⏱ {note.readTime}</div>
          </div>

          <button
            className={`bookmark-big ${bookmarked ? "bookmarked" : ""}`}
            onClick={() => setBookmarks((items) => bookmarked ? items.filter((id) => id !== note.id) : [...items, note.id])}
          >
            {bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
          </button>
        </div>

        <div className="note-tools">
          <div className="search-box">🔎
            <input value={insideSearch} onChange={(e) => setInsideSearch(e.target.value)} placeholder="Search inside this note..." />
          </div>
          <button className={mode === "full" ? "active-tool" : ""} onClick={() => setMode("full")}>📖 Full Notes</button>
          <button className={mode === "quick" ? "active-tool" : ""} onClick={() => setMode("quick")}>⚡ Quick Revision</button>
          <button className={mode === "viva" ? "active-tool" : ""} onClick={() => setMode("viva")}>🎤 Viva Questions</button>
        </div>

        {mode === "quick" && (
          <section className="smart-box">
            <div className="section-label">QUICK REVISION</div>
            <h2>Remember this in 60 seconds</h2>
            <p>{note.content.quickRevision}</p>
            <ul className="key-list">
              {note.content.keyPoints.map((point) => <li key={point}>✓ {point}</li>)}
            </ul>
          </section>
        )}

        {mode === "viva" && (
          <section className="smart-box viva-box">
            <div className="section-label">VIVA PREP</div>
            <h2>Likely questions from this topic</h2>
            {note.content.viva.map((question, index) => (
              <details key={question}>
                <summary>Q{index + 1}. {question}</summary>
                <p>Prepare a short definition first, then give one simple example. Connect the answer to the concept shown in these notes.</p>
              </details>
            ))}
          </section>
        )}

        {mode === "full" && (
          <>
            <section className="overview-box">
              <div className="section-label">OVERVIEW</div>
              <p>{note.content.overview}</p>
            </section>

            <div className="note-content-area">
              <aside className="note-toc">
                <strong>On this page</strong>
                {note.content.sections.map((section) => <a key={section.heading} href={`#${section.heading.replace(/\W/g, "-")}`}>{section.heading}</a>)}
              </aside>

              <div className="note-sections">
                {insideSearch && <p className="search-result-text">{matches.length} matching section(s) found.</p>}
                {matches.map((section) => (
                  <section className="note-section" id={section.heading.replace(/\W/g, "-")} key={section.heading}>
                    <h2>{section.heading}</h2>
                    <p>{section.text}</p>
                    {section.code && <pre><code>{section.code}</code></pre>}
                  </section>
                ))}

                <section className="smart-box">
                  <div className="section-label">KEY POINTS</div>
                  <ul className="key-list">{note.content.keyPoints.map((point) => <li key={point}>✓ {point}</li>)}</ul>
                </section>
              </div>
            </div>
          </>
        )}
      </article>
    </main>
  );
}

export default NoteDetails;