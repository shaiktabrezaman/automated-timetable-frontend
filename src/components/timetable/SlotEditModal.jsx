import React, { useState, useEffect } from 'react';

export default function SlotEditModal({
  isOpen,
  onClose,
  slotData, // { day, periodIndex, periodInfo, existingSlot }
  subjects,
  faculty,
  rooms,
  onSaveSlot,
  onClearSlot
}) {
  if (!isOpen || !slotData) return null;

  const { day, periodIndex, periodInfo, existingSlot } = slotData;

  const [selectedSubjectId, setSelectedSubjectId] = useState(existingSlot?.subjectId || '');
  const [selectedFacultyId, setSelectedFacultyId] = useState(existingSlot?.facultyId || '');
  const [selectedRoomId, setSelectedRoomId] = useState(existingSlot?.roomId || '');
  const [spanPeriods, setSpanPeriods] = useState(existingSlot?.spanPeriods || 1);

  // Auto-fill duration based on subject type when subject changes
  const handleSubjectChange = (subjectId) => {
    setSelectedSubjectId(subjectId);
    const sub = subjects.find((s) => s.id === subjectId);
    if (sub) {
      if (sub.type === 'LAB') {
        setSpanPeriods(sub.durationPeriods || 3);
      } else if (sub.type === 'TRAINING') {
        setSpanPeriods(sub.durationPeriods || 2);
      } else {
        setSpanPeriods(1);
      }
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedSubjectId) {
      onClearSlot(day, periodIndex);
      onClose();
      return;
    }

    onSaveSlot({
      day,
      periodIndex,
      subjectId: selectedSubjectId,
      facultyId: selectedFacultyId,
      roomId: selectedRoomId,
      spanPeriods: Number(spanPeriods)
    });
    onClose();
  };

  const handleClear = () => {
    onClearSlot(day, periodIndex);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>Assign Timetable Slot</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {day} · Period {periodIndex} ({periodInfo?.time})
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body">
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Course / Activity *</label>
              <select
                className="form-control"
                value={selectedSubjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
              >
                <option value="">-- No Class / Free Period --</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    [{s.type}] {s.shortName} – {s.name} ({s.code || 'No code'})
                  </option>
                ))}
              </select>
            </div>

            {selectedSubjectId && (
              <>
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Faculty In-Charge</label>
                  <select
                    className="form-control"
                    value={selectedFacultyId}
                    onChange={(e) => setSelectedFacultyId(e.target.value)}
                  >
                    <option value="">-- Unassigned --</option>
                    {faculty.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.designation})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Classroom / Laboratory</label>
                  <select
                    className="form-control"
                    value={selectedRoomId}
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                  >
                    <option value="">-- Unassigned --</option>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.type} · {r.capacity} seats)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label>Session Duration (Consecutive Periods)</label>
                  <select
                    className="form-control"
                    value={spanPeriods}
                    onChange={(e) => setSpanPeriods(e.target.value)}
                  >
                    <option value="1">1 Period (55 mins - Standard Lecture)</option>
                    <option value="2">2 Consecutive Periods (e.g. Training/Workshop)</option>
                    <option value="3">3 Consecutive Periods (Multi-Period Lab)</option>
                  </select>
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                    Note: Multi-period blocks cannot cross the 12:40 PM lunch break.
                  </small>
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            {existingSlot && (
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={handleClear}
              >
                Clear Slot
              </button>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Save Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
