// Shared data adapter: Campus Assistant reads the same academic records as the main app.
import { timetable as academicTimetable, readAttendance, readStudents, overallStats } from "./campusData";
import { assignmentsData } from "./mockData";
import { addDays, toISO } from "../utils/dates";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function to24Hour(timeText) {
  const match = String(timeText || "").match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return "09:00";
  let hour = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hour += 12;
  return `${String(hour).padStart(2, "0")}:${match[2]}`;
}

function getCurrentStudentId() {
  try {
    const current = JSON.parse(localStorage.getItem("campusHubUser") || "null");
    const users = JSON.parse(localStorage.getItem("campusHubUsers") || "[]");
    const students = readStudents(users);
    return students.find((student) => student.email === current?.email)?.id || students[0]?.id || "student-demo";
  } catch {
    return "student-demo";
  }
}

export const timetable = academicTimetable.map(([dayName, subject, teacher, room, time, type]) => ({
  day: DAY_NAMES.indexOf(dayName),
  dayName,
  start: to24Hour(time),
  subject,
  teacher,
  room,
  time,
  type,
}));

export function getNextClass(now = new Date()) {
  const nowMinutes = now.getDay() * 1440 + now.getHours() * 60 + now.getMinutes();
  let best = null;
  timetable.forEach((item) => {
    const [hour, minute] = item.start.split(":").map(Number);
    let at = item.day * 1440 + hour * 60 + minute;
    if (at < nowMinutes) at += 7 * 1440;
    if (!best || at < best.at) best = { ...item, at };
  });
  return best;
}

export function getAttendance() {
  const stats = overallStats(getCurrentStudentId(), readAttendance());
  const needed = stats.percentage >= 75 ? 0 : Math.ceil((0.75 * stats.total - stats.attended) / 0.25);
  return { attended: stats.attended, total: stats.total, percent: stats.percentage, needed };
}

export function getPendingAssignments() {
  let assignments = assignmentsData;
  try {
    const saved = JSON.parse(localStorage.getItem("parteekAssignments") || "null");
    if (Array.isArray(saved)) assignments = saved;
  } catch {
    // Fall back to the bundled assignment demo data.
  }
  return assignments
    .filter((assignment) => String(assignment.status || "Pending").toLowerCase() === "pending")
    .map((assignment) => {
      const due = assignment.dueDate || assignment.due || toISO(addDays(assignment.dueInDays || 0));
      return { ...assignment, due };
    })
    .sort((a, b) => String(a.due).localeCompare(String(b.due)));
}
