import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { fetchCommunityData } from "../services/communityApi";
import { SEED_COMPLAINTS } from "../data/complaintData";
import { todayISO } from "../utils/dates";
import { addNotification } from "../services/notificationService";

const CommunityContext = createContext(null);
const XP_PER_LEVEL = 400;

export function CommunityProvider({ children }) {
  // ---- async data (clubs, events, profile) with loading / error / retry ----
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [simulateError, setSimulateError] = useLocalStorage("simulateError", false);

  useEffect(() => {
    let cancelled = false; // ignore results from an outdated request
    setLoading(true);
    setError("");

    fetchCommunityData(simulateError)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Something went wrong.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [attempt, simulateError]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  // ---- user state, saved in localStorage ----
  const [joinedClubIds, setJoinedClubIds] = useLocalStorage("joinedClubs", []);
  const [registeredIds, setRegisteredIds] = useLocalStorage("registeredEvents", []);
  const [complaints, setComplaints] = useLocalStorage("complaints", SEED_COMPLAINTS);

  const clubs = data ? data.clubs : [];
  const events = data ? data.events : [];
  const profile = data ? data.profile : null;

  const joinClub = useCallback(
    (id) => {
      if (joinedClubIds.includes(id)) return;
      setJoinedClubIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      const club = clubs.find((item) => item.id === id);
      addNotification({ title: "Club joined", message: `You joined ${club?.name || "a campus club"}.`, type: "club", link: "/clubs" });
    },
    [joinedClubIds, setJoinedClubIds, clubs]
  );
  const leaveClub = useCallback(
    (id) => {
      setJoinedClubIds((prev) => prev.filter((x) => x !== id));
      const club = clubs.find((item) => item.id === id);
      addNotification({ title: "Club membership updated", message: `You left ${club?.name || "a campus club"}.`, type: "club", link: "/clubs" });
    },
    [setJoinedClubIds, clubs]
  );

  const seatsLeft = useCallback(
    (event) => Math.max(0, event.capacity - event.seatsTaken - (registeredIds.includes(event.id) ? 1 : 0)),
    [registeredIds]
  );

  const registerEvent = useCallback(
    (id) => {
      const event = events.find((e) => e.id === id);
      if (!event || event.capacity - event.seatsTaken <= 0 || registeredIds.includes(id)) return false;
      setRegisteredIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      addNotification({ title: "Event registration confirmed", message: `You're registered for ${event.title}.`, type: "event", link: `/events/${event.id}` });
      return true;
    },
    [events, registeredIds, setRegisteredIds]
  );
  const unregisterEvent = useCallback(
    (id) => {
      const event = events.find((item) => item.id === id);
      setRegisteredIds((prev) => prev.filter((x) => x !== id));
      if (event) addNotification({ title: "Event registration cancelled", message: `You're no longer registered for ${event.title}.`, type: "event", link: `/events/${event.id}` });
    },
    [events, setRegisteredIds]
  );

  // Demo complaint IDs: 001, 002, 003 ...
  const fileComplaint = useCallback(
    ({ category, location, description }) => {
      const highest = complaints.reduce((max, c) => Math.max(max, parseInt(c.id, 10) || 0), 0);
      const id = String(highest + 1).padStart(3, "0");
      setComplaints((prev) => [
        { id, category, location, description, status: "Pending", createdAt: todayISO() },
        ...prev,
      ]);
      addNotification({ title: "Complaint submitted", message: `Your complaint #${id} was submitted and is pending review.`, type: "complaint", link: "/complaints" });
      return id;
    },
    [complaints, setComplaints]
  );

  const updateComplaintStatus = useCallback(
    (id, status) => {
      setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
      addNotification({ title: "Complaint status updated", message: `Complaint #${id} is now ${status.toLowerCase()}.`, type: "complaint", link: "/complaints" });
    },
    [setComplaints]
  );

  // ---- XP, level and achievements are derived from what the student did ----
  const stats = useMemo(() => {
    const base = profile ? profile.baseXp : 0;
    const resolved = complaints.filter((c) => c.status === "Resolved").length;
    const xp = base + registeredIds.length * 40 + joinedClubIds.length * 25 + complaints.length * 15 + resolved * 20;
    return {
      xp,
      level: Math.floor(xp / XP_PER_LEVEL) + 1,
      intoLevel: xp % XP_PER_LEVEL,
      perLevel: XP_PER_LEVEL,
      achievements: [
        { id: "explorer", label: "Club Explorer", hint: "Join your first club", earned: joinedClubIds.length >= 1 },
        { id: "butterfly", label: "Social Butterfly", hint: "Join 3 clubs", earned: joinedClubIds.length >= 3 },
        { id: "regular", label: "Event Regular", hint: "Register for 3 events", earned: registeredIds.length >= 3 },
        { id: "voice", label: "Voice Heard", hint: "File a complaint", earned: complaints.length >= 1 },
        { id: "solver", label: "Problem Solved", hint: "Get a complaint resolved", earned: resolved >= 1 },
      ],
    };
  }, [profile, registeredIds, joinedClubIds, complaints]);

  const value = useMemo(
    () => ({
      loading, error, retry, ready: !!data && !error,
      simulateError, setSimulateError,
      clubs, events, profile,
      joinedClubIds, joinClub, leaveClub,
      registeredIds, registerEvent, unregisterEvent, seatsLeft,
      complaints, fileComplaint, updateComplaintStatus,
      stats,
    }),
    [
      loading, error, retry, data, simulateError, setSimulateError, clubs, events, profile,
      joinedClubIds, joinClub, leaveClub, registeredIds, registerEvent, unregisterEvent, seatsLeft,
      complaints, fileComplaint, updateComplaintStatus, stats,
    ]
  );

  return <CommunityContext.Provider value={value}>{children}</CommunityContext.Provider>;
}

export function useCommunity() {
  const ctx = useContext(CommunityContext);
  if (!ctx) throw new Error("useCommunity must be used inside <CommunityProvider>");
  return ctx;
}
