import React, { useState } from 'react';
import {
  createSection, deleteSection as apiDeleteSection,
  createFaculty, deleteFaculty as apiDeleteFaculty,
  createSubject, deleteSubject as apiDeleteSubject,
  createRoom, deleteRoom as apiDeleteRoom,
  createElectiveGroup, deleteElectiveGroup as apiDeleteElectiveGroup,
} from '../../api/api';

export default function ManageData({
  sections, setSections,
  faculty, setFaculty,
  subjects, setSubjects,
  rooms, setRooms,
  electiveGroups, setElectiveGroups,
  departments,
  academicYears,
  semesters,
  onDataChanged,
}) {
  const [subTab, setSubTab] = useState('sections');
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const defaultDeptId = departments[0]?.id || '';
  const defaultAyId = academicYears[0]?.id || '';
  const defaultSemId = semesters[0]?.id || '';

  // ── Form states ──────────────────────────────────────────────────────────────
  const [newSection, setNewSection] = useState({
    code: '', name: '', studentCount: 65,
    departmentId: defaultDeptId,
    academicYearId: defaultAyId,
    semesterId: defaultSemId,
    defaultRoomId: '',
  });

  const [newFaculty, setNewFaculty] = useState({
    name: '', designation: 'Assistant Professor',
    email: '',
    maxWeeklyHours: 18,
    departmentId: defaultDeptId,
  });

  const [newSubject, setNewSubject] = useState({
    code: '', name: '', shortName: '',
    type: 'THEORY',
    departmentId: defaultDeptId,
    semesterId: defaultSemId,
    electiveGroupId: '',
  });

  const [newRoom, setNewRoom] = useState({
    roomNumber: '', type: 'CLASSROOM', capacity: 70, block: '',
  });

  const [newElectiveGroup, setNewElectiveGroup] = useState({
    name: '',
    departmentId: defaultDeptId,
    semesterId: defaultSemId,
  });

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const clearMessages = () => { setFormError(''); setFormSuccess(''); };

  const withSave = async (fn, successMsg, resetFn) => {
    clearMessages();
    setSaving(true);
    try {
      await fn();
      setFormSuccess(successMsg);
      if (resetFn) resetFn();
      await onDataChanged();
    } catch (err) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setSaving(false);
    }
  };

  // ── Sections ─────────────────────────────────────────────────────────────────
  const handleAddSection = (e) => {
    e.preventDefault();
    const dto = {
      code: newSection.code,
      name: newSection.name,
      studentCount: Number(newSection.studentCount),
      departmentId: Number(newSection.departmentId),
      academicYearId: Number(newSection.academicYearId),
      semesterId: Number(newSection.semesterId),
      defaultRoomId: newSection.defaultRoomId ? Number(newSection.defaultRoomId) : null,
    };
    withSave(() => createSection(dto), `Section "${dto.code}" added successfully.`, () =>
      setNewSection({ code: '', name: '', studentCount: 65, departmentId: defaultDeptId, academicYearId: defaultAyId, semesterId: defaultSemId, defaultRoomId: '' })
    );
  };

  const handleDeleteSection = (id) => {
    if (!window.confirm('Delete this section? This will also remove its timetable slots.')) return;
    withSave(() => apiDeleteSection(id), 'Section deleted.');
  };

  // ── Faculty ──────────────────────────────────────────────────────────────────
  const handleAddFaculty = (e) => {
    e.preventDefault();
    const dto = {
      name: newFaculty.name,
      designation: newFaculty.designation,
      email: newFaculty.email || null,
      maxWeeklyHours: Number(newFaculty.maxWeeklyHours),
      departmentId: Number(newFaculty.departmentId),
    };
    withSave(() => createFaculty(dto), `Faculty "${dto.name}" added.`, () =>
      setNewFaculty({ name: '', designation: 'Assistant Professor', email: '', maxWeeklyHours: 18, departmentId: defaultDeptId })
    );
  };

  const handleDeleteFaculty = (id) => {
    if (!window.confirm('Delete this faculty member?')) return;
    withSave(() => apiDeleteFaculty(id), 'Faculty deleted.');
  };

  // ── Subjects ─────────────────────────────────────────────────────────────────
  const handleAddSubject = (e) => {
    e.preventDefault();
    const dto = {
      code: newSubject.code || null,
      name: newSubject.name,
      shortName: newSubject.shortName,
      type: newSubject.type,
      departmentId: Number(newSubject.departmentId),
      semesterId: Number(newSubject.semesterId),
      electiveGroupId: newSubject.electiveGroupId ? Number(newSubject.electiveGroupId) : null,
    };
    withSave(() => createSubject(dto), `Subject "${dto.name}" added.`, () =>
      setNewSubject({ code: '', name: '', shortName: '', type: 'THEORY', departmentId: defaultDeptId, semesterId: defaultSemId, electiveGroupId: '' })
    );
  };

  const handleDeleteSubject = (id) => {
    if (!window.confirm('Delete this subject?')) return;
    withSave(() => apiDeleteSubject(id), 'Subject deleted.');
  };

  // ── Rooms ────────────────────────────────────────────────────────────────────
  const handleAddRoom = (e) => {
    e.preventDefault();
    const dto = {
      roomNumber: newRoom.roomNumber,
      type: newRoom.type,
      capacity: Number(newRoom.capacity),
      block: newRoom.block || null,
    };
    withSave(() => createRoom(dto), `Room "${dto.roomNumber}" added.`, () =>
      setNewRoom({ roomNumber: '', type: 'CLASSROOM', capacity: 70, block: '' })
    );
  };

  const handleDeleteRoom = (id) => {
    if (!window.confirm('Delete this room?')) return;
    withSave(() => apiDeleteRoom(id), 'Room deleted.');
  };

  // ── Elective Groups ───────────────────────────────────────────────────────────
  const handleAddElectiveGroup = (e) => {
    e.preventDefault();
    const dto = {
      name: newElectiveGroup.name,
      departmentId: Number(newElectiveGroup.departmentId),
      semesterId: Number(newElectiveGroup.semesterId),
    };
    withSave(() => createElectiveGroup(dto), `Elective group "${dto.name}" added.`, () =>
      setNewElectiveGroup({ name: '', departmentId: defaultDeptId, semesterId: defaultSemId })
    );
  };

  const handleDeleteElectiveGroup = (id) => {
    if (!window.confirm('Delete this elective group?')) return;
    withSave(() => apiDeleteElectiveGroup(id), 'Elective group deleted.');
  };

  return (
    <div className="manage-data-view">
      <div className="page-header">
        <div className="page-title">
          <h2>Institutional Data Management</h2>
          <p>Configure dynamic sections, faculty profiles, subjects/labs, rooms, and electives</p>
        </div>
      </div>

      {/* Status banners */}
      {formError && <div className="error-banner">⚠ {formError}</div>}
      {formSuccess && <div className="success-banner">✓ {formSuccess}</div>}

      {/* Sub Tabs */}
      <div className="sub-tabs">
        <button className={`sub-tab-btn ${subTab === 'sections' ? 'active' : ''}`} onClick={() => { setSubTab('sections'); clearMessages(); }}>
          👥 Sections ({sections.length})
        </button>
        <button className={`sub-tab-btn ${subTab === 'faculty' ? 'active' : ''}`} onClick={() => { setSubTab('faculty'); clearMessages(); }}>
          👨‍🏫 Faculty ({faculty.length})
        </button>
        <button className={`sub-tab-btn ${subTab === 'subjects' ? 'active' : ''}`} onClick={() => { setSubTab('subjects'); clearMessages(); }}>
          📚 Subjects &amp; Labs ({subjects.length})
        </button>
        <button className={`sub-tab-btn ${subTab === 'rooms' ? 'active' : ''}`} onClick={() => { setSubTab('rooms'); clearMessages(); }}>
          🏛️ Classrooms &amp; Labs ({rooms.length})
        </button>
        <button className={`sub-tab-btn ${subTab === 'electives' ? 'active' : ''}`} onClick={() => { setSubTab('electives'); clearMessages(); }}>
          🔀 Electives ({electiveGroups.length})
        </button>
      </div>

      {/* ─── 1. SECTIONS TAB ────────────────────────────────────────────────── */}
      {subTab === 'sections' && (
        <div>
          <div className="card">
            <div className="card-header"><h3>Add New Section</h3></div>
            <div className="card-body">
              <form onSubmit={handleAddSection}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Section Code * (e.g. ECE-A)</label>
                    <input type="text" className="form-control" placeholder="e.g. ECE-A" value={newSection.code}
                      onChange={(e) => setNewSection({ ...newSection, code: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Full Section Name *</label>
                    <input type="text" className="form-control" placeholder="e.g. III Year ECE Section A" value={newSection.name}
                      onChange={(e) => setNewSection({ ...newSection, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Department *</label>
                    <select className="form-control" value={newSection.departmentId}
                      onChange={(e) => setNewSection({ ...newSection, departmentId: e.target.value })} required>
                      <option value="">-- Select Department --</option>
                      {departments.map((d) => <option key={d.id} value={d.id}>{d.code} — {d.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Academic Year *</label>
                    <select className="form-control" value={newSection.academicYearId}
                      onChange={(e) => setNewSection({ ...newSection, academicYearId: e.target.value })} required>
                      <option value="">-- Select Year --</option>
                      {academicYears.map((ay) => <option key={ay.id} value={ay.id}>{ay.yearName}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Semester *</label>
                    <select className="form-control" value={newSection.semesterId}
                      onChange={(e) => setNewSection({ ...newSection, semesterId: e.target.value })} required>
                      <option value="">-- Select Semester --</option>
                      {semesters.map((sem) => <option key={sem.id} value={sem.id}>{sem.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Student Count</label>
                    <input type="number" className="form-control" value={newSection.studentCount}
                      onChange={(e) => setNewSection({ ...newSection, studentCount: e.target.value })} min="1" />
                  </div>
                  <div className="form-group">
                    <label>Default Classroom</label>
                    <select className="form-control" value={newSection.defaultRoomId}
                      onChange={(e) => setNewSection({ ...newSection, defaultRoomId: e.target.value })}>
                      <option value="">-- None --</option>
                      {rooms.filter((r) => r.type === 'CLASSROOM').map((r) => (
                        <option key={r.id} value={r.id}>{r.roomNumber}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : '+ Add Section'}
                </button>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3>Existing Sections ({sections.length})</h3></div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Code</th><th>Full Name</th><th>Department</th>
                    <th>Semester</th><th>Academic Year</th><th>Students</th>
                    <th>Default Room</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sections.map((s) => (
                    <tr key={s.id}>
                      <td><strong>{s.code}</strong></td>
                      <td>{s.name}</td>
                      <td>{s.departmentCode || '—'}</td>
                      <td>{s.semesterCode || '—'}</td>
                      <td>{s.academicYearName || '—'}</td>
                      <td>{s.studentCount}</td>
                      <td>{s.defaultRoomNumber || '—'}</td>
                      <td>
                        <button className="btn btn-outline-danger btn-sm" disabled={saving}
                          onClick={() => handleDeleteSection(s.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {sections.length === 0 && (
                    <tr><td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No sections found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── 2. FACULTY TAB ─────────────────────────────────────────────────── */}
      {subTab === 'faculty' && (
        <div>
          <div className="card">
            <div className="card-header"><h3>Add Faculty Member</h3></div>
            <div className="card-body">
              <form onSubmit={handleAddFaculty}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Faculty Name *</label>
                    <input type="text" className="form-control" placeholder="e.g. Dr. Priya Sharma" value={newFaculty.name}
                      onChange={(e) => setNewFaculty({ ...newFaculty, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Designation *</label>
                    <select className="form-control" value={newFaculty.designation}
                      onChange={(e) => setNewFaculty({ ...newFaculty, designation: e.target.value })}>
                      <option value="Professor">Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Lecturer / Lab Assistant">Lecturer / Lab Assistant</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Email (optional)</label>
                    <input type="email" className="form-control" placeholder="e.g. priya@college.edu" value={newFaculty.email}
                      onChange={(e) => setNewFaculty({ ...newFaculty, email: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Department *</label>
                    <select className="form-control" value={newFaculty.departmentId}
                      onChange={(e) => setNewFaculty({ ...newFaculty, departmentId: e.target.value })} required>
                      <option value="">-- Select Department --</option>
                      {departments.map((d) => <option key={d.id} value={d.id}>{d.code} — {d.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Max Weekly Hours</label>
                    <input type="number" className="form-control" value={newFaculty.maxWeeklyHours} min="1"
                      onChange={(e) => setNewFaculty({ ...newFaculty, maxWeeklyHours: e.target.value })} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : '+ Add Faculty'}
                </button>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3>Active Faculty Directory ({faculty.length})</h3></div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr><th>Name</th><th>Designation</th><th>Department</th><th>Max Hrs/Week</th><th>Email</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {faculty.map((f) => (
                    <tr key={f.id}>
                      <td><strong>{f.name}</strong></td>
                      <td>{f.designation}</td>
                      <td>{f.departmentCode || '—'}</td>
                      <td>{f.maxWeeklyHours} hrs</td>
                      <td>{f.email || '—'}</td>
                      <td>
                        <button className="btn btn-outline-danger btn-sm" disabled={saving}
                          onClick={() => handleDeleteFaculty(f.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {faculty.length === 0 && (
                    <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No faculty found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── 3. SUBJECTS TAB ────────────────────────────────────────────────── */}
      {subTab === 'subjects' && (
        <div>
          <div className="card">
            <div className="card-header"><h3>Add Course, Lab, or Institutional Activity</h3></div>
            <div className="card-body">
              <form onSubmit={handleAddSubject}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Course Title *</label>
                    <input type="text" className="form-control" placeholder="e.g. Signals & Systems" value={newSubject.name}
                      onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Short Code / Acronym *</label>
                    <input type="text" className="form-control" placeholder="e.g. SS" value={newSubject.shortName}
                      onChange={(e) => setNewSubject({ ...newSubject, shortName: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Official Course Code</label>
                    <input type="text" className="form-control" placeholder="e.g. EC3101" value={newSubject.code}
                      onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Subject Type *</label>
                    <select className="form-control" value={newSubject.type}
                      onChange={(e) => setNewSubject({ ...newSubject, type: e.target.value })}>
                      <option value="THEORY">Theory</option>
                      <option value="LAB">Lab (Multi-Period)</option>
                      <option value="ELECTIVE">Elective</option>
                      <option value="TRAINING">Technical Training / CRT</option>
                      <option value="ACTIVITY">Institutional Activity</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Department *</label>
                    <select className="form-control" value={newSubject.departmentId}
                      onChange={(e) => setNewSubject({ ...newSubject, departmentId: e.target.value })} required>
                      <option value="">-- Select Department --</option>
                      {departments.map((d) => <option key={d.id} value={d.id}>{d.code} — {d.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Semester *</label>
                    <select className="form-control" value={newSubject.semesterId}
                      onChange={(e) => setNewSubject({ ...newSubject, semesterId: e.target.value })} required>
                      <option value="">-- Select Semester --</option>
                      {semesters.map((sem) => <option key={sem.id} value={sem.id}>{sem.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Elective Group (optional)</label>
                    <select className="form-control" value={newSubject.electiveGroupId}
                      onChange={(e) => setNewSubject({ ...newSubject, electiveGroupId: e.target.value })}>
                      <option value="">-- None --</option>
                      {electiveGroups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : '+ Add Course / Lab'}
                </button>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3>Courses &amp; Laboratories ({subjects.length})</h3></div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr><th>Type</th><th>Code</th><th>Subject Name</th><th>Short Name</th><th>Semester</th><th>Dept</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {subjects.map((sub) => (
                    <tr key={sub.id}>
                      <td>
                        <span className={`badge badge-${
                          sub.type === 'THEORY' ? 'theory' : sub.type === 'LAB' ? 'lab'
                            : sub.type === 'ELECTIVE' ? 'elective' : sub.type === 'TRAINING' ? 'training' : 'activity'
                        }`}>{sub.type}</span>
                      </td>
                      <td>{sub.code || '—'}</td>
                      <td><strong>{sub.name}</strong></td>
                      <td>{sub.shortName}</td>
                      <td>{sub.semesterCode || '—'}</td>
                      <td>{sub.departmentCode || '—'}</td>
                      <td>
                        <button className="btn btn-outline-danger btn-sm" disabled={saving}
                          onClick={() => handleDeleteSubject(sub.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {subjects.length === 0 && (
                    <tr><td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No subjects found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── 4. ROOMS TAB ───────────────────────────────────────────────────── */}
      {subTab === 'rooms' && (
        <div>
          <div className="card">
            <div className="card-header"><h3>Add Classroom or Specialized Lab</h3></div>
            <div className="card-body">
              <form onSubmit={handleAddRoom}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Room Number / Name *</label>
                    <input type="text" className="form-control" placeholder="e.g. D-201 or ECE Lab 1" value={newRoom.roomNumber}
                      onChange={(e) => setNewRoom({ ...newRoom, roomNumber: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Room Type *</label>
                    <select className="form-control" value={newRoom.type}
                      onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}>
                      <option value="CLASSROOM">Classroom / Lecture Hall</option>
                      <option value="LAB">Specialized Laboratory</option>
                      <option value="SEMINAR_HALL">Seminar Hall</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Seating Capacity</label>
                    <input type="number" className="form-control" value={newRoom.capacity} min="1"
                      onChange={(e) => setNewRoom({ ...newRoom, capacity: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Block / Location</label>
                    <input type="text" className="form-control" placeholder="e.g. D-Block" value={newRoom.block}
                      onChange={(e) => setNewRoom({ ...newRoom, block: e.target.value })} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : '+ Add Room / Lab'}
                </button>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3>Rooms &amp; Laboratories ({rooms.length})</h3></div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr><th>Room Name</th><th>Type</th><th>Capacity</th><th>Block</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {rooms.map((r) => (
                    <tr key={r.id}>
                      <td><strong>{r.roomNumber}</strong></td>
                      <td>
                        <span className={`badge ${r.type === 'LAB' ? 'badge-lab' : r.type === 'SEMINAR_HALL' ? 'badge-training' : 'badge-theory'}`}>
                          {r.type}
                        </span>
                      </td>
                      <td>{r.capacity} seats</td>
                      <td>{r.block || '—'}</td>
                      <td>
                        <button className="btn btn-outline-danger btn-sm" disabled={saving}
                          onClick={() => handleDeleteRoom(r.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {rooms.length === 0 && (
                    <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No rooms found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── 5. ELECTIVES TAB ───────────────────────────────────────────────── */}
      {subTab === 'electives' && (
        <div>
          <div className="card">
            <div className="card-header"><h3>Add Elective Group</h3></div>
            <div className="card-body">
              <form onSubmit={handleAddElectiveGroup}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Elective Group Title *</label>
                    <input type="text" className="form-control" placeholder="e.g. Professional Elective - I" value={newElectiveGroup.name}
                      onChange={(e) => setNewElectiveGroup({ ...newElectiveGroup, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Department *</label>
                    <select className="form-control" value={newElectiveGroup.departmentId}
                      onChange={(e) => setNewElectiveGroup({ ...newElectiveGroup, departmentId: e.target.value })} required>
                      <option value="">-- Select Department --</option>
                      {departments.map((d) => <option key={d.id} value={d.id}>{d.code} — {d.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Semester *</label>
                    <select className="form-control" value={newElectiveGroup.semesterId}
                      onChange={(e) => setNewElectiveGroup({ ...newElectiveGroup, semesterId: e.target.value })} required>
                      <option value="">-- Select Semester --</option>
                      {semesters.map((sem) => <option key={sem.id} value={sem.id}>{sem.name}</option>)}
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : '+ Add Elective Group'}
                </button>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3>Elective Groups ({electiveGroups.length})</h3></div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr><th>Group Name</th><th>Department</th><th>Semester</th><th>Subjects</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {electiveGroups.map((g) => (
                    <tr key={g.id}>
                      <td><strong>{g.name}</strong></td>
                      <td>{g.departmentCode || '—'}</td>
                      <td>{g.semesterCode || '—'}</td>
                      <td>{g.electiveSubjects ? g.electiveSubjects.length : 0} subject(s)</td>
                      <td>
                        <button className="btn btn-outline-danger btn-sm" disabled={saving}
                          onClick={() => handleDeleteElectiveGroup(g.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {electiveGroups.length === 0 && (
                    <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No elective groups found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
