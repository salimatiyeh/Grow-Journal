import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client.js';

const waterOptions = [
  0.25, 0.5, 0.75,
  1, 1.25, 1.5, 1.75,
  2, 2.25, 2.5, 2.75,
  3, 3.25, 3.5, 3.75,
  4, 4.25, 4.5, 4.75,
  5
];

function PlantWaterEventNewPage() {
  const { growId, plantId } = useParams();
  const navigate = useNavigate();
  const [plantName, setPlantName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = `${today.getMonth() + 1}`.padStart(2, '0');
    const d = `${today.getDate()}`.padStart(2, '0');
    return {
      date: `${y}-${m}-${d}`,
      is_feed: false,
      nutrient_notes: '',
      water_amount_gal: '',
      solution_ph: ''
    };
  });

  useEffect(() => {
    let isMounted = true;
    async function loadPlant() {
      try {
        const plant = await api.getPlant(plantId);
        if (isMounted) setPlantName(plant?.name || '');
      } catch {
        if (isMounted) setPlantName('');
      }
    }
    loadPlant();
    return () => {
      isMounted = false;
    };
  }, [plantId]);

  const handleChange = (evt) => {
    const { name, type, checked, value } = evt.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setError('');
    if (!formData.water_amount_gal) {
      setError('Water amount is required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        date: formData.date,
        is_feed: formData.is_feed,
        nutrient_notes: formData.is_feed ? formData.nutrient_notes || null : null,
        water_amount_gal: formData.water_amount_gal ? Number(formData.water_amount_gal) : null,
        solution_ph: formData.solution_ph ? Number(formData.solution_ph) : null,
        even_split_total_gal: formData.water_amount_gal ? Number(formData.water_amount_gal) : null,
        plant_ids: [Number(plantId)]
      };

      await api.createWaterFeedEvent(growId, payload);
      navigate(`/grows/${growId}/plants/${plantId}`);
    } catch (err) {
      setError(err.message || 'Could not save watering entry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-stack">
      <Link to={`/grows/${growId}/plants/${plantId}`} className="back-link">
        ← Back to plant
      </Link>

      <div className="panel">
        <div className="panel-header">
          <h1>New Watering Entry</h1>
          {plantName && <span className="pill">{plantName}</span>}
        </div>

        {error && <div className="form-error">{error}</div>}

        <form className="form-stack" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="date">Date</label>
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
            <label>
              <input
                type="checkbox"
                name="is_feed"
                checked={formData.is_feed}
                onChange={handleChange}
              />{' '}
              This watering included nutrients
            </label>
          </div>

          {formData.is_feed && (
            <div className="form-group">
              <label htmlFor="nutrient_notes">Nutrients (notes)</label>
              <textarea
                id="nutrient_notes"
                name="nutrient_notes"
                className="text-input"
                rows="3"
                value={formData.nutrient_notes}
                onChange={handleChange}
                placeholder="Notes about nutrients used..."
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="water_amount_gal">Water amount (gal)</label>
            <select
              id="water_amount_gal"
              name="water_amount_gal"
              className="text-input"
              value={formData.water_amount_gal}
              onChange={handleChange}
              required
            >
              <option value="">Select amount</option>
              {waterOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt} gal
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="solution_ph">Solution pH</label>
            <input
              id="solution_ph"
              name="solution_ph"
              type="number"
              step="0.1"
              min="4"
              max="8"
              className="text-input"
              value={formData.solution_ph}
              onChange={handleChange}
              placeholder="6.5"
            />
          </div>

          <div className="button-row">
            <button type="submit" className="primary-button" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save Entry'}
            </button>
            <Link
              to={`/grows/${growId}/plants/${plantId}`}
              className="ghost-button inline-button"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PlantWaterEventNewPage;
