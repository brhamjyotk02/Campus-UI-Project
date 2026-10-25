import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { useCommunity } from "../context/CommunityContext";
import { QUESTIONS, answerQuestion } from "../data/assistantEngine";

export default function CampusAssistant() {
  const community = useCommunity();
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! I can answer from your timetable, attendance, assignments, events, clubs and complaints. Pick a question or type your own." },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef(null);

  // Keep the newest message in view.
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, thinking]);

  function ask(question) {
    const text = question.trim();
    if (!text || thinking) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setThinking(true);

    // The answer is built from the app's current data at the moment you ask.
    const reply = answerQuestion(text, {
      ready: community.ready,
      events: community.events,
      clubs: community.clubs,
      registeredIds: community.registeredIds,
      joinedClubIds: community.joinedClubIds,
      complaints: community.complaints,
      stats: community.stats,
    });

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: reply }]);
      setThinking(false);
    }, 450);
  }

  function handleSubmit(e) {
    e.preventDefault();
    ask(input);
    setInput("");
  }

  return (
    <>
      <div className="page-head">
        <h1>Campus Assistant</h1>
        <p>Quick answers pulled from the app’s own data.</p>
      </div>

      <div className="chat">
        <div className="chat-log" aria-live="polite">
          {messages.map((m, i) => (
            <div key={i} className={`bubble bubble--${m.role}`}>{m.text}</div>
          ))}
          {thinking && (
            <div className="bubble bubble--bot typing" aria-label="Assistant is typing">
              <span /><span /><span />
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="suggestions">
          {QUESTIONS.map((q) => (
            <button key={q} className="chip" onClick={() => ask(q)}>{q}</button>
          ))}
        </div>

        <form className="chat-input" onSubmit={handleSubmit}>
          <input type="text" placeholder="Type a question…" value={input} onChange={(e) => setInput(e.target.value)} aria-label="Your question" />
          <button className="send" type="submit" disabled={!input.trim() || thinking} aria-label="Send">
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
}
