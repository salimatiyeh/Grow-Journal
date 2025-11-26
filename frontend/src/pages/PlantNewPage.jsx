import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client.js';

const mediumOptions = ['Soil', 'Coco', 'Hydro', 'Rockwool', 'Other'];
const stageOptions = ['Seedling', 'Vegetative', 'Flower', 'Drying', 'Curing', 'Other'];

function PlantNewPage() {
  const { growId } = useParams();
  const navigate = useNavigate();
  const [growName, setGrowName] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    breeder: '',
    medium: '',
    potSizeGal: '',
    isAutoflower: false,
    sproutDate: '',
    stage: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadGrow() {
      try {
        const data = await api.getGrow(growId);
        if (isMounted) setGrowName(data?.name || '');
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
    const { name, value, type, checked } = evt.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    setError('');
    if (!formData.name.trim()) {
      setError('Plant name is required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        breeder: formData.breeder.trim() || null,
        medium: formData.medium || null,
        pot_size_gal: formData.potSizeGal ? parseFloat(formData.potSizeGal) : null,
        is_autoflower: formData.isAutoflower,
        sprout_date: formData.sproutDate || null,
        stage: formData.stage || null,
        photo: photoFile || null
      };

      await api.createPlant(growId, payload);
      navigate(`/grows/${growId}`);
    } catch (err) {
      setError(err.message || 'Could not create plant.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-stack">
      <Link to={`/grows/${growId}`} className="back-link">
        ← Back to plants
      </Link>

      <div className="panel">
        <div className="panel-header">
          <h1>Add Plant</h1>
          {growName && <span className="pill">{growName}</span>}
        </div>
        <p className="muted" style={{ marginBottom: '0.5rem' }}>
          Create a new plant for this grow.
        </p>

        {error && <div className="form-error">{error}</div>}

        <form className="form-stack" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="photo">Photo</label>
            <input
              id="photo"
              name="photo"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files && e.target.files[0];
                setPhotoFile(file || null);
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Plant name *</label>
            <input
              id="name"
              name="name"
              type="text"
              className="text-input"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Sunset Sherbet #1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="breeder">Breeder</label>
            <input
              id="breeder"
              name="breeder"
              type="text"
              className="text-input"
              value={formData.breeder}
              onChange={handleChange}
              placeholder="Barney's Farm"
            />
          </div>

          <div className="form-group">
            <label htmlFor="medium">Medium</label>
            <select
              id="medium"
              name="medium"
              className="text-input"
              value={formData.medium}
              onChange={handleChange}
            >
              <option value="">Select medium</option>
              {mediumOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="potSizeGal">Pot size (gal)</label>
            <input
              id="potSizeGal"
              name="potSizeGal"
              type="number"
              step="0.5"
              min="0"
              className="text-input"
              value={formData.potSizeGal}
              onChange={handleChange}
              placeholder="5"
            />
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="isAutoflower"
                checked={formData.isAutoflower}
                onChange={handleChange}
              />{' '}
              This plant is an autoflower
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="sproutDate">Sprout date</label>
            <input
              id="sproutDate"
              name="sproutDate"
              type="date"
              className="text-input"
              value={formData.sproutDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="stage">Stage</label>
            <select
              id="stage"
              name="stage"
              className="text-input"
              value={formData.stage}
              onChange={handleChange}
            >
              <option value="">Select stage</option>
              {stageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="button-row">
            <button
              type="submit"
              className="primary-button"
              disabled={submitting}
            >
              {submitting ? 'Saving…' : 'Save plant'}
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

export default PlantNewPage;
