import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';

function GrowNewPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    plantCount: '',
    lighting: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formData.name.trim()) nextErrors.name = 'Grow name is required.';
    if (!formData.startDate) nextErrors.startDate = 'Start date is required.';
    const count = Number(formData.plantCount);
    if (Number.isNaN(count) || count < 0) {
      nextErrors.plantCount = 'Plant count must be 0 or greater.';
    }
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setSubmitError('');
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        start_date: formData.startDate,
        plant_count: Number(formData.plantCount),
        lighting: formData.lighting.trim() || undefined,
        notes: formData.notes.trim() || undefined
      };
      const grow = await api.createGrow(payload);
      navigate(`/grows/${grow.id}`);
    } catch (err) {
      setSubmitError(err.message || 'Could not create grow.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-stack">
      <Link to="/grows" className="back-link">
        ← Back to grows
      </Link>

      <div className="panel">
        <h1>New Grow</h1>
        <p className="muted" style={{ marginBottom: '0.5rem' }}>
          Set up a new run with a start date and plant count.
        </p>

        {submitError && <div className="form-error">{submitError}</div>}

        <form className="form-stack" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="name">Grow Name *</label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              className="text-input"
              placeholder="Summer Tent Run"
              required
            />
            {errors.name && <p className="field-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="startDate">Start Date *</label>
            <input
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              type="date"
              className="text-input"
              required
            />
            {errors.startDate && (
              <p className="field-error">{errors.startDate}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="plantCount">Plant Count *</label>
            <input
              id="plantCount"
              name="plantCount"
              value={formData.plantCount}
              onChange={handleChange}
              type="number"
              min="0"
              step="1"
              className="text-input"
              required
            />
            {errors.plantCount && (
              <p className="field-error">{errors.plantCount}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lighting">Lighting</label>
            <input
              id="lighting"
              name="lighting"
              value={formData.lighting}
              onChange={handleChange}
              type="text"
              className="text-input"
              placeholder="AC Infinity Ionboard S44 @ 60%"
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="text-input"
              placeholder="Any additional context for this run..."
              rows="4"
            />
          </div>

          <div className="button-row">
            <button
              type="submit"
              className="primary-button"
              disabled={submitting}
            >
              {submitting ? 'Saving…' : 'Create Grow'}
            </button>
            <Link to="/grows" className="ghost-button inline-button">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GrowNewPage;
