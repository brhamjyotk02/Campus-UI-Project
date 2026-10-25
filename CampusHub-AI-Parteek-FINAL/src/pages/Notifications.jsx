import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "../services/notificationService";

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(getNotifications);
  const refresh = () => setItems(getNotifications());

  useEffect(() => {
    window.addEventListener("campusHubNotificationsChanged", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("campusHubNotificationsChanged", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const unread = items.filter((n) => !n.isRead).length;

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={open} onClose={() => setOpen(false)} />
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-title">
            <h1>Notifications</h1>
            <p>Your campus updates and important reminders.</p>
          </div>
          <button className="mobile-menu-button" onClick={() => setOpen(true)}>☰</button>
        </header>
        <section className="dashboard-content">
          <section className="hero-panel">
            <div>
              <div className="section-label">CAMPUS UPDATES</div>
              <h1>Notifications 🔔</h1>
              <p>Assignment updates, campus events and important reminders in one place.</p>
            </div>
            <button className="primary-btn" onClick={() => { markAllNotificationsRead(); refresh(); }} disabled={!unread}>
              Mark all as read
            </button>
          </section>
          <div className="section-heading"><h2>{unread} unread</h2></div>
          <div className="notification-list">
            {items.map((n) => (
              <article className={`notification-item ${n.isRead ? "read" : "unread"}`} key={n.id}>
                <div className="notification-dot" />
                <div className="notification-copy">
                  <strong>{n.title}</strong>
                  <p>{n.message}</p>
                  <small>{new Date(n.createdAt).toLocaleString("en-IN")}</small>
                  {n.link && <a className="notification-open-link" href={n.link}>Open</a>}
                </div>
                {!n.isRead && <button className="secondary-btn" onClick={() => { markNotificationRead(n.id); refresh(); }}>Mark read</button>}
              </article>
            ))}
            {!items.length && <div className="empty-state">You're all caught up. New updates will appear here.</div>}
          </div>
        </section>
      </main>
    </div>
  );
}
