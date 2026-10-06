export const WORKING_DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

export const PERIOD_DEFINITIONS = [
  { index: 1, label: "Period 1", time: "9:00 – 9:55", session: "morning" },
  { index: 2, label: "Period 2", time: "9:55 – 10:50", session: "morning" },
  { index: 3, label: "Period 3", time: "10:50 – 11:45", session: "morning" },
  { index: 4, label: "Period 4", time: "11:45 – 12:40", session: "morning" },
  // Lunch Break is 12:40 – 1:20 PM
  { index: 5, label: "Period 5", time: "1:20 – 2:15", session: "afternoon" },
  { index: 6, label: "Period 6", time: "2:15 – 3:10", session: "afternoon" },
  { index: 7, label: "Period 7", time: "3:10 – 4:05", session: "afternoon" }
];

export const LUNCH_BREAK = {
  time: "12:40 – 1:20 PM",
  label: "LUNCH BREAK"
};

export const DEFAULT_ACADEMIC_YEARS = [
  "2024-2025",
  "2025-2026",
  "2026-2027"
];

export const DEFAULT_SEMESTERS = [
  { id: "sem-2-1", name: "II Year I Sem", code: "II-I" },
  { id: "sem-2-2", name: "II Year II Sem", code: "II-II" },
  { id: "sem-3-1", name: "III Year I Sem", code: "III-I" },
  { id: "sem-3-2", name: "III Year II Sem", code: "III-II" },
  { id: "sem-4-1", name: "IV Year I Sem", code: "IV-I" }
];

export const INITIAL_SECTIONS = [
  {
    id: "sec-ece-2a",
    code: "ECE-A",
    name: "II Year ECE Section A",
    department: "ECE",
    academicYear: "2025-2026",
    semesterId: "sem-2-1",
    studentCount: 65,
    defaultRoomId: "room-d201"
  },
  {
    id: "sec-ece-2b",
    code: "ECE-B",
    name: "II Year ECE Section B",
    department: "ECE",
    academicYear: "2025-2026",
    semesterId: "sem-2-1",
    studentCount: 65,
    defaultRoomId: "room-d202"
  },
  {
    id: "sec-ece-2c",
    code: "ECE-C",
    name: "II Year ECE Section C",
    department: "ECE",
    academicYear: "2025-2026",
    semesterId: "sem-2-1",
    studentCount: 64,
    defaultRoomId: "room-d203"
  },
  {
    id: "sec-ece-2d",
    code: "ECE-D",
    name: "II Year ECE Section D",
    department: "ECE",
    academicYear: "2025-2026",
    semesterId: "sem-2-1",
    studentCount: 65,
    defaultRoomId: "room-d204"
  },
  {
    id: "sec-ece-2e",
    code: "ECE-E",
    name: "II Year ECE Section E",
    department: "ECE",
    academicYear: "2025-2026",
    semesterId: "sem-2-1",
    studentCount: 63,
    defaultRoomId: "room-d205"
  },
  {
    id: "sec-ece-2f",
    code: "ECE-F",
    name: "II Year ECE Section F",
    department: "ECE",
    academicYear: "2025-2026",
    semesterId: "sem-2-1",
    studentCount: 64,
    defaultRoomId: "room-d206"
  },
  {
    id: "sec-ece-2g",
    code: "ECE-G",
    name: "II Year ECE Section G",
    department: "ECE",
    academicYear: "2025-2026",
    semesterId: "sem-2-1",
    studentCount: 62,
    defaultRoomId: "room-d207"
  },
  {
    id: "sec-ece-3a",
    code: "ECE-3A",
    name: "III Year ECE Section A",
    department: "ECE",
    academicYear: "2025-2026",
    semesterId: "sem-3-1",
    studentCount: 66,
    defaultRoomId: "room-d301"
  }
];

export const INITIAL_ROOMS = [
  { id: "room-d201", name: "D-201", type: "CLASSROOM", capacity: 70, block: "D-Block" },
  { id: "room-d202", name: "D-202", type: "CLASSROOM", capacity: 70, block: "D-Block" },
  { id: "room-d203", name: "D-203", type: "CLASSROOM", capacity: 70, block: "D-Block" },
  { id: "room-d204", name: "D-204", type: "CLASSROOM", capacity: 70, block: "D-Block" },
  { id: "room-d205", name: "D-205", type: "CLASSROOM", capacity: 70, block: "D-Block" },
  { id: "room-d206", name: "D-206", type: "CLASSROOM", capacity: 70, block: "D-Block" },
  { id: "room-d207", name: "D-207", type: "CLASSROOM", capacity: 70, block: "D-Block" },
  { id: "room-d301", name: "D-301", type: "CLASSROOM", capacity: 70, block: "D-Block" },
  { id: "room-lab-1", name: "ECE Lab 1", type: "LAB", capacity: 40, block: "D-Block" },
  { id: "room-lab-2", name: "ECE Lab 2", type: "LAB", capacity: 40, block: "D-Block" },
  { id: "room-lab-3", name: "Computer Center / Simulation Lab", type: "LAB", capacity: 45, block: "D-Block" }
];

export const INITIAL_FACULTY = [
  { id: "fac-1", name: "Faculty Member 1", designation: "Professor", department: "ECE", maxWeeklyHours: 14 },
  { id: "fac-2", name: "Faculty Member 2", designation: "Associate Professor", department: "ECE", maxWeeklyHours: 16 },
  { id: "fac-3", name: "Faculty Member 3", designation: "Assistant Professor", department: "ECE", maxWeeklyHours: 18 },
  { id: "fac-4", name: "Faculty Member 4", designation: "Assistant Professor", department: "ECE", maxWeeklyHours: 18 },
  { id: "fac-5", name: "Faculty Member 5", designation: "Assistant Professor", department: "ECE", maxWeeklyHours: 18 },
  { id: "fac-6", name: "Faculty Member 6", designation: "Associate Professor", department: "ECE", maxWeeklyHours: 16 }
];

export const INITIAL_SUBJECTS = [
  {
    id: "sub-1",
    code: "EC2101",
    name: "Electronic Devices & Circuits",
    shortName: "EDC",
    type: "THEORY",
    weeklyHours: 4,
    durationPeriods: 1,
    semesterId: "sem-2-1",
    electiveGroupId: null
  },
  {
    id: "sub-2",
    code: "EC2102",
    name: "Signals & Systems",
    shortName: "SS",
    type: "THEORY",
    weeklyHours: 4,
    durationPeriods: 1,
    semesterId: "sem-2-1",
    electiveGroupId: null
  },
  {
    id: "sub-3",
    code: "EC2103",
    name: "Digital Logic Design",
    shortName: "DLD",
    type: "THEORY",
    weeklyHours: 4,
    durationPeriods: 1,
    semesterId: "sem-2-1",
    electiveGroupId: null
  },
  {
    id: "sub-4",
    code: "EC2104",
    name: "Network Theory",
    shortName: "NT",
    type: "THEORY",
    weeklyHours: 3,
    durationPeriods: 1,
    semesterId: "sem-2-1",
    electiveGroupId: null
  },
  {
    id: "sub-5",
    code: "EC2105",
    name: "Mathematics III",
    shortName: "M-III",
    type: "THEORY",
    weeklyHours: 3,
    durationPeriods: 1,
    semesterId: "sem-2-1",
    electiveGroupId: null
  },
  {
    id: "sub-lab-1",
    code: "EC2106",
    name: "Electronic Devices & Circuits Lab",
    shortName: "EDC Lab",
    type: "LAB",
    weeklyHours: 3,
    durationPeriods: 3,
    semesterId: "sem-2-1",
    electiveGroupId: null
  },
  {
    id: "sub-lab-2",
    code: "EC2107",
    name: "Digital Logic Design Lab",
    shortName: "DLD Lab",
    type: "LAB",
    weeklyHours: 3,
    durationPeriods: 3,
    semesterId: "sem-2-1",
    electiveGroupId: null
  },
  {
    id: "sub-tt",
    code: "TT101",
    name: "Technical Training / Skill Enhancement",
    shortName: "Tech Training",
    type: "TRAINING",
    weeklyHours: 2,
    durationPeriods: 2,
    semesterId: "sem-2-1",
    electiveGroupId: null
  },
  {
    id: "sub-act-lib",
    code: "ACT01",
    name: "Library / Sports / Mentoring",
    shortName: "Library/Sports",
    type: "ACTIVITY",
    weeklyHours: 2,
    durationPeriods: 1,
    semesterId: "sem-2-1",
    electiveGroupId: null
  },
  // III Year Electives Starter
  {
    id: "sub-pe1-a",
    code: "PE3101",
    name: "Professional Elective I - Option A",
    shortName: "PE-I (Opt A)",
    type: "ELECTIVE",
    weeklyHours: 3,
    durationPeriods: 1,
    semesterId: "sem-3-1",
    electiveGroupId: "elec-pe1"
  },
  {
    id: "sub-pe1-b",
    code: "PE3102",
    name: "Professional Elective I - Option B",
    shortName: "PE-I (Opt B)",
    type: "ELECTIVE",
    weeklyHours: 3,
    durationPeriods: 1,
    semesterId: "sem-3-1",
    electiveGroupId: "elec-pe1"
  }
];

export const INITIAL_ELECTIVE_GROUPS = [
  {
    id: "elec-pe1",
    name: "Professional Elective - I",
    semesterId: "sem-3-1",
    subjectIds: ["sub-pe1-a", "sub-pe1-b"]
  }
];

// Sample initial weekly slot assignments for ECE-A demonstrating single theory, multi-period labs, and training
export const INITIAL_TIMETABLE_SLOTS = [
  // Monday: EDC, SS, DLD, NT, Lunch, [EDC Lab 3-period block: Periods 5,6,7]
  { id: "s-m-1", sectionId: "sec-ece-2a", day: "Monday", periodIndex: 1, subjectId: "sub-1", facultyId: "fac-1", roomId: "room-d201" },
  { id: "s-m-2", sectionId: "sec-ece-2a", day: "Monday", periodIndex: 2, subjectId: "sub-2", facultyId: "fac-2", roomId: "room-d201" },
  { id: "s-m-3", sectionId: "sec-ece-2a", day: "Monday", periodIndex: 3, subjectId: "sub-3", facultyId: "fac-3", roomId: "room-d201" },
  { id: "s-m-4", sectionId: "sec-ece-2a", day: "Monday", periodIndex: 4, subjectId: "sub-4", facultyId: "fac-4", roomId: "room-d201" },
  { id: "s-m-5", sectionId: "sec-ece-2a", day: "Monday", periodIndex: 5, subjectId: "sub-lab-1", facultyId: "fac-1", roomId: "room-lab-1", spanPeriods: 3, isMultiPeriodHead: true },
  { id: "s-m-6", sectionId: "sec-ece-2a", day: "Monday", periodIndex: 6, subjectId: "sub-lab-1", facultyId: "fac-1", roomId: "room-lab-1", spanPeriods: 3, isMultiPeriodContinuation: true },
  { id: "s-m-7", sectionId: "sec-ece-2a", day: "Monday", periodIndex: 7, subjectId: "sub-lab-1", facultyId: "fac-1", roomId: "room-lab-1", spanPeriods: 3, isMultiPeriodContinuation: true },

  // Tuesday: [DLD Lab 3-period block: Periods 1,2,3], EDC, Lunch, SS, M-III, Library/Sports
  { id: "s-t-1", sectionId: "sec-ece-2a", day: "Tuesday", periodIndex: 1, subjectId: "sub-lab-2", facultyId: "fac-3", roomId: "room-lab-2", spanPeriods: 3, isMultiPeriodHead: true },
  { id: "s-t-2", sectionId: "sec-ece-2a", day: "Tuesday", periodIndex: 2, subjectId: "sub-lab-2", facultyId: "fac-3", roomId: "room-lab-2", spanPeriods: 3, isMultiPeriodContinuation: true },
  { id: "s-t-3", sectionId: "sec-ece-2a", day: "Tuesday", periodIndex: 3, subjectId: "sub-lab-2", facultyId: "fac-3", roomId: "room-lab-2", spanPeriods: 3, isMultiPeriodContinuation: true },
  { id: "s-t-4", sectionId: "sec-ece-2a", day: "Tuesday", periodIndex: 4, subjectId: "sub-1", facultyId: "fac-1", roomId: "room-d201" },
  { id: "s-t-5", sectionId: "sec-ece-2a", day: "Tuesday", periodIndex: 5, subjectId: "sub-2", facultyId: "fac-2", roomId: "room-d201" },
  { id: "s-t-6", sectionId: "sec-ece-2a", day: "Tuesday", periodIndex: 6, subjectId: "sub-5", facultyId: "fac-5", roomId: "room-d201" },
  { id: "s-t-7", sectionId: "sec-ece-2a", day: "Tuesday", periodIndex: 7, subjectId: "sub-act-lib", facultyId: "fac-6", roomId: "room-d201" },

  // Wednesday: SS, DLD, M-III, EDC, Lunch, NT, Tech Training (2-period block: Periods 6,7)
  { id: "s-w-1", sectionId: "sec-ece-2a", day: "Wednesday", periodIndex: 1, subjectId: "sub-2", facultyId: "fac-2", roomId: "room-d201" },
  { id: "s-w-2", sectionId: "sec-ece-2a", day: "Wednesday", periodIndex: 2, subjectId: "sub-3", facultyId: "fac-3", roomId: "room-d201" },
  { id: "s-w-3", sectionId: "sec-ece-2a", day: "Wednesday", periodIndex: 3, subjectId: "sub-5", facultyId: "fac-5", roomId: "room-d201" },
  { id: "s-w-4", sectionId: "sec-ece-2a", day: "Wednesday", periodIndex: 4, subjectId: "sub-1", facultyId: "fac-1", roomId: "room-d201" },
  { id: "s-w-5", sectionId: "sec-ece-2a", day: "Wednesday", periodIndex: 5, subjectId: "sub-4", facultyId: "fac-4", roomId: "room-d201" },
  { id: "s-w-6", sectionId: "sec-ece-2a", day: "Wednesday", periodIndex: 6, subjectId: "sub-tt", facultyId: "fac-6", roomId: "room-lab-3", spanPeriods: 2, isMultiPeriodHead: true },
  { id: "s-w-7", sectionId: "sec-ece-2a", day: "Wednesday", periodIndex: 7, subjectId: "sub-tt", facultyId: "fac-6", roomId: "room-lab-3", spanPeriods: 2, isMultiPeriodContinuation: true },

  // Thursday: DLD, NT, SS, EDC, Lunch, M-III, Library/Sports, Free
  { id: "s-th-1", sectionId: "sec-ece-2a", day: "Thursday", periodIndex: 1, subjectId: "sub-3", facultyId: "fac-3", roomId: "room-d201" },
  { id: "s-th-2", sectionId: "sec-ece-2a", day: "Thursday", periodIndex: 2, subjectId: "sub-4", facultyId: "fac-4", roomId: "room-d201" },
  { id: "s-th-3", sectionId: "sec-ece-2a", day: "Thursday", periodIndex: 3, subjectId: "sub-2", facultyId: "fac-2", roomId: "room-d201" },
  { id: "s-th-4", sectionId: "sec-ece-2a", day: "Thursday", periodIndex: 4, subjectId: "sub-1", facultyId: "fac-1", roomId: "room-d201" },
  { id: "s-th-5", sectionId: "sec-ece-2a", day: "Thursday", periodIndex: 5, subjectId: "sub-5", facultyId: "fac-5", roomId: "room-d201" },
  { id: "s-th-6", sectionId: "sec-ece-2a", day: "Thursday", periodIndex: 6, subjectId: "sub-act-lib", facultyId: "fac-6", roomId: "room-d201" },

  // Friday: EDC, DLD, SS, NT, Lunch, Library/Sports, Free, Free
  { id: "s-f-1", sectionId: "sec-ece-2a", day: "Friday", periodIndex: 1, subjectId: "sub-1", facultyId: "fac-1", roomId: "room-d201" },
  { id: "s-f-2", sectionId: "sec-ece-2a", day: "Friday", periodIndex: 2, subjectId: "sub-3", facultyId: "fac-3", roomId: "room-d201" },
  { id: "s-f-3", sectionId: "sec-ece-2a", day: "Friday", periodIndex: 3, subjectId: "sub-2", facultyId: "fac-2", roomId: "room-d201" },
  { id: "s-f-4", sectionId: "sec-ece-2a", day: "Friday", periodIndex: 4, subjectId: "sub-4", facultyId: "fac-4", roomId: "room-d201" },
  { id: "s-f-5", sectionId: "sec-ece-2a", day: "Friday", periodIndex: 5, subjectId: "sub-act-lib", facultyId: "fac-5", roomId: "room-d201" },

  // Saturday: Revision / Technical Seminars
  { id: "s-sa-1", sectionId: "sec-ece-2a", day: "Saturday", periodIndex: 1, subjectId: "sub-5", facultyId: "fac-5", roomId: "room-d201" },
  { id: "s-sa-2", sectionId: "sec-ece-2a", day: "Saturday", periodIndex: 2, subjectId: "sub-1", facultyId: "fac-1", roomId: "room-d201" },
  { id: "s-sa-3", sectionId: "sec-ece-2a", day: "Saturday", periodIndex: 3, subjectId: "sub-3", facultyId: "fac-3", roomId: "room-d201" },
  { id: "s-sa-4", sectionId: "sec-ece-2a", day: "Saturday", periodIndex: 4, subjectId: "sub-2", facultyId: "fac-2", roomId: "room-d201" }
];
