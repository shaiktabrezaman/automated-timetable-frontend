import React, { useState, useEffect, useCallback } from 'react';
import {
  createDepartment, updateDepartment, deleteDepartment as apiDeleteDepartment,
  createSection, updateSection, deleteSection as apiDeleteSection,
  createFaculty, updateFaculty, deleteFaculty as apiDeleteFaculty,
  createSubject, updateSubject, deleteSubject as apiDeleteSubject,
  createRoom, updateRoom, deleteRoom as apiDeleteRoom,
  createElectiveGroup, updateElectiveGroup, deleteElectiveGroup as apiDeleteElectiveGroup,
  fetchCourseOfferings, createCourseOffering, updateCourseOffering, deleteCourseOffering as apiDeleteCourseOffering,
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
  subTab: propSubTab,
  setSubTab: propSetSubTab,
  selectedOfferingSectionId: propOfferingSectionId,
  setSelectedOfferingSectionId: propSetOfferingSectionId,
}) {
  const [internalSubTab, setInternalSubTab] = useState('sections');
  const subTab = propSubTab !== undefined ? propSubTab : internalSubTab;
  const setSubTab = propSetSubTab || setInternalSubTab;
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const defaultDeptId = departments[0]?.id || '';
  const defaultAyId = academicYears[0]?.id || '';
  const defaultSemId = semesters[0]?.id || '';

  // ── Edit states ──────────────────────────────────────────────────────────────
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingFacultyId, setEditingFacultyId] = useState(null);
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editingElectiveGroupId, setEditingElectiveGroupId] = useState(null);
  const [editingOfferingId, setEditingOfferingId] = useState(null);

  // ── Form states ──────────────────────────────────────────────────────────────
  const [newDepartment, setNewDepartment] = useState({ code: '', name: '' });
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
    roomNumber: '', type: 'CLASSROOM', capacity: 70, block: '', departmentId: '',
  });

  const [newElectiveGroup, setNewElectiveGroup] = useState({
    name: '',
    departmentId: defaultDeptId,
    semesterId: defaultSemId,
  });

  // ── Course Offerings State ──────────────────────────────────────────────────
  const [internalOfferingSectionId, setInternalOfferingSectionId] = useState(sections[0]?.id || '');
  const selectedOfferingSectionId = propOfferingSectionId !== undefined && propOfferingSectionId !== null
    ? propOfferingSectionId
    : internalOfferingSectionId;
  const setSelectedOfferingSectionId = propSetOfferingSectionId || setInternalOfferingSectionId;

  const [offerings, setOfferings] = useState([]);
  const [loadingOfferings, setLoadingOfferings] = useState(false);
  const [newOffering, setNewOffering] = useState({
    sectionId: selectedOfferingSectionId || sections[0]?.id || '',
    subjectId: '',
    weeklyPeriods: 3,
    durationPeriods: 1,
    assignedFacultyId: '',
    preferredRoomId: '',
    active: true,
  });

  useEffect(() => {
    if (!selectedOfferingSectionId && sections.length > 0) {
      setSelectedOfferingSectionId(sections[0].id);
      setNewOffering((prev) => ({ ...prev, sectionId: prev.sectionId || sections[0].id }));
    }
  }, [sections, selectedOfferingSectionId, setSelectedOfferingSectionId]);

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
      const msg = err.message || 'Operation failed.';
      if (
        msg.toLowerCase().includes('foreign key') ||
        msg.toLowerCase().includes('constraint') ||
        msg.toLowerCase().includes('integrity')
      ) {
        setFormError('Cannot delete or modify record: It is currently referenced by other existing data (such as sections, faculty, subjects, or timetables). Please reassign or delete related records first.');
      } else {
        setFormError(msg);
      }
    } finally {
      setSaving(false);
    }
  };

  const cancelAllEdits = () => {
    resetDepartmentForm();
    resetSectionForm();
    resetFacultyForm();
    resetSubjectForm();
    resetRoomForm();
    resetElectiveGroupForm();
    resetOfferingForm();
    clearMessages();
  };

  // ── Sections ─────────────────────────────────────────────────────────────────
  const resetSectionForm = () => {
    setNewSection({
      code: '', name: '', studentCount: 65,
      departmentId: defaultDeptId,
      academicYearId: defaultAyId,
      semesterId: defaultSemId,
      defaultRoomId: '',
    });
    setEditingSectionId(null);
  };

  const startEditSection = (s) => {
    clearMessages();
    setEditingSectionId(s.id);
    setNewSection({
      code: s.code || '',
      name: s.name || '',
      studentCount: s.studentCount ?? 60,
      departmentId: s.departmentId || defaultDeptId,
      academicYearId: s.academicYearId || defaultAyId,
      semesterId: s.semesterId || defaultSemId,
      defaultRoomId: s.defaultRoomId || '',
    });
  };

  const handleSaveSection = (e) => {
    e.preventDefault();
    const dto = {
      code: newSection.code.trim(),
      name: newSection.name.trim(),
      studentCount: Number(newSection.studentCount),
      departmentId: Number(newSection.departmentId),
      academicYearId: Number(newSection.academicYearId),
      semesterId: Number(newSection.semesterId),
      defaultRoomId: newSection.defaultRoomId ? Number(newSection.defaultRoomId) : null,
    };
    if (editingSectionId) {
      withSave(
        () => updateSection(editingSectionId, dto),
        `Section "${dto.code}" updated successfully.`,
        resetSectionForm
      );
    } else {
      withSave(
        () => createSection(dto),
        `Section "${dto.code}" added successfully.`,
        resetSectionForm
      );
    }
  };

  const handleDeleteSection = (id) => {
    if (!window.confirm('Delete this section? This will also remove its timetable slots.')) return;
    withSave(() => apiDeleteSection(id), 'Section deleted.', () => {
      if (editingSectionId === id) resetSectionForm();
    });
  };

  // ── Faculty ──────────────────────────────────────────────────────────────────
  const resetFacultyForm = () => {
    setNewFaculty({
      name: '', designation: 'Assistant Professor',
      email: '',
      maxWeeklyHours: 18,
      departmentId: defaultDeptId,
    });
    setEditingFacultyId(null);
  };

  const startEditFaculty = (f) => {
    clearMessages();
    setEditingFacultyId(f.id);
    setNewFaculty({
      name: f.name || '',
      designation: f.designation || 'Assistant Professor',
      email: f.email || '',
      maxWeeklyHours: f.maxWeeklyHours ?? 18,
      departmentId: f.departmentId || defaultDeptId,
    });
  };

  const handleSaveFaculty = (e) => {
    e.preventDefault();
    const dto = {
      name: newFaculty.name.trim(),
      designation: newFaculty.designation.trim(),
      email: newFaculty.email ? newFaculty.email.trim() : null,
      maxWeeklyHours: Number(newFaculty.maxWeeklyHours),
      departmentId: Number(newFaculty.departmentId),
    };
    if (editingFacultyId) {
      withSave(
        () => updateFaculty(editingFacultyId, dto),
        `Faculty "${dto.name}" updated successfully.`,
        resetFacultyForm
      );
    } else {
      withSave(
        () => createFaculty(dto),
        `Faculty "${dto.name}" added.`,
        resetFacultyForm
      );
    }
  };

  const handleDeleteFaculty = (id) => {
    if (!window.confirm('Delete this faculty member?')) return;
    withSave(() => apiDeleteFaculty(id), 'Faculty deleted.', () => {
      if (editingFacultyId === id) resetFacultyForm();
    });
  };

  // ── Subjects ─────────────────────────────────────────────────────────────────
  const resetSubjectForm = () => {
    setNewSubject({
      code: '', name: '', shortName: '',
      type: 'THEORY',
      departmentId: defaultDeptId,
      semesterId: defaultSemId,
      electiveGroupId: '',
    });
    setEditingSubjectId(null);
  };

  const startEditSubject = (sub) => {
    clearMessages();
    setEditingSubjectId(sub.id);
    setNewSubject({
      code: sub.code || '',
      name: sub.name || '',
      shortName: sub.shortName || '',
      type: sub.type || 'THEORY',
      departmentId: sub.departmentId || defaultDeptId,
      semesterId: sub.semesterId || defaultSemId,
      electiveGroupId: sub.electiveGroupId || '',
    });
  };

  const handleSaveSubject = (e) => {
    e.preventDefault();
    const dto = {
      code: newSubject.code ? newSubject.code.trim() : null,
      name: newSubject.name.trim(),
      shortName: newSubject.shortName.trim(),
      type: newSubject.type,
      departmentId: Number(newSubject.departmentId),
      semesterId: Number(newSubject.semesterId),
      electiveGroupId: newSubject.electiveGroupId ? Number(newSubject.electiveGroupId) : null,
    };
    if (editingSubjectId) {
      withSave(
        () => updateSubject(editingSubjectId, dto),
        `Subject "${dto.name}" updated successfully.`,
        resetSubjectForm
      );
    } else {
      withSave(
        () => createSubject(dto),
        `Subject "${dto.name}" added.`,
        resetSubjectForm
      );
    }
  };

  const handleDeleteSubject = (id) => {
    if (!window.confirm('Delete this subject?')) return;
    withSave(() => apiDeleteSubject(id), 'Subject deleted.', () => {
      if (editingSubjectId === id) resetSubjectForm();
    });
  };

  // ── Rooms ────────────────────────────────────────────────────────────────────
  const resetRoomForm = () => {
    setNewRoom({
      roomNumber: '', type: 'CLASSROOM', capacity: 70, block: '', departmentId: '',
    });
    setEditingRoomId(null);
  };

  const startEditRoom = (r) => {
    clearMessages();
    setEditingRoomId(r.id);
    setNewRoom({
      roomNumber: r.roomNumber || '',
      type: r.type || 'CLASSROOM',
      capacity: r.capacity ?? 70,
      block: r.block || '',
      departmentId: r.departmentId || '',
    });
  };

  const handleSaveRoom = (e) => {
    e.preventDefault();
    const dto = {
      roomNumber: newRoom.roomNumber.trim(),
      type: newRoom.type,
      capacity: Number(newRoom.capacity),
      block: newRoom.block ? newRoom.block.trim() : null,
      departmentId: newRoom.departmentId ? Number(newRoom.departmentId) : null,
    };
    if (editingRoomId) {
      withSave(
        () => updateRoom(editingRoomId, dto),
        `Room "${dto.roomNumber}" updated successfully.`,
        resetRoomForm
      );
    } else {
      withSave(
        () => createRoom(dto),
        `Room "${dto.roomNumber}" added.`,
        resetRoomForm
      );
    }
  };

  const handleDeleteRoom = (id) => {
    if (!window.confirm('Delete this room?')) return;
    withSave(() => apiDeleteRoom(id), 'Room deleted.', () => {
      if (editingRoomId === id) resetRoomForm();
    });
  };

  // ── Elective Groups ───────────────────────────────────────────────────────────
  const resetElectiveGroupForm = () => {
    setNewElectiveGroup({
      name: '',
      departmentId: defaultDeptId,
      semesterId: defaultSemId,
    });
    setEditingElectiveGroupId(null);
  };

  const startEditElectiveGroup = (g) => {
    clearMessages();
    setEditingElectiveGroupId(g.id);
    setNewElectiveGroup({
      name: g.name || '',
      departmentId: g.departmentId || defaultDeptId,
      semesterId: g.semesterId || defaultSemId,
    });
  };

  const handleSaveElectiveGroup = (e) => {
    e.preventDefault();
    const dto = {
      name: newElectiveGroup.name.trim(),
      departmentId: Number(newElectiveGroup.departmentId),
      semesterId: Number(newElectiveGroup.semesterId),
    };
    if (editingElectiveGroupId) {
      withSave(
        () => updateElectiveGroup(editingElectiveGroupId, dto),
        `Elective group "${dto.name}" updated successfully.`,
        resetElectiveGroupForm
      );
    } else {
      withSave(
        () => createElectiveGroup(dto),
        `Elective group "${dto.name}" added.`,
        resetElectiveGroupForm
      );
    }
  };

  const handleDeleteElectiveGroup = (id) => {
    if (!window.confirm('Delete this elective group?')) return;
    withSave(() => apiDeleteElectiveGroup(id), 'Elective group deleted.', () => {
      if (editingElectiveGroupId === id) resetElectiveGroupForm();
    });
  };

  // ── Course Offerings ────────────────────────────────────────────────────────
  const loadOfferings = useCallback(async (secId) => {
    if (!secId) {
      setOfferings([]);
      return;
    }
    setLoadingOfferings(true);
    try {
      const data = await fetchCourseOfferings(secId);
      setOfferings(Array.isArray(data) ? data : []);
    } catch (err) {
      setFormError('Failed to load course offerings: ' + (err.message || 'Error'));
    } finally {
      setLoadingOfferings(false);
    }
  }, []);

  useEffect(() => {
    if (subTab === 'offerings' && selectedOfferingSectionId) {
      loadOfferings(selectedOfferingSectionId);
    }
  }, [subTab, selectedOfferingSectionId, loadOfferings]);

  const resetOfferingForm = (secId) => {
    const sId = secId !== undefined ? secId : selectedOfferingSectionId;
    setEditingOfferingId(null);
    setNewOffering({
      sectionId: sId || '',
      subjectId: '',
      weeklyPeriods: 3,
      durationPeriods: 1,
      assignedFacultyId: '',
      preferredRoomId: '',
      active: true,
    });
  };

  const handleOfferingSectionChange = (secId) => {
    const id = secId ? Number(secId) : '';
    setSelectedOfferingSectionId(id);
    resetOfferingForm(id);
    loadOfferings(id);
  };

  const startEditOffering = (offering) => {
    clearMessages();
    setEditingOfferingId(offering.id);
    setNewOffering({
      sectionId: offering.sectionId,
      subjectId: offering.subjectId,
      weeklyPeriods: offering.weeklyPeriods,
      durationPeriods: offering.durationPeriods,
      assignedFacultyId: offering.assignedFacultyId || '',
      preferredRoomId: offering.preferredRoomId || '',
      active: offering.active ?? true,
    });
    if (offering.sectionId !== selectedOfferingSectionId) {
      setSelectedOfferingSectionId(offering.sectionId);
    }
  };

  const handleSaveOffering = (e) => {
    e.preventDefault();
    clearMessages();

    if (!newOffering.sectionId) {
      setFormError('Section is required.');
      return;
    }
    if (!newOffering.subjectId) {
      setFormError('Subject is required.');
      return;
    }

    const weekly = Number(newOffering.weeklyPeriods);
    const duration = Number(newOffering.durationPeriods);

    if (isNaN(weekly) || weekly < 1) {
      setFormError('Weekly periods must be at least 1.');
      return;
    }
    if (isNaN(duration) || duration < 1) {
      setFormError('Consecutive periods per session must be at least 1.');
      return;
    }
    if (weekly < duration || (weekly % duration !== 0)) {
      setFormError(`Weekly periods (${weekly}) must be greater than or equal to consecutive periods (${duration}) and divisible by consecutive periods.`);
      return;
    }

    // Check duplicate on create
    if (!editingOfferingId) {
      const isDuplicate = offerings.some(
        (o) => Number(o.subjectId) === Number(newOffering.subjectId) && Number(o.sectionId) === Number(newOffering.sectionId)
      );
      if (isDuplicate) {
        const sub = subjects.find((s) => s.id === Number(newOffering.subjectId));
        setFormError(`Course offering for "${sub ? sub.name : 'this subject'}" already exists for this section. Edit the existing record instead.`);
        return;
      }
    }

    const dto = {
      sectionId: Number(newOffering.sectionId),
      subjectId: Number(newOffering.subjectId),
      weeklyPeriods: weekly,
      durationPeriods: duration,
      assignedFacultyId: newOffering.assignedFacultyId ? Number(newOffering.assignedFacultyId) : null,
      preferredRoomId: newOffering.preferredRoomId ? Number(newOffering.preferredRoomId) : null,
      active: Boolean(newOffering.active),
    };

    if (editingOfferingId) {
      withSave(
        () => updateCourseOffering(editingOfferingId, dto),
        'Course offering updated successfully.',
        () => {
          resetOfferingForm(dto.sectionId);
          loadOfferings(dto.sectionId);
        }
      );
    } else {
      withSave(
        () => createCourseOffering(dto),
        'Course offering added successfully.',
        () => {
          resetOfferingForm(dto.sectionId);
          loadOfferings(dto.sectionId);
        }
      );
    }
  };

  const handleDeleteOffering = (id) => {
    if (!window.confirm('Delete this course offering?')) return;
    withSave(
      () => apiDeleteCourseOffering(id),
      'Course offering deleted successfully.',
      () => {
        if (editingOfferingId === id) resetOfferingForm();
        loadOfferings(selectedOfferingSectionId);
      }
    );
  };

  // ── Departments ──────────────────────────────────────────────────────────────
  const resetDepartmentForm = () => {
    setNewDepartment({ code: '', name: '' });
    setEditingDepartmentId(null);
  };

  const startEditDepartment = (d) => {
    clearMessages();
    setEditingDepartmentId(d.id);
    setNewDepartment({
      code: d.code || '',
      name: d.name || '',
    });
  };

  const handleSaveDepartment = (e) => {
    e.preventDefault();
    const code = newDepartment.code.trim().toUpperCase();
    const name = newDepartment.name.trim();
    if (!code) {
      setFormError('Department code is required.');
      return;
    }
    if (!name) {
      setFormError('Department name is required.');
      return;
    }
    const dto = { code, name };
    if (editingDepartmentId) {
      withSave(
        () => updateDepartment(editingDepartmentId, dto),
        `Department "${dto.code}" updated successfully.`,
        resetDepartmentForm
      );
    } else {
      withSave(
        () => createDepartment(dto),
        `Department "${dto.code}" added successfully.`,
        resetDepartmentForm
      );
    }
  };

  const handleDeleteDepartment = (id, code) => {
    if (!window.confirm(`Delete department "${code || id}"? Note: Deletion will be rejected if sections, faculty, or subjects are assigned to this department.`)) return;
    withSave(
      () => apiDeleteDepartment(id),
      `Department "${code || id}" deleted successfully.`,
      () => {
        if (editingDepartmentId === id) resetDepartmentForm();
      }
    );
  };

  return (
    <div className="manage-data-view">
      <div className="page-header">
        <div className="page-title">
          <h2>Institutional Data Management</h2>
          <p>Configure dynamic departments, sections, faculty profiles, subjects/labs, rooms, and electives</p>
        </div>
      </div>

      {/* Status banners */}
      {formError && <div className="error-banner">⚠ {formError}</div>}
      {formSuccess && <div className="success-banner">✓ {formSuccess}</div>}

      {/* Sub Tabs */}
      <div className="sub-tabs">
        <button className={`sub-tab-btn ${subTab === 'departments' ? 'active' : ''}`} onClick={() => { setSubTab('departments'); cancelAllEdits(); }}>
          🏢 Departments ({departments.length})
        </button>
        <button className={`sub-tab-btn ${subTab === 'sections' ? 'active' : ''}`} onClick={() => { setSubTab('sections'); cancelAllEdits(); }}>
          👥 Sections ({sections.length})
        </button>
        <button className={`sub-tab-btn ${subTab === 'faculty' ? 'active' : ''}`} onClick={() => { setSubTab('faculty'); cancelAllEdits(); }}>
          👨‍🏫 Faculty ({faculty.length})
        </button>
        <button className={`sub-tab-btn ${subTab === 'subjects' ? 'active' : ''}`} onClick={() => { setSubTab('subjects'); cancelAllEdits(); }}>
          📚 Subjects &amp; Labs ({subjects.length})
        </button>
        <button className={`sub-tab-btn ${subTab === 'rooms' ? 'active' : ''}`} onClick={() => { setSubTab('rooms'); cancelAllEdits(); }}>
          🏛️ Classrooms &amp; Labs ({rooms.length})
        </button>
        <button className={`sub-tab-btn ${subTab === 'electives' ? 'active' : ''}`} onClick={() => { setSubTab('electives'); cancelAllEdits(); }}>
          🔀 Electives ({electiveGroups.length})
        </button>
        <button className={`sub-tab-btn ${subTab === 'offerings' ? 'active' : ''}`} onClick={() => { setSubTab('offerings'); cancelAllEdits(); }}>
          📋 Course Offerings
        </button>
      </div>

      {/* ─── DEPARTMENTS TAB ─────────────────────────────────────────────────── */}
      {subTab === 'departments' && (
        <div>
          <div className="card">
            <div className="card-header">
              <h3>{editingDepartmentId ? '✏️ Edit Department' : 'Add New Department'}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSaveDepartment}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Department Code * (e.g. CSE, ECE, MECH)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. CSE"
                      maxLength={20}
                      value={newDepartment.code}
                      onChange={(e) => setNewDepartment({ ...newDepartment, code: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Department Full Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Computer Science and Engineering"
                      maxLength={100}
                      value={newDepartment.name}
                      onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '1rem' }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : editingDepartmentId ? '✓ Save Changes' : '+ Add Department'}
                  </button>
                  {editingDepartmentId && (
                    <button type="button" className="btn btn-secondary" disabled={saving} onClick={resetDepartmentForm}>
                      ✕ Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Existing Departments ({departments.length})</h3>
            </div>
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: '140px' }}>Code</th>
                    <th>Full Department Name</th>
                    <th style={{ width: '160px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((d) => (
                    <tr key={d.id}>
                      <td><strong>{d.code}</strong></td>
                      <td>{d.name}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          style={{ marginRight: '0.4rem' }}
                          disabled={saving}
                          onClick={() => startEditDepartment(d)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          disabled={saving}
                          onClick={() => handleDeleteDepartment(d.id, d.code)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {departments.length === 0 && (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>
                        No departments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── 1. SECTIONS TAB ────────────────────────────────────────────────── */}
      {subTab === 'sections' && (
        <div>
          <div className="card">
            <div className="card-header">
              <h3>{editingSectionId ? '✏️ Edit Section' : 'Add New Section'}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSaveSection}>
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
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : editingSectionId ? '✓ Save Changes' : '+ Add Section'}
                  </button>
                  {editingSectionId && (
                    <button type="button" className="btn btn-secondary" disabled={saving} onClick={resetSectionForm}>
                      ✕ Cancel
                    </button>
                  )}
                </div>
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
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <button className="btn btn-outline-primary btn-sm" style={{ marginRight: '0.4rem' }} disabled={saving}
                          onClick={() => startEditSection(s)}>Edit</button>
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
            <div className="card-header">
              <h3>{editingFacultyId ? '✏️ Edit Faculty Member' : 'Add Faculty Member'}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSaveFaculty}>
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
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : editingFacultyId ? '✓ Save Changes' : '+ Add Faculty'}
                  </button>
                  {editingFacultyId && (
                    <button type="button" className="btn btn-secondary" disabled={saving} onClick={resetFacultyForm}>
                      ✕ Cancel
                    </button>
                  )}
                </div>
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
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <button className="btn btn-outline-primary btn-sm" style={{ marginRight: '0.4rem' }} disabled={saving}
                          onClick={() => startEditFaculty(f)}>Edit</button>
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
            <div className="card-header">
              <h3>{editingSubjectId ? '✏️ Edit Course, Lab, or Institutional Activity' : 'Add Course, Lab, or Institutional Activity'}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSaveSubject}>
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
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : editingSubjectId ? '✓ Save Changes' : '+ Add Course / Lab'}
                  </button>
                  {editingSubjectId && (
                    <button type="button" className="btn btn-secondary" disabled={saving} onClick={resetSubjectForm}>
                      ✕ Cancel
                    </button>
                  )}
                </div>
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
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <button className="btn btn-outline-primary btn-sm" style={{ marginRight: '0.4rem' }} disabled={saving}
                          onClick={() => startEditSubject(sub)}>Edit</button>
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
            <div className="card-header">
              <h3>{editingRoomId ? '✏️ Edit Classroom or Specialized Lab' : 'Add Classroom or Specialized Lab'}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSaveRoom}>
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
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : editingRoomId ? '✓ Save Changes' : '+ Add Room / Lab'}
                  </button>
                  {editingRoomId && (
                    <button type="button" className="btn btn-secondary" disabled={saving} onClick={resetRoomForm}>
                      ✕ Cancel
                    </button>
                  )}
                </div>
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
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <button className="btn btn-outline-primary btn-sm" style={{ marginRight: '0.4rem' }} disabled={saving}
                          onClick={() => startEditRoom(r)}>Edit</button>
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
            <div className="card-header">
              <h3>{editingElectiveGroupId ? '✏️ Edit Elective Group' : 'Add Elective Group'}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSaveElectiveGroup}>
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
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : editingElectiveGroupId ? '✓ Save Changes' : '+ Add Elective Group'}
                  </button>
                  {editingElectiveGroupId && (
                    <button type="button" className="btn btn-secondary" disabled={saving} onClick={resetElectiveGroupForm}>
                      ✕ Cancel
                    </button>
                  )}
                </div>
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
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <button className="btn btn-outline-primary btn-sm" style={{ marginRight: '0.4rem' }} disabled={saving}
                          onClick={() => startEditElectiveGroup(g)}>Edit</button>
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

      {/* ─── 6. COURSE OFFERINGS TAB ────────────────────────────────────────── */}
      {subTab === 'offerings' && (
        <div>
          {/* Add / Edit Form Card */}
          <div className="card">
            <div className="card-header">
              <h3>{editingOfferingId ? '✏️ Edit Course Offering' : 'Add Course Offering'}</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSaveOffering}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Target Section *</label>
                    <select
                      className="form-control"
                      value={newOffering.sectionId}
                      onChange={(e) => {
                        const secId = Number(e.target.value);
                        setNewOffering({ ...newOffering, sectionId: secId });
                        if (!editingOfferingId && secId !== selectedOfferingSectionId) {
                          setSelectedOfferingSectionId(secId);
                          loadOfferings(secId);
                        }
                      }}
                      required
                    >
                      <option value="">-- Select Section --</option>
                      {sections.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.code} — {s.name} ({s.semesterCode || 'Semester'})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Subject / Laboratory *</label>
                    <select
                      className="form-control"
                      value={newOffering.subjectId}
                      onChange={(e) => {
                        const subId = Number(e.target.value);
                        const selectedSub = subjects.find((s) => s.id === subId);
                        let defaultWeekly = newOffering.weeklyPeriods;
                        let defaultDuration = newOffering.durationPeriods;
                        if (selectedSub && !editingOfferingId) {
                          if (selectedSub.type === 'LAB' || selectedSub.type === 'ACTIVITY') {
                            defaultWeekly = 3;
                            defaultDuration = 3;
                          } else {
                            defaultWeekly = 3;
                            defaultDuration = 1;
                          }
                        }
                        setNewOffering({
                          ...newOffering,
                          subjectId: subId,
                          weeklyPeriods: defaultWeekly,
                          durationPeriods: defaultDuration,
                        });
                      }}
                      required
                    >
                      <option value="">-- Select Subject --</option>
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.code ? `${s.code} — ` : ''}{s.name} ({s.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Weekly Periods *</label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      max="30"
                      value={newOffering.weeklyPeriods}
                      onChange={(e) => setNewOffering({ ...newOffering, weeklyPeriods: e.target.value })}
                      required
                    />
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      Total periods per week (must be divisible by session duration)
                    </small>
                  </div>

                  <div className="form-group">
                    <label>Consecutive Periods Per Session *</label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      max="7"
                      value={newOffering.durationPeriods}
                      onChange={(e) => setNewOffering({ ...newOffering, durationPeriods: e.target.value })}
                      required
                    />
                    <small style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                      Session duration (e.g. 1 for theory, 2 or 3 for lab)
                    </small>
                  </div>

                  <div className="form-group">
                    <label>Assigned Faculty (optional)</label>
                    <select
                      className="form-control"
                      value={newOffering.assignedFacultyId}
                      onChange={(e) => setNewOffering({ ...newOffering, assignedFacultyId: e.target.value })}
                    >
                      <option value="">-- Unassigned / None --</option>
                      {faculty.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} ({f.designation || 'Faculty'}) — Max: {f.maxWeeklyHours || 18}h
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Preferred Room (optional)</label>
                    <select
                      className="form-control"
                      value={newOffering.preferredRoomId}
                      onChange={(e) => setNewOffering({ ...newOffering, preferredRoomId: e.target.value })}
                    >
                      <option value="">-- None (Auto-assign / Section Default) --</option>
                      {rooms.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.roomNumber} ({r.type}, Cap: {r.capacity})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '0.75rem', marginBottom: '1.25rem' }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                    <input
                      type="checkbox"
                      checked={newOffering.active}
                      onChange={(e) => setNewOffering({ ...newOffering, active: e.target.checked })}
                    />
                    <span>Active in timetable generator scheduling</span>
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Saving…' : editingOfferingId ? '✓ Save Changes' : '+ Add Course Offering'}
                  </button>
                  {editingOfferingId && (
                    <button type="button" className="btn btn-secondary" disabled={saving} onClick={() => resetOfferingForm()}>
                      ✕ Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Existing Offerings Table Card */}
          <div className="card">
            <div
              className="card-header"
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}
            >
              <div>
                <h3 style={{ margin: 0 }}>
                  Course Offerings for Section ({offerings.length})
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Total scheduled periods: <strong>{offerings.reduce((sum, o) => sum + (o.weeklyPeriods || 0), 0)}</strong>
                  {offerings.reduce((sum, o) => sum + (o.weeklyPeriods || 0), 0) === 30 ? (
                    <span style={{ color: 'var(--color-success, #22c55e)', marginLeft: '0.5rem', fontWeight: 600 }}>✓ (30 periods reached)</span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>/ 30 periods target</span>
                  )}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0 }}>Section:</label>
                <select
                  className="form-control"
                  style={{ width: 'auto', minWidth: '220px' }}
                  value={selectedOfferingSectionId}
                  onChange={(e) => handleOfferingSectionChange(e.target.value)}
                >
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} — {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Type</th>
                    <th>Weekly Periods</th>
                    <th>Session Duration</th>
                    <th>Assigned Faculty</th>
                    <th>Preferred Room</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingOfferings ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
                        Loading course offerings…
                      </td>
                    </tr>
                  ) : offerings.length > 0 ? (
                    offerings.map((o) => (
                      <tr key={o.id}>
                        <td>
                          <strong>{o.subjectName}</strong>
                          {o.subjectCode && (
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                              Code: {o.subjectCode} {o.subjectShortName ? `(${o.subjectShortName})` : ''}
                            </div>
                          )}
                        </td>
                        <td>
                          <span className={`badge badge-${
                            o.subjectType === 'THEORY' ? 'theory' : o.subjectType === 'LAB' ? 'lab'
                              : o.subjectType === 'ELECTIVE' ? 'elective' : o.subjectType === 'TRAINING' ? 'training' : 'activity'
                          }`}>
                            {o.subjectType}
                          </span>
                        </td>
                        <td>
                          <strong>{o.weeklyPeriods}</strong> periods/wk
                        </td>
                        <td>
                          {o.durationPeriods === 1 ? '1 period / session' : `${o.durationPeriods} consecutive periods`}
                        </td>
                        <td>{o.assignedFacultyName || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                        <td>{o.preferredRoomNumber || <span style={{ color: 'var(--text-muted)' }}>—</span>}</td>
                        <td>
                          <span style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            background: o.active ? 'rgba(34, 197, 94, 0.15)' : 'rgba(156, 163, 175, 0.2)',
                            color: o.active ? '#15803d' : '#6b7280',
                          }}>
                            {o.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            style={{ marginRight: '0.4rem' }}
                            disabled={saving}
                            onClick={() => startEditOffering(o)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            disabled={saving}
                            onClick={() => handleDeleteOffering(o.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem' }}>
                        No course offerings configured for this section yet.
                      </td>
                    </tr>
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
