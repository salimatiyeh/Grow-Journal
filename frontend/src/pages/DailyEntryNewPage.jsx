import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client.js';

function fetchOutsideWeatherStub() {
  // TODO: replace with real weather API call later.
  return {
    outside_high_f: 95,
    outside_low_f: 72,
    humidity_percent: 55
  };
}

function DailyEntryNewPage() {
  const { growId } = useParams();
  const navigate = useNavigate();
  const [growName, setGrowName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = `${today.getMonth() + 1}`.padStart(2, '0');
    const d = `${today.getDate()}`.padStart(2, '0');
    return {
      date: `${y}-${m}-${d}`,
      temperature_f: '',
      humidity_percent: '',
      outside_high_f: '',
      outside_low_f: '',
      notes: ''
    };
  });

  useEffect(() => {
    let isMounted = true;
    async function loadGrow() {
      try {
        const grow = await api.getGrow(growId);
        if (isMounted) setGrowName(grow?.name || '');
      } catch {
        if (isMounted) setGrowName('');
      }
    }
    loadGrow();
    return () => {
      isMounted = false;
    };
  }, [growId]);

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleWeatherFill = () => {
    const stub = fetchOutsideWeatherStub();
    setFormData((prev) => ({
      ...prev,
      outside_high_f: stub.outside_high_f,
      outside_low_f: stub.outside_low_f,
      humidity_percent: stub.humidity_percent
    }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setError('');
    if (!formData.date) {
      setError('Date is required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        date: formData.date,
        temperature_f: formData.temperature_f ? Number(formData.temperature_f) : null,
        humidity_percent: formData.humidity_percent ? Number(formData.humidity_percent) : null,
        outside_high_f: formData.outside_high_f ? Number(formData.outside_high_f) : null,
        outside_low_f: formData.outside_low_f ? Number(formData.outside_low_f) : null,
        notes: formData.notes || null
      };

      await api.createDailyEntry(growId, payload);
      navigate(`/grows/${growId}`);
    } catch (err) {
      setError(err.message || 'Could not save daily entry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-stack">
      <Link to={`/grows/${growId}`} className="back-link">
        ← Back to grow
      </Link>

      <div className="panel">
        <div className="panel-header">
          <h1>New Daily Entry</h1>
          {growName && <span className="pill">{growName}</span>}
        </div>

        {error && <div className="form-error">{error}</div>}

        <form className="form-stack" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              id="date"
              name="date"
              type="date"
              className="text-input"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="temperature_f">Temperature (°F)</label>
            <input
              id="temperature_f"
              name="temperature_f"
              type="number"
              className="text-input"
              value={formData.temperature_f}
              onChange={handleChange}
              placeholder="78.5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="humidity_percent">Humidity (%)</label>
            <input
              id="humidity_percent"
              name="humidity_percent"
              type="number"
              className="text-input"
              value={formData.humidity_percent}
              onChange={handleChange}
              placeholder="60"
            />
          </div>

          <div className="form-group">
            <label htmlFor="outside_high_f">Outside High (°F)</label>
            <input
              id="outside_high_f"
              name="outside_high_f"
              type="number"
              className="text-input"
              value={formData.outside_high_f}
              onChange={handleChange}
              placeholder="95"
            />
          </div>

          <div className="form-group">
            <label htmlFor="outside_low_f">Outside Low (°F)</label>
            <input
              id="outside_low_f"
              name="outside_low_f"
              type="number"
              className="text-input"
              value={formData.outside_low_f}
              onChange={handleChange}
              placeholder="72"
            />
          </div>

          <div className="form-group">
            <button type="button" className="ghost-button" onClick={handleWeatherFill}>
              Auto-fill from weather
            </button>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              className="text-input"
              rows="4"
              placeholder="Raised light 2 inches, fed 0.75 gal, leaves slightly tacoing."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="button-row">
            <button
              type="submit"
              className="primary-button"
              disabled={submitting}
            >
              {submitting ? 'Saving…' : 'Save Entry'}
            </button>
            <Link to={`/grows/${growId}`} className="ghost-button inline-button">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DailyEntryNewPage;
