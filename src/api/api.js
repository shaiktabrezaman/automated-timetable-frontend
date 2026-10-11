/**
 * Centralized API client for the College Timetable Generator backend.
 * Base URL is configured via the VITE_API_BASE_URL environment variable.
 * All functions throw an Error with a user-friendly message on failure.
 */

const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/** Internal fetch wrapper that validates HTTP status and returns parsed JSON. */
async function apiFetch(path, options = {}) {
  const url = `${BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (res.status === 204) return null; // No-content (DELETE success)

  let body;
  try {
    body = await res.json();
  } catch {
    body = null;
  }

  if (!res.ok) {
    // Spring Boot validation errors: { message, errors: [...] }
    const detail =
      (body && (body.message || body.error || JSON.stringify(body))) ||
      `HTTP ${res.status}`;
    throw new Error(detail);
  }

  return body;
}

// ─── Reference data ──────────────────────────────────────────────────────────

export const fetchDepartments = () => apiFetch('/api/departments');
export const fetchAcademicYears = () => apiFetch('/api/academic-years');
export const fetchSemesters = () => apiFetch('/api/semesters');

// ─── Sections ─────────────────────────────────────────────────────────────────

export const fetchSections = () => apiFetch('/api/sections');

export const createSection = (dto) =>
  apiFetch('/api/sections', { method: 'POST', body: JSON.stringify(dto) });

export const deleteSection = (id) =>
  apiFetch(`/api/sections/${id}`, { method: 'DELETE' });

// ─── Faculty ──────────────────────────────────────────────────────────────────

export const fetchFaculty = () => apiFetch('/api/faculty');

export const createFaculty = (dto) =>
  apiFetch('/api/faculty', { method: 'POST', body: JSON.stringify(dto) });

export const deleteFaculty = (id) =>
  apiFetch(`/api/faculty/${id}`, { method: 'DELETE' });

// ─── Subjects ─────────────────────────────────────────────────────────────────

export const fetchSubjects = () => apiFetch('/api/subjects');

export const createSubject = (dto) =>
  apiFetch('/api/subjects', { method: 'POST', body: JSON.stringify(dto) });

export const deleteSubject = (id) =>
  apiFetch(`/api/subjects/${id}`, { method: 'DELETE' });

// ─── Rooms ────────────────────────────────────────────────────────────────────

export const fetchRooms = () => apiFetch('/api/rooms');

export const createRoom = (dto) =>
  apiFetch('/api/rooms', { method: 'POST', body: JSON.stringify(dto) });

export const deleteRoom = (id) =>
  apiFetch(`/api/rooms/${id}`, { method: 'DELETE' });

// ─── Elective Groups ──────────────────────────────────────────────────────────

export const fetchElectiveGroups = () => apiFetch('/api/elective-groups');

export const createElectiveGroup = (dto) =>
  apiFetch('/api/elective-groups', { method: 'POST', body: JSON.stringify(dto) });

export const deleteElectiveGroup = (id) =>
  apiFetch(`/api/elective-groups/${id}`, { method: 'DELETE' });

// ─── Timetable ────────────────────────────────────────────────────────────────

/**
 * Calls the scheduler algorithm for the given section.
 * Returns an array of TimetableSlotResponseDTO.
 */
export const generateTimetable = (sectionId) =>
  apiFetch(`/api/timetable-generator/generate/${sectionId}`, { method: 'POST' });

/**
 * Returns the full timetable grid DTO: { section, slots, courseOfferings }
 */
export const fetchTimetableGrid = (sectionId) =>
  apiFetch(`/api/timetable-grid/${sectionId}`);

/**
 * Returns all timetable slot records for a section.
 */
export const fetchTimetableSlots = (sectionId) =>
  apiFetch(`/api/timetable-slots/section/${sectionId}`);

/**
 * Assigns or updates a timetable slot.
 */
export const assignSlot = (slotDto) =>
  apiFetch('/api/timetable-slots', { method: 'POST', body: JSON.stringify(slotDto) });

/**
 * Deletes a single timetable slot by ID.
 */
export const deleteSlot = (slotId) =>
  apiFetch(`/api/timetable-slots/${slotId}`, { method: 'DELETE' });

/**
 * Clears all timetable slots for a section.
 */
export const clearSectionTimetable = (sectionId) =>
  apiFetch(`/api/timetable-slots/section/${sectionId}`, { method: 'DELETE' });

// ─── Course Offerings ────────────────────────────────────────────────────────

/**
 * Returns active course offerings for a section.
 */
export const fetchActiveOfferings = (sectionId) =>
  apiFetch(`/api/course-offerings/section/${sectionId}/active`);

