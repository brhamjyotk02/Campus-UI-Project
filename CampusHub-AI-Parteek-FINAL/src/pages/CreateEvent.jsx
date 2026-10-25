import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEvents } from "../context/EventsContext";
import { addNotification } from "../services/notificationService";
import { todayISO, daysUntil } from "../utils/dates";

const CATEGORIES = ["Technical", "Workshop", "Cultural", "Sports", "Career"];

const EMPTY_FORM = {
  title: "",
  club: "",
  category: CATEGORIES[0],
  date: "",
  time: "",
  location: "",
  capacity: "50",
  description: "",
};

export default function CreateEvent() {
  const { addEvent } = useEvents();
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const next = {};
    if (form.title.trim().length < 4) next.title = "Give the event a clear title (4+ characters).";
    if (!form.club.trim()) next.club = "Which club or group is hosting?";
    if (!form.date) next.date = "Pick a date.";
    else if (daysUntil(form.date) < 0) next.date = "The date can't be in the past.";
    if (!form.time.trim()) next.time = "Add a time, e.g. 5:00 PM - 7:00 PM.";
    if (!form.location.trim()) next.location = "Where will it happen?";
    const capacity = Number(form.capacity);
    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 1000) {
      next.capacity = "Capacity must be a whole number between 1 and 1000.";
    }
    if (form.description.trim().length < 15) next.description = "Add a short description (15+ characters).";
    return next;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const id = `custom-${Date.now()}`;
    addEvent({
      id,
      title: form.title.trim(),
      club: form.club.trim(),
      category: form.category,
      date: form.date,
      time: form.time.trim(),
      location: form.location.trim(),
      capacity: Number(form.capacity),
      seatsTaken: 0,
      description: form.description.trim(),
      custom: true,
    });

    addNotification({
      type: "event",
      title: "Event created",
      message: `${form.title.trim()} is now listed for students.`,
      link: `/events/${id}`,
    });
    navigate(`/events/${id}`);
  }

  const field = (id, label, input) => (
    <div className="ev-field">
      <label htmlFor={id}>{label}</label>
      {input}
      {errors[id] && <p className="ev-error">{errors[id]}</p>}
    </div>
  );

  return (
    <>
      <Link to="/events" className="ev-back">
        <ArrowLeft size={14} /> Back to events
      </Link>

      <div className="ev-page-head">
        <h1>Create an event</h1>
        <p>Hosting something? Add it here and students can register right away.</p>
      </div>

      <form className="ev-form ev-form--card" onSubmit={handleSubmit} noValidate>
        {field("title", "Event title",
          <input id="title" type="text" value={form.title} onChange={(e) => handleChange("title", e.target.value)} />)}

        {field("club", "Hosted by",
          <input id="club" type="text" placeholder="e.g. Coding Club" value={form.club} onChange={(e) => handleChange("club", e.target.value)} />)}

        {field("category", "Category",
          <select id="category" value={form.category} onChange={(e) => handleChange("category", e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>)}

        <div className="ev-row">
          {field("date", "Date",
            <input id="date" type="date" min={todayISO()} value={form.date} onChange={(e) => handleChange("date", e.target.value)} />)}
          {field("time", "Time",
            <input id="time" type="text" placeholder="5:00 PM - 7:00 PM" value={form.time} onChange={(e) => handleChange("time", e.target.value)} />)}
        </div>

        {field("location", "Location",
          <input id="location" type="text" value={form.location} onChange={(e) => handleChange("location", e.target.value)} />)}

        {field("capacity", "Capacity",
          <input id="capacity" type="number" min="1" max="1000" value={form.capacity} onChange={(e) => handleChange("capacity", e.target.value)} />)}

        {field("description", "Description",
          <textarea id="description" rows={4} value={form.description} onChange={(e) => handleChange("description", e.target.value)} />)}

        <button className="ev-btn" type="submit">Publish event</button>
      </form>
    </>
  );
}
