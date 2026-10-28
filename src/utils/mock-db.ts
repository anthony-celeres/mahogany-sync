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

export type CleaningType = 'daily' | 'general'
export type CleaningRemark = 'check' | 'excuse' | 'absent' | 'paid' | 'na'

export type DormLevel = 'all' | 'ground' | 'first' | 'second' | 'third'

export interface LevelConfig {
  id: DormLevel
  name: string
  subtitle: string
  rooms: string[]
}

export const MMH_LEVELS: LevelConfig[] = [
  { 
    id: 'all', 
    name: 'All Levels', 
    subtitle: 'Ground, 1st, 2nd, & 3rd Levels', 
    rooms: [] 
  },
  { 
    id: 'ground', 
    name: 'Ground Level', 
    subtitle: 'Room 002 (3 SAs), Room 3 (10), Room 4 (10), Room 5 (12)', 
    rooms: ['002', '003-A', '003-B', '004-A', '004-B', '005-A', '005-B', '2', '3', '4', '5'] 
  },
  { 
    id: 'first', 
    name: 'First Level', 
    subtitle: 'Rooms 101–110 (4 occupants each)', 
    rooms: ['101', '102', '103', '104', '105', '106', '107', '108', '109', '110'] 
  },
  { 
    id: 'second', 
    name: 'Second Level', 
    subtitle: 'Rooms 211–213 & 216–220 (4 occupants each)', 
    rooms: ['211', '212', '213', '216', '217', '218', '219', '220'] 
  },
  { 
    id: 'third', 
    name: 'Third Level', 
    subtitle: 'Rooms 321–330 (4 occupants each)', 
    rooms: ['321', '322', '323', '324', '325', '326', '327', '328', '329', '330'] 
  },
]

export function getRoomLevel(roomNumber?: string): 'ground' | 'first' | 'second' | 'third' | 'other' {
  if (!roomNumber) return 'other'
  const clean = roomNumber.trim().toUpperCase()
  // Ground: 2, 3, 4, 5 or 002, 003, 004, 005 (with optional -A, -B suffix)
  if (/^(00[2-5]|[2-5])(-[A-Z0-9]+)?$/.test(clean)) return 'ground'
  const m = clean.match(/^(\d{3})/)
  if (m) {
    const n = parseInt(m[1], 10)
    if (n >= 101 && n <= 110) return 'first'
    if ((n >= 211 && n <= 213) || (n >= 216 && n <= 220)) return 'second'
    if (n >= 321 && n <= 330) return 'third'
  }
  return 'other'
}

export interface CleaningAttendance {
  id: string
  date: string
  userId: string
  cleaningType?: CleaningType // 'daily' | 'general'
  remark?: CleaningRemark // 'check' (/) | 'excuse' (E) | 'absent' (A) | 'paid' (P) | 'na' (NA)
  status?: 'present' | 'absent' | 'excused' // backward compatibility
  fineAmount?: number // 10 for daily, 50 for general
  finePaymentId?: string // links to payment record
  kitchenOnly?: boolean
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

// Preset Users data (System Dev + Dorm Adviser + 147 Occupants)
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

  // ================= GROUND LEVEL OCCUPANTS =================
  // Room 002 (3 occupants: 3 Student Assistants)
  { id: 'u-2', email: 'sa@vsu.edu.ph', fullName: 'Reyes, John Paul', username: 'reyes.jp05678', role: 'user', specialRoles: ['SA'], studentId: '23-2-05678', roomNumber: '002', degreeProgram: 'BS in Agriculture', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-sa-2', email: 'flores.mar@vsu.edu.ph', fullName: 'Flores, Michael Angelo R.', username: 'flores.mar05679', role: 'user', specialRoles: ['SA'], studentId: '23-1-05679', roomNumber: '002', degreeProgram: 'BS in Development Communication', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-sa-3', email: 'bautista.mdt@vsu.edu.ph', fullName: 'Bautista, Mark Dave T.', username: 'bautista.mdt05680', role: 'user', specialRoles: ['SA'], studentId: '24-1-05680', roomNumber: '002', degreeProgram: 'BS in Civil Engineering', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-01', email: 'santos.r@vsu.edu.ph', fullName: 'Santos, Rafael D.', username: 'santos.rd01101', role: 'user', specialRoles: [], studentId: '24-1-01101', roomNumber: '003-A', degreeProgram: 'BSAB-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-02', email: 'olarte.k@vsu.edu.ph', fullName: 'Olarte, Kevin P.', username: 'olarte.kp01102', role: 'user', specialRoles: [], studentId: '23-1-01102', roomNumber: '003-A', degreeProgram: 'BSCE-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-03', email: 'tan.c@vsu.edu.ph', fullName: 'Tan, Christian Mark L.', username: 'tan.cml01103', role: 'user', specialRoles: [], studentId: '24-1-01103', roomNumber: '003-A', degreeProgram: 'BSCS-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-04', email: 'flores.d@vsu.edu.ph', fullName: 'Flores, Dominic R.', username: 'flores.dr01104', role: 'user', specialRoles: [], studentId: '25-1-01104', roomNumber: '003-A', degreeProgram: 'BSME-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-05', email: 'villar.a@vsu.edu.ph', fullName: 'Villar, Angelo S.', username: 'villar.as01105', role: 'user', specialRoles: [], studentId: '23-1-01105', roomNumber: '003-A', degreeProgram: 'BSAB-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-06', email: 'alcantara.j@vsu.edu.ph', fullName: 'Alcantara, Jhon Rey M.', username: 'alcantara.jrm01106', role: 'user', specialRoles: [], studentId: '25-1-01106', roomNumber: '003-B', degreeProgram: 'BSA-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-07', email: 'beltran.c@vsu.edu.ph', fullName: 'Beltran, Carl Joshua V.', username: 'beltran.cjv01107', role: 'user', specialRoles: [], studentId: '24-1-01107', roomNumber: '003-B', degreeProgram: 'BSIT-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-08', email: 'cortez.e@vsu.edu.ph', fullName: 'Cortez, Emmanuel B.', username: 'cortez.eb01108', role: 'user', specialRoles: [], studentId: '23-1-01108', roomNumber: '003-B', degreeProgram: 'BSGE-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-09', email: 'dizon.p@vsu.edu.ph', fullName: 'Dizon, Patrick Ian N.', username: 'dizon.pin01109', role: 'user', specialRoles: [], studentId: '24-1-01109', roomNumber: '003-B', degreeProgram: 'BSEd-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-10', email: 'enriquez.m@vsu.edu.ph', fullName: 'Enriquez, Mark Louis T.', username: 'enriquez.mlt01110', role: 'user', specialRoles: [], studentId: '25-1-01110', roomNumber: '003-B', degreeProgram: 'BSF-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-11', email: 'bajao.m@vsu.edu.ph', fullName: 'Bajao, Marc Angelo L.', username: 'bajao.mal01111', role: 'user', specialRoles: [], studentId: '24-1-01111', roomNumber: '004-A', degreeProgram: 'BSCS-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-12', email: 'cabero.j@vsu.edu.ph', fullName: 'Cabero, Jerald Brian T.', username: 'cabero.jbt01112', role: 'user', specialRoles: [], studentId: '25-1-01112', roomNumber: '004-A', degreeProgram: 'AB-Philo-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-13', email: 'viter.g@vsu.edu.ph', fullName: 'Viter, Gezer Briel', username: 'viter.gb01113', role: 'user', specialRoles: [], studentId: '24-1-01113', roomNumber: '004-A', degreeProgram: 'BSEd Science-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-14', email: 'miasco.e@vsu.edu.ph', fullName: 'Miasco, Ezra', username: 'miasco.e01114', role: 'user', specialRoles: [], studentId: '23-1-01114', roomNumber: '004-A', degreeProgram: 'BSN-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-15', email: 'lagaret.n@vsu.edu.ph', fullName: 'Lagaret, Niel Wyne', username: 'lagaret.nw01115', role: 'user', specialRoles: [], studentId: '22-1-01115', roomNumber: '004-A', degreeProgram: 'BSGE-4', yearLevel: '4th Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-16', email: 'gloria.d@vsu.edu.ph', fullName: 'Gloria, Derick O.', username: 'gloria.do01116', role: 'user', specialRoles: [], studentId: '22-1-01116', roomNumber: '004-B', degreeProgram: 'BSA Horti-4', yearLevel: '4th Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-17', email: 'maligon.e@vsu.edu.ph', fullName: 'Malig-on, Edward Emmanuel G.', username: 'maligon.eeg01117', role: 'user', specialRoles: [], studentId: '23-1-01117', roomNumber: '004-B', degreeProgram: 'BSAB-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-18', email: 'martinez.j@vsu.edu.ph', fullName: 'Martinez, John Kenneth O.', username: 'martinez.jko01118', role: 'user', specialRoles: [], studentId: '22-1-01118', roomNumber: '004-B', degreeProgram: 'BSA AnSci-4', yearLevel: '4th Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-19', email: 'conejos.h@vsu.edu.ph', fullName: 'Conejos, Harley', username: 'conejos.h01119', role: 'user', specialRoles: [], studentId: '23-1-01119', roomNumber: '004-B', degreeProgram: 'BSA AnSci-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-20', email: 'timkang.j@vsu.edu.ph', fullName: 'Timkang, Jayson', username: 'timkang.j01120', role: 'user', specialRoles: [], studentId: '24-1-01120', roomNumber: '004-B', degreeProgram: 'BSA-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-21', email: 'gacayan.v@vsu.edu.ph', fullName: 'Gacayan, Vince Neil C.', username: 'gacayan.vnc01121', role: 'user', specialRoles: [], studentId: '24-1-01121', roomNumber: '005-A', degreeProgram: 'BSFT-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-22', email: 'herrera.r@vsu.edu.ph', fullName: 'Herrera, Ronnel M.', username: 'herrera.rm01122', role: 'user', specialRoles: [], studentId: '24-1-01122', roomNumber: '005-A', degreeProgram: 'BSCE-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-23', email: 'javier.a@vsu.edu.ph', fullName: 'Javier, Adrian Paul E.', username: 'javier.ape01123', role: 'user', specialRoles: [], studentId: '23-1-01123', roomNumber: '005-A', degreeProgram: 'BSME-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-24', email: 'lim.k@vsu.edu.ph', fullName: 'Lim, Keith Ronald G.', username: 'lim.krg01124', role: 'user', specialRoles: [], studentId: '23-1-01124', roomNumber: '005-A', degreeProgram: 'BSCS-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-25', email: 'mendoza.s@vsu.edu.ph', fullName: 'Mendoza, Sean Kyle P.', username: 'mendoza.skp01125', role: 'user', specialRoles: [], studentId: '25-1-01125', roomNumber: '005-A', degreeProgram: 'BSA-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-26', email: 'navarro.c@vsu.edu.ph', fullName: 'Navarro, Clark Kent D.', username: 'navarro.ckd01126', role: 'user', specialRoles: [], studentId: '24-1-01126', roomNumber: '005-A', degreeProgram: 'BSAB-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-27', email: 'ocampo.j@vsu.edu.ph', fullName: 'Ocampo, Justin Drake F.', username: 'ocampo.jdf01127', role: 'user', specialRoles: [], studentId: '25-1-01127', roomNumber: '005-B', degreeProgram: 'BSIT-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-28', email: 'pascual.b@vsu.edu.ph', fullName: 'Pascual, Bryan Dale T.', username: 'pascual.bdt01128', role: 'user', specialRoles: [], studentId: '24-1-01128', roomNumber: '005-B', degreeProgram: 'BSGE-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-29', email: 'quirante.d@vsu.edu.ph', fullName: 'Quirante, Dave Allen S.', username: 'quirante.das01129', role: 'user', specialRoles: [], studentId: '24-1-01129', roomNumber: '005-B', degreeProgram: 'BSN-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-30', email: 'ramos.j@vsu.edu.ph', fullName: 'Ramos, Joshua Kurt B.', username: 'ramos.jkb01130', role: 'user', specialRoles: [], studentId: '23-1-01130', roomNumber: '005-B', degreeProgram: 'BSEd-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-31', email: 'salvador.k@vsu.edu.ph', fullName: 'Salvador, Kyle Matthew L.', username: 'salvador.kml01131', role: 'user', specialRoles: [], studentId: '24-1-01131', roomNumber: '005-B', degreeProgram: 'BSF-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-g-32', email: 'tolentino.l@vsu.edu.ph', fullName: 'Tolentino, Lance Gabriel M.', username: 'tolentino.lgm01132', role: 'user', specialRoles: [], studentId: '25-1-01132', roomNumber: '005-B', degreeProgram: 'BSME-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-01', email: 'abad.c@vsu.edu.ph', fullName: 'Abad, Christian V.', username: 'abad.cv01133', role: 'user', specialRoles: [], studentId: '25-1-01133', roomNumber: '101', degreeProgram: 'BSCS-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-02', email: 'bautista.p@vsu.edu.ph', fullName: 'Bautista, Paulo M.', username: 'bautista.pm01134', role: 'user', specialRoles: [], studentId: '24-1-01134', roomNumber: '101', degreeProgram: 'BSIT-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-03', email: 'castillo.a@vsu.edu.ph', fullName: 'Castillo, Andrei G.', username: 'castillo.ag01135', role: 'user', specialRoles: [], studentId: '25-1-01135', roomNumber: '101', degreeProgram: 'BSCE-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-04', email: 'david.s@vsu.edu.ph', fullName: 'David, Sean Patrick L.', username: 'david.spl01136', role: 'user', specialRoles: [], studentId: '24-1-01136', roomNumber: '101', degreeProgram: 'BSME-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3', email: 'treasurer@vsu.edu.ph', fullName: 'Dela Cruz, Juan Miguel', username: 'delacruz.jm01234', role: 'user', specialRoles: ['Treasurer'], studentId: '22-1-01234', roomNumber: '102', degreeProgram: 'BS in Computer Science', yearLevel: '4th Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-05', email: 'esteban.g@vsu.edu.ph', fullName: 'Esteban, Gerald K.', username: 'esteban.gk01137', role: 'user', specialRoles: [], studentId: '24-1-01137', roomNumber: '102', degreeProgram: 'BSA-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-06', email: 'fabian.r@vsu.edu.ph', fullName: 'Fabian, Renz J.', username: 'fabian.rj01138', role: 'user', specialRoles: [], studentId: '23-1-01138', roomNumber: '102', degreeProgram: 'BSAB-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-07', email: 'garcia.m@vsu.edu.ph', fullName: 'Garcia, Mark Anthony D.', username: 'garcia.mad01139', role: 'user', specialRoles: [], studentId: '25-1-01139', roomNumber: '102', degreeProgram: 'BSGE-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-4', email: 'secretary@vsu.edu.ph', fullName: 'De Los Santos, Jose Mari', username: 'delossantos.jm00987', role: 'user', specialRoles: ['Secretary'], studentId: '24-1-00987', roomNumber: '103', degreeProgram: 'BS in Forestry', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-6', email: 'evaluator@vsu.edu.ph', fullName: 'Hermoso, Mark Evaluator', username: 'hermoso.me08888', role: 'user', specialRoles: ['Evaluator'], studentId: '23-1-08888', roomNumber: '103', degreeProgram: 'BS in Biology', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-08', email: 'ignacio.f@vsu.edu.ph', fullName: 'Ignacio, Francis B.', username: 'ignacio.fb01140', role: 'user', specialRoles: [], studentId: '24-1-01140', roomNumber: '103', degreeProgram: 'BSFT-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-09', email: 'jacinto.n@vsu.edu.ph', fullName: 'Jacinto, Neil Allen P.', username: 'jacinto.nap01141', role: 'user', specialRoles: [], studentId: '25-1-01141', roomNumber: '103', degreeProgram: 'BSN-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-5', email: 'km@vsu.edu.ph', fullName: 'Celeres, Anthony Lumapat Jr.', username: 'celeres.alj02249', role: 'user', specialRoles: ['Kitchen Manager'], studentId: '23-1-02249', roomNumber: '104', degreeProgram: 'BS in Information Technology', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-8', email: 'media@vsu.edu.ph', fullName: 'Alonso, Marco (Media Officer)', username: 'alonso.mo03311', role: 'user', specialRoles: ['Media'], studentId: '23-1-03311', roomNumber: '104', degreeProgram: 'BS in Development Communication', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-10', email: 'lacson.k@vsu.edu.ph', fullName: 'Lacson, Kenneth M.', username: 'lacson.km01142', role: 'user', specialRoles: [], studentId: '23-1-01142', roomNumber: '104', degreeProgram: 'BSCS-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-11', email: 'manalo.d@vsu.edu.ph', fullName: 'Manalo, Dave R.', username: 'manalo.dr01143', role: 'user', specialRoles: [], studentId: '24-1-01143', roomNumber: '104', degreeProgram: 'BSCE-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-7', email: 'occupant@vsu.edu.ph', fullName: 'Noriega, Carl Vincent S.', username: 'noriega.cvs09999', role: 'user', specialRoles: [], studentId: '25-1-09999', roomNumber: '105', degreeProgram: 'BS in Civil Engineering', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-12', email: 'ortega.r@vsu.edu.ph', fullName: 'Ortega, Reymark C.', username: 'ortega.rc01144', role: 'user', specialRoles: [], studentId: '24-1-01144', roomNumber: '105', degreeProgram: 'BSA-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-13', email: 'perez.j@vsu.edu.ph', fullName: 'Perez, Joshua Dan T.', username: 'perez.jdt01145', role: 'user', specialRoles: [], studentId: '23-1-01145', roomNumber: '105', degreeProgram: 'BSME-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-14', email: 'quizon.a@vsu.edu.ph', fullName: 'Quizon, Arvin L.', username: 'quizon.al01146', role: 'user', specialRoles: [], studentId: '25-1-01146', roomNumber: '105', degreeProgram: 'BSIT-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-15', email: 'rivera.d@vsu.edu.ph', fullName: 'Rivera, Dan Michael E.', username: 'rivera.dme01147', role: 'user', specialRoles: [], studentId: '24-1-01147', roomNumber: '106', degreeProgram: 'BSAB-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-16', email: 'soriano.k@vsu.edu.ph', fullName: 'Soriano, Keith Brian F.', username: 'soriano.kbf01148', role: 'user', specialRoles: [], studentId: '24-1-01148', roomNumber: '106', degreeProgram: 'BSCS-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-17', email: 'torres.c@vsu.edu.ph', fullName: 'Torres, Christian Paul G.', username: 'torres.cpg01149', role: 'user', specialRoles: [], studentId: '23-1-01149', roomNumber: '106', degreeProgram: 'BSF-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-18', email: 'urbina.m@vsu.edu.ph', fullName: 'Urbina, Matthew J.', username: 'urbina.mj01150', role: 'user', specialRoles: [], studentId: '24-1-01150', roomNumber: '106', degreeProgram: 'BSGE-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-19', email: 'valenzuela.j@vsu.edu.ph', fullName: 'Valenzuela, James Ryan H.', username: 'valenzuela.jrh01151', role: 'user', specialRoles: [], studentId: '24-1-01151', roomNumber: '107', degreeProgram: 'BSEd-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-20', email: 'wong.a@vsu.edu.ph', fullName: 'Wong, Aaron John K.', username: 'wong.ajk01152', role: 'user', specialRoles: [], studentId: '25-1-01152', roomNumber: '107', degreeProgram: 'BSFT-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-21', email: 'yabut.k@vsu.edu.ph', fullName: 'Yabut, Kyle Patrick N.', username: 'yabut.kpn01153', role: 'user', specialRoles: [], studentId: '24-1-01153', roomNumber: '107', degreeProgram: 'BSME-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-22', email: 'zapata.i@vsu.edu.ph', fullName: 'Zapata, Ian Gabriel P.', username: 'zapata.igp01154', role: 'user', specialRoles: [], studentId: '23-1-01154', roomNumber: '107', degreeProgram: 'BSA-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-23', email: 'alcantara.e@vsu.edu.ph', fullName: 'Alcantara, Eric Vincent R.', username: 'alcantara.evr01155', role: 'user', specialRoles: [], studentId: '24-1-01155', roomNumber: '108', degreeProgram: 'BSN-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-24', email: 'bernal.d@vsu.edu.ph', fullName: 'Bernal, Dominic S.', username: 'bernal.ds01156', role: 'user', specialRoles: [], studentId: '25-1-01156', roomNumber: '108', degreeProgram: 'BSCS-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-25', email: 'capistrano.l@vsu.edu.ph', fullName: 'Capistrano, Lloyd M.', username: 'capistrano.lm01157', role: 'user', specialRoles: [], studentId: '23-1-01157', roomNumber: '108', degreeProgram: 'BSCE-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-26', email: 'domingo.p@vsu.edu.ph', fullName: 'Domingo, Paul Jansen T.', username: 'domingo.pjt01158', role: 'user', specialRoles: [], studentId: '23-1-01158', roomNumber: '108', degreeProgram: 'BSIT-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-27', email: 'evangelista.j@vsu.edu.ph', fullName: 'Evangelista, John Dave V.', username: 'evangelista.jdv01159', role: 'user', specialRoles: [], studentId: '24-1-01159', roomNumber: '109', degreeProgram: 'BSA Agro-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-28', email: 'fajardo.j@vsu.edu.ph', fullName: 'Fajardo, Justin Troy A.', username: 'fajardo.jta01160', role: 'user', specialRoles: [], studentId: '25-1-01160', roomNumber: '109', degreeProgram: 'BSAB-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-29', email: 'guerrero.r@vsu.edu.ph', fullName: 'Guerrero, Ruel B.', username: 'guerrero.rb01161', role: 'user', specialRoles: [], studentId: '22-1-01161', roomNumber: '109', degreeProgram: 'BSGE-4', yearLevel: '4th Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-30', email: 'hernandez.c@vsu.edu.ph', fullName: 'Hernandez, Carlo Miguel C.', username: 'hernandez.cmc01162', role: 'user', specialRoles: [], studentId: '24-1-01162', roomNumber: '109', degreeProgram: 'BSF-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-31', email: 'ibarra.v@vsu.edu.ph', fullName: 'Ibarra, Vince Joseph D.', username: 'ibarra.vjd01163', role: 'user', specialRoles: [], studentId: '25-1-01163', roomNumber: '110', degreeProgram: 'BSME-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-32', email: 'jimenez.k@vsu.edu.ph', fullName: 'Jimenez, Kurt Russell E.', username: 'jimenez.kre01164', role: 'user', specialRoles: [], studentId: '24-1-01164', roomNumber: '110', degreeProgram: 'BSCE-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-33', email: 'katigbak.l@vsu.edu.ph', fullName: 'Katigbak, Lance F.', username: 'katigbak.lf01165', role: 'user', specialRoles: [], studentId: '24-1-01165', roomNumber: '110', degreeProgram: 'BSCS-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-1-34', email: 'lao.p@vsu.edu.ph', fullName: 'Lao, Peter Gabriel G.', username: 'lao.pgg01166', role: 'user', specialRoles: [], studentId: '23-1-01166', roomNumber: '110', degreeProgram: 'BSA AnSci-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-01', email: 'valdez.m@vsu.edu.ph', fullName: 'Valdez, Miguel A.', username: 'valdez.ma02211', role: 'user', specialRoles: [], studentId: '24-1-02211', roomNumber: '211', degreeProgram: 'BSCE-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-02', email: 'morales.j@vsu.edu.ph', fullName: 'Morales, Joshua T.', username: 'morales.jt02212', role: 'user', specialRoles: [], studentId: '23-1-02212', roomNumber: '211', degreeProgram: 'BSCS-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-03', email: 'castro.r@vsu.edu.ph', fullName: 'Castro, Renz P.', username: 'castro.rp02213', role: 'user', specialRoles: [], studentId: '25-1-02213', roomNumber: '211', degreeProgram: 'BSME-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-04', email: 'santiago.l@vsu.edu.ph', fullName: 'Santiago, Luis K.', username: 'santiago.lk02214', role: 'user', specialRoles: [], studentId: '24-1-02214', roomNumber: '211', degreeProgram: 'BSIT-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-06', email: 'mercado.k@vsu.edu.ph', fullName: 'Mercado, Kenneth D.', username: 'mercado.kd02216', role: 'user', specialRoles: [], studentId: '23-1-02216', roomNumber: '212', degreeProgram: 'BSA-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-07', email: 'padilla.a@vsu.edu.ph', fullName: 'Padilla, Aaron C.', username: 'padilla.ac02217', role: 'user', specialRoles: [], studentId: '24-1-02217', roomNumber: '212', degreeProgram: 'BSAB-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-08', email: 'romero.c@vsu.edu.ph', fullName: 'Romero, Carl B.', username: 'romero.cb02218', role: 'user', specialRoles: [], studentId: '25-1-02218', roomNumber: '212', degreeProgram: 'BSF-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-09', email: 'aquino.d@vsu.edu.ph', fullName: 'Aquino, Daniel M.', username: 'aquino.dm02219', role: 'user', specialRoles: [], studentId: '23-1-02219', roomNumber: '212', degreeProgram: 'BSN-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-10', email: 'delgado.v@vsu.edu.ph', fullName: 'Delgado, Vince E.', username: 'delgado.ve02220', role: 'user', specialRoles: [], studentId: '24-1-02220', roomNumber: '213', degreeProgram: 'BSCS-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-11', email: 'estrada.j@vsu.edu.ph', fullName: 'Estrada, John Carlo F.', username: 'estrada.jcf02221', role: 'user', specialRoles: [], studentId: '24-1-02221', roomNumber: '213', degreeProgram: 'BSGE-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-12', email: 'fuentes.r@vsu.edu.ph', fullName: 'Fuentes, Ronald G.', username: 'fuentes.rg02222', role: 'user', specialRoles: [], studentId: '23-1-02222', roomNumber: '213', degreeProgram: 'BSME-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-13', email: 'guinto.p@vsu.edu.ph', fullName: 'Guinto, Paolo H.', username: 'guinto.ph02223', role: 'user', specialRoles: [], studentId: '25-1-02223', roomNumber: '213', degreeProgram: 'BSCE-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-14', email: 'espiritu.j@vsu.edu.ph', fullName: 'Espiritu, John Paul R.', username: 'espiritu.jpr02224', role: 'user', specialRoles: [], studentId: '24-1-02224', roomNumber: '216', degreeProgram: 'BSCE-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-15', email: 'ilagan.k@vsu.edu.ph', fullName: 'Ilagan, Kevin Dave J.', username: 'ilagan.kdj02225', role: 'user', specialRoles: [], studentId: '24-1-02225', roomNumber: '216', degreeProgram: 'BSFT-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-16', email: 'jocson.r@vsu.edu.ph', fullName: 'Jocson, Raymond K.', username: 'jocson.rk02226', role: 'user', specialRoles: [], studentId: '25-1-02226', roomNumber: '216', degreeProgram: 'BSA-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-17', email: 'labrador.j@vsu.edu.ph', fullName: 'Labrador, Jeffrey L.', username: 'labrador.jl02227', role: 'user', specialRoles: [], studentId: '23-1-02227', roomNumber: '216', degreeProgram: 'BSIT-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-18', email: 'ferrari.m@vsu.edu.ph', fullName: 'Ferrari, Marco S.', username: 'ferrari.ms02228', role: 'user', specialRoles: [], studentId: '23-1-02228', roomNumber: '217', degreeProgram: 'BSIT-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-19', email: 'macaraeg.n@vsu.edu.ph', fullName: 'Macaraeg, Nathan M.', username: 'macaraeg.nm02229', role: 'user', specialRoles: [], studentId: '24-1-02229', roomNumber: '217', degreeProgram: 'BSAB-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-20', email: 'nacario.p@vsu.edu.ph', fullName: 'Nacario, Philip N.', username: 'nacario.pn02230', role: 'user', specialRoles: [], studentId: '23-1-02230', roomNumber: '217', degreeProgram: 'BSF-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-21', email: 'obra.s@vsu.edu.ph', fullName: 'Obra, Sean Michael P.', username: 'obra.smp02231', role: 'user', specialRoles: [], studentId: '25-1-02231', roomNumber: '217', degreeProgram: 'BSCS-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-22', email: 'gomez.n@vsu.edu.ph', fullName: 'Gomez, Neil T.', username: 'gomez.nt02232', role: 'user', specialRoles: [], studentId: '24-1-02232', roomNumber: '218', degreeProgram: 'BSA-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-23', email: 'pabilona.t@vsu.edu.ph', fullName: 'Pabilona, Tristan Q.', username: 'pabilona.tq02233', role: 'user', specialRoles: [], studentId: '24-1-02233', roomNumber: '218', degreeProgram: 'BSME-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-24', email: 'quiambao.v@vsu.edu.ph', fullName: 'Quiambao, Vincent R.', username: 'quiambao.vr02234', role: 'user', specialRoles: [], studentId: '24-1-02234', roomNumber: '218', degreeProgram: 'BSN-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-25', email: 'resurreccion.w@vsu.edu.ph', fullName: 'Resurreccion, Warren S.', username: 'resurreccion.ws02235', role: 'user', specialRoles: [], studentId: '23-1-02235', roomNumber: '218', degreeProgram: 'BSCE-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-26', email: 'hidalgo.p@vsu.edu.ph', fullName: 'Hidalgo, Peter L.', username: 'hidalgo.pl02236', role: 'user', specialRoles: [], studentId: '25-1-02236', roomNumber: '219', degreeProgram: 'BSFT-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-27', email: 'sarmiento.x@vsu.edu.ph', fullName: 'Sarmiento, Xavier T.', username: 'sarmiento.xt02237', role: 'user', specialRoles: [], studentId: '25-1-02237', roomNumber: '219', degreeProgram: 'BSGE-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-28', email: 'teves.y@vsu.edu.ph', fullName: 'Teves, Yuri V.', username: 'teves.yv02238', role: 'user', specialRoles: [], studentId: '24-1-02238', roomNumber: '219', degreeProgram: 'BSCS-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-29', email: 'urbano.z@vsu.edu.ph', fullName: 'Urbano, Zach W.', username: 'urbano.zw02239', role: 'user', specialRoles: [], studentId: '23-1-02239', roomNumber: '219', degreeProgram: 'BSA Horti-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-30', email: 'isidro.r@vsu.edu.ph', fullName: 'Isidro, Ronald Q.', username: 'isidro.rq02240', role: 'user', specialRoles: [], studentId: '22-1-02240', roomNumber: '220', degreeProgram: 'BSGE-4', yearLevel: '4th Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-31', email: 'villanueva.a@vsu.edu.ph', fullName: 'Villanueva, Alvin Y.', username: 'villanueva.ay02241', role: 'user', specialRoles: [], studentId: '23-1-02241', roomNumber: '220', degreeProgram: 'BSAB-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-32', email: 'ybanez.b@vsu.edu.ph', fullName: 'Ybañez, Brian Z.', username: 'ybanez.bz02242', role: 'user', specialRoles: [], studentId: '24-1-02242', roomNumber: '220', degreeProgram: 'BSIT-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-2-33', email: 'zubiri.c@vsu.edu.ph', fullName: 'Zubiri, Cedric A.', username: 'zubiri.ca02243', role: 'user', specialRoles: [], studentId: '25-1-02243', roomNumber: '220', degreeProgram: 'BSME-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-01', email: 'robin.h@vsu.edu.ph', fullName: 'Robin, Heaven B.', username: 'robin.hb03321', role: 'user', specialRoles: [], studentId: '24-1-03321', roomNumber: '321', degreeProgram: 'BSEd SocStud-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-02', email: 'pelias.j@vsu.edu.ph', fullName: 'Pelias, John Francis K.', username: 'pelias.jfk03322', role: 'user', specialRoles: [], studentId: '25-1-03322', roomNumber: '321', degreeProgram: 'BSCS-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-03', email: 'reoma.h@vsu.edu.ph', fullName: 'Reoma, Hary Kris M.', username: 'reoma.hkm03323', role: 'user', specialRoles: [], studentId: '25-1-03323', roomNumber: '321', degreeProgram: 'BSCS-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-04', email: 'abarquez.s@vsu.edu.ph', fullName: 'Abarquez, Siemon Danielle B.', username: 'abarquez.sdb03324', role: 'user', specialRoles: [], studentId: '25-1-03324', roomNumber: '321', degreeProgram: 'BSFT-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-06', email: 'malima.k@vsu.edu.ph', fullName: 'Malima, Kenjie P.', username: 'malima.kp03326', role: 'user', specialRoles: [], studentId: '23-1-03326', roomNumber: '322', degreeProgram: 'BSA AnSci-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-07', email: 'soriano.g@vsu.edu.ph', fullName: 'Soriano, Gerald C.', username: 'soriano.gc03327', role: 'user', specialRoles: [], studentId: '24-1-03327', roomNumber: '322', degreeProgram: 'BSA-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-08', email: 'teodoro.m@vsu.edu.ph', fullName: 'Teodoro, Marvin B.', username: 'teodoro.mb03328', role: 'user', specialRoles: [], studentId: '23-1-03328', roomNumber: '322', degreeProgram: 'BSCS-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-09', email: 'umali.j@vsu.edu.ph', fullName: 'Umali, Jerome D.', username: 'umali.jd03329', role: 'user', specialRoles: [], studentId: '24-1-03329', roomNumber: '322', degreeProgram: 'BSIT-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-10', email: 'villegas.r@vsu.edu.ph', fullName: 'Villegas, Raymond S.', username: 'villegas.rs03330', role: 'user', specialRoles: [], studentId: '23-1-03330', roomNumber: '323', degreeProgram: 'BSCE-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-11', email: 'bravo.c@vsu.edu.ph', fullName: 'Bravo, Christian E.', username: 'bravo.ce03331', role: 'user', specialRoles: [], studentId: '25-1-03331', roomNumber: '323', degreeProgram: 'BSME-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-12', email: 'crisostomo.d@vsu.edu.ph', fullName: 'Crisostomo, Dave F.', username: 'crisostomo.df03332', role: 'user', specialRoles: [], studentId: '24-1-03332', roomNumber: '323', degreeProgram: 'BSF-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-13', email: 'dizon.e@vsu.edu.ph', fullName: 'Dizon, Elvin G.', username: 'dizon.eg03333', role: 'user', specialRoles: [], studentId: '25-1-03333', roomNumber: '323', degreeProgram: 'BSA-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-14', email: 'yap.k@vsu.edu.ph', fullName: 'Yap, Kevin L.', username: 'yap.kl03334', role: 'user', specialRoles: [], studentId: '24-1-03334', roomNumber: '324', degreeProgram: 'BSAB-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-15', email: 'escobar.f@vsu.edu.ph', fullName: 'Escobar, Felix H.', username: 'escobar.fh03335', role: 'user', specialRoles: [], studentId: '23-1-03335', roomNumber: '324', degreeProgram: 'BSGE-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-16', email: 'figueroa.g@vsu.edu.ph', fullName: 'Figueroa, Gabriel J.', username: 'figueroa.gj03336', role: 'user', specialRoles: [], studentId: '24-1-03336', roomNumber: '324', degreeProgram: 'BSN-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-17', email: 'galang.h@vsu.edu.ph', fullName: 'Galang, Hector K.', username: 'galang.hk03337', role: 'user', specialRoles: [], studentId: '24-1-03337', roomNumber: '324', degreeProgram: 'BSCS-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-18', email: 'zamora.a@vsu.edu.ph', fullName: 'Zamora, Anthony F.', username: 'zamora.af03338', role: 'user', specialRoles: [], studentId: '25-1-03338', roomNumber: '325', degreeProgram: 'BSME-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-19', email: 'hipolito.i@vsu.edu.ph', fullName: 'Hipolito, Ivan L.', username: 'hipolito.il03339', role: 'user', specialRoles: [], studentId: '24-1-03339', roomNumber: '325', degreeProgram: 'BSCE-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-20', email: 'inocencio.j@vsu.edu.ph', fullName: 'Inocencio, Joel M.', username: 'inocencio.jm03340', role: 'user', specialRoles: [], studentId: '25-1-03340', roomNumber: '325', degreeProgram: 'BSIT-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-21', email: 'javier.k@vsu.edu.ph', fullName: 'Javier, Kenneth N.', username: 'javier.kn03341', role: 'user', specialRoles: [], studentId: '23-1-03341', roomNumber: '325', degreeProgram: 'BSFT-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-22', email: 'lagman.l@vsu.edu.ph', fullName: 'Lagman, Louie P.', username: 'lagman.lp03342', role: 'user', specialRoles: [], studentId: '24-1-03342', roomNumber: '326', degreeProgram: 'BSA-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-23', email: 'magno.m@vsu.edu.ph', fullName: 'Magno, Manuel Q.', username: 'magno.mq03343', role: 'user', specialRoles: [], studentId: '23-1-03343', roomNumber: '326', degreeProgram: 'BSAB-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-24', email: 'noble.n@vsu.edu.ph', fullName: 'Noble, Nathan R.', username: 'noble.nr03344', role: 'user', specialRoles: [], studentId: '25-1-03344', roomNumber: '326', degreeProgram: 'BSEd-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-25', email: 'ocampo.o@vsu.edu.ph', fullName: 'Ocampo, Oscar S.', username: 'ocampo.os03345', role: 'user', specialRoles: [], studentId: '24-1-03345', roomNumber: '326', degreeProgram: 'BSF-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-26', email: 'pangilinan.p@vsu.edu.ph', fullName: 'Pangilinan, Patrick T.', username: 'pangilinan.pt03346', role: 'user', specialRoles: [], studentId: '23-1-03346', roomNumber: '327', degreeProgram: 'BSCS-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-27', email: 'quintos.r@vsu.edu.ph', fullName: 'Quintos, Ralph V.', username: 'quintos.rv03347', role: 'user', specialRoles: [], studentId: '24-1-03347', roomNumber: '327', degreeProgram: 'BSME-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-28', email: 'reyes.s@vsu.edu.ph', fullName: 'Reyes, Simon W.', username: 'reyes.sw03348', role: 'user', specialRoles: [], studentId: '25-1-03348', roomNumber: '327', degreeProgram: 'BSCE-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-29', email: 'salas.t@vsu.edu.ph', fullName: 'Salas, Timothy Y.', username: 'salas.ty03349', role: 'user', specialRoles: [], studentId: '24-1-03349', roomNumber: '327', degreeProgram: 'BSGE-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-30', email: 'tiu.v@vsu.edu.ph', fullName: 'Tiu, Victor Z.', username: 'tiu.vz03350', role: 'user', specialRoles: [], studentId: '23-1-03350', roomNumber: '328', degreeProgram: 'BSN-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-31', email: 'ubaldo.w@vsu.edu.ph', fullName: 'Ubaldo, Walter A.', username: 'ubaldo.wa03351', role: 'user', specialRoles: [], studentId: '24-1-03351', roomNumber: '328', degreeProgram: 'BSA AnSci-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-32', email: 'velasco.x@vsu.edu.ph', fullName: 'Velasco, Xander B.', username: 'velasco.xb03352', role: 'user', specialRoles: [], studentId: '24-1-03352', roomNumber: '328', degreeProgram: 'BSIT-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-33', email: 'yuson.y@vsu.edu.ph', fullName: 'Yuson, Yancy C.', username: 'yuson.yc03353', role: 'user', specialRoles: [], studentId: '25-1-03353', roomNumber: '328', degreeProgram: 'BSFT-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-34', email: 'agoncillo.z@vsu.edu.ph', fullName: 'Agoncillo, Zandro D.', username: 'agoncillo.zd03354', role: 'user', specialRoles: [], studentId: '25-1-03354', roomNumber: '329', degreeProgram: 'BSAB-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-35', email: 'balagtas.a@vsu.edu.ph', fullName: 'Balagtas, Arnel E.', username: 'balagtas.ae03355', role: 'user', specialRoles: [], studentId: '24-1-03355', roomNumber: '329', degreeProgram: 'BSCS-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-36', email: 'catacutan.b@vsu.edu.ph', fullName: 'Catacutan, Bernard F.', username: 'catacutan.bf03356', role: 'user', specialRoles: [], studentId: '23-1-03356', roomNumber: '329', degreeProgram: 'BSCE-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-37', email: 'dimatulac.c@vsu.edu.ph', fullName: 'Dimatulac, Carl G.', username: 'dimatulac.cg03357', role: 'user', specialRoles: [], studentId: '24-1-03357', roomNumber: '329', degreeProgram: 'BSME-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-38', email: 'estrella.d@vsu.edu.ph', fullName: 'Estrella, Dennis H.', username: 'estrella.dh03358', role: 'user', specialRoles: [], studentId: '23-1-03358', roomNumber: '330', degreeProgram: 'BSA-3', yearLevel: '3rd Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-39', email: 'francisco.e@vsu.edu.ph', fullName: 'Francisco, Edgar J.', username: 'francisco.ej03359', role: 'user', specialRoles: [], studentId: '25-1-03359', roomNumber: '330', degreeProgram: 'BSF-1', yearLevel: '1st Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-40', email: 'guevarra.f@vsu.edu.ph', fullName: 'Guevarra, Ferdinand K.', username: 'guevarra.fk03360', role: 'user', specialRoles: [], studentId: '22-1-03360', roomNumber: '330', degreeProgram: 'BSGE-4', yearLevel: '4th Year', status: 'active', addedAt: '2026-06-01' },
  { id: 'u-3-41', email: 'honrado.g@vsu.edu.ph', fullName: 'Honrado, Glenn L.', username: 'honrado.gl03361', role: 'user', specialRoles: [], studentId: '24-1-03361', roomNumber: '330', degreeProgram: 'BSEd-2', yearLevel: '2nd Year', status: 'active', addedAt: '2026-06-01' },
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
  { id: 'cs-1', dayOfWeek: 'Monday', rooms: ['002', '003-A', '003-B', '004-A', '004-B', '005-A', '005-B', '101', '102'], kitchenOnly: false },
  { id: 'cs-2', dayOfWeek: 'Tuesday', rooms: ['103', '104', '105', '106'], kitchenOnly: false },
  { id: 'cs-3', dayOfWeek: 'Wednesday', rooms: ['107', '108', '109', '110', '211', '212'], kitchenOnly: false },
  { id: 'cs-4', dayOfWeek: 'Thursday', rooms: ['213', '216', '217', '218', '219', '220'], kitchenOnly: false },
  { id: 'cs-5', dayOfWeek: 'Friday', rooms: ['321', '322', '323', '324', '325', '326', '327', '328', '329', '330'], kitchenOnly: false },
  { id: 'cs-6', dayOfWeek: 'Monday', rooms: ['101', '104'], kitchenOnly: true },
  { id: 'cs-7', dayOfWeek: 'Wednesday', rooms: ['102', '105'], kitchenOnly: true },
  { id: 'cs-8', dayOfWeek: 'Friday', rooms: ['103'], kitchenOnly: true },
]

const INITIAL_CLEANING_ATTENDANCE: CleaningAttendance[] = [
  // August 2026 Exact Official Sheet Records (Matching uploaded sheet)
  { id: 'ca-aug-01', date: '2026-08-10', userId: 'u-g-11', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-02', date: '2026-08-11', userId: 'u-g-11', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-03', date: '2026-08-12', userId: 'u-g-11', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-04', date: '2026-08-13', userId: 'u-g-11', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-05', date: '2026-08-14', userId: 'u-g-11', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },

  { id: 'ca-aug-06', date: '2026-08-10', userId: 'u-g-12', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-07', date: '2026-08-11', userId: 'u-g-12', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-08', date: '2026-08-12', userId: 'u-g-12', cleaningType: 'daily', remark: 'excuse', status: 'excused', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-09', date: '2026-08-13', userId: 'u-g-12', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-10', date: '2026-08-14', userId: 'u-g-12', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },

  { id: 'ca-aug-14', date: '2026-08-10', userId: 'u-g-15', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-15', date: '2026-08-11', userId: 'u-g-15', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-16', date: '2026-08-13', userId: 'u-g-15', cleaningType: 'daily', remark: 'absent', status: 'absent', fineAmount: 10, finePaymentId: 'py-fine-aug-15', markedBy: 'reyes.jp05678' },

  { id: 'ca-aug-11', date: '2026-08-10', userId: 'u-g-16', cleaningType: 'daily', remark: 'absent', status: 'absent', fineAmount: 10, finePaymentId: 'py-fine-aug-16', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-12', date: '2026-08-11', userId: 'u-g-16', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-13', date: '2026-08-12', userId: 'u-g-16', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-16b', date: '2026-08-13', userId: 'u-g-16', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-16c', date: '2026-08-14', userId: 'u-g-16', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-16d', date: '2026-08-18', userId: 'u-g-16', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-16e', date: '2026-08-19', userId: 'u-g-16', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },

  { id: 'ca-aug-17', date: '2026-08-10', userId: 'u-3-01', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-18', date: '2026-08-11', userId: 'u-3-01', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-19', date: '2026-08-10', userId: 'u-3-02', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-20', date: '2026-08-11', userId: 'u-3-02', cleaningType: 'daily', remark: 'paid', status: 'absent', fineAmount: 10, markedBy: 'reyes.jp05678' },

  // Seeded realistic records across First, Second, and Third levels
  { id: 'ca-aug-101', date: '2026-08-10', userId: 'u-2', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-102', date: '2026-08-11', userId: 'u-2', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-103', date: '2026-08-12', userId: 'u-2', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-101b', date: '2026-08-10', userId: 'u-sa-2', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-102b', date: '2026-08-11', userId: 'u-sa-2', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-103b', date: '2026-08-12', userId: 'u-sa-2', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-101c', date: '2026-08-10', userId: 'u-sa-3', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-102c', date: '2026-08-11', userId: 'u-sa-3', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-103c', date: '2026-08-12', userId: 'u-sa-3', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },

  { id: 'ca-aug-104', date: '2026-08-10', userId: 'u-3', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-105', date: '2026-08-11', userId: 'u-3', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-106', date: '2026-08-12', userId: 'u-3', cleaningType: 'daily', remark: 'absent', status: 'absent', fineAmount: 10, markedBy: 'reyes.jp05678' },

  { id: 'ca-aug-107', date: '2026-08-10', userId: 'u-4', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-108', date: '2026-08-11', userId: 'u-4', cleaningType: 'daily', remark: 'excuse', status: 'excused', markedBy: 'reyes.jp05678' },

  { id: 'ca-aug-109', date: '2026-08-10', userId: 'u-2-01', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-110', date: '2026-08-11', userId: 'u-2-01', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-111', date: '2026-08-12', userId: 'u-2-01', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },

  { id: 'ca-aug-112', date: '2026-08-10', userId: 'u-2-06', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-113', date: '2026-08-11', userId: 'u-2-06', cleaningType: 'daily', remark: 'absent', status: 'absent', fineAmount: 10, markedBy: 'reyes.jp05678' },

  { id: 'ca-aug-114', date: '2026-08-10', userId: 'u-3-06', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-115', date: '2026-08-11', userId: 'u-3-06', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },
  { id: 'ca-aug-116', date: '2026-08-12', userId: 'u-3-06', cleaningType: 'daily', remark: 'check', status: 'present', markedBy: 'reyes.jp05678' },

  // Standard legacy records
  { id: 'ca-1', date: '2026-06-29', userId: 'u-2', cleaningType: 'daily', remark: 'check', status: 'present', kitchenOnly: false, markedBy: 'reyes.jp05678' },
  { id: 'ca-2', date: '2026-06-29', userId: 'u-3', cleaningType: 'general', remark: 'absent', status: 'absent', fineAmount: 50, finePaymentId: 'py-3', kitchenOnly: false, markedBy: 'reyes.jp05678' },
  { id: 'ca-3', date: '2026-06-28', userId: 'u-3', cleaningType: 'daily', remark: 'paid', status: 'absent', fineAmount: 10, kitchenOnly: false, markedBy: 'reyes.jp05678' },
  { id: 'ca-4', date: '2026-06-29', userId: 'u-7', cleaningType: 'general', remark: 'excuse', status: 'excused', kitchenOnly: false, markedBy: 'reyes.jp05678' },
  { id: 'ca-5', date: '2026-06-29', userId: 'u-5', cleaningType: 'daily', remark: 'na', kitchenOnly: false, markedBy: 'reyes.jp05678' },
  { id: 'ca-6', date: '2026-06-29', userId: 'u-2', cleaningType: 'daily', remark: 'check', status: 'present', kitchenOnly: true, markedBy: 'celeres.a02249' },
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
      '002': 'u-2',
      '101': 'u-1-01',
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
    const activeOccCount = existingUsers.filter(u => u.status === 'active' && u.role === 'user' && u.roomNumber).length
    const hasRoom002 = existingUsers.some(u => u.roomNumber === '002')

    // If cached localStorage has an outdated occupant count or is missing Room 002, re-seed with full 147 PRESET_USERS
    let finalUsers = existingUsers
    if (activeOccCount !== 147 || !hasRoom002) {
      finalUsers = [...PRESET_USERS, ...INITIAL_PENDING_SIGNUPS]
    } else {
      PRESET_USERS.forEach(pu => {
        const idx = finalUsers.findIndex(u => u.id === pu.id || u.email === pu.email)
        if (idx === -1) {
          finalUsers.push(pu)
        } else {
          finalUsers[idx] = { ...finalUsers[idx], ...pu }
        }
      })
      // Ensure all initial pending signup records are populated
      INITIAL_PENDING_SIGNUPS.forEach(ps => {
        const idx = finalUsers.findIndex(u => u.id === ps.id || u.email === ps.email)
        if (idx === -1) {
          finalUsers.push(ps)
        }
      })
    }

    const existingAttendance: CleaningAttendance[] = parsed.cleaningAttendance || []
    INITIAL_CLEANING_ATTENDANCE.forEach(ca => {
      if (!existingAttendance.some(e => e.id === ca.id)) {
        existingAttendance.push(ca)
      }
    })

    const mergedDb: MockDatabase = {
      ...DEFAULT_DB,
      ...parsed,
      users: finalUsers,
      cleaningAttendance: existingAttendance,
      cleaningSchedule: parsed.cleaningSchedule && parsed.cleaningSchedule.length > 5 ? parsed.cleaningSchedule : DEFAULT_DB.cleaningSchedule,
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
