import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TimetableCard from "../components/TimetableCard";
import { timetable } from "../data/campusData";
import "../styles/timetable-page.css";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function Timetable() {
  const [open, setOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [view, setView] = useState("daily");

  const dailyClasses = useMemo(
    () => timetable.filter((item) => item[0] === selectedDay),
    [selectedDay]
  );

  const renderClass = (item, index) => (
    <TimetableCard
      key={`${item[0]}-${item[1]}-${index}`}
      subject={item[1]}
      teacher={item[2]}
      room={item[3]}
      time={item[4]}
      type={item[5]}
    />
  );

  return (
    <div className="dashboard-layout">
      <Sidebar isOpen={open} onClose={() => setOpen(false)} />
      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-title">
            <h1>My Timetable</h1>
            <p>Check your daily and weekly class schedule.</p>
          </div>
          <button className="mobile-menu-button" onClick={() => setOpen(true)}>☰</button>
        </header>

        <section className="dashboard-content">
          <div className="timetable-view-buttons">
            <button className={view === "daily" ? "active" : ""} onClick={() => setView("daily")}>Daily View</button>
            <button className={view === "weekly" ? "active" : ""} onClick={() => setView("weekly")}>Weekly View</button>
          </div>

          {view === "daily" ? (
            <>
              <div className="day-buttons">
                {days.map((day) => (
                  <button key={day} className={selectedDay === day ? "active" : ""} onClick={() => setSelectedDay(day)}>{day}</button>
                ))}
              </div>
              <div className="dashboard-card">
                <div className="dashboard-card-header">
                  <h2>{selectedDay}'s Classes</h2><span>{dailyClasses.length} classes</span>
                </div>
                {dailyClasses.length ? dailyClasses.map(renderClass) : <p className="muted">No classes scheduled for this day.</p>}
              </div>
            </>
          ) : (
            <div className="weekly-timetable-grid">
              {days.map((day) => {
                const classes = timetable.filter((item) => item[0] === day);
                return (
                  <section className="dashboard-card weekly-timetable-day" key={day}>
                    <div className="dashboard-card-header"><h2>{day}</h2><span>{classes.length} classes</span></div>
                    {classes.length ? classes.map(renderClass) : <p className="muted">No classes</p>}
                  </section>
                );
              })}
            </div>
          )}
          <div className="dashboard-card timetable-help">
            <h3>Subject details</h3>
            <p>Open a class card's <strong>View</strong> button to see its subject details.</p>
            <Link to="/directory">Open Campus Directory →</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
