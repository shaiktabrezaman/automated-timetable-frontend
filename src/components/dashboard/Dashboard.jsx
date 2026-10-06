import React from 'react';

export default function Dashboard({
  sections,
  faculty,
  subjects,
  rooms,
  slots,
  setActiveTab
}) {
  const labCount = subjects.filter((s) => s.type === 'LAB').length;
  const theoryCount = subjects.filter((s) => s.type === 'THEORY').length;
  const classroomCount = rooms.filter((r) => r.type === 'CLASSROOM').length;
  const specializedLabCount = rooms.filter((r) => r.type === 'LAB').length;

  return (
    <div className="dashboard-view">
      <div className="page-header">
        <div className="page-title">
          <h2>Department Scheduling Dashboard</h2>
          <p>Real-time metrics and timetable resource management overview</p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-primary"
            onClick={() => setActiveTab('generator')}
          >
            ⚡ Launch Timetable Generator
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-info">
            <h3>Total Sections</h3>
            <div className="metric-number">{sections.length}</div>
            <p className="metric-hint">Dynamic (e.g. ECE-A to ECE-G)</p>
          </div>
          <div className="metric-icon-box icon-blue">👥</div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <h3>Active Faculty</h3>
            <div className="metric-number">{faculty.length}</div>
            <p className="metric-hint">Professors & Instructors</p>
          </div>
          <div className="metric-icon-box icon-teal">👨‍🏫</div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <h3>Courses & Labs</h3>
            <div className="metric-number">{subjects.length}</div>
            <p className="metric-hint">{theoryCount} Theory · {labCount} Labs</p>
          </div>
          <div className="metric-icon-box icon-indigo">📚</div>
        </div>

        <div className="metric-card">
          <div className="metric-info">
            <h3>Rooms & Labs</h3>
            <div className="metric-number">{rooms.length}</div>
            <p className="metric-hint">{classroomCount} Classrooms · {specializedLabCount} Labs</p>
          </div>
          <div className="metric-icon-box icon-amber">🏛️</div>
        </div>
      </div>

      {/* System Status and Schedule Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h3>Institutional Schedule Model</h3>
            <span className="badge badge-training">Active Structure</span>
          </div>
          <div className="card-body">
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                <strong>Working Days:</strong>
                <span>Monday to Saturday (6 Days)</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                <strong>Total Daily Periods:</strong>
                <span>7 Periods (55 mins each)</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem', color: '#b45309' }}>
                <strong>Fixed Lunch Break:</strong>
                <span style={{ fontWeight: '700' }}>12:40 PM – 1:20 PM</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                <strong>Morning Session:</strong>
                <span>Periods 1 to 4 (9:00 AM – 12:40 PM)</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Afternoon Session:</strong>
                <span>Periods 5 to 7 (1:20 PM – 4:05 PM)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Multi-Section & Resource Capabilities</h3>
            <span className="badge badge-theory">System Ready</span>
          </div>
          <div className="card-body" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Dynamic Section Addition:</strong>
                <p style={{ fontSize: '0.82rem' }}>Easily add new sections from ECE-A through ECE-G or any future semester.</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Multi-Period Continuous Labs:</strong>
                <p style={{ fontSize: '0.82rem' }}>Supports 2- or 3-period continuous lab blocks without splitting across lunch.</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span>
              <div>
                <strong style={{ color: 'var(--text-primary)' }}>Elective Groups & Custom Tracks:</strong>
                <p style={{ fontSize: '0.82rem' }}>Assign different elective subjects per section or student groups.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="card">
        <div className="card-header">
          <h3>Quick Actions</h3>
        </div>
        <div className="card-body" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => setActiveTab('manage')}>
            ⚙️ Add or Edit Data (Sections, Faculty, Subjects, Rooms)
          </button>
          <button className="btn btn-secondary" onClick={() => setActiveTab('timetable')}>
            🗓️ Open Weekly Timetable Grid
          </button>
          <button className="btn btn-primary" onClick={() => setActiveTab('generator')}>
            ⚡ Run Timetable Generator Workflow
          </button>
        </div>
      </div>
    </div>
  );
}
