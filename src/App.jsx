import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/layout/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import ManageData from './components/management/ManageData';
import GeneratorWorkflow from './components/generator/GeneratorWorkflow';
import TimetableGrid from './components/timetable/TimetableGrid';

import {
  fetchSections,
  fetchFaculty,
  fetchSubjects,
  fetchRooms,
  fetchElectiveGroups,
  fetchDepartments,
  fetchAcademicYears,
  fetchSemesters,
} from './api/api';

import { PERIOD_DEFINITIONS, WORKING_DAYS, LUNCH_BREAK } from './data/defaultState';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // ── Backend-sourced reference data ──────────────────────────────────────────
  const [sections, setSections] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [electiveGroups, setElectiveGroups] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [semesters, setSemesters] = useState([]);

  // ── Manage Data persistent tab and section state ─────────────────────────────
  const [manageSubTab, setManageSubTab] = useState('sections');
  const [manageOfferingSectionId, setManageOfferingSectionId] = useState(null);

  // ── Shared selected section (used across Generator + Timetable tabs) ─────────
  const [selectedSectionId, setSelectedSectionId] = useState(null);

  // ── Global loading / error state ─────────────────────────────────────────────
  const [loadingInit, setLoadingInit] = useState(true);
  const [initError, setInitError] = useState(null);
  const initialLoadDoneRef = useRef(false);

  // ── Load all reference data from backend ─────────────────────────────────────
  const loadAll = useCallback(async () => {
    // Only display the full-screen connecting spinner on initial startup
    if (!initialLoadDoneRef.current) {
      setLoadingInit(true);
    }
    setInitError(null);
    try {
      const [
        sectionsData,
        facultyData,
        subjectsData,
        roomsData,
        electivesData,
        departmentsData,
        academicYearsData,
        semestersData,
      ] = await Promise.all([
        fetchSections(),
        fetchFaculty(),
        fetchSubjects(),
        fetchRooms(),
        fetchElectiveGroups(),
        fetchDepartments(),
        fetchAcademicYears(),
        fetchSemesters(),
      ]);

      setSections(sectionsData || []);
      setFaculty(facultyData || []);
      setSubjects(subjectsData || []);
      setRooms(roomsData || []);
      setElectiveGroups(electivesData || []);
      setDepartments(departmentsData || []);
      setAcademicYears(academicYearsData || []);
      setSemesters(semestersData || []);

      // Pick default selected section if none selected
      if (sectionsData && sectionsData.length > 0) {
        setSelectedSectionId((prev) => prev || sectionsData[0].id);
        setManageOfferingSectionId((prev) => prev || sectionsData[0].id);
      }
      initialLoadDoneRef.current = true;
    } catch (err) {
      if (!initialLoadDoneRef.current) {
        setInitError(
          `Could not connect to backend: ${err.message}. Make sure the Spring Boot server is running at ${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}.`
        );
      }
    } finally {
      setLoadingInit(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // ── Global loading screen ─────────────────────────────────────────────────────
  if (loadingInit) {
    return (
      <div className="app-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1.5rem', color: 'var(--text-secondary)' }}>
          <div className="spinner" />
          <p style={{ fontSize: '1rem', fontWeight: '600' }}>Connecting to backend…</p>
        </div>
      </div>
    );
  }

  // ── Connection error screen ───────────────────────────────────────────────────
  if (initError) {
    return (
      <div className="app-container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', gap: '1.5rem', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem' }}>⚠️</div>
          <h2 style={{ color: 'var(--danger)' }}>Backend Not Reachable</h2>
          <p style={{ maxWidth: '540px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{initError}</p>
          <button className="btn btn-primary" onClick={loadAll}>↺ Retry Connection</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetData={loadAll}
      />

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            sections={sections}
            faculty={faculty}
            subjects={subjects}
            rooms={rooms}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'manage' && (
          <ManageData
            sections={sections}
            setSections={setSections}
            faculty={faculty}
            setFaculty={setFaculty}
            subjects={subjects}
            setSubjects={setSubjects}
            rooms={rooms}
            setRooms={setRooms}
            electiveGroups={electiveGroups}
            setElectiveGroups={setElectiveGroups}
            departments={departments}
            academicYears={academicYears}
            semesters={semesters}
            onDataChanged={loadAll}
            subTab={manageSubTab}
            setSubTab={setManageSubTab}
            selectedOfferingSectionId={manageOfferingSectionId}
            setSelectedOfferingSectionId={setManageOfferingSectionId}
          />
        )}

        {activeTab === 'generator' && (
          <GeneratorWorkflow
            sections={sections}
            semesters={semesters}
            academicYears={academicYears}
            selectedSectionId={selectedSectionId}
            setSelectedSectionId={setSelectedSectionId}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'timetable' && (
          <TimetableGrid
            sections={sections}
            selectedSectionId={selectedSectionId}
            setSelectedSectionId={setSelectedSectionId}
            semesters={semesters}
            faculty={faculty}
            subjects={subjects}
            rooms={rooms}
            departments={departments}
            academicYears={academicYears}
          />
        )}
      </main>

      <footer className="app-footer">
        Automated College Timetable Generation and Scheduling System &nbsp;|&nbsp; College Technical Training Project
      </footer>
    </div>
  );
}
