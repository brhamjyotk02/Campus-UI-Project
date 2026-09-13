import { Link } from "react-router-dom";

function NoteCard({ note, bookmarked, onBookmark }) {
  return (
    <article className="note-card">
      <div className="note-icon">{note.icon}</div>

      <div className="note-content">
        <div className="note-card-top">
          <span className="subject-badge">{note.subject}</span>
          <button
            className={`bookmark-btn ${bookmarked ? "bookmarked" : ""}`}
            onClick={() => onBookmark(note.id)}
            title="Bookmark note"
          >
            {bookmarked ? "★" : "☆"}
          </button>
        </div>

        <h3>{note.title}</h3>
        <p className="folder-label">📁 {note.folder}</p>
        <p className="description">{note.description}</p>

        <div className="tag-row">
          {note.tags.map((tag) => <span key={tag}>#{tag}</span>)}
        </div>

        <div className="note-footer">
          <span>⏱ {note.readTime}</span>
          <Link className="secondary-btn" to={`/notes/${note.id}`}>Open Notes →</Link>
        </div>
      </div>
    </article>
  );
}

export default NoteCard;