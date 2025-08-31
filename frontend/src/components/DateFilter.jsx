import React, { useState,useEffect } from "react";

export default function DateFilter({ startDate, endDate, onApply, onClear }) {
  // Local state for temporary selection before applying
  const [localStart, setLocalStart] = useState(startDate);
  const [localEnd, setLocalEnd] = useState(endDate);

  // Sync with props if they change
  useEffect(() => {
    setLocalStart(startDate);
    setLocalEnd(endDate);
  }, [startDate, endDate]);

  const handleApply = () => {
    onApply(localStart, localEnd);
  };

  const handleClear = () => {
    setLocalStart("");
    setLocalEnd("");
    onClear(); // resets global state
  };

  return (
    <div className="date-filter">
      <label className="df-item">
        Start Date
        <input
          type="date"
          value={localStart}
          onChange={(e) => setLocalStart(e.target.value)}
        />
      </label>

      <label className="df-item">
        End Date
        <input
          type="date"
          value={localEnd}
          onChange={(e) => setLocalEnd(e.target.value)}
        />
      </label>

      <button className="btn" onClick={handleApply}>
        Apply
      </button>

      <button className="btn btn-ghost" onClick={handleClear}>
        Clear
      </button>
    </div>
  );
}
