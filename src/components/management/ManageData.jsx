import React, { useState } from 'react';

export default function ManageData({
  sections,
  setSections,
  faculty,
  setFaculty,
  subjects,
  setSubjects,
  rooms,
  setRooms,
  semesters,
  academicYears,
  electiveGroups,
  setElectiveGroups
}) {
  const [subTab, setSubTab] = useState('sections');

  // Form states for adding new items
  const [newSection, setNewSection] = useState({
    code: '',
    name: '',
    department: 'ECE',
    academicYear: academicYears[1] || '2025-2026',
    semesterId: semesters[0]?.id || 'sem-2-1',
    studentCount: 65,
    defaultRoomId: rooms[0]?.id || ''
  });

  const [newFaculty, setNewFaculty] = useState({
    name: '',
    designation: 'Assistant Professor',
    department: 'ECE',
    maxWeeklyHours: 18
  });

  const [newSubject, setNewSubject] = useState({
    code: '',
    name: '',
    shortName: '',
    type: 'THEORY',
    weeklyHours: 4,
    durationPeriods: 1,
    semesterId: semesters[0]?.id || 'sem-2-1'
  });

  const [newRoom, setNewRoom] = useState({
    name: '',
    type: 'CLASSROOM',
    capacity: 70,
    block: 'D-Block'
  });

  const [newElectiveGroup, setNewElectiveGroup] = useState({
    name: '',
    semesterId: semesters[2]?.id || 'sem-3-1'
  });

  // Handlers for Adding
  const handleAddSection = (e) => {
    e.preventDefault();
    if (!newSection.code || !newSection.name) return;
    const id = `sec-${Date.now()}`;
    setSections([...sections, { ...newSection, id }]);
    setNewSection({
      code: '',
      name: '',
      department: 'ECE',
      academicYear: academicYears[1] || '2025-2026',
      semesterId: semesters[0]?.id || 'sem-2-1',
      studentCount: 65,
      defaultRoomId: rooms[0]?.id || ''
    });
  };

  const handleDeleteSection = (id) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  const handleAddFaculty = (e) => {
    e.preventDefault();
    if (!newFaculty.name) return;
    const id = `fac-${Date.now()}`;
    setFaculty([...faculty, { ...newFaculty, id }]);
    setNewFaculty({
      name: '',
      designation: 'Assistant Professor',
      department: 'ECE',
      maxWeeklyHours: 18
    });
  };

  const handleDeleteFaculty = (id) => {
    setFaculty(faculty.filter((f) => f.id !== id));
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubject.name || !newSubject.shortName) return;
    const id = `sub-${Date.now()}`;
    setSubjects([...subjects, { ...newSubject, id, electiveGroupId: null }]);
    setNewSubject({
      code: '',
      name: '',
      shortName: '',
      type: 'THEORY',
      weeklyHours: 4,
      durationPeriods: 1,
      semesterId: semesters[0]?.id || 'sem-2-1'
    });
  };

  const handleDeleteSubject = (id) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const handleAddRoom = (e) => {
    e.preventDefault();
    if (!newRoom.name) return;
    const id = `room-${Date.now()}`;
    setRooms([...rooms, { ...newRoom, id }]);
    setNewRoom({
      name: '',
      type: 'CLASSROOM',
      capacity: 70,
      block: 'D-Block'
    });
  };

  const handleDeleteRoom = (id) => {
    setRooms(rooms.filter((r) => r.id !== id));
  };

  const handleAddElectiveGroup = (e) => {
    e.preventDefault();
    if (!newElectiveGroup.name) return;
    const id = `elec-${Date.now()}`;
    setElectiveGroups([...electiveGroups, { ...newElectiveGroup, id, subjectIds: [] }]);
    setNewElectiveGroup({
      name: '',
      semesterId: semesters[2]?.id || 'sem-3-1'
    });
  };

  const handleDeleteElectiveGroup = (id) => {
    setElectiveGroups(electiveGroups.filter((g) => g.id !== id));
  };

  return (
    <div className="manage-data-view">
      <div className="page-header">
        <div className="page-title">
          <h2>Institutional Data Management</h2>
          <p>Configure dynamic sections, faculty profiles, subjects/labs, rooms, and electives</p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="sub-tabs">
        <button
          className={`sub-tab-btn ${subTab === 'sections' ? 'active' : ''}`}
          onClick={() => setSubTab('sections')}
        >
          👥 Sections ({sections.length})
        </button>
        <button
          className={`sub-tab-btn ${subTab === 'faculty' ? 'active' : ''}`}
          onClick={() => setSubTab('faculty')}
        >
          👨‍🏫 Faculty ({faculty.length})
        </button>
        <button
          className={`sub-tab-btn ${subTab === 'subjects' ? 'active' : ''}`}
          onClick={() => setSubTab('subjects')}
        >
          📚 Subjects & Labs ({subjects.length})
        </button>
        <button
          className={`sub-tab-btn ${subTab === 'rooms' ? 'active' : ''}`}
          onClick={() => setSubTab('rooms')}
        >
          🏛️ Classrooms & Labs ({rooms.length})
        </button>
        <button
          className={`sub-tab-btn ${subTab === 'electives' ? 'active' : ''}`}
          onClick={() => setSubTab('electives')}
        >
          🔀 Electives ({electiveGroups.length})
        </button>
      </div>

      {/* 1. SECTIONS TAB */}
      {subTab === 'sections' && (
        <div>
          <div className="card">
            <div className="card-header">
              <h3>Add New Section</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleAddSection}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Section Code * (e.g. ECE-A, ECE-B ... ECE-G)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. ECE-A"
                      value={newSection.code}
                      onChange={(e) => setNewSection({ ...newSection, code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Full Section Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. II Year ECE Section A"
                      value={newSection.name}
                      onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Semester</label>
                    <select
                      className="form-control"
                      value={newSection.semesterId}
                      onChange={(e) => setNewSection({ ...newSection, semesterId: e.target.value })}
                    >
                      {semesters.map((sem) => (
                        <option key={sem.id} value={sem.id}>
                          {sem.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Academic Year</label>
                    <select
                      className="form-control"
                      value={newSection.academicYear}
                      onChange={(e) => setNewSection({ ...newSection, academicYear: e.target.value })}
                    >
                      {academicYears.map((ay) => (
                        <option key={ay} value={ay}>
                          {ay}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Student Count</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newSection.studentCount}
                      onChange={(e) => setNewSection({ ...newSection, studentCount: Number(e.target.value) })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Default Classroom</label>
                    <select
                      className="form-control"
                      value={newSection.defaultRoomId}
                      onChange={(e) => setNewSection({ ...newSection, defaultRoomId: e.target.value })}
                    >
                      <option value="">-- None --</option>
                      {rooms.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.type})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">
                  + Add Section
                </button>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Existing Sections ({sections.length})</h3>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Section Code</th>
                    <th>Full Name</th>
                    <th>Semester</th>
                    <th>Academic Year</th>
                    <th>Students</th>
                    <th>Default Room</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sections.map((s) => {
                    const sem = semesters.find((sm) => sm.id === s.semesterId);
                    const rm = rooms.find((r) => r.id === s.defaultRoomId);
                    return (
                      <tr key={s.id}>
                        <td><strong>{s.code}</strong></td>
                        <td>{s.name}</td>
                        <td>{sem ? sem.name : s.semesterId}</td>
                        <td>{s.academicYear}</td>
                        <td>{s.studentCount}</td>
                        <td>{rm ? rm.name : '—'}</td>
                        <td>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteSection(s.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. FACULTY TAB */}
      {subTab === 'faculty' && (
        <div>
          <div className="card">
            <div className="card-header">
              <h3>Add Faculty Member</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleAddFaculty}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Faculty Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Dr. / Prof. / Name"
                      value={newFaculty.name}
                      onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Designation</label>
                    <select
                      className="form-control"
                      value={newFaculty.designation}
                      onChange={(e) => setNewFaculty({ ...newFaculty, designation: e.target.value })}
                    >
                      <option value="Professor">Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Lecturer / Lab Assistant">Lecturer / Lab Assistant</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newFaculty.department}
                      onChange={(e) => setNewFaculty({ ...newFaculty, department: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Max Weekly Hours (Cap)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newFaculty.maxWeeklyHours}
                      onChange={(e) => setNewFaculty({ ...newFaculty, maxWeeklyHours: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">
                  + Add Faculty
                </button>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Active Faculty Directory ({faculty.length})</h3>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Faculty Name</th>
                    <th>Designation</th>
                    <th>Department</th>
                    <th>Max Hours/Week</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faculty.map((f) => (
                    <tr key={f.id}>
                      <td><strong>{f.name}</strong></td>
                      <td>{f.designation}</td>
                      <td>{f.department}</td>
                      <td>{f.maxWeeklyHours} hrs</td>
                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteFaculty(f.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. SUBJECTS & LABS TAB */}
      {subTab === 'subjects' && (
        <div>
          <div className="card">
            <div className="card-header">
              <h3>Add Course, Lab, or Institutional Activity</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleAddSubject}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Course Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Signals & Systems"
                      value={newSubject.name}
                      onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Short Code / Acronym *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. SS or DSP Lab"
                      value={newSubject.shortName}
                      onChange={(e) => setNewSubject({ ...newSubject, shortName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Official Course Code</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. EC2102"
                      value={newSubject.code}
                      onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Subject Type</label>
                    <select
                      className="form-control"
                      value={newSubject.type}
                      onChange={(e) => {
                        const t = e.target.value;
                        setNewSubject({
                          ...newSubject,
                          type: t,
                          durationPeriods: t === 'LAB' ? 3 : t === 'TRAINING' ? 2 : 1
                        });
                      }}
                    >
                      <option value="THEORY">Theory</option>
                      <option value="LAB">Lab (Multi-Period)</option>
                      <option value="ELECTIVE">Elective</option>
                      <option value="TRAINING">Technical Training / CRT</option>
                      <option value="ACTIVITY">Institutional Activity (Library/Sports)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Weekly Periods Required</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newSubject.weeklyHours}
                      onChange={(e) => setNewSubject({ ...newSubject, weeklyHours: Number(e.target.value) })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Duration in Periods per Session</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newSubject.durationPeriods}
                      onChange={(e) => setNewSubject({ ...newSubject, durationPeriods: Number(e.target.value) })}
                      min="1"
                      max="4"
                    />
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                      (1 for regular lecture, 2 or 3 for continuous multi-period lab)
                    </small>
                  </div>
                  <div className="form-group">
                    <label>Semester</label>
                    <select
                      className="form-control"
                      value={newSubject.semesterId}
                      onChange={(e) => setNewSubject({ ...newSubject, semesterId: e.target.value })}
                    >
                      {semesters.map((sem) => (
                        <option key={sem.id} value={sem.id}>
                          {sem.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">
                  + Add Course / Lab
                </button>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Courses & Laboratories ({subjects.length})</h3>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Code</th>
                    <th>Subject Name</th>
                    <th>Short Name</th>
                    <th>Weekly Periods</th>
                    <th>Session Duration</th>
                    <th>Semester</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((sub) => {
                    const sem = semesters.find((s) => s.id === sub.semesterId);
                    return (
                      <tr key={sub.id}>
                        <td>
                          <span
                            className={`badge badge-${
                              sub.type === 'THEORY'
                                ? 'theory'
                                : sub.type === 'LAB'
                                ? 'lab'
                                : sub.type === 'ELECTIVE'
                                ? 'elective'
                                : sub.type === 'TRAINING'
                                ? 'training'
                                : 'activity'
                            }`}
                          >
                            {sub.type}
                          </span>
                        </td>
                        <td>{sub.code || '—'}</td>
                        <td><strong>{sub.name}</strong></td>
                        <td>{sub.shortName}</td>
                        <td>{sub.weeklyHours} periods</td>
                        <td>{sub.durationPeriods} {sub.durationPeriods > 1 ? 'periods (Multi-Slot)' : 'period'}</td>
                        <td>{sem ? sem.name : sub.semesterId}</td>
                        <td>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteSubject(sub.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. ROOMS TAB */}
      {subTab === 'rooms' && (
        <div>
          <div className="card">
            <div className="card-header">
              <h3>Add Classroom or Specialized Lab</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleAddRoom}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Room Name / Number *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. D-201 or ECE Lab 1"
                      value={newRoom.name}
                      onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Room Type</label>
                    <select
                      className="form-control"
                      value={newRoom.type}
                      onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                    >
                      <option value="CLASSROOM">Classroom / Lecture Hall</option>
                      <option value="LAB">Specialized Laboratory</option>
                      <option value="SEMINAR_HALL">Seminar Hall</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Seating Capacity</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newRoom.capacity}
                      onChange={(e) => setNewRoom({ ...newRoom, capacity: Number(e.target.value) })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Block / Location</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. D-Block"
                      value={newRoom.block}
                      onChange={(e) => setNewRoom({ ...newRoom, block: e.target.value })}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">
                  + Add Room / Lab
                </button>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Rooms & Laboratories ({rooms.length})</h3>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Room Name</th>
                    <th>Type</th>
                    <th>Capacity</th>
                    <th>Block</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((r) => (
                    <tr key={r.id}>
                      <td><strong>{r.name}</strong></td>
                      <td>
                        <span className={`badge ${r.type === 'LAB' ? 'badge-lab' : 'badge-theory'}`}>
                          {r.type}
                        </span>
                      </td>
                      <td>{r.capacity} seats</td>
                      <td>{r.block || '—'}</td>
                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeleteRoom(r.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. ELECTIVES TAB */}
      {subTab === 'electives' && (
        <div>
          <div className="card">
            <div className="card-header">
              <h3>Add Elective Group</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleAddElectiveGroup}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Elective Group Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Professional Elective - I"
                      value={newElectiveGroup.name}
                      onChange={(e) => setNewElectiveGroup({ ...newElectiveGroup, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Semester</label>
                    <select
                      className="form-control"
                      value={newElectiveGroup.semesterId}
                      onChange={(e) => setNewElectiveGroup({ ...newElectiveGroup, semesterId: e.target.value })}
                    >
                      {semesters.map((sem) => (
                        <option key={sem.id} value={sem.id}>
                          {sem.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">
                  + Add Elective Group
                </button>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Elective Groups ({electiveGroups.length})</h3>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Group Name</th>
                    <th>Semester</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {electiveGroups.map((g) => {
                    const sem = semesters.find((s) => s.id === g.semesterId);
                    return (
                      <tr key={g.id}>
                        <td><strong>{g.name}</strong></td>
                        <td>{sem ? sem.name : g.semesterId}</td>
                        <td>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteElectiveGroup(g.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
