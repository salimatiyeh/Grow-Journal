function PlantsCard({ plants, navigate, growId }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Plants</h2>
        <span className="pill">{plants.length}</span>
      </div>

      {plants.length === 0 ? (
        <p className="muted">No plants yet for this grow.</p>
      ) : (
        <div className="plant-list">
          {plants.map((plant) => (
            <button
              key={plant.id}
              type="button"
              className="plant-card plant-card-clickable"
              onClick={() => navigate(`/grows/${growId}/plants/${plant.id}`)}
            >
              {plant.photo_url ? (
                <img
                  src={plant.photo_url}
                  alt={plant.name || 'Plant photo'}
                  className="plant-card-image"
                />
              ) : (
                <div className="plant-card-image placeholder" aria-hidden="true">
                  No photo
                </div>
              )}
              <div className="plant-content">
                <div className="plant-name">
                  {plant.name || 'Unnamed plant'}
                </div>
                <p className="grow-card-meta">
                  {plant.strain || 'Strain not set'}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default PlantsCard;
