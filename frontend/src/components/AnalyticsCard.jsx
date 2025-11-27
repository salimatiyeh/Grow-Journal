function AnalyticsCard({ activeTab, setActiveTab, renderChart }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Analytics</h2>
        <div className="tab-bar">
          <button
            type="button"
            className={`tab-button ${activeTab === 'temp' ? 'active' : ''}`}
            onClick={() => setActiveTab('temp')}
          >
            Temperature
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === 'humidity' ? 'active' : ''}`}
            onClick={() => setActiveTab('humidity')}
          >
            Humidity
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === 'vpd' ? 'active' : ''}`}
            onClick={() => setActiveTab('vpd')}
          >
            VPD
          </button>
        </div>
      </div>
      <div className="chart-panel">{renderChart()}</div>
    </div>
  );
}

export default AnalyticsCard;
