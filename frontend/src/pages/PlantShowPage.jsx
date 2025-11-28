import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client.js';
import PlantEntryTypeModal from '../components/PlantEntryTypeModal.jsx';

function PlantShowPage() {
  const { plantId } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);

  const fetchPlant = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getPlant(plantId);
      setPlant(data);
    } catch (err) {
      setError(err.message || 'Unable to load plant.');
    } finally {
      setLoading(false);
    }
  }, [plantId]);

  useEffect(() => {
    fetchPlant();
  }, [fetchPlant]);

  if (loading) {
    return (
      <div className="page-stack">
        <Link to="/grows" className="back-link">
          ← Back
        </Link>
        <div className="panel">
          <p>Loading plant...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-stack">
        <Link to="/grows" className="back-link">
          ← Back
        </Link>
        <div className="panel error-panel">
          <p>{error}</p>
          <button className="ghost-button" type="button" onClick={fetchPlant}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!plant) return null;

  return (
    <div className="page-stack">
      <button
        type="button"
        className="back-link"
        onClick={() => navigate(-1)}
      >
        ← Back to plants
      </button>

      <div className="panel">
        <div className="panel-header">
          <h1>{plant.name || 'Unnamed plant'}</h1>
          {plant.stage && <span className="pill">{plant.stage}</span>}
        </div>
        <div className="plant-hero">
          {plant.photo_url ? (
            <img
              src={plant.photo_url}
              alt={plant.name || 'Plant photo'}
              className="plant-hero-img"
            />
          ) : (
            <div className="plant-hero-placeholder" aria-hidden="true" />
          )}
        </div>

        <div className="info-grid" style={{ marginTop: '1rem' }}>
          <div className="info-tile">
            <span className="label">Last water or feed</span>
            <strong>{plant.last_event || 'Not recorded yet'}</strong>
          </div>
          <div className="info-tile">
            <span className="label">Growth stage</span>
            <strong>{plant.stage || 'Vegetative'}</strong>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="fab fab-pill"
        onClick={() => setIsEntryModalOpen(true)}
      >
        New Entry +
      </button>

      <PlantEntryTypeModal
        isOpen={isEntryModalOpen}
        onClose={() => setIsEntryModalOpen(false)}
        onSelect={(type) => {
          console.log('Selected entry type:', type);
          setIsEntryModalOpen(false);
        }}
      />
    </div>
  );
}

export default PlantShowPage;
