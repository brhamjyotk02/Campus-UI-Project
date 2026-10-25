import { useState } from 'react';

export default function NotificationBell({ notifications, onMarkRead, onMarkAllRead }) {
  const [open, setOpen] = useState(false);
  const unread = notifications.filter(item => !item.read).length;

  return (
    <div className="as-notification-wrap">
      <button className="as-bell-button" type="button" aria-label={`Notifications, ${unread} unread`} onClick={() => setOpen(value => !value)}>
        <span aria-hidden="true">♧</span><span className="as-bell-label">Notifications</span>{unread > 0 && <span className="as-unread-count">{unread > 99 ? '99+' : unread}</span>}
      </button>
      {open && <div className="as-notification-panel">
        <div className="as-notification-head"><div><h3>Notifications</h3><p>{unread ? `${unread} unread` : 'You are all caught up'}</p></div>{unread > 0 && <button type="button" className="as-text-button" onClick={onMarkAllRead}>Mark all read</button>}</div>
        <div className="as-notification-list">
          {notifications.length === 0 ? <div className="as-empty-small"><span>✦</span><p>No notifications yet</p></div> : notifications.map(item => (
            <button type="button" key={item.id} className={`as-notification-item ${item.read ? 'is-read' : ''}`} onClick={() => onMarkRead(item.id)}>
              <span className={`as-notification-dot ${item.read ? 'is-read' : ''}`} />
              <span className="as-notification-copy"><strong>{item.title}</strong><span>{item.message}</span><small>{item.createdAt ? new Date(item.createdAt).toLocaleString() : ''}</small></span>
              {!item.read && <span className="as-notification-new">New</span>}
            </button>
          ))}
        </div>
      </div>}
    </div>
  );
}
