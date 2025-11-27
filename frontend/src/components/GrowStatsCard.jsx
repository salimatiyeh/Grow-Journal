function GrowStatsCard({ grow, lightInfo, plantCount, daysRunning, latestEntryDate, formatDisplayDate }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Grow Stats</h2>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="label">Grow Area</span>
          <strong>{grow.area_sqft ? `${grow.area_sqft} sqft` : 'Not set'}</strong>
        </div>
        <div className="stat-card">
          <span className="label">Light</span>
          <strong>{lightInfo || 'Not set'}</strong>
        </div>
        <div className="stat-card">
          <span className="label">Plant Count</span>
          <strong>{plantCount}</strong>
        </div>
        <div className="stat-card">
          <span className="label">Days Since Start</span>
          <strong>{daysRunning !== null ? daysRunning : 'Not set'}</strong>
        </div>
        <div className="stat-card">
          <span className="label">Last Daily Entry</span>
          <strong>{latestEntryDate ? formatDisplayDate(latestEntryDate) : 'No entries yet'}</strong>
        </div>
      </div>
    </div>
  );
}

export default GrowStatsCard;
