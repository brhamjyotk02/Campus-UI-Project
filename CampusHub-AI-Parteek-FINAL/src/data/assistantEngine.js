import { daysUntil, formatDate, whenLabel } from "../utils/dates";
import { getNextClass, getAttendance, getPendingAssignments } from "./sharedDemoData";

// The predefined questions shown as chips.
export const QUESTIONS = [
  "What is my next class?",
  "What is my attendance?",
  "What assignments are due?",
  "What events are coming?",
  "Which events am I registered for?",
  "Which clubs have I joined?",
  "What is my complaint status?",
  "What is my XP?",
];

const NEEDS_DATA = "I can’t read the community data right now. Once it loads (or you press Retry on any page), ask me again.";

// Each intent: a pattern to match the question, and answer(ctx) => text.
// ctx = { ready, events, clubs, registeredIds, joinedClubIds, complaints, stats }
// More specific intents come first; the first match wins.
const INTENTS = [
  { pattern: /\b(hi|hello|hey)\b/, answer: () => "Hi! Ask me about classes, attendance, assignments, events, clubs, complaints or your XP." },
  { pattern: /thank/, answer: () => "Anytime. Enjoy your day." },
  { pattern: /\b(help|what can you do)\b/, answer: () => "Try one of the suggestions below, or type something like “next class”, “attendance”, “my events” or “my clubs”." },
  {
    pattern: /next class|timetable|schedule/,
    answer: () => {
      const c = getNextClass();
      return `Your next class is ${c.subject} on ${c.dayName} at ${c.start} in ${c.room}.`;
    },
  },
  {
    pattern: /attend|75/,
    answer: () => {
      const a = getAttendance();
      if (a.total === 0) return "No attendance records have been marked yet. Once your teacher records a class, your percentage will appear here.";
      const tail = a.needed === 0 ? "You’re above the 75% mark." : `Attend the next ${a.needed} classes in a row to get back to 75%.`;
      return `Your overall attendance is ${a.percent}% (${a.attended} of ${a.total} classes). ${tail}`;
    },
  },
  {
    pattern: /assign|homework|due|submit/,
    answer: () => {
      const list = getPendingAssignments();
      if (list.length === 0) return "No pending assignments. Nice.";
      return `You have ${list.length} pending:\n` + list.map((a) => `• ${a.title}, due ${formatDate(a.due)}`).join("\n");
    },
  },
  {
    pattern: /registered|registration|my events/,
    answer: (ctx) => {
      if (!ctx.ready) return NEEDS_DATA;
      const mine = ctx.events.filter((e) => ctx.registeredIds.includes(e.id));
      if (mine.length === 0) return "You haven’t registered for any events yet. Open the Events page to pick one.";
      return `You’re registered for ${mine.length}:\n` + mine.map((e) => `• ${e.title} (${whenLabel(daysUntil(e.date)).toLowerCase()})`).join("\n");
    },
  },
  {
    pattern: /event|fest|happening/,
    answer: (ctx) => {
      if (!ctx.ready) return NEEDS_DATA;
      const upcoming = ctx.events.filter((e) => daysUntil(e.date) >= 0);
      const next = upcoming[0];
      if (!next) return "There are no upcoming campus events listed right now.";
      return `There are ${upcoming.length} upcoming events. Next up: ${next.title} (${whenLabel(daysUntil(next.date)).toLowerCase()}) at ${next.location}.`;
    },
  },
  {
    pattern: /club|society/,
    answer: (ctx) => {
      if (!ctx.ready) return NEEDS_DATA;
      const mine = ctx.clubs.filter((c) => ctx.joinedClubIds.includes(c.id));
      if (mine.length === 0) return "You haven’t joined a club yet. The Clubs page has a few relaxed ones to start with.";
      return `You’ve joined ${mine.length}: ${mine.map((c) => c.name).join(", ")}.`;
    },
  },
  {
    pattern: /complain|wifi|wi-fi|issue/,
    answer: (ctx) => {
      const open = ctx.complaints.filter((c) => c.status !== "Resolved").length;
      if (ctx.complaints.length === 0) return "You haven’t filed any complaints.";
      const latest = ctx.complaints[0];
      return `You’ve filed ${ctx.complaints.length} complaint${ctx.complaints.length === 1 ? "" : "s"}, ${open} still open. Latest: #${latest.id} (${latest.category}, ${latest.location}) is ${latest.status}.`;
    },
  },
  {
    pattern: /xp|level|achievement/,
    answer: (ctx) => {
      if (!ctx.ready) return NEEDS_DATA;
      const earned = ctx.stats.achievements.filter((a) => a.earned).length;
      return `You have ${ctx.stats.xp} XP (level ${ctx.stats.level}) and ${earned} of ${ctx.stats.achievements.length} achievements.`;
    },
  },
];

const FALLBACK = "I’m not sure about that one. Try one of the suggestions below.";

export function answerQuestion(text, ctx) {
  const q = text.toLowerCase();
  const match = INTENTS.find((intent) => intent.pattern.test(q));
  return match ? match.answer(ctx) : FALLBACK;
}
