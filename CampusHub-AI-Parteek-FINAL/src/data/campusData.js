export const subjects = [
  { id: "dbms", name: "DBMS", teacher: "DBMS Faculty", room: "TG 201", type: "Lecture" },
  { id: "fee-ii", name: "FEE II", teacher: "Niket Gupta", room: "TG 201", type: "Lecture" },
  { id: "oop", name: "OOP", teacher: "Kajal Sharma", room: "TG 201", type: "Lecture" },
  { id: "discrete", name: "Discrete", teacher: "Discrete Faculty", room: "TG 201", type: "Lecture" }
];

// CSE 3 G3 — timetable transcribed from the supplied timetable image.
// Periods: 1=08:00-10:00, 2=10:00-11:00, 3=11:00-12:00,
// 4=12:00-01:00, 5=01:00-02:00, 6=02:00-03:00, 7=03:00-04:00.
export const timetable = [
  ["Monday", "DBMS", "DBMS Faculty", "TG 201", "08:00 AM – 11:00 AM", "Lecture (Periods 1–2)"],
  ["Monday", "FEE II", "Niket Gupta", "TG 201", "11:00 AM – 01:00 PM", "Lecture (Periods 3–4)"],
  ["Monday", "OOP", "Kajal Sharma", "TG 201", "02:00 PM – 04:00 PM", "Lecture (Periods 6–7)"],

  ["Tuesday", "FEE II", "Niket Gupta", "TG 201", "08:00 AM – 11:00 AM", "Lecture (Periods 1–2)"],
  ["Tuesday", "DBMS", "DBMS Faculty", "TG 201", "11:00 AM – 01:00 PM", "Lecture (Periods 3–4)"],
  ["Tuesday", "OOP", "Kajal Sharma", "TG 201", "02:00 PM – 04:00 PM", "Lecture (Periods 6–7)"],

  ["Wednesday", "Discrete", "Discrete Faculty", "TG 201", "08:00 AM – 10:00 AM", "Lecture (Period 1)"],
  ["Wednesday", "OOP", "Kajal Sharma", "TG 201", "01:00 PM – 04:00 PM", "Lecture (Periods 5–7)"],

  ["Thursday", "FEE II", "Niket Gupta", "TG 201", "08:00 AM – 11:00 AM", "Lecture (Periods 1–2)"],
  ["Thursday", "Discrete", "Discrete Faculty", "TG 201", "12:00 PM – 01:00 PM", "Lecture (Period 4)"],
  ["Thursday", "OOP", "Kajal Sharma", "TG 201", "01:00 PM – 04:00 PM", "Lecture (Periods 5–7)"],

  ["Friday", "Discrete", "Discrete Faculty", "TG 201", "11:00 AM – 12:00 PM", "Lecture (Period 3)"],
  ["Friday", "OOP", "Kajal Sharma", "TG 201", "01:00 PM – 04:00 PM", "Lecture (Periods 5–7)"],
];

export const defaultStudents = [
  { id: "student-demo", name: "Rahul Kumar", rollNo: "CSE-001", email: "student@campushub.local" },
  { id: "s2", name: "Aman Sharma", rollNo: "CSE-002", email: "aman@campushub.local" },
  { id: "s3", name: "Riya Singh", rollNo: "CSE-003", email: "riya@campushub.local" },
  { id: "s4", name: "Karan Verma", rollNo: "CSE-004", email: "karan@campushub.local" },
  { id: "s5", name: "Simran Kaur", rollNo: "CSE-005", email: "simran@campushub.local" },
  { id: "s6", name: "Arjun Mehta", rollNo: "CSE-006", email: "arjun@campushub.local" },
];

const ATTENDANCE_KEY = "campusHubAttendance";
const STUDENTS_KEY = "campusHubStudents";

export function readStudents(users = []) {
  try {
    const saved = JSON.parse(localStorage.getItem(STUDENTS_KEY) || "null");
    if (Array.isArray(saved) && saved.length) return saved;

    const registered = users
      .filter((u) => String(u.role).toLowerCase() === "student")
      .map((u, i) => ({
        id: String(u.id),
        name: u.name,
        rollNo: u.rollNo || `CSE-G3-${String(i + 1).padStart(2, "0")}`,
        email: u.email,
      }));

    const merged = [
      ...defaultStudents,
      ...registered.filter((r) => !defaultStudents.some((s) => s.email === r.email)),
    ];
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return defaultStudents;
  }
}

export function readAttendance() {
  try { return JSON.parse(localStorage.getItem(ATTENDANCE_KEY) || "{}"); }
  catch { return {}; }
}

export function saveAttendance(data) {
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event("campusHubAttendanceChanged"));
}

export function subjectStats(studentId, attendance = readAttendance()) {
  return subjects.map((subject) => {
    let attended = 0;
    let total = 0;
    Object.values(attendance || {}).forEach((day) => {
      const record = day?.[subject.id];
      if (record && Object.prototype.hasOwnProperty.call(record, studentId)) {
        total += 1;
        if (record[studentId] === true) attended += 1;
      }
    });
    return { ...subject, attended, total, percentage: total ? Math.round((attended / total) * 100) : 0 };
  });
}

export function overallStats(studentId, attendance = readAttendance()) {
  const stats = subjectStats(studentId, attendance);
  const attended = stats.reduce((sum, item) => sum + item.attended, 0);
  const total = stats.reduce((sum, item) => sum + item.total, 0);
  return { attended, total, percentage: total ? Math.round((attended / total) * 100) : 0 };
}

export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function weekday(date = new Date()) {
  return date.toLocaleDateString("en-US", { weekday: "long" });
}
