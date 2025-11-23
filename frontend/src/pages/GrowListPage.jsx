import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';

function GrowListPage() {
  const [grows, setGrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchGrows = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getGrows();
      setGrows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Could not load grows.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGrows();
  }, [fetchGrows]);

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <h1>Grows home</h1>
          <p className="muted">Browse all grows from the journal API.</p>
        </div>
      </div>

      {loading && (
        <div className="panel">
          <p>Loading grows...</p>
        </div>
      )}

      {error && !loading && (
        <div className="panel error-panel">
          <p>{error}</p>
          <button className="ghost-button" type="button" onClick={fetchGrows}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {grows.length === 0 ? (
            <div className="panel">
              <p>No grows yet. Start a new one when you are ready.</p>
            </div>
          ) : (
            <div className="grow-grid">
              {grows.map((grow) => (
                <Link
                  key={grow.id}
                  to={`/grows/${grow.id}`}
                  className="grow-card"
                >
                  <div className="grow-card-title">
                    {grow.name || 'Untitled grow'}
                  </div>
                  <p className="grow-card-meta">
                    {grow.strain || `ID: ${grow.id}`}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </>
      )}

      <button
        type="button"
        className="fab"
        onClick={() => navigate('/grows/new')}
        aria-label="Add a new grow"
      >
        +
      </button>
    </div>
  );
}

export default GrowListPage;
