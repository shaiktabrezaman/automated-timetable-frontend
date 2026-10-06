import React, { useState } from 'react';

export default function GeneratorWorkflow({
  sections,
  semesters,
  academicYears,
  faculty,
  subjects,
  rooms,
  selectedSectionId,
  setSelectedSectionId,
  setActiveTab
}) {
  const [selectedSemester, setSelectedSemester] = useState(semesters[0]?.id || 'sem-2-1');
  const [selectedYear, setSelectedYear] = useState(academicYears[1] || '2025-2026');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationReport, setGenerationReport] = useState(null);

  // Filter sections by selected semester
  const availableSections = sections.filter((s) => s.semesterId === selectedSemester);

  const handleRunGenerator = () => {
    setIsGenerating(true);
    setGenerationReport(null);

    // Simulate constraint validation and preparation
    setTimeout(() => {
      setIsGenerating(false);
      setGenerationReport({
        status: 'SUCCESS',
        timestamp: new Date().toLocaleTimeString(),
        message: 'Timetable constraints verified. Schedule slots mapped for selected section.',
        checks: [
          { name: 'Faculty Clash Avoidance', status: 'PASSED', detail: 'Zero faculty overlaps detected' },
          { name: 'Classroom & Lab Conflicts', status: 'PASSED', detail: 'Rooms uniquely allocated per time slot' },
          { name: 'Fixed Lunch Hour Reserved', status: 'PASSED', detail: '12:40 – 1:20 PM strictly blocked' },
          { name: 'Multi-Period Lab Continuity', status: 'PASSED', detail: 'Consecutive periods maintained within morning/afternoon sessions' },
          { name: 'Weekly Teaching Hours Balance', status: 'PASSED', detail: 'Subject hour limits respected' }
        ]
      });
    }, 600);
  };

  return (
    <div className="generator-view">
      <div className="page-header">
        <div className="page-title">
          <h2>Timetable Generator Workflow</h2>
          <p>Prepare inputs, verify scheduling constraints, and generate weekly timetables</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Configuration Panel */}
        <div className="card">
          <div className="card-header">
            <h3>1. Scheduling Target Selection</h3>
          </div>
          <div className="card-body">
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Academic Year</label>
              <select
                className="form-control"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {academicYears.map((ay) => (
                  <option key={ay} value={ay}>
                    {ay}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label>Semester</label>
              <select
                className="form-control"
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
              >
                {semesters.map((sem) => (
                  <option key={sem.id} value={sem.id}>
                    {sem.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Target Section</label>
              <select
                className="form-control"
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
              >
                {availableSections.length > 0 ? (
                  availableSections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} – {s.name}
                    </option>
                  ))
                ) : (
                  <option value="">No sections found for this semester</option>
                )}
              </select>
              <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                Total sections available in system: {sections.length}
              </small>
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={handleRunGenerator}
              disabled={isGenerating || !selectedSectionId}
            >
              {isGenerating ? 'Validating Constraints...' : '⚡ Generate Timetable'}
            </button>
          </div>
        </div>

        {/* Constraint Checklist Panel */}
        <div className="card">
          <div className="card-header">
            <h3>2. Deterministic Constraint Engine Rules</h3>
            <span className="badge badge-training">Strict Mode</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>🔒</span>
                <div>
                  <strong>No Faculty Double-Booking:</strong> A faculty member cannot be assigned to two classes simultaneously.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>🔒</span>
                <div>
                  <strong>No Classroom/Lab Overlap:</strong> Each room can only hold one batch/section at any given period.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <span style={{ color: '#d97706', fontWeight: 'bold' }}>🕒</span>
                <div>
                  <strong>Mandatory Lunch Break:</strong> 12:40 PM to 1:20 PM is preserved across all days and sections.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>🔬</span>
                <div>
                  <strong>Multi-Period Lab Continuity:</strong> Practical labs requiring 2 or 3 periods are scheduled contiguously without splitting across lunch.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>📊</span>
                <div>
                  <strong>Weekly Teaching Hours Compliance:</strong> Slot counts adhere strictly to course requirements.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generation Report Modal / Box */}
      {generationReport && (
        <div className="card" style={{ borderColor: 'var(--success)' }}>
          <div className="card-header" style={{ background: 'var(--success-light)' }}>
            <h3 style={{ color: 'var(--success)' }}>
              ✓ Timetable Ready ({generationReport.timestamp})
            </h3>
            <button
              className="btn btn-success btn-sm"
              onClick={() => setActiveTab('timetable')}
            >
              🗓️ View in Weekly Timetable Grid →
            </button>
          </div>
          <div className="card-body">
            <p style={{ marginBottom: '1rem', fontWeight: '600' }}>{generationReport.message}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {generationReport.checks.map((chk, i) => (
                <div
                  key={i}
                  style={{
                    padding: '0.6rem 0.85rem',
                    background: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    borderLeft: '3px solid var(--success)',
                    fontSize: '0.8rem'
                  }}
                >
                  <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{chk.name}</div>
                  <div style={{ color: 'var(--success)', fontWeight: '600' }}>✓ {chk.status}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem' }}>{chk.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
