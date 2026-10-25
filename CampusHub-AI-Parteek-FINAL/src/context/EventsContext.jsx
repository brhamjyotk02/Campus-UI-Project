import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { addNotification } from "../services/notificationService";
import { addDays, toISO, daysUntil, formatDate, whenLabel } from "../utils/dates";

const EventsContext = createContext(null);

export function EventsProvider({ children }) {
  const [apiEvents, setApiEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [customEvents, setCustomEvents] = useLocalStorage("customEvents", []);
  const [registeredIds, setRegisteredIds] = useLocalStorage("registeredEvents", []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetch("/events.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setApiEvents(data.map((e) => ({ ...e, date: toISO(addDays(e.offsetDays)) })));
      })
      .catch((err) => { if (!cancelled) setError(err.message || "Could not load events."); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);
  const events = useMemo(() => [...apiEvents, ...customEvents].sort((a, b) => a.date.localeCompare(b.date)), [apiEvents, customEvents]);
  const getEventById = useCallback((id) => events.find((e) => e.id === id) || null, [events]);
  const isRegistered = useCallback((id) => registeredIds.includes(id), [registeredIds]);
  const getSeatsLeft = useCallback((event) => Math.max(0, event.capacity - event.seatsTaken - (registeredIds.includes(event.id) ? 1 : 0)), [registeredIds]);
  const addEvent = useCallback((event) => setCustomEvents((prev) => [...prev, event]), [setCustomEvents]);

  const register = useCallback((eventId) => {
    const event = events.find((e) => e.id === eventId);
    if (!event || registeredIds.includes(eventId) || event.capacity - event.seatsTaken <= 0) return false;
    setRegisteredIds((prev) => [...prev, eventId]);
    addNotification({ title: "Registration confirmed", message: `You're registered for ${event.title} on ${formatDate(event.date)}.`, type: "event", link: `/events/${event.id}` });
    return true;
  }, [events, registeredIds, setRegisteredIds]);

  const unregister = useCallback((eventId) => {
    const event = events.find((e) => e.id === eventId);
    setRegisteredIds((prev) => prev.filter((id) => id !== eventId));
    if (event) addNotification({ title: "Registration cancelled", message: `You're no longer registered for ${event.title}.`, type: "event", link: `/events/${event.id}` });
  }, [events, setRegisteredIds]);

  useEffect(() => {
    if (loading || events.length === 0) return;
    events.forEach((event) => {
      const days = daysUntil(event.date);
      if (days < 0 || days > 3) return;
      if (registeredIds.includes(event.id)) {
        addNotification({ id: `reminder-${event.id}`, title: "Event reminder", message: `${event.title} is ${whenLabel(days).toLowerCase()} at ${event.location}.`, type: "event", link: `/events/${event.id}`, silent: true });
      } else if (days <= 2) {
        addNotification({ id: `upcoming-${event.id}`, title: "Happening soon", message: `${event.title} is ${whenLabel(days).toLowerCase()}. Seats are still open.`, type: "event", link: `/events/${event.id}`, silent: true });
      }
    });
  }, [events, loading, registeredIds]);

  const value = useMemo(() => ({ events, loading, error, reload, getEventById, isRegistered, getSeatsLeft, registeredIds, register, unregister, addEvent }), [events, loading, error, reload, getEventById, isRegistered, getSeatsLeft, registeredIds, register, unregister, addEvent]);
  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const ctx = useContext(EventsContext);
  if (!ctx) throw new Error("useEvents must be used inside <EventsProvider>");
  return ctx;
}
