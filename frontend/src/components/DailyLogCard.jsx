function DailyLogCard({
  dayLabels,
  calendarDays,
  entriesByDate,
  selectedDate,
  setSelectedDate,
  currentMonth,
  setCurrentMonth,
  selectedEntries,
  formatDateKey,
  formatDisplayDate
}) {
  return (
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
  );
}

export default DailyLogCard;
