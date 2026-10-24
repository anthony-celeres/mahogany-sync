// src/utils/mock-db.ts

export interface MockUser {
  id: string
  email: string
  fullName: string
  username: string
  role: 'admin' | 'user' | 'developer'
  specialRoles: string[] // 'SA' | 'Treasurer' | 'Secretary' | 'Kitchen Manager' | 'Evaluator' | 'Media'
  studentId?: string
  roomNumber?: string
  degreeProgram?: string
  yearLevel?: string
  birthdate?: string
  mobileNumber?: string
  barangay?: string
  city?: string
  province?: string
  guardianName?: string
  guardianRelationship?: string
  guardianContact?: string
  guardianAddress?: string
  kitchenIntent?: boolean
  status: 'pending' | 'active' | 'inactive' | 'removed'
  addedAt: string
  mustChangePassword?: boolean
  avatarUrl?: string // optional profile picture; falls back to initials avatar
  leaveRequested?: boolean // occupant has filed a Leave Dormitory request to the Adviser
}

export interface Article {
  id: string
  tag: string
  title: string
  meta: string
  href: string
  body: string[]
  date: string
  author: string
  status: 'published' | 'draft'
}

// Dorm-wide announcement posted to the resident bulletin (read-only for occupants)
export interface Announcement {
  id: string
  title: string
  body: string
  date: string
  pinned: boolean
  postedBy: string
}

// Upcoming dorm event surfaced on the resident bulletin (read-only for occupants)
export interface DormEvent {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
}

export interface CleaningSchedule {
  id: string
  dayOfWeek: string // 'Monday', 'Tuesday', etc.
  rooms: string[]
  kitchenOnly: boolean
}

export interface CleaningAttendance {
  id: string
  date: string
  userId: string
  status: 'present' | 'absent' | 'excused'
  kitchenOnly: boolean
  markedBy: string
}

export interface Gadget {
  id: string
  userId: string
  brand: string
  type: string
  watts: number
  registeredDate: string
  status: 'pending' | 'approved'
}

export interface Payment {
  id: string
  userId: string
  type: 'maintenance' | 'gadget' | 'fine' | 'event'
  description: string
  amount: number
  dueDate: string
  status: 'unpaid' | 'pending' | 'paid'
  datePaid?: string
  receiptUrl?: string
}

export interface Violation {
  id: string
  userId: string
  date: string
  type: string
  severity: 'low' | 'medium' | 'high'
  details: string
  recordedBy: string
}

export interface MeetingAttendance {
  id: string
  eventName: string
  date: string
  attendees: { userId: string; status: 'present' | 'absent' | 'excused' }[]
  minutesUrl?: string
  uploadedBy: string
}

export interface OfficerElection {
  id: string
  title: string
  status: 'setup' | 'active' | 'closed'
  positions: {
    id: string
    name: string // 'Treasurer', 'Secretary', 'Kitchen Manager', etc.
    candidates: { userId: string; fullName: string }[]
    votes: { [voterId: string]: string | 'abstain' } // maps voterId -> candidate userId or 'abstain'
  }[]
}

export interface EvaluatorElection {
  id: string
  status: 'setup' | 'nomination' | 'voting' | 'closed'
  qualifyingCount: number // N
  nominations: { [roomId: string]: string } // maps roomId -> nominee userId
  votes: { [voterId: string]: string } // maps voterId -> nominee userId
  evaluators: string[] // userIds of top N winners
}

export interface EvaluationRating {
  id: string
  evaluatorId: string
  userId: string
  score: number // 1 to 5
  feedback: string
  date: string
}

export interface FinancialReport {
  id: string
  title: string
  date: string
  url: string
  uploadedBy: string
}

// Preset Users data
export const PRESET_USERS: MockUser[] = [
  {
    id: 'u-0',
    email: 'dev@vsu.edu.ph',
    fullName: 'System Developer',
    username: 'developer',
    role: 'developer',
    specialRoles: [],
    status: 'active',
    addedAt: '2026-06-01',
  },
  {
    id: 'u-1',
    email: 'adviser@vsu.edu.ph',
    fullName: 'Dorm Adviser',
    username: 'adviser',
    role: 'admin',
    specialRoles: [],
    status: 'active',
    addedAt: '2026-06-01',
  },
  {
    id: 'u-2',
    email: 'sa@vsu.edu.ph',
    fullName: 'John Paul Reyes',
    username: 'reyes.jp05678',
    role: 'user',
    specialRoles: ['SA'],
    studentId: '23-2-05678',
    roomNumber: '101',
    degreeProgram: 'BS in Agriculture',
    yearLevel: '3rd Year',
    birthdate: '2005-04-12',
    mobileNumber: '09172223333',
    barangay: 'Pangolin',
    city: 'Baybay',
    province: 'Leyte',
    status: 'active',
    addedAt: '2026-06-01',
  },
  {
    id: 'u-3',
    email: 'treasurer@vsu.edu.ph',
    fullName: 'Juan Miguel Dela Cruz',
    username: 'delacruz.jm01234',
    role: 'user',
    specialRoles: ['Treasurer'],
    studentId: '22-1-01234',
    roomNumber: '102',
    degreeProgram: 'BS in Computer Science',
    yearLevel: '4th Year',
    birthdate: '2004-10-15',
    mobileNumber: '09181112222',
    barangay: 'Guadalupe',
    city: 'Baybay',
    province: 'Leyte',
    status: 'active',
    addedAt: '2026-06-01',
  },
  {
    id: 'u-4',
    email: 'secretary@vsu.edu.ph',
    fullName: 'Jose Mari De Los Santos',
    username: 'delossantos.jm00987',
    role: 'user',
    specialRoles: ['Secretary'],
    studentId: '24-1-00987',
    roomNumber: '103',
    degreeProgram: 'BS in Forestry',
    yearLevel: '2nd Year',
    birthdate: '2006-01-20',
    mobileNumber: '09193334444',
    barangay: 'San Jose',
    city: 'Baybay',
    province: 'Leyte',
    status: 'active',
    addedAt: '2026-06-01',
  },
  {
    id: 'u-5',
    email: 'km@vsu.edu.ph',
    fullName: 'Anthony Lumapat Celeres Jr.',
    username: 'celeres.a02249',
    role: 'user',
    specialRoles: ['Kitchen Manager'],
    studentId: '23-1-02249',
    roomNumber: '104',
    degreeProgram: 'BS in Information Technology',
    yearLevel: '3rd Year',
    birthdate: '2005-08-25',
    mobileNumber: '09204445555',
    barangay: 'Patag',
    city: 'Baybay',
    province: 'Leyte',
    status: 'active',
    addedAt: '2026-06-01',
  },
  {
    id: 'u-6',
    email: 'evaluator@vsu.edu.ph',
    fullName: 'Mark Room 3 Evaluator',
    username: 'evaluator.mark',
    role: 'user',
    specialRoles: ['Evaluator'],
    studentId: '23-1-08888',
    roomNumber: '103',
    degreeProgram: 'BS in Biology',
    yearLevel: '3rd Year',
    status: 'active',
    addedAt: '2026-06-01',
  },
  {
    id: 'u-7',
    email: 'occupant@vsu.edu.ph',
    fullName: 'Regular Occupant',
    username: 'occupant',
    role: 'user',
    specialRoles: [],
    studentId: '25-1-09999',
    roomNumber: '105',
    degreeProgram: 'BS in Civil Engineering',
    yearLevel: '1st Year',
    status: 'active',
    addedAt: '2026-06-01',
  },
  {
    id: 'u-8',
    email: 'media@vsu.edu.ph',
    fullName: 'Marco Alonso (Media Officer)',
    username: 'alonso.m03311',
    role: 'user',
    specialRoles: ['Media'],
    studentId: '23-1-03311',
    roomNumber: '104',
    degreeProgram: 'BS in Development Communication',
    yearLevel: '3rd Year',
    birthdate: '2005-09-10',
    mobileNumber: '09215556666',
    barangay: 'Pangolin',
    city: 'Baybay',
    province: 'Leyte',
    status: 'active',
    addedAt: '2026-06-01',
  },
]

const INITIAL_PENDING_SIGNUPS: MockUser[] = [
  {
    id: 'p-1',
    email: 'pending1@vsu.edu.ph',
    fullName: 'Pedro Penduko',
    username: '',
    role: 'user',
    specialRoles: [],
    studentId: '25-1-05555',
    roomNumber: '106',
    degreeProgram: 'BS in Agribusiness',
    yearLevel: '1st Year',
    birthdate: '2007-05-05',
    mobileNumber: '09301234567',
    barangay: 'Pangasugan',
    city: 'Baybay',
    province: 'Leyte',
    kitchenIntent: true,
    status: 'pending',
    addedAt: '2026-07-04',
  },
  {
    id: 'p-2',
    email: 'pending2@vsu.edu.ph',
    fullName: 'Juan dela Cruz II',
    username: '',
    role: 'user',
    specialRoles: [],
    studentId: '24-2-07777',
    roomNumber: '107',
    degreeProgram: 'BS in Mechanical Engineering',
    yearLevel: '2nd Year',
    birthdate: '2006-12-12',
    mobileNumber: '09407778888',
    barangay: 'Cogon',
    city: 'Baybay',
    province: 'Leyte',
    kitchenIntent: false,
    status: 'pending',
    addedAt: '2026-07-05',
  },
  {
    id: 'p-3',
    email: 'pending3@vsu.edu.ph',
    fullName: 'Gabriel Silang',
    username: '',
    role: 'user',
    specialRoles: [],
    studentId: '25-2-08888',
    roomNumber: '108',
    degreeProgram: 'BS in Electrical Engineering',
    yearLevel: '1st Year',
    birthdate: '2007-08-18',
    mobileNumber: '09508889999',
    barangay: 'Villa',
    city: 'Baybay',
    province: 'Leyte',
    kitchenIntent: true,
    status: 'pending',
    addedAt: '2026-07-06',
  },
  {
    id: 'p-4',
    email: 'pending4@vsu.edu.ph',
    fullName: 'Mark Anthony Velez',
    username: '',
    role: 'user',
    specialRoles: [],
    studentId: '25-1-01122',
    roomNumber: '109',
    degreeProgram: 'BS in Agricultural Engineering',
    yearLevel: '1st Year',
    birthdate: '2007-03-14',
    mobileNumber: '09171119988',
    barangay: 'Guadalupe',
    city: 'Baybay',
    province: 'Leyte',
    kitchenIntent: false,
    status: 'pending',
    addedAt: '2026-07-08',
  },
  {
    id: 'p-5',
    email: 'pending5@vsu.edu.ph',
    fullName: 'Christian Dave Reyes',
    username: '',
    role: 'user',
    specialRoles: [],
    studentId: '24-1-03344',
    roomNumber: '110',
    degreeProgram: 'BS in Food Technology',
    yearLevel: '2nd Year',
    birthdate: '2006-09-22',
    mobileNumber: '09283334455',
    barangay: 'Zone 1',
    city: 'Baybay',
    province: 'Leyte',
    kitchenIntent: true,
    status: 'pending',
    addedAt: '2026-07-09',
  },
  {
    id: 'p-6',
    email: 'pending6@vsu.edu.ph',
    fullName: 'Joshua Kiamco',
    username: '',
    role: 'user',
    specialRoles: [],
    studentId: '25-2-05566',
    roomNumber: '111',
    degreeProgram: 'BS in Environmental Science',
    yearLevel: '1st Year',
    birthdate: '2007-11-03',
    mobileNumber: '09395556677',
    barangay: 'San Agustin',
    city: 'Baybay',
    province: 'Leyte',
    kitchenIntent: false,
    status: 'pending',
    addedAt: '2026-07-10',
  },
]

const INITIAL_CLEANING_SCHEDULE: CleaningSchedule[] = [
  { id: 'cs-1', dayOfWeek: 'Monday', rooms: ['101', '102'], kitchenOnly: false },
  { id: 'cs-2', dayOfWeek: 'Tuesday', rooms: ['103', '104'], kitchenOnly: false },
  { id: 'cs-3', dayOfWeek: 'Wednesday', rooms: ['105', '106'], kitchenOnly: false },
  { id: 'cs-4', dayOfWeek: 'Thursday', rooms: ['107', '108'], kitchenOnly: false },
  { id: 'cs-5', dayOfWeek: 'Friday', rooms: ['101', '102', '103', '104', '105', '106', '107', '108'], kitchenOnly: false },
  { id: 'cs-6', dayOfWeek: 'Monday', rooms: ['101', '104'], kitchenOnly: true },
  { id: 'cs-7', dayOfWeek: 'Wednesday', rooms: ['102', '105'], kitchenOnly: true },
  { id: 'cs-8', dayOfWeek: 'Friday', rooms: ['103'], kitchenOnly: true },
]

const INITIAL_CLEANING_ATTENDANCE: CleaningAttendance[] = [
  { id: 'ca-1', date: '2026-06-29', userId: 'u-2', status: 'present', kitchenOnly: false, markedBy: 'reyes.jp05678' },
  { id: 'ca-2', date: '2026-06-29', userId: 'u-3', status: 'absent', kitchenOnly: false, markedBy: 'reyes.jp05678' }, // Absence triggers Php 50 fine
  { id: 'ca-3', date: '2026-06-29', userId: 'u-2', status: 'present', kitchenOnly: true, markedBy: 'celeres.a02249' },
]

const INITIAL_GADGETS: Gadget[] = [
  { id: 'g-1', userId: 'u-2', brand: 'Asus', type: 'Laptop', watts: 65, registeredDate: '2026-06-02', status: 'approved' },
  { id: 'g-2', userId: 'u-7', brand: 'Standard', type: 'Electric Fan', watts: 50, registeredDate: '2026-06-10', status: 'approved' },
  { id: 'g-3', userId: 'u-5', brand: 'Dell', type: 'Laptop', watts: 90, registeredDate: '2026-07-04', status: 'pending' },
]

const INITIAL_PAYMENTS: Payment[] = [
  { id: 'py-1', userId: 'u-2', type: 'maintenance', description: 'Maintenance Fee - 1st Semester AY 2026-2027', amount: 500, dueDate: '2026-07-31', status: 'unpaid' },
  { id: 'py-2', userId: 'u-2', type: 'gadget', description: 'Gadget Fee - Laptop (Asus)', amount: 150, dueDate: '2026-07-31', status: 'paid', datePaid: '2026-06-15', receiptUrl: 'receipt_g1.png' },
  { id: 'py-3', userId: 'u-3', type: 'fine', description: 'Fine - General Cleaning Absence (2026-06-29)', amount: 50, dueDate: '2026-07-15', status: 'unpaid' },
  { id: 'py-4', userId: 'u-2', type: 'event', description: 'Event Dues - MMH Welcoming Night', amount: 100, dueDate: '2026-07-20', status: 'unpaid' },
]

const INITIAL_VIOLATIONS: Violation[] = [
  { id: 'v-1', userId: 'u-7', date: '2026-06-25', type: 'Curfew Violation', severity: 'medium', details: 'Arrived at the dormitory at 11:30 PM (curfew is 10:00 PM) without prior permission.', recordedBy: 'reyes.jp05678' },
]

const INITIAL_MEETINGS: MeetingAttendance[] = [
  {
    id: 'm-1',
    eventName: 'MMH General Assembly',
    date: '2026-06-15',
    attendees: [
      { userId: 'u-2', status: 'present' },
      { userId: 'u-3', status: 'present' },
      { userId: 'u-4', status: 'present' },
      { userId: 'u-5', status: 'present' },
      { userId: 'u-6', status: 'present' },
      { userId: 'u-7', status: 'absent' },
    ],
    minutesUrl: 'assembly_minutes_2026_06_15.pdf',
    uploadedBy: 'delossantos.jm00987',
  },
]

const INITIAL_FINANCIALS: FinancialReport[] = [
  { id: 'f-1', title: 'June 2026 MMH Financial Audit', date: '2026-06-30', url: 'financial_report_june_2026.pdf', uploadedBy: 'delacruz.jm01234' },
]

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'an-1',
    title: 'Water Interruption — Saturday 8AM to 12NN',
    body: 'The Baybay water district will conduct pipeline maintenance this Saturday. Please store water in advance. Comfort rooms on the 2nd floor will be temporarily closed.',
    date: '2026-07-24',
    pinned: true,
    postedBy: 'Dorm Adviser',
  },
  {
    id: 'an-2',
    title: 'Maintenance Fee Deadline — July 31',
    body: 'Friendly reminder that the 1st Semester maintenance fee (Php 500) is due on July 31. Settle at the Treasurer\'s office or upload your receipt in Payment Records.',
    date: '2026-07-22',
    pinned: true,
    postedBy: 'Juan Miguel Dela Cruz (Treasurer)',
  },
  {
    id: 'an-3',
    title: 'General Cleaning Reoriented to Fridays',
    body: 'Starting this week, whole-dorm general cleaning moves to Friday 5PM. Check your assigned area under Attendance & Schedules. Absentees incur a Php 50 fine.',
    date: '2026-07-20',
    pinned: false,
    postedBy: 'John Paul Reyes (SA)',
  },
]

const INITIAL_EVENTS: DormEvent[] = [
  {
    id: 'ev-welcome',
    title: 'MMH Welcoming Night',
    date: '2026-08-02',
    time: '6:00 PM',
    location: 'MMH Common Hall',
    description: 'Welcome program for new occupants. Bring your own mug. Dues of Php 100 apply (see Payment Records).',
  },
  {
    id: 'ev-assembly',
    title: 'General Assembly — 1st Semester',
    date: '2026-08-15',
    time: '7:00 PM',
    location: 'MMH Common Hall',
    description: 'Mandatory assembly. Attendance is recorded; absentees must file an excuse letter with the Secretary.',
  },
  {
    id: 'ev-cleanup',
    title: 'Dorm-wide Deep Cleanup Drive',
    date: '2026-08-23',
    time: '5:00 AM',
    location: 'All floors & communal kitchen',
    description: 'Semestral deep clean. Kitchen users report to the communal kitchen; everyone else to their assigned area.',
  },
]

const INITIAL_OFFICER_ELECTION: OfficerElection[] = [
  {
    id: 'el-1',
    title: 'MMH Officers Elections - AY 2026-2027 1st Semester',
    status: 'closed',
    positions: [
      {
        id: 'p-treasurer',
        name: 'Treasurer',
        candidates: [{ userId: 'u-3', fullName: 'Juan Miguel Dela Cruz' }],
        votes: { 'u-2': 'u-3', 'u-4': 'u-3', 'u-5': 'abstain', 'u-6': 'u-3', 'u-7': 'u-3' }, // Candidate outnumbers Abstain
      },
      {
        id: 'p-secretary',
        name: 'Secretary',
        candidates: [{ userId: 'u-4', fullName: 'Jose Mari De Los Santos' }],
        votes: { 'u-2': 'u-4', 'u-3': 'u-4', 'u-5': 'u-4', 'u-6': 'abstain', 'u-7': 'abstain' }, // Candidate outnumbers Abstain
      },
      {
        id: 'p-km',
        name: 'Kitchen Manager',
        candidates: [{ userId: 'u-5', fullName: 'Anthony Lumapat Celeres Jr.' }],
        votes: { 'u-2': 'u-5', 'u-3': 'u-5', 'u-4': 'abstain', 'u-6': 'abstain', 'u-7': 'abstain' }, // Won.
      },
    ],
  },
  {
    id: 'el-2',
    title: 'Special Officers Elections (Vacant Positions)',
    status: 'setup',
    positions: [
      {
        id: 'p-pro',
        name: 'P.R.O.',
        candidates: [{ userId: 'u-7', fullName: 'Regular Occupant' }],
        votes: {},
      },
    ],
  },
]

const INITIAL_EVALUATOR_ELECTION: EvaluatorElection[] = [
  {
    id: 'ev-1',
    status: 'voting',
    qualifyingCount: 5,
    nominations: {
      '101': 'u-2',
      '102': 'u-3',
      '103': 'u-6',
      '104': 'u-5',
    },
    votes: {
      'u-2': 'u-6',
      'u-3': 'u-6',
      'u-7': 'u-6',
    },
    evaluators: ['u-6'],
  },
]

const INITIAL_EVALUATIONS: EvaluationRating[] = [
  { id: 'evr-1', evaluatorId: 'u-6', userId: 'u-7', score: 4.5, feedback: 'Always cleans his bunk and helps throw out trash. Very respectful to hallmates.', date: '2026-07-02' },
]

const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    tag: 'MMH News',
    title: "Mahogany Men's Hall unveils its new official logo",
    meta: 'Jul 21, 2026 · MMH Communications',
    href: '#',
    body: [
      'Mahogany Men’s Hall (MMH) formally unveiled its new official logo in a ceremony led by the Dormitory Adviser Board and the MMH Student Officers Council. The refreshed emblem marks the hall’s transition into the fully digital Mahogany Sync era while honoring its heritage since 1979.',
      'The new mark keeps the hall’s signature forest-green and gold palette, pairing a modern wordmark with a symbol that nods to both the mahogany tree and the sense of home the hall has offered generations of Viscan residents.',
      'Hall administration says the logo will roll out across the portal, official documents, and community materials over the coming weeks.',
    ],
    date: '2026-07-21',
    author: 'MMH Communications',
    status: 'published',
  },
  {
    id: 'art-2',
    tag: 'MMH News',
    title: 'The story and symbolism behind the new MMH emblem',
    meta: 'Jul 18, 2026 · MMH Communications',
    href: '#',
    body: [
      'Every element of the new MMH emblem was chosen deliberately. The interlocking form represents the brotherhood and continuity of hall residents, while the upward motion signals growth, leadership, and academic perseverance.',
      'The gold accent carries forward the “est. 1979” legacy, a reminder of the decades of tradition the hall stands on, even as it modernizes its operations through the Mahogany Sync platform.',
    ],
    date: '2026-07-18',
    author: 'MMH Communications',
    status: 'published',
  },
  {
    id: 'art-3',
    tag: 'MMH News',
    title: 'Logo design contest winners recognized at the hall',
    meta: 'Jul 10, 2026 · MMH Communications',
    href: '#',
    body: [
      'Ahead of the official unveiling, the hall recognized the winners of the internal logo design contest that invited residents to help shape the new identity.',
      'Winning concepts were reviewed by the Student Officers Council and refined with the adviser board before being finalized. Participants were commended for their creativity and pride in representing Mahogany Men’s Hall.',
    ],
    date: '2026-07-10',
    author: 'MMH Communications',
    status: 'published',
  },
]

export interface MockDatabase {
  users: MockUser[]
  cleaningSchedule: CleaningSchedule[]
  cleaningAttendance: CleaningAttendance[]
  gadgets: Gadget[]
  payments: Payment[]
  violations: Violation[]
  meetings: MeetingAttendance[]
  financialReports: FinancialReport[]
  officerElections: OfficerElection[]
  evaluatorElections: EvaluatorElection[]
  evaluations: EvaluationRating[]
  announcements: Announcement[]
  events: DormEvent[]
  articles: Article[]
}

export const DEFAULT_DB: MockDatabase = {
  users: [...PRESET_USERS, ...INITIAL_PENDING_SIGNUPS],
  cleaningSchedule: INITIAL_CLEANING_SCHEDULE,
  cleaningAttendance: INITIAL_CLEANING_ATTENDANCE,
  gadgets: INITIAL_GADGETS,
  payments: INITIAL_PAYMENTS,
  violations: INITIAL_VIOLATIONS,
  meetings: INITIAL_MEETINGS,
  financialReports: INITIAL_FINANCIALS,
  officerElections: INITIAL_OFFICER_ELECTION,
  evaluatorElections: INITIAL_EVALUATOR_ELECTION,
  evaluations: INITIAL_EVALUATIONS,
  announcements: INITIAL_ANNOUNCEMENTS,
  events: INITIAL_EVENTS,
  articles: INITIAL_ARTICLES,
}

// Helper to access data both on server (static copy) and client (sync to localStorage)
export function getDb(): MockDatabase {
  if (typeof window === 'undefined') {
    return DEFAULT_DB
  }
  const stored = localStorage.getItem('mahogany_sync_db')
  if (!stored) {
    localStorage.setItem('mahogany_sync_db', JSON.stringify(DEFAULT_DB))
    return DEFAULT_DB
  }
  try {
    const parsed = JSON.parse(stored)
    const existingUsers: MockUser[] = parsed.users || []
    
    PRESET_USERS.forEach(pu => {
      const idx = existingUsers.findIndex(u => u.id === pu.id || u.email === pu.email)
      if (idx === -1) {
        existingUsers.push(pu)
      } else {
        if (pu.specialRoles && pu.specialRoles.length > 0) {
          pu.specialRoles.forEach(r => {
            if (!existingUsers[idx].specialRoles) existingUsers[idx].specialRoles = []
            if (!existingUsers[idx].specialRoles.includes(r)) {
              existingUsers[idx].specialRoles.push(r)
            }
          })
        }
      }
    })

    // Ensure all initial pending signup records are populated
    INITIAL_PENDING_SIGNUPS.forEach(ps => {
      const idx = existingUsers.findIndex(u => u.id === ps.id || u.email === ps.email)
      if (idx === -1) {
        existingUsers.push(ps)
      }
    })

    const mergedDb: MockDatabase = {
      ...DEFAULT_DB,
      ...parsed,
      users: existingUsers,
      articles: parsed.articles && parsed.articles.length > 0 ? parsed.articles : DEFAULT_DB.articles,
    }
    
    localStorage.setItem('mahogany_sync_db', JSON.stringify(mergedDb))
    return mergedDb
  } catch {
    return DEFAULT_DB
  }
}

export function saveDb(db: MockDatabase) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mahogany_sync_db', JSON.stringify(db))
  }
}

// Developer tool: wipe the persisted mock DB and reseed from DEFAULT_DB.
// Returns a fresh deep copy so the module-level singleton is never mutated.
export function resetDb(): MockDatabase {
  const fresh = JSON.parse(JSON.stringify(DEFAULT_DB)) as MockDatabase
  if (typeof window !== 'undefined') {
    localStorage.setItem('mahogany_sync_db', JSON.stringify(fresh))
  }
  return fresh
}

// Username Auto-Suggestion Pattern F generator
export function generateUsername(lastName: string, firstName: string, studentId: string): string {
  // Normalize last name: lowercase, join words, remove non-alphanumeric, exclude Jr/Sr/etc.
  let cleanedLast = lastName
    .toLowerCase()
    .replace(/\b(jr|sr|iii|iv|v|ii)\b\.?/gi, '')
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9]/g, '') // remove spaces, hyphens, punctuation

  // Suffix strip cleanup (if ending in e.g. jr)
  if (cleanedLast.endsWith('jr') || cleanedLast.endsWith('sr')) {
    cleanedLast = cleanedLast.replace(/(jr|sr)$/, '')
  }

  // Normalize first name initials
  const initials = firstName
    .toLowerCase()
    .split(/\s+/)
    .map(word => word[0])
    .filter(Boolean)
    .join('')

  // Last 5 digits of student ID
  const idDigits = studentId.replace(/[^0-9]/g, '')
  const tail = idDigits.slice(-5)

  return `${cleanedLast}.${initials}${tail}`
}
