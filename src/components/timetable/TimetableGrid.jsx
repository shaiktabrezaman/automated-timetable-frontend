import React, { useState } from 'react';
import { WORKING_DAYS, PERIOD_DEFINITIONS, LUNCH_BREAK } from '../../data/defaultState';
import SlotEditModal from './SlotEditModal';

export default function TimetableGrid({
  sections,
  selectedSectionId,
  setSelectedSectionId,
  semesters,
  academicYears,
  faculty,
  subjects,
  rooms,
  slots,
  setSlots
}) {
  const currentSection = sections.find((s) => s.id === selectedSectionId) || sections[0];
  const currentSemester = semesters.find((sem) => sem.id === currentSection?.semesterId);
  const defaultRoom = rooms.find((r) => r.id === currentSection?.defaultRoomId);

  // Filter slots for the current selected section
  const sectionSlots = slots.filter((slot) => slot.sectionId === currentSection?.id);

  // Modal State for editing a slot
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSlotData, setActiveSlotData] = useState(null);

  const handleCellClick = (day, period) => {
    const existingSlot = sectionSlots.find(
      (s) => s.day === day && s.periodIndex === period.index
    );

    setActiveSlotData({
      day,
      periodIndex: period.index,
      periodInfo: period,
      existingSlot
    });
    setModalOpen(true);
  };

  const handleSaveSlot = (slotInfo) => {
    // Remove any existing slot for this section, day, periodIndex
    const remainingSlots = slots.filter(
      (s) => !(s.sectionId === currentSection.id && s.day === slotInfo.day && s.periodIndex === slotInfo.periodIndex)
    );

    const span = slotInfo.spanPeriods || 1;
    const newEntries = [];

    if (span > 1) {
      // Create entries for the multi-period block
      for (let i = 0; i < span; i++) {
        const targetPeriod = slotInfo.periodIndex + i;
        if (targetPeriod <= 7) {
          newEntries.push({
            id: `slot-${Date.now()}-${i}`,
            sectionId: currentSection.id,
            day: slotInfo.day,
            periodIndex: targetPeriod,
            subjectId: slotInfo.subjectId,
            facultyId: slotInfo.facultyId,
            roomId: slotInfo.roomId,
            spanPeriods: span,
            isMultiPeriodHead: i === 0,
            isMultiPeriodContinuation: i > 0
          });
        }
      }
      // Also remove any overlapping slots within the span
      const cleaned = remainingSlots.filter(
        (s) => !(s.sectionId === currentSection.id && s.day === slotInfo.day && s.periodIndex >= slotInfo.periodIndex && s.periodIndex < slotInfo.periodIndex + span)
      );
      setSlots([...cleaned, ...newEntries]);
    } else {
      const newSlot = {
        id: `slot-${Date.now()}`,
        sectionId: currentSection.id,
        day: slotInfo.day,
        periodIndex: slotInfo.periodIndex,
        subjectId: slotInfo.subjectId,
        facultyId: slotInfo.facultyId,
        roomId: slotInfo.roomId,
        spanPeriods: 1
      };
      setSlots([...remainingSlots, newSlot]);
    }
  };

  const handleClearSlot = (day, periodIndex) => {
    setSlots(
      slots.filter(
        (s) => !(s.sectionId === currentSection?.id && s.day === day && s.periodIndex === periodIndex)
      )
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="timetable-view-wrapper">
      <div className="timetable-controls">
        <div className="controls-left">
          <div className="selector-group">
            <label>Select Section:</label>
            <select
              className="form-control"
              style={{ fontWeight: '700', minWidth: '160px' }}
              value={selectedSectionId}
              onChange={(e) => setSelectedSectionId(e.target.value)}
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} ({s.name})
                </option>
              ))}
            </select>
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            <strong>Semester:</strong> {currentSemester ? currentSemester.name : '—'} &nbsp;|&nbsp;
            <strong>Room:</strong> {defaultRoom ? defaultRoom.name : 'Not Set'} &nbsp;|&nbsp;
            <strong>Students:</strong> {currentSection?.studentCount || 0}
          </div>
        </div>

        <div className="controls-right">
          <button className="btn btn-secondary btn-sm" onClick={handlePrint}>
            🖨️ Print Timetable
          </button>
        </div>
      </div>

      <div className="timetable-wrapper">
        {/* Institutional College Timetable Header */}
        <div className="timetable-institution-header">
          <h2>Department of Electronics & Communication Engineering</h2>
          <p>WEEKLY CLASS & LABORATORY TIMETABLE</p>
        </div>

        <div className="timetable-meta-bar">
          <div><strong>Academic Year:</strong> {currentSection?.academicYear || '2025-2026'}</div>
          <div><strong>Year & Semester:</strong> {currentSemester?.name || 'II Year I Sem'}</div>
          <div><strong>Section:</strong> <span style={{ color: 'var(--primary)', fontWeight: '800' }}>{currentSection?.code}</span></div>
          <div><strong>Room / Hall:</strong> {defaultRoom ? defaultRoom.name : 'Designated Hall'}</div>
          <div><strong>Working Schedule:</strong> Mon – Sat (7 Periods)</div>
        </div>

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
                        (s) => s.day === day && s.periodIndex === period.index
                      );
                      const sub = subjects.find((s) => s.id === slot?.subjectId);
                      const fac = faculty.find((f) => f.id === slot?.facultyId);
                      const rm = rooms.find((r) => r.id === slot?.roomId);

                      let cellTypeClass = 'slot-empty';
                      if (sub) {
                        if (sub.type === 'LAB') cellTypeClass = 'slot-lab';
                        else if (sub.type === 'ELECTIVE') cellTypeClass = 'slot-elective';
                        else if (sub.type === 'TRAINING') cellTypeClass = 'slot-training';
                        else if (sub.type === 'ACTIVITY') cellTypeClass = 'slot-activity';
                        else cellTypeClass = 'slot-theory';
                      }

                      return (
                        <td
                          key={period.index}
                          className={`td-period-slot ${slot?.spanPeriods > 1 ? 'td-multi-span' : ''}`}
                          onClick={() => handleCellClick(day, period)}
                          title="Click to assign or edit this period"
                        >
                          {sub ? (
                            <div className={`slot-content ${cellTypeClass}`}>
                              <div>
                                <div className="slot-title">{sub.shortName}</div>
                                <div className="slot-code">{sub.code || sub.name}</div>
                              </div>
                              <div className="slot-details">
                                <span className="slot-faculty" title={fac?.name}>
                                  {fac ? fac.name.split(' ').slice(0, 2).join(' ') : '—'}
                                </span>
                                <span className="slot-room">{rm ? rm.name : '—'}</span>
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
                        (s) => s.day === day && s.periodIndex === period.index
                      );
                      const sub = subjects.find((s) => s.id === slot?.subjectId);
                      const fac = faculty.find((f) => f.id === slot?.facultyId);
                      const rm = rooms.find((r) => r.id === slot?.roomId);

                      let cellTypeClass = 'slot-empty';
                      if (sub) {
                        if (sub.type === 'LAB') cellTypeClass = 'slot-lab';
                        else if (sub.type === 'ELECTIVE') cellTypeClass = 'slot-elective';
                        else if (sub.type === 'TRAINING') cellTypeClass = 'slot-training';
                        else if (sub.type === 'ACTIVITY') cellTypeClass = 'slot-activity';
                        else cellTypeClass = 'slot-theory';
                      }

                      return (
                        <td
                          key={period.index}
                          className={`td-period-slot ${slot?.spanPeriods > 1 ? 'td-multi-span' : ''}`}
                          onClick={() => handleCellClick(day, period)}
                          title="Click to assign or edit this period"
                        >
                          {sub ? (
                            <div className={`slot-content ${cellTypeClass}`}>
                              <div>
                                <div className="slot-title">{sub.shortName}</div>
                                <div className="slot-code">{sub.code || sub.name}</div>
                              </div>
                              <div className="slot-details">
                                <span className="slot-faculty" title={fac?.name}>
                                  {fac ? fac.name.split(' ').slice(0, 2).join(' ') : '—'}
                                </span>
                                <span className="slot-room">{rm ? rm.name : '—'}</span>
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
            <span>Library / Sports / Mentoring</span>
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
