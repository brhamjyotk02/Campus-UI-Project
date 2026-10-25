import { useState, useEffect, useMemo } from "react";
import { CheckCircle2 } from "lucide-react";
import ComplaintCard from "../components/ComplaintCard";
import { EmptyState } from "../components/StatusViews";
import { useCommunity } from "../context/CommunityContext";
import { COMPLAINT_CATEGORIES, COMPLAINT_STATUSES } from "../data/complaintData";

const EMPTY_FORM = { category: COMPLAINT_CATEGORIES[0], location: "", description: "" };

export default function Complaints() {
  const { complaints, fileComplaint, updateComplaintStatus } = useCommunity();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [newId, setNewId] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Hide the "filed" message after a few seconds.
  useEffect(() => {
    if (!newId) return;
    const timer = setTimeout(() => setNewId(""), 4000);
    return () => clearTimeout(timer);
  }, [newId]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const found = {};
    if (!form.location.trim()) found.location = "Tell us where this is happening.";
    if (form.description.trim().length < 10) found.description = "Add a little more detail (at least 10 characters).";
    return found;
  }

  function handleSubmit(e) {
    e.preventDefault(); // stop the browser from reloading the page
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const id = fileComplaint({
      category: form.category,
      location: form.location.trim(),
      description: form.description.trim(),
    });
    setNewId(id);
    setForm(EMPTY_FORM);
  }

  const counts = useMemo(() => {
    const result = { Pending: 0, "In Progress": 0, Resolved: 0 };
    complaints.forEach((c) => {
      if (result[c.status] !== undefined) result[c.status] += 1;
    });
    return result;
  }, [complaints]);

  const visible = useMemo(
    () => (statusFilter === "All" ? complaints : complaints.filter((c) => c.status === statusFilter)),
    [complaints, statusFilter]
  );

  return (
    <>
      <div className="page-head">
        <h1>Complaints</h1>
        <p>Something not right on campus? Tell us and follow the fix.</p>
      </div>

      <div className="stat-row">
        {COMPLAINT_STATUSES.map((s) => (
          <div key={s} className="stat">
            <strong>{counts[s]}</strong>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <form className="panel form" onSubmit={handleSubmit} noValidate>
        <h2 className="section-title section-title--first">File a complaint</h2>

        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" value={form.category} onChange={(e) => handleChange("category", e.target.value)}>
            {COMPLAINT_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="location">Location</label>
          <input id="location" type="text" placeholder="e.g. Lab 4, Hostel Block C" value={form.location} onChange={(e) => handleChange("location", e.target.value)} />
          {errors.location && <p className="error">{errors.location}</p>}
        </div>

        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea id="description" rows={3} placeholder="What’s going on?" value={form.description} onChange={(e) => handleChange("description", e.target.value)} />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>

        <button className="btn" type="submit">Submit complaint</button>

        {newId && (
          <p className="success" role="status">
            <CheckCircle2 size={17} /> Filed as complaint #{newId}. We’ll keep you posted.
          </p>
        )}
      </form>

      <div className="toolbar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} aria-label="Filter by status">
          <option value="All">All statuses</option>
          {COMPLAINT_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {visible.length === 0 ? (
        <EmptyState title="Nothing here" text="No complaints match this filter." />
      ) : (
        <div className="grid">
          {visible.map((c) => (
            <ComplaintCard key={c.id} complaint={c} onStatusChange={updateComplaintStatus} />
          ))}
        </div>
      )}
    </>
  );
}
