export const NOTIFICATIONS_KEY = "campusHubNotifications";

export function getNotifications() {
  try { return JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || "[]"); }
  catch { return []; }
}

export function addNotification({ id, title, message, type = "info", link = null, silent = false }) {
  const items = getNotifications();
  if (id && items.some((item) => item.id === id)) return items.find((item) => item.id === id);
  const item = { id: id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title, message, type, link, isRead: false, createdAt: new Date().toISOString() };
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([item, ...items]));
  window.dispatchEvent(new Event("campusHubNotificationsChanged"));
  if (!silent) window.dispatchEvent(new CustomEvent("campusHubToast", { detail: item }));
  return item;
}

export function markNotificationRead(id) {
  const items = getNotifications().map((n) => n.id === id ? { ...n, isRead: true } : n);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("campusHubNotificationsChanged"));
}

export function markAllNotificationsRead() {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(getNotifications().map((n) => ({ ...n, isRead: true }))));
  window.dispatchEvent(new Event("campusHubNotificationsChanged"));
}
