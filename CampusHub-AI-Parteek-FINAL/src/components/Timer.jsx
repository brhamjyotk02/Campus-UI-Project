import useTimer from "../hooks/useTimer";

function Timer({ minutes = 25, onComplete }) {
  const timer = useTimer(minutes * 60, onComplete);
  const mins = String(Math.floor(timer.seconds / 60)).padStart(2, "0");
  const secs = String(timer.seconds % 60).padStart(2, "0");

  return (
    <section className="focus-card timer-card">
      <div className="section-label">POMODORO FOCUS</div>
      <h2>Study Timer</h2>

      <div className="timer-ring">
        <div className="timer-display">{mins}:{secs}</div>
        <span>{timer.isRunning ? "FOCUSING" : timer.seconds === 0 ? "COMPLETED" : "READY"}</span>
      </div>

      <div className="timer-actions">
        {!timer.isRunning ? (
          <button className="primary-btn" onClick={timer.start}>▶ Start</button>
        ) : (
          <button className="secondary-btn" onClick={timer.pause}>⏸ Pause</button>
        )}
        <button className="secondary-btn" onClick={timer.reset}>↻ Reset</button>
      </div>

      <p className="muted timer-tip">Tip: finish one focused session before checking your phone.</p>
    </section>
  );
}

export default Timer;