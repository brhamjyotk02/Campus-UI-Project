import { useMemo, useState } from "react";
import Timer from "../components/Timer";
import useLocalStorage from "../hooks/useLocalStorage";

const DAY = 86400000;

function dateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function formatMinutes(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

function getLastDays(count) {
  const days = [];
  const today = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * DAY);
    days.push({
      key: dateKey(d),
      date: d,
      day: d.getDate(),
      month: d.toLocaleString("en-US", { month: "short" }),
      weekday: d.toLocaleString("en-US", { weekday: "short" })
    });
  }
  return days;
}

function activityLevel(minutes) {
  if (!minutes) return 0;
  if (minutes < 25) return 1;
  if (minutes < 60) return 2;
  if (minutes < 120) return 3;
  return 4;
}

function FocusZone() {
  const [goal, setGoal] = useLocalStorage("parteekStudyGoal", 120);
  const [sessions, setSessions] = useLocalStorage("parteekSessions", []);
  const [activity, setActivity] = useLocalStorage("parteekActivity", {});
  const [goalInput, setGoalInput] = useState(goal);
  const [subject, setSubject] = useState("Java");
  const [selectedDate, setSelectedDate] = useState(dateKey());
  const [modeMinutes, setModeMinutes] = useState(25);

  const days = useMemo(() => getLastDays(84), []);
  const todayKey = dateKey();

  const todayMinutes = activity[todayKey] || 0;
  const totalMinutes = Object.values(activity).reduce((sum, value) => sum + value, 0);
  const goalPercent = Math.min(100, Math.round((todayMinutes / goal) * 100));

  const streak = useMemo(() => {
    let count = 0;
    const cursor = new Date();
    while (true) {
      const key = dateKey(cursor);
      if ((activity[key] || 0) > 0) {
        count++;
        cursor.setTime(cursor.getTime() - DAY);
      } else {
        break;
      }
    }
    return count;
  }, [activity]);

  const completeSession = () => {
    const minutes = modeMinutes;
    const key = dateKey();
    const session = {
      id: Date.now(),
      date: key,
      subject,
      duration: minutes,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setSessions((items) => [...items, session]);
    setActivity((old) => ({ ...old, [key]: (old[key] || 0) + minutes }));
  };

  const addDemoSession = () => {
    const key = dateKey();
    setSessions((items) => [...items, {
      id: Date.now(),
      date: key,
      subject,
      duration: 25,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }]);
    setActivity((old) => ({ ...old, [key]: (old[key] || 0) + 25 }));
  };

  const selectedMinutes = activity[selectedDate] || 0;
  const recentSessions = [...sessions].reverse().slice(0, 8);

  return (
    <main className="page">
      <section className="hero-panel focus-hero">
        <div>
          <div className="section-label">PRODUCTIVITY DASHBOARD</div>
          <h1>Focus Zone <span>🎯</span></h1>
          <p>Turn focused study sessions into visible progress and a consistent daily streak.</p>
        </div>
        <div className="streak-hero">🔥 <strong>{streak}</strong><small>day streak</small></div>
      </section>

      <div className="focus-grid">
        <Timer minutes={modeMinutes} onComplete={completeSession} />

        <section className="focus-card">
          <div className="section-label">DAILY TARGET</div>
          <h2>Study Goal</h2>
          <div className="goal-number">{formatMinutes(goal)}</div>
          <div className="progress-track"><div style={{ width: `${goalPercent}%` }} /></div>
          <p><strong>{todayMinutes} min</strong> studied today · {goalPercent}% complete</p>

          <label className="field-label">Goal in minutes</label>
          <div className="inline-form">
            <input type="number" min="15" value={goalInput} onChange={(e) => setGoalInput(e.target.value)} />
            <button className="primary-btn" onClick={() => setGoal(Math.max(15, Number(goalInput) || 120))}>Save</button>
          </div>
        </section>

        <section className="focus-card">
          <div className="section-label">SESSION SETUP</div>
          <h2>Choose your focus</h2>
          <label className="field-label">Subject</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option>Java</option>
            <option>Operating Systems</option>
            <option>DBMS</option>
            <option>EVS</option>
          </select>

          <label className="field-label">Timer length</label>
          <div className="mode-buttons">
            {[25, 50, 90].map((minutes) => (
              <button className={modeMinutes === minutes ? "selected-mode" : ""} key={minutes} onClick={() => setModeMinutes(minutes)}>
                {minutes}m
              </button>
            ))}
          </div>
          <button className="secondary-btn full-btn" onClick={addDemoSession}>+ Log completed session</button>
        </section>
      </div>

      <section className="focus-card activity-card">
        <div className="section-heading">
          <div>
            <div className="section-label">CONSISTENCY TRACKER</div>
            <h2>Study Activity</h2>
            <p className="muted">Darker squares mean more focused study time.</p>
          </div>
          <div className="legend"><span>Less</span><i className="level-0" /><i className="level-1" /><i className="level-2" /><i className="level-3" /><i className="level-4" /><span>More</span></div>
        </div>

        <div className="heatmap">
          {days.map((day) => (
            <button
              key={day.key}
              className={`heat-cell level-${activityLevel(activity[day.key])} ${selectedDate === day.key ? "selected-day" : ""}`}
              title={`${day.key} • ${formatMinutes(activity[day.key] || 0)} studied`}
              onClick={() => setSelectedDate(day.key)}
            />
          ))}
        </div>

        <div className="activity-detail">
          <div><strong>{selectedDate === todayKey ? "Today" : selectedDate}</strong><span>{formatMinutes(selectedMinutes)} studied</span></div>
          <div><strong>{totalMinutes} min</strong><span>Total tracked time</span></div>
          <div><strong>{sessions.length}</strong><span>Sessions completed</span></div>
        </div>
      </section>

      <section className="focus-card history-card">
        <div className="section-heading">
          <div>
            <div className="section-label">RECENT WORK</div>
            <h2>Session History</h2>
          </div>
          <span className="result-count">{sessions.length} sessions</span>
        </div>

        {recentSessions.length === 0 ? (
          <div className="empty-state compact">Complete a timer session and it will appear here.</div>
        ) : (
          <div className="session-list">
            {recentSessions.map((session) => (
              <div className="session-row" key={session.id}>
                <div><span className="session-icon">⏱</span><strong>{session.subject}</strong><small>{session.date} · {session.time}</small></div>
                <b>{session.duration} min</b>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default FocusZone;