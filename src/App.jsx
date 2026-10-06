import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import ManageData from './components/management/ManageData';
import GeneratorWorkflow from './components/generator/GeneratorWorkflow';
import TimetableGrid from './components/timetable/TimetableGrid';

import {
  INITIAL_SECTIONS,
  INITIAL_FACULTY,
  INITIAL_SUBJECTS,
  INITIAL_ROOMS,
  INITIAL_ELECTIVE_GROUPS,
  INITIAL_TIMETABLE_SLOTS,
  DEFAULT_SEMESTERS,
  DEFAULT_ACADEMIC_YEARS
} from './data/defaultState';

const STORAGE_KEY_PREFIX = 'college_tt_';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Load from localStorage or fall back to defaultState
  const [sections, setSections] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}sections`);
    return saved ? JSON.parse(saved) : INITIAL_SECTIONS;
  });

  const [faculty, setFaculty] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}faculty`);
    return saved ? JSON.parse(saved) : INITIAL_FACULTY;
  });

  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}subjects`);
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  const [rooms, setRooms] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}rooms`);
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [electiveGroups, setElectiveGroups] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}electives`);
    return saved ? JSON.parse(saved) : INITIAL_ELECTIVE_GROUPS;
  });

  const [slots, setSlots] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}slots`);
    return saved ? JSON.parse(saved) : INITIAL_TIMETABLE_SLOTS;
  });

  const [selectedSectionId, setSelectedSectionId] = useState(
    sections[0]?.id || 'sec-ece-2a'
  );

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}sections`, JSON.stringify(sections));
  }, [sections]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}faculty`, JSON.stringify(faculty));
  }, [faculty]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}subjects`, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}rooms`, JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}electives`, JSON.stringify(electiveGroups));
  }, [electiveGroups]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}slots`, JSON.stringify(slots));
  }, [slots]);

  // Reset to default starter configuration
  const handleResetData = () => {
    if (window.confirm('Reset all timetable data to initial starter state? Custom entries will be re-initialized.')) {
      setSections(INITIAL_SECTIONS);
      setFaculty(INITIAL_FACULTY);
      setSubjects(INITIAL_SUBJECTS);
      setRooms(INITIAL_ROOMS);
      setElectiveGroups(INITIAL_ELECTIVE_GROUPS);
      setSlots(INITIAL_TIMETABLE_SLOTS);
      setSelectedSectionId(INITIAL_SECTIONS[0]?.id || 'sec-ece-2a');
      localStorage.clear();
    }
  };

  return (
    <div className="app-container">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetData={handleResetData}
      />

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            sections={sections}
            faculty={faculty}
            subjects={subjects}
            rooms={rooms}
            slots={slots}
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
            semesters={DEFAULT_SEMESTERS}
            academicYears={DEFAULT_ACADEMIC_YEARS}
            electiveGroups={electiveGroups}
            setElectiveGroups={setElectiveGroups}
          />
        )}

        {activeTab === 'generator' && (
          <GeneratorWorkflow
            sections={sections}
            semesters={DEFAULT_SEMESTERS}
            academicYears={DEFAULT_ACADEMIC_YEARS}
            faculty={faculty}
            subjects={subjects}
            rooms={rooms}
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
            semesters={DEFAULT_SEMESTERS}
            academicYears={DEFAULT_ACADEMIC_YEARS}
            faculty={faculty}
            subjects={subjects}
            rooms={rooms}
            slots={slots}
            setSlots={setSlots}
          />
        )}
      </main>

      <footer className="app-footer">
        Automated College Timetable Generation and Scheduling System &nbsp;|&nbsp; College Technical Training Project
      </footer>
    </div>
  );
}
