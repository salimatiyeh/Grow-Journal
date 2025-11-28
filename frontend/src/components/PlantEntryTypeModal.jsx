import { useEffect } from 'react';

function PlantEntryTypeModal({ isOpen, onClose, onSelect }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0 }}>New Plant Entry</h2>
        <p className="muted">Choose what type of event you want to log for this plant.</p>
        <div className="modal-actions">
          <button
            type="button"
            className="primary-button"
            onClick={() => onSelect('water')}
          >
            Watering
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={() => onSelect('transplant')}
          >
            Transplant
          </button>
          <button
            type="button"
            className="primary-button danger-button"
            onClick={() => onSelect('harvest')}
          >
            Harvest
          </button>
        </div>
        <button type="button" className="ghost-button inline-button" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default PlantEntryTypeModal;
