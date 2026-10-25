import { useEffect, useState } from 'react';

const emptyForm = { title: '', subject: '', dueDate: '', description: '' };

export default function AssignmentForm({ assignment, onSave, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(assignment ? {
      title: assignment.title || '',
      subject: assignment.subject || '',
      dueDate: assignment.dueDate || '',
      description: assignment.description || '',
    } : emptyForm);
    setError('');
  }, [assignment]);

  function handleSubmit(event) {
    event.preventDefault();
    if (!form.title.trim() || !form.subject.trim() || !form.dueDate) {
      setError('Title, subject and due date are required.');
      return;
    }
    onSave({ ...form, title: form.title.trim(), subject: form.subject.trim() });
    setForm(emptyForm);
  }

  return (
    <form className="as-form" onSubmit={handleSubmit}>
      <div className="as-form-heading">
        <div><p className="as-eyebrow">ASSIGNMENT DETAILS</p><h3>{assignment ? 'Edit assignment' : 'Create assignment'}</h3></div>
        {onCancel && <button type="button" className="as-icon-button" onClick={onCancel} aria-label="Close form">×</button>}
      </div>
      <label>Assignment title<input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Java OOP practice" maxLength={100} /></label>
      <div className="as-form-grid">
        <label>Subject<input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Java" maxLength={60} /></label>
        <label>Due date<input type="date" value={form.dueDate} min={!assignment ? new Date().toISOString().slice(0, 10) : undefined} onChange={e => setForm({ ...form, dueDate: e.target.value })} /></label>
      </div>
      <label>Description <span className="as-muted">(optional)</span><textarea rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Add instructions or notes..." maxLength={500} /></label>
      {error && <p className="as-form-error" role="alert">{error}</p>}
      <div className="as-form-actions"><button className="as-button as-button-light" type="button" onClick={onCancel || (() => setForm(emptyForm))}>Cancel</button><button className="as-button as-button-primary" type="submit">{assignment ? 'Save changes' : 'Add assignment'}</button></div>
    </form>
  );
}
