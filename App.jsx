import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import NoteDetails from "./pages/NoteDetails";
import Assignments from "./pages/Assignments";
import AssignmentDetails from "./pages/AssignmentDetails";
import FocusZone from "./pages/FocusZone";
import Timetable from "./pages/Timetable";
import SubjectDetails from "./pages/SubjectDetails";
import Attendance from "./pages/Attendance";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherTimetable from "./pages/TeacherTimetable";
import TeacherAttendance from "./pages/TeacherAttendance";
import TeacherStudents from "./pages/TeacherStudents";
import Profile from "./pages/Profile";
import ProtectedRoute from "./routes/ProtectedRoute";
import CampusLifeLayout from "./components/CampusLifeLayout";
import Clubs from "./pages/Clubs";
import ClubDetails from "./pages/ClubDetails";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Complaints from "./pages/Complaints";
import CampusAssistant from "./pages/CampusAssistant";
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
      <Route path="/notes" element={<Protected roles={["student"]}><Notes /></Protected>} />
      <Route path="/notes/:noteId" element={<Protected roles={["student"]}><NoteDetails /></Protected>} />
      <Route path="/assignments" element={<Protected roles={["student"]}><Assignments /></Protected>} />
      <Route path="/assignments/:assignmentId" element={<Protected roles={["student"]}><AssignmentDetails /></Protected>} />
      <Route path="/focus-zone" element={<Protected roles={["student"]}><FocusZone /></Protected>} />
      <Route path="/profile" element={<Protected roles={["student"]}><Profile /></Protected>} />
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
