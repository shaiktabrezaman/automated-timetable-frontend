import React, { useState, useEffect, useCallback } from 'react';
import { WORKING_DAYS, PERIOD_DEFINITIONS, LUNCH_BREAK } from '../../data/defaultState';
import { fetchTimetableGrid, assignSlot, deleteSlot, clearSectionTimetable, fillInstitutionalActivities } from '../../api/api';
import SlotEditModal from './SlotEditModal';

export default function TimetableGrid({
  sections = [],
  selectedSectionId,
  setSelectedSectionId,
  semesters = [],
  faculty = [],
  subjects = [],
  rooms = [],
  departments = [],
  academicYears = []
}) {
  const [gridData, setGridData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Modal State for editing a slot
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSlotData, setActiveSlotData] = useState(null);

  // Load grid for selected section
  const loadGrid = useCallback(async (sectionId) => {
    if (!sectionId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTimetableGrid(sectionId);
      setGridData(data);
    } catch (err) {
      setError(err.message || 'Failed to load timetable grid.');
      setGridData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedSectionId) {
      loadGrid(selectedSectionId);
    }
  }, [selectedSectionId, loadGrid]);

  const currentSection =
    gridData?.section ||
    sections.find((s) => String(s.id) === String(selectedSectionId)) ||
    sections[0];

  const currentSemester = semesters.find(
    (sem) => String(sem.id) === String(currentSection?.semesterId)
  );

  const currentDept = departments.find(
    (d) => String(d.id) === String(currentSection?.departmentId) || (currentSection?.departmentCode && d.code === currentSection.departmentCode)
  );

  const departmentHeading = currentDept?.name
    ? `Department of ${currentDept.name}`
    : currentSection?.departmentName
      ? `Department of ${currentSection.departmentName}`
      : currentSection?.departmentCode
        ? `Department of ${currentSection.departmentCode}`
        : 'Department Timetable';

  const academicYearHeading = currentSection?.academicYearName || 'Current Academic Year';

  const sectionSlots = gridData?.slots || [];

  const handleCellClick = (day, period) => {
    const existingSlot = sectionSlots.find(
      (s) =>
        s.day === day.toUpperCase() &&
        s.periodIndex === period.index
    );

    setActiveSlotData({
      day,
      periodIndex: period.index,
      periodInfo: period,
      existingSlot
    });
    setModalOpen(true);
  };

  const handleSaveSlot = async (slotInfo) => {
    setActionSuccess(null);
    const dto = {
      sectionId: Number(selectedSectionId),
      day: slotInfo.day.toUpperCase(),
      periodIndex: Number(slotInfo.periodIndex),
      spanPeriods: Number(slotInfo.spanPeriods || 1),
      subjectId: Number(slotInfo.subjectId),
      facultyId: slotInfo.facultyId ? Number(slotInfo.facultyId) : null,
      roomId: slotInfo.roomId ? Number(slotInfo.roomId) : null,
    };

    await assignSlot(dto);
    setActionSuccess('Slot assigned successfully.');
    await loadGrid(selectedSectionId);
  };

  const handleClearSlot = async (slotId) => {
    setActionSuccess(null);
    if (slotId) {
      await deleteSlot(slotId);
      setActionSuccess('Slot removed.');
      await loadGrid(selectedSectionId);
    }
  };

  const handleClearAll = async () => {
    if (!selectedSectionId) return;
    const ok = window.confirm(
      `Are you sure you want to clear all scheduled slots for section ${currentSection?.code}? This cannot be undone.`
    );
    if (!ok) return;

    try {
      setLoading(true);
      await clearSectionTimetable(selectedSectionId);
      setActionSuccess(`All timetable slots cleared for ${currentSection?.code}.`);
      await loadGrid(selectedSectionId);
    } catch (err) {
      setError(err.message || 'Failed to clear timetable.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillActivities = async () => {
    if (!selectedSectionId) return;
    const ok = window.confirm(
      `Fill institutional activities (Library, NPTEL, Sports, Counselling, NSS/NCC) for section ${currentSection?.code}?\n\nExisting academic timetable slots will NOT be modified.`
    );
    if (!ok) return;

    try {
      setLoading(true);
      setError(null);
      setActionSuccess(null);
      await fillInstitutionalActivities(selectedSectionId);
      setActionSuccess(`12 institutional activities allocated successfully for ${currentSection?.code}.`);
      await loadGrid(selectedSectionId);
    } catch (err) {
      setError(err.message || 'Failed to fill institutional activities.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="timetable-view-wrapper">
      {/* Controls Bar */}
      <div className="timetable-controls">
        <div className="controls-left">
          <div className="selector-group">
            <label>Select Section:</label>
            <select
              className="form-control"
              style={{ fontWeight: '700', minWidth: '180px' }}
              value={selectedSectionId || ''}
              onChange={(e) => setSelectedSectionId(Number(e.target.value))}
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} ({s.name})
                </option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <strong>Semester:</strong>{' '}
            {currentSection?.semesterCode || (currentSemester ? currentSemester.name : '—')} &nbsp;|&nbsp;
            <strong>Room:</strong>{' '}
            {currentSection?.defaultRoomNumber || 'Not Set'} &nbsp;|&nbsp;
            <strong>Students:</strong> {currentSection?.studentCount || 0}
            {loading && <span style={{ marginLeft: '0.5rem', color: 'var(--primary)' }}>(Loading...)</span>}
          </div>
        </div>

        <div className="controls-right" style={{ display: 'flex', gap: '0.5rem' }}>
          {sectionSlots.length > 0 && sectionSlots.length < 42 && (
            <button
              className="btn btn-primary btn-sm"
              onClick={handleFillActivities}
              title="Fill institutional free-hour activities in empty periods"
              disabled={loading}
              style={{ fontWeight: '600' }}
            >
              ⚡ Fill Institutional Activities
            </button>
          )}
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => loadGrid(selectedSectionId)}
            title="Refresh grid data from backend"
            disabled={loading}
          >
            ↺ Refresh
          </button>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleClearAll}
            title="Clear all scheduled slots for this section"
            disabled={loading || sectionSlots.length === 0}
          >
            🗑️ Clear Schedule
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
            🖨️ Print Timetable
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && <div className="error-banner">⚠ {error}</div>}
      {actionSuccess && <div className="success-banner">✓ {actionSuccess}</div>}

      <div className="timetable-wrapper">
        {/* Institutional College Timetable Header */}
        <div className="timetable-institution-header">
          <h2>{departmentHeading}</h2>
          <p>WEEKLY CLASS & LABORATORY TIMETABLE</p>
        </div>

        <div className="timetable-meta-bar">
          <div>
            <strong>Academic Year:</strong> {academicYearHeading}
          </div>
          <div>
            <strong>Year & Semester:</strong>{' '}
            {currentSection?.semesterCode || currentSemester?.name || 'II Year I Sem'}
          </div>
          <div>
            <strong>Section:</strong>{' '}
            <span style={{ color: 'var(--primary)', fontWeight: '800' }}>
              {currentSection?.code}
            </span>
          </div>
          <div>
            <strong>Room / Hall:</strong> {currentSection?.defaultRoomNumber || 'Designated Hall'}
          </div>
          <div>
            <strong>Working Schedule:</strong> Mon – Sat (7 Periods)
          </div>
        </div>

        {/* Empty state alert if section has no slots */}
        {!loading && sectionSlots.length === 0 && (
          <div
            style={{
              padding: '1.5rem',
              textAlign: 'center',
              background: 'var(--bg-subtle)',
              borderBottom: '1px solid var(--border-color)',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem'
            }}
          >
            ℹ No timetable slots scheduled for section <strong>{currentSection?.code}</strong>.
            Click <strong>"⚡ Timetable Generator"</strong> in the navigation bar to generate automatically, or click any period cell below to assign manually.
          </div>
        )}

        {/* Scrollable Matrix Table */}
        <div className="timetable-scroll-container">
          <table className="timetable-grid-table">
            <thead>
              <tr>
                <th className="th-day">DAY / PERIOD</th>
                {PERIOD_DEFINITIONS.slice(0, 4).map((p) => (
                  <th key={p.index} className="th-period">
                    <span className="period-name">{p.label}</span>
                    <span className="period-time">{p.time}</span>
                  </th>
                ))}

                {/* Fixed Lunch Break Header */}
                <th className="th-lunch">
                  <span className="lunch-vertical-banner">{LUNCH_BREAK.label}</span>
                  <span className="lunch-time-sub">{LUNCH_BREAK.time}</span>
                </th>

                {PERIOD_DEFINITIONS.slice(4, 7).map((p) => (
                  <th key={p.index} className="th-period">
                    <span className="period-name">{p.label}</span>
                    <span className="period-time">{p.time}</span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {WORKING_DAYS.map((day) => {
                return (
                  <tr key={day}>
                    <td className="td-day-header">{day}</td>

                    {/* Periods 1 to 4 (Morning Session) */}
                    {PERIOD_DEFINITIONS.slice(0, 4).map((period) => {
                      const slot = sectionSlots.find(
                        (s) =>
                          s.day === day.toUpperCase() &&
                          s.periodIndex === period.index
                      );

                      let cellTypeClass = 'slot-empty';
                      if (slot?.subjectType) {
                        if (slot.subjectType === 'LAB') cellTypeClass = 'slot-lab';
                        else if (slot.subjectType === 'ELECTIVE') cellTypeClass = 'slot-elective';
                        else if (slot.subjectType === 'TRAINING') cellTypeClass = 'slot-training';
                        else if (slot.subjectType === 'ACTIVITY') cellTypeClass = 'slot-activity';
                        else cellTypeClass = 'slot-theory';
                      }

                      return (
                        <td
                          key={period.index}
                          className={`td-period-slot ${slot?.spanPeriods > 1 ? 'td-multi-span' : ''}`}
                          onClick={() => handleCellClick(day, period)}
                          title={
                            slot
                              ? slot.subjectType === 'ACTIVITY'
                                ? `${slot.subjectName || slot.subjectShortName} (${slot.periodIndex}) · Institutional Activity`
                                : `${slot.subjectName || slot.subjectShortName} (${slot.periodIndex}) · ${slot.facultyName || 'No Faculty'} · Room ${slot.roomNumber || '—'}`
                              : 'Click to assign or edit this period'
                          }
                        >
                          {slot ? (
                            <div className={`slot-content ${cellTypeClass}`}>
                              <div>
                                <div className="slot-title">
                                  {slot.subjectShortName || 'Subject'}
                                  {(slot.multiPeriodContinuation || slot.isMultiPeriodContinuation) && (
                                    <span style={{ fontSize: '0.65rem', opacity: 0.8, marginLeft: '0.25rem' }}>
                                      (Cont.)
                                    </span>
                                  )}
                                </div>
                                <div className="slot-code">
                                  {slot.subjectCode || slot.subjectName || ''}
                                </div>
                              </div>
                              <div className="slot-details">
                                {slot.subjectType === 'ACTIVITY' ? (
                                  <span className="slot-faculty" style={{ fontStyle: 'italic', color: '#64748b' }}>
                                    Activity
                                  </span>
                                ) : (
                                  <>
                                    <span className="slot-faculty" title={slot.facultyName}>
                                      {slot.facultyName
                                        ? slot.facultyName.split(' ').slice(0, 2).join(' ')
                                        : '—'}
                                    </span>
                                    <span className="slot-room">{slot.roomNumber || '—'}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="slot-empty">+ Assign</div>
                          )}
                        </td>
                      );
                    })}

                    {/* Fixed Lunch Break Cell */}
                    <td className="td-lunch">
                      <div className="lunch-vertical-banner">LUNCH</div>
                    </td>

                    {/* Periods 5 to 7 (Afternoon Session) */}
                    {PERIOD_DEFINITIONS.slice(4, 7).map((period) => {
                      const slot = sectionSlots.find(
                        (s) =>
                          s.day === day.toUpperCase() &&
                          s.periodIndex === period.index
                      );

                      let cellTypeClass = 'slot-empty';
                      if (slot?.subjectType) {
                        if (slot.subjectType === 'LAB') cellTypeClass = 'slot-lab';
                        else if (slot.subjectType === 'ELECTIVE') cellTypeClass = 'slot-elective';
                        else if (slot.subjectType === 'TRAINING') cellTypeClass = 'slot-training';
                        else if (slot.subjectType === 'ACTIVITY') cellTypeClass = 'slot-activity';
                        else cellTypeClass = 'slot-theory';
                      }

                      return (
                        <td
                          key={period.index}
                          className={`td-period-slot ${slot?.spanPeriods > 1 ? 'td-multi-span' : ''}`}
                          onClick={() => handleCellClick(day, period)}
                          title={
                            slot
                              ? slot.subjectType === 'ACTIVITY'
                                ? `${slot.subjectName || slot.subjectShortName} (${slot.periodIndex}) · Institutional Activity`
                                : `${slot.subjectName || slot.subjectShortName} (${slot.periodIndex}) · ${slot.facultyName || 'No Faculty'} · Room ${slot.roomNumber || '—'}`
                              : 'Click to assign or edit this period'
                          }
                        >
                          {slot ? (
                            <div className={`slot-content ${cellTypeClass}`}>
                              <div>
                                <div className="slot-title">
                                  {slot.subjectShortName || 'Subject'}
                                  {(slot.multiPeriodContinuation || slot.isMultiPeriodContinuation) && (
                                    <span style={{ fontSize: '0.65rem', opacity: 0.8, marginLeft: '0.25rem' }}>
                                      (Cont.)
                                    </span>
                                  )}
                                </div>
                                <div className="slot-code">
                                  {slot.subjectCode || slot.subjectName || ''}
                                </div>
                              </div>
                              <div className="slot-details">
                                {slot.subjectType === 'ACTIVITY' ? (
                                  <span className="slot-faculty" style={{ fontStyle: 'italic', color: '#64748b' }}>
                                    Activity
                                  </span>
                                ) : (
                                  <>
                                    <span className="slot-faculty" title={slot.facultyName}>
                                      {slot.facultyName
                                        ? slot.facultyName.split(' ').slice(0, 2).join(' ')
                                        : '—'}
                                    </span>
                                    <span className="slot-room">{slot.roomNumber || '—'}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="slot-empty">+ Assign</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Timetable Color Legend */}
        <div className="timetable-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#0284c7' }}></span>
            <span>Theory Lecture (Single Period)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#ca8a04' }}></span>
            <span>Laboratory (Continuous Multi-Period Block)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#9333ea' }}></span>
            <span>Professional Elective</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#16a34a' }}></span>
            <span>Technical Training / Skill Enhancement</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#64748b' }}></span>
            <span>Institutional Activity</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#f59e0b' }}></span>
            <span>Fixed Lunch Break (12:40 – 1:20 PM)</span>
          </div>
        </div>
      </div>

      {/* Interactive Slot Edit Modal */}
      <SlotEditModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        slotData={activeSlotData}
        subjects={subjects}
        faculty={faculty}
        rooms={rooms}
        onSaveSlot={handleSaveSlot}
        onClearSlot={handleClearSlot}
      />
    </div>
  );
}
