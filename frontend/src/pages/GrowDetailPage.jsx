import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { api } from '../api/client.js';

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatDateKey(dateObj) {
  const y = dateObj.getFullYear();
  const m = `${dateObj.getMonth() + 1}`.padStart(2, '0');
  const d = `${dateObj.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) return `${parts[1]}/${parts[2]}/${parts[0]}`;
  return dateStr;
}

function daysSince(dateStr) {
  if (!dateStr) return null;
  const start = new Date(dateStr);
  if (Number.isNaN(start.getTime())) return null;
  const diffMs = Date.now() - start.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

function GrowDetailPage() {
  const { growId } = useParams();
  const navigate = useNavigate();

  const [grow, setGrow] = useState(null);
  const [plants, setPlants] = useState([]);
  const [dailyEntries, setDailyEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(() => new Date());
  const [activeTab, setActiveTab] = useState('temp');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [growData, plantData, entryData] = await Promise.all([
        api.getGrow(growId),
        api.getPlants(growId),
        api.getDailyEntries(growId)
      ]);

      setGrow(growData);
      setPlants(Array.isArray(plantData) ? plantData : []);

      const entries = Array.isArray(entryData) ? entryData : [];
      setDailyEntries(entries);

      const latestDate = entries
        .map((e) => e.date)
        .filter(Boolean)
        .sort()
        .pop();
      if (latestDate) {
        setSelectedDate((prev) => prev || latestDate);
        setCurrentMonth(new Date(latestDate));
      }
    } catch (err) {
      setError(err.message || 'Unable to load grow.');
    } finally {
      setLoading(false);
    }
  }, [growId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!selectedDate) {
      const latestDate = dailyEntries
        .map((e) => e.date)
        .filter(Boolean)
        .sort()
        .pop();
      if (latestDate) {
        setSelectedDate(latestDate);
        setCurrentMonth(new Date(latestDate));
      } else {
        const today = new Date();
        setSelectedDate(formatDateKey(today));
        setCurrentMonth(today);
      }
    }
  }, [dailyEntries, selectedDate]);

  const entriesByDate = useMemo(() => {
    const map = {};
    dailyEntries.forEach((entry) => {
      if (!entry.date) return;
      const key = entry.date;
      if (!map[key]) map[key] = [];
      map[key].push(entry);
    });
    return map;
  }, [dailyEntries]);

  const sortedEntries = useMemo(() => {
    return [...dailyEntries]
      .filter((e) => e.date)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((e) => ({
        ...e,
        temperature_f:
          e.temperature_f === null || e.temperature_f === undefined
            ? null
            : Number(e.temperature_f),
        humidity_percent:
          e.humidity_percent === null || e.humidity_percent === undefined
            ? null
            : Number(e.humidity_percent),
        vpd: e.vpd === null || e.vpd === undefined ? null : Number(e.vpd),
        outside_high_f:
          e.outside_high_f === null || e.outside_high_f === undefined
            ? null
            : Number(e.outside_high_f),
        outside_low_f:
          e.outside_low_f === null || e.outside_low_f === undefined
            ? null
            : Number(e.outside_low_f)
      }));
  }, [dailyEntries]);

  const latestEntryDate = useMemo(() => {
    return dailyEntries
      .map((e) => e.date)
      .filter(Boolean)
      .sort()
      .pop();
  }, [dailyEntries]);

  const plantCount = grow?.plant_count || plants.length || 0;
  const lightInfo = [grow?.light_brand, grow?.light_model || grow?.light_type]
    .filter(Boolean)
    .join(' • ');
  const daysRunning = daysSince(grow?.start_date);

  const monthStart = useMemo(
    () => new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
    [currentMonth]
  );
  const startDay = monthStart.getDay();
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < startDay; i += 1) days.push(null);
    for (let d = 1; d <= daysInMonth; d += 1) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d));
    }
    return days;
  }, [currentMonth, daysInMonth, startDay]);

  const selectedEntries = selectedDate ? entriesByDate[selectedDate] || [] : [];

  const renderChart = () => {
    if (!sortedEntries.length) return <p className="muted">No data yet.</p>;

    if (activeTab === 'temp') {
      return (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={sortedEntries} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatDisplayDate} />
            <YAxis />
            <Tooltip formatter={(value) => (value === null ? '–' : value)} labelFormatter={formatDisplayDate} />
            <Line type="monotone" dataKey="temperature_f" stroke="#0f172a" name="Temp (°F)" />
            <Line type="monotone" dataKey="outside_high_f" stroke="#ef4444" name="Outside High" strokeDasharray="4 4" />
            <Line type="monotone" dataKey="outside_low_f" stroke="#3b82f6" name="Outside Low" strokeDasharray="4 4" />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    if (activeTab === 'humidity') {
      return (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={sortedEntries} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={formatDisplayDate} />
            <YAxis />
            <Tooltip formatter={(value) => (value === null ? '–' : value)} labelFormatter={formatDisplayDate} />
            <Line type="monotone" dataKey="humidity_percent" stroke="#10b981" name="Humidity (%)" />
          </LineChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={sortedEntries} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={formatDisplayDate} />
          <YAxis />
          <Tooltip formatter={(value) => (value === null ? '–' : value)} labelFormatter={formatDisplayDate} />
          <Line type="monotone" dataKey="vpd" stroke="#8b5cf6" name="VPD" />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  if (loading) {
    return (
      <div className="page-stack">
        <Link to="/grows" className="back-link">
          ← Back to grows
        </Link>
        <div className="panel">
          <p>Loading grow...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-stack">
        <Link to="/grows" className="back-link">
          ← Back to grows
        </Link>
        <div className="panel error-panel">
          <p>{error}</p>
          <button className="ghost-button" type="button" onClick={fetchData}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!grow) return null;

  return (
    <div className="page-stack">
      <Link to="/grows" className="back-link">
        ← Back to grows
      </Link>

      <div className="panel">
        <div className="panel-header">
          <h1>{grow.name || 'Untitled grow'}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {grow.strain && <span className="muted">Strain: {grow.strain}</span>}
            <button
              type="button"
              className="primary-button"
              onClick={() => navigate(`/grows/${growId}/plants/new`)}
            >
              Add Plant
            </button>
          </div>
        </div>
        {grow.notes && <p className="muted">{grow.notes}</p>}
      </div>

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

      <div className="panel">
        <div className="panel-header">
          <h2>Daily Log</h2>
          <div className="calendar-nav">
            <button
              type="button"
              className="ghost-button inline-button"
              onClick={() =>
                setCurrentMonth(
                  new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
                )
              }
            >
              ← Prev
            </button>
            <strong>
              {currentMonth.toLocaleString('default', { month: 'long' })}{' '}
              {currentMonth.getFullYear()}
            </strong>
            <button
              type="button"
              className="ghost-button inline-button"
              onClick={() =>
                setCurrentMonth(
                  new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
                )
              }
            >
              Next →
            </button>
          </div>
        </div>

        <div className="calendar-grid header">
          {dayLabels.map((day) => (
            <div key={day} className="calendar-cell header-cell">
              {day}
            </div>
          ))}
        </div>
        <div className="calendar-grid">
          {calendarDays.map((dateObj, idx) => {
            if (!dateObj) {
              return <div key={`empty-${idx}`} className="calendar-cell empty" />;
            }
            const dateKey = formatDateKey(dateObj);
            const hasEntry = Boolean(entriesByDate[dateKey]);
            const isSelected = selectedDate === dateKey;
            return (
              <button
                key={dateKey}
                type="button"
                className={`calendar-cell day-cell ${hasEntry ? 'has-entry' : ''} ${
                  isSelected ? 'selected' : ''
                }`}
                onClick={() => setSelectedDate(dateKey)}
              >
                <span>{dateObj.getDate()}</span>
              </button>
            );
          })}
        </div>

        <div className="day-detail">
          <h3>Day Details</h3>
          {!selectedEntries.length ? (
            <p className="muted">No entry for this date.</p>
          ) : (
            selectedEntries.map((entry) => (
              <div key={entry.id} className="day-detail-card">
                <p className="muted">{formatDisplayDate(entry.date)}</p>
                <p><strong>Temp:</strong> {entry.temperature_f ?? '–'}°F</p>
                <p><strong>Humidity:</strong> {entry.humidity_percent ?? '–'}%</p>
                <p><strong>VPD:</strong> {entry.vpd ?? '–'}</p>
                <p>
                  <strong>Outside:</strong> {entry.outside_high_f ?? '–'}° /{' '}
                  {entry.outside_low_f ?? '–'}°
                </p>
                {entry.notes && <p className="muted">{entry.notes}</p>}
              </div>
            ))
          )}
        </div>
      </div>

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

      <button
        type="button"
        className="fab fab-pill"
        onClick={() => navigate(`/grows/${growId}/daily-entry/new`)}
      >
        Daily Entry +
      </button>
    </div>
  );
}

export default GrowDetailPage;
