// The Campus Assistant reads from these helpers, which in turn read
// localStorage keys — some written by THIS module (joinedClubs,
// registeredEvents, complaints), and some that will eventually be
// written by teammates' modules (nextClass, attendanceSummary,
// assignments, studyGoal). Until those are merged in, each helper
// falls back to a placeholder value so the assistant still works
// standalone.

import { timetable, overallStats, readAttendance, readStudents } from "./campusData";
import { eventsData } from "./eventsData";

export function getNextClass() {
  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "long" });
  const rows = timetable.filter((row) => row[0] === day);
  const row = rows[0];
  if (row) return { subject: row[1], time: row[4], room: row[3] };
  return { subject: "No class scheduled", time: "—", room: "—" };
}

export function getAttendanceSummary() {
  let studentId = "student-demo";
  try {
    const user = JSON.parse(localStorage.getItem("campusHubUser") || "null");
    const students = readStudents(JSON.parse(localStorage.getItem("campusHubUsers") || "[]"));
    studentId = students.find((s) => s.email === user?.email)?.id || studentId;
  } catch {}
  const stats = overallStats(studentId, readAttendance());
  return { overallPercentage: stats.total ? stats.percentage : 0 };
}

export function getPendingAssignments() {
  try {
    const all = JSON.parse(localStorage.getItem("parteekAssignments") || "null");
    if (Array.isArray(all)) return all.filter((a) => a.status !== "Submitted");
  } catch {}
  return [];
}

export function getStudyGoal() {
  const stored = localStorage.getItem("studyGoal");
  if (stored) return JSON.parse(stored);
  return { hoursToday: 1.5, targetHours: 3 };
}

export function getUpcomingEventsCount() {
  const today = new Date().toISOString().slice(0, 10);
  return eventsData.filter((event) => event.date >= today).length;
}

export function getJoinedClubsCount() {
  const stored = localStorage.getItem("joinedClubs");
  return stored ? JSON.parse(stored).length : 0;
}

export function getRegisteredEventsCount() {
  const stored = localStorage.getItem("registeredEvents");
  return stored ? JSON.parse(stored).length : 0;
}

export function getComplaintsSummary() {
  const stored = localStorage.getItem("complaints");
  const all = stored ? JSON.parse(stored) : [];
  const pending = all.filter((c) => c.status !== "Resolved").length;
  return { total: all.length, pending };
}

// --- Intent matching -------------------------------------------------
// Each intent has a list of keywords/phrases to match against the
// user's message (case-insensitive, substring match) and a function
// that builds the reply. Order matters — first match wins, so more
// specific intents are listed before generic ones.

const INTENTS = [
  {
    name: "greeting",
    keywords: ["hi", "hello", "hey", "yo", "sup"],
    answer: () =>
      "Hey! I can tell you about your next class, attendance, assignments, events, clubs, complaints, or profile XP. What do you want to know?",
  },
  {
    name: "thanks",
    keywords: ["thank", "thanks", "thx", "appreciate"],
    answer: () => "Anytime! Let me know if you need anything else.",
  },
  {
    name: "help",
    keywords: ["help", "what can you do", "options", "commands"],
    answer: () =>
      "Try asking about: next class, attendance, assignments due, upcoming events, clubs you've joined, complaint status, or your profile/XP.",
  },
  {
    name: "next-class",
    keywords: ["next class", "class now", "upcoming class", "what's next", "timetable"],
    answer: () => {
      const nextClass = getNextClass();
      return `Your next class is ${nextClass.subject} at ${nextClass.time} in ${nextClass.room}.`;
    },
  },
  {
    name: "attendance",
    keywords: ["attendance", "present", "bunk", "75%"],
    answer: () => {
      const { overallPercentage } = getAttendanceSummary();
      const note =
        overallPercentage < 75
          ? " That's below 75% — check the Attendance page for how many classes you need."
          : " You're above the 75% mark.";
      return `Your overall attendance is ${overallPercentage}%.${note}`;
    },
  },
  {
    name: "assignments",
    keywords: ["assignment", "homework", "due", "submit", "submission"],
    answer: () => {
      const pending = getPendingAssignments();
      if (pending.length === 0) return "You have no pending assignments. Nice.";
      const list = pending.map((a) => `${a.title} (due ${a.dueDate})`).join(", ");
      return `You have ${pending.length} pending: ${list}.`;
    },
  },
  {
    name: "study-goal",
    keywords: ["study goal", "study time", "focus", "hours studied"],
    answer: () => {
      const { hoursToday, targetHours } = getStudyGoal();
      return `You've studied ${hoursToday} of your ${targetHours} hour goal today. ${
        hoursToday >= targetHours ? "Goal met!" : "Keep going."
      }`;
    },
  },
  {
    name: "events",
    keywords: ["event", "fest", "happening", "registered event"],
    answer: () => {
      const total = getUpcomingEventsCount();
      const registered = getRegisteredEventsCount();
      return `There are ${total} upcoming events, and you're registered for ${registered}. Check the Events tab to see them.`;
    },
  },
  {
    name: "clubs",
    keywords: ["club", "society", "joined"],
    answer: () => {
      const count = getJoinedClubsCount();
      return count === 0
        ? "You haven't joined any clubs yet — head to the Clubs tab to browse."
        : `You've joined ${count} club${count === 1 ? "" : "s"} so far.`;
    },
  },
  {
    name: "complaints",
    keywords: ["complaint", "wifi", "issue", "report"],
    answer: () => {
      const { total, pending } = getComplaintsSummary();
      if (total === 0) return "No complaints filed yet.";
      return `You've filed ${total} complaint${total === 1 ? "" : "s"}, ${pending} still open.`;
    },
  },
  {
    name: "profile",
    keywords: ["xp", "level", "profile", "achievement"],
    answer: () => "Check the Profile tab for your XP, level, and achievements.",
  },
];

const FALLBACK =
  "I'm not sure about that one yet — try asking about your next class, attendance, assignments, events, clubs, or complaints.";

export function answerFor(question) {
  const normalized = question.toLowerCase();
  const matched = INTENTS.find((intent) =>
    intent.keywords.some((keyword) => normalized.includes(keyword))
  );
  return matched ? matched.answer() : FALLBACK;
}

export const SUGGESTED_QUESTIONS = [
  "What is my next class?",
  "What is my attendance?",
  "What assignments are due?",
  "What events are coming?",
  "How many clubs have I joined?",
  "What's my complaint status?",
];
