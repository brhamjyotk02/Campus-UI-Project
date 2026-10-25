import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { StudentDashboard as Dashboard, StudentTimetable as Timetable, SubjectDetails, Attendance, Notes, NoteDetails, Assignments, AssignmentDetails, TeacherDashboard, TeacherTimetable, TeacherAttendance, TeacherStudents } from "./features/academic";
import { FocusZone } from "./features/productivity";
import { Clubs, ClubDetails, Events, EventDetails, Complaints, CampusAssistant, CampusProfile } from "./features/campus-life";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import CampusDirectory from "./pages/CampusDirectory";
import ProtectedRoute from "./routes/ProtectedRoute";
import CampusLifeLayout from "./components/CampusLifeLayout";
import "./styles/campusLife.css";

const Protected = ({ children, roles }) => (
  <ProtectedRoute allowedRoles={roles}>{children}</ProtectedRoute>
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Protected roles={["student"]}><Dashboard /></Protected>} />
      <Route path="/timetable" element={<Protected roles={["student"]}><Timetable /></Protected>} />
      <Route path="/timetable/:subjectId" element={<Protected roles={["student"]}><SubjectDetails /></Protected>} />
      <Route path="/attendance" element={<Protected roles={["student"]}><Attendance /></Protected>} />
      <Route path="/directory" element={<Protected roles={["student"]}><CampusDirectory /></Protected>} />
      <Route path="/notifications" element={<Protected roles={["student", "teacher"]}><Notifications /></Protected>} />
      <Route path="/notes" element={<Protected roles={["student"]}><Notes /></Protected>} />
      <Route path="/notes/:noteId" element={<Protected roles={["student"]}><NoteDetails /></Protected>} />
      <Route path="/assignments" element={<Protected roles={["student"]}><Assignments /></Protected>} />
      <Route path="/teacher/assignments" element={<Protected roles={["teacher"]}><Assignments /></Protected>} />
      <Route path="/assignments/:assignmentId" element={<Protected roles={["student"]}><AssignmentDetails /></Protected>} />
      <Route path="/focus-zone" element={<Protected roles={["student"]}><FocusZone /></Protected>} />
      <Route path="/profile" element={<Protected roles={["student"]}><Profile /></Protected>} />
      <Route path="/campus-profile" element={<Protected roles={["student"]}><CampusLifeLayout title="Campus Profile & Achievements"><CampusProfile /></CampusLifeLayout></Protected>} />
      <Route path="/clubs" element={<Protected roles={["student"]}><CampusLifeLayout title="Clubs"><Clubs /></CampusLifeLayout></Protected>} />
      <Route path="/clubs/:clubId" element={<Protected roles={["student"]}><CampusLifeLayout title="Club Details"><ClubDetails /></CampusLifeLayout></Protected>} />
      <Route path="/events" element={<Protected roles={["student"]}><CampusLifeLayout title="Events"><Events /></CampusLifeLayout></Protected>} />
      <Route path="/events/:eventId" element={<Protected roles={["student"]}><CampusLifeLayout title="Event Details"><EventDetails /></CampusLifeLayout></Protected>} />
      <Route path="/complaints" element={<Protected roles={["student"]}><CampusLifeLayout title="Complaints"><Complaints /></CampusLifeLayout></Protected>} />
      <Route path="/assistant" element={<Protected roles={["student"]}><CampusLifeLayout title="Campus Assistant"><CampusAssistant /></CampusLifeLayout></Protected>} />


      <Route path="/teacher" element={<Protected roles={["teacher"]}><TeacherDashboard /></Protected>} />
      <Route path="/teacher/timetable" element={<Protected roles={["teacher"]}><TeacherTimetable /></Protected>} />
      <Route path="/teacher/attendance" element={<Protected roles={["teacher"]}><TeacherAttendance /></Protected>} />
      <Route path="/teacher/students" element={<Protected roles={["teacher"]}><TeacherStudents /></Protected>} />
      <Route path="/teacher/profile" element={<Protected roles={["teacher"]}><Profile teacher /></Protected>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
