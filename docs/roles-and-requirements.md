# MMH Connect — Project Specification & Roles Reference Guide

**System:** Mahogany Men's Hall (MMH) Dormitory Management System  
**URL:** https://mmh-connect.vercel.app  
**Document Version:** 2.0 (Comprehensive Master Specification)  
**Purpose:** Source of truth for architecture, user roles, sidebar navigation, specialized occupant tools, permissions matrix, workflows, and business rules.

---

## 1. System Architecture & Main Roles

MMH Connect operates on a tri-tier main role architecture. Every user account belongs primarily to one of these three main roles:

```
                  ┌──────────────────────────────────────────┐
                  │            MMH CONNECT SYSTEM            │
                  └────────────────────┬─────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
  ┌─────────────┐               ┌─────────────┐               ┌─────────────┐
  │    ADMIN    │               │  OCCUPANT   │               │  DEVELOPER  │
  └──────┬──────┘               └──────┬──────┘               └─────────────┘
         │                             │
  ┌──────┴──────┐          ┌───────────┴───────────┐
  │ Adviser     │          │ Default Occupant View │
  │ Asst.Adv.   │          └───────────┬───────────┘
  └─────────────┘                      │ (Optional Special Roles)
                    ┌──────────────────┼──────────────────┐
                    ▼                  ▼                  ▼
             ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
             │ Student Asst│    │  President  │    │ Kitchen Mgr │
             ├─────────────┤    ├─────────────┤    ├─────────────┤
             │  Treasurer  │    │  Secretary  │    │  Evaluator  │
             ├─────────────┤    └─────────────┴────┴─────────────┘
             │ Media Officer│
             └─────────────┘
```

### 1.1 Main Roles Overview

1. **Admin (Dormitory Adviser & Assistant Adviser)**
   - **Target Users:** Dormitory Adviser and Assistant Adviser(s).
   - **Scope:** Full administrative governance over the residence hall.
   - **Responsibilities:**
     - User account lifecycle management (reviewing self-registrations, approving/rejecting accounts, user activation, deactivation, and permanent removal).
     - Academic Year (AY) and Semester roster configuration (creating separate rosters for 1st Semester and 2nd Semester).
     - Election setup (creating Officer Elections, populating candidates, running Evaluator Elections).
     - Final approval for occupant "Leave Dormitory" requests.
     - System-wide policy and fine rate configurations.

2. **Occupant**
   - **Target Users:** All student residents living in Mahogany Men's Hall.
   - **Scope:** Personal dorm management, duty compliance, payment tracking, and community participation.
   - **Responsibilities:**
     - Access personal portal dashboard to inspect cleaning assignments, fines, event dues, meeting minutes, violations, and evaluation scores.
     - Self-register for accounts and maintain profile accuracy.
     - Perform assigned cleaning duties (general cleaning and kitchen cleaning if registered as a kitchen user).
     - Submit payments for maintenance fees, gadget fees, fines, and event collectables.
     - Vote in dorm elections and participate in semester evaluations.
     - Submit formal "Leave Dormitory" requests when vacating residence.
   - **Special Role Extensions:** Occupants may hold one or more **Special Roles** (e.g., President, Treasurer, Secretary, Student Assistant, Kitchen Manager, Evaluator, Media Officer), unlocking dedicated management tools within their portal.

3. **Developer**
   - **Target Users:** System maintainers, software engineers, and technical administrators.
   - **Scope:** Technical operations, application health, system auditing, and infrastructure maintenance.
   - **Responsibilities:**
     - System health monitoring, error log inspection, and runtime diagnostics.
     - Database schema migrations, index optimization, and backup verification.
     - API integration management (Gmail SMTP, Supabase Auth/SSR, external webhooks).
     - Environment configuration management (staging vs. production feature flags).
     - Sandbox testing, RBAC role-switch simulation, and debug tools.

---

## 2. Admin Dashboard & Portal Specifications

The **Admin Dashboard** provides the Dormitory Adviser and Assistant Adviser(s) with an executive command center to govern all Mahogany Men's Hall operations, occupant rosters, financial health, elections, and exit clearances.

```
ADMIN DASHBOARD ARCHITECTURE
├── 📊 Key Performance Indicator (KPI) Cards
│    ├── Total Active Occupants (1st & 2nd Semester)
│    ├── Pending Registration Approvals Queue
│    ├── Dorm Occupancy Rate & Room Allocation Breakdown
│    ├── Total Revenue & Pending Collections (Maintenance, Gadgets, Fines, Events)
│    ├── Active Violation Alerts & Unresolved Discipline Cases
│    └── Pending Leave Dormitory Exit Clearances
├── 👥 User & Roster Management Module
│    ├── Pending Sign-Ups Queue (Approve / Reject & Pattern F Auto-Username Generation)
│    ├── Master Occupant Roster (Filter by Academic Year, Semester, Room, Status)
│    ├── Account Lifecycle Control (Activate, Deactivate, Soft Delete / Permanent Remove)
│    └── Academic Year & Semester Roster Initialization
├── ⚖️ Elections & Evaluations Governance Center
│    ├── Officer Elections Setup (Position Creation, Candidate Roster, Voting Status)
│    ├── Officer Election Tally & Abstain (No-Confidence) Audit
│    └── Evaluator Election Trigger & Qualifying Cutoff (N) Setup
├── 🚪 Leave Dormitory Clearance Queue
│    ├── Review President-Endorsed Leave Requests
│    ├── Audit Clearance (Keys, Assets, Outstanding Dues & Fines)
│    └── Final Adviser Exit Authorization & Automated Billing Halt
├── 📢 Announcements & System Policy Controls
│    ├── Adviser Direct Broadcast Announcements (Pinned / Urgent)
│    └── System Fine Rate & Fee Policy Settings (Fine amounts, Gadget rates)
└── 💰 Master Financial & Audit Repository
     ├── Centralized Ledger (Maintenance Fees, Gadget Fees, Fines, Event Dues)
     ├── Financial Reports & Meeting Minutes Review
     └── System-Wide Audit Log & Action Trail
```

### 2.1 Detailed Admin Dashboard Modules

#### 1. Executive Summary & KPI Metrics
- **Active Occupants Card:** Displays total registered occupants for the active Academic Year and Semester, broken down by semester standing.
- **Pending Approvals Alert:** Direct counter of unapproved self-registration sign-ups awaiting Adviser review.
- **Occupancy & Room Rate:** Visual capacity bar showing room slot allocations across Mahogany Men's Hall.
- **Financial Collections Summary:** Real-time totals of collected vs. pending dues across Maintenance Fees, Gadget Fees, Fines, and Event Collectables.
- **Pending Exit Clearances:** Active count of "Leave Dormitory" requests submitted by occupants and endorsed by the President.

#### 2. User & Roster Management Module
- **Pending Sign-Up Review Queue:** Review applicant profile fields (Name, Email, Student ID, Room Number, Degree Program, Emergency Contact). Clicking **Approve** sets status to `ACTIVE`, computes `added_at`, auto-generates the locked username (Pattern F), and dispatches credentials via email.
- **Master Occupant Roster Table:** Searchable, filterable table of all dorm residents. Filters include Academic Year, Semester, Room Number, and Account Status (`Pending`, `Active`, `Inactive`, `Left Dormitory`).
- **Account Actions:** Perform manual edits, trigger password resets, toggle account activation state, or execute soft deletion.

#### 3. Elections & Evaluations Governance Center
- **Officer Election Manager:** Create new election cycles, define officer positions (President, Treasurer, Secretary, Kitchen Manager, etc.), assign candidates per position, and monitor live voting metrics. Includes automatic tallying against **Abstain** (no-confidence rule).
- **Evaluator Cycle Launcher:** Initiate end-of-semester evaluation cycles, set the qualifying evaluator count $N$ (e.g. top 15 voted nominees), open room nomination windows, and inspect submitted evaluation scorecards.

#### 4. Leave Dormitory Clearance Queue
- **Endorsed Requests Review:** Inspect leave requests forwarded by the President with initial property/key clearance notes.
- **Final Financial Audit:** Verify zero outstanding balance across all payment streams (fines, maintenance, gadget fees, event dues).
- **Final Exit Authorization:** One-click approval that sets the occupant status to `LEFT_DORMITORY`, locks the departure timestamp, halts future fee generation, and archives records.

#### 5. Master Financial & System Audit Ledger
- **Global Dues & Fine Ledger:** Master view of all payments accrued and settled across all occupants in the residence hall.
- **Policy Configuration:** Define base rates for general cleaning fines, kitchen fines, gadget registration fees, and maintenance dues.
- **System Action Audit Log:** Detailed chronological log of administrative actions (roster approvals, election setup, role assignments, leave authorizations).

---

## 3. Occupant Sidebar & Portal Specifications

All occupants access a standardized, intuitive sidebar navigation tailored to residence hall life. The sidebar exposes core personal views, duty schedules, payment records, and administrative settings.

```
OCCUPANT SIDEBAR
├── 📌 My Bulletin
│    ├── Welcome Banner
│    ├── Official Announcements
│    ├── Upcoming Events Calendar
│    └── Assigned Cleaning Area (General & Kitchen)
├── 👤 Occupant Profile
│    ├── Profile Photo & Full Name
│    ├── Student ID, Username & Email
│    ├── Room Number, Degree Program & Year Level
│    ├── Permanent Home Address
│    └── Parent/Guardian Emergency Contact
├── 📅 Attendance & Schedules
│    ├── General Cleaning Schedules & Attendance
│    ├── Kitchen Cleaning Schedules & Attendance (Kitchen Users)
│    └── Assembly & Event Schedules & Attendance
├── 💳 Payment Records
│    ├── Event Contributions Dues List
│    ├── General Cleaning Fines
│    ├── Kitchen Cleaning Fines (Kitchen Users)
│    ├── Gadget Registration Fees
│    └── Dormitory Maintenance Fees
├── 📑 Minutes & Records
│    ├── General Meeting Minutes Archive
│    └── Monthly & Semester Financial Reports
├── ⚠️ Violation Records
│    └── Infraction History, Severity Level & Status
├── 📊 Evaluation Performance
│    └── Score Breakdowns, Dorm Rank & Standing
└── ⚙️ Settings
     ├── Edit Profile Details
     └── Leave Dormitory (Send Request to Adviser)
```

### 2.1 Detailed Section Specifications

#### 1. My Bulletin
- **Welcome Card:** Displays greeting, current Academic Year, Semester status, assigned room, and active occupant badges.
- **Official Announcements:** Feed of pinned and recent notices posted by the President, Media Officer, or Adviser. Supports rich media, category badges (Urgent, General, Event), and published timestamps.
- **Upcoming Events Calendar:** Chronological list of upcoming dorm assemblies, clean-up drives, officer elections, and social programs.
- **Assigned Area Cleaning Card:** Highlights the occupant's currently assigned cleaning duty area (e.g., "Ground Floor Hallway", "Bathroom B") and next duty date. Includes the **Kitchen Cleaning Schedule** card if the occupant is an active Kitchen User.

#### 2. Occupant Profile
- **Picture:** Profile photo / avatar display.
- **Full Name:** First Name, Middle Name, Last Name, Suffix (Jr./Sr./III).
- **Username:** System-generated, locked username (e.g., `celeres.a02249` — see Pattern F rule in §5.3).
- **Email:** Primary email address used for system notifications and credential delivery.
- **Student ID:** University identification number (e.g., `23-1-02249`).
- **Room Number:** Designated room assignment in Mahogany Men's Hall.
- **Degree Program & Year Level:** Academic course (e.g., BS Computer Science) and current year standing (e.g., 3rd Year).
- **Home Address:** Complete permanent address (Barangay, City/Municipality, Province).
- **Parent/Guardian Emergency Contact:** Full name of parent/guardian, relationship, primary mobile number, and emergency contact address.

#### 3. Attendance & Schedules
- **General Cleaning Schedules & Attendance:** Comprehensive log of past and future cleaning shifts, assigned areas, and recorded attendance status (`Present`, `Absent`, `Excused`).
- **Kitchen Cleaning Schedules & Attendance:** Dedicated schedule tab visible only to registered Kitchen Users, showing kitchen rota shifts and compliance logs.
- **Event Schedules & Attendance:** History of required assemblies, dorm meetings, and activities with attendance markers recorded by the Secretary.

#### 4. Payment Records
- **Event Contributions List:** Itemized dues for dorm social events, sports fests, and special projects. Shows contribution title, amount, due date, payment status (`Paid`, `Unpaid`, `Waived`), and receipt reference.
- **Cleaning Fines:** Ledger of fines incurred from unexcused general cleaning duty absences.
- **Kitchen Fines:** Ledger of fines incurred from unexcused kitchen cleaning duty absences (applicable only to Kitchen Users).
- **Gadget Fee:** Breakdown of monthly/semester fees for registered electrical appliances (e.g., laptops, electric fans, rice cookers).
- **Maintenance Fee:** Standard dorm maintenance and utilities fee record.

#### 5. Minutes & Records
- **General Meeting Minutes:** Central repository of downloadable PDF/document meeting minutes uploaded by the Secretary following general assemblies.
- **Financial Reports:** Accessible collection of itemized financial statements, income/expense reports, and treasury balances published by the Treasurer.

#### 6. Violation Records
- **Infraction History:** Transparent log of registered dorm rule infractions (e.g., curfew breach, noise violation, unauthorized gadget).
- **Details & Severity:** Date of offense, reporting officer (SA/Adviser), severity category (`Minor`, `Major`, `Critical`), offense count (1st/2nd/3rd warning), and resolution/appeal status.

#### 7. Evaluation Performance
- **Evaluation Record Breakdowns:** Detailed criteria scores received during end-of-semester evaluations (e.g., Room Cleanliness, Dorm Participation, Conduct, Community Spirit).
- **Rank & Status:** Numerical rank within the dormitory room/hall, performance category, and evaluation standing.

#### 8. Settings
- **Edit Profile:** Allows updating editable fields (mobile number, profile photo, emergency contact details). Core identity fields (Student ID, Name, Room) require Admin verification to change.
- **Leave Dormitory:** Dedicated request workflow enabling an occupant to submit a formal request to vacate Mahogany Men's Hall (initiating endorsement by the President and final approval by the Adviser).

---

## 4. Specialized Occupant Tools (Role Extensions)

Occupants who hold leadership or functional positions access dedicated **Occupant Tools** integrated into their portal navigation. An occupant can hold zero, one, or multiple special roles simultaneously.

```
       ┌─────────────────────────────────────────────────────────────┐
       │                   SPECIALIZED OCCUPANT TOOLS                │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
   ┌───────────────┬──────────────────┼──────────────────┬───────────────┐
   ▼               ▼                  ▼                  ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Student     │ │  President   │ │   Kitchen    │ │  Treasurer   │ │  Secretary   │
│  Assistant   │ │    Tool      │ │ Manager Tool │ │    Tool      │ │    Tool      │
└──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
       │                │                │                │                │
       └──────────┬─────┴────────────────┼────────────────┴─────┬──────────┘
                  ▼                      ▼                      ▼
           ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
           │  Evaluator   │       │ Media Officer│       │ Multi-Role   │
           │    Tool      │       │    Tool      │       │ Context Switch│
           └──────────────┘       └──────────────┘       └──────────────┘
```

### 3.1 Student Assistant (SA) Tool
- **Role Context:** Appointed directly by the Adviser (no election). Permissions activate immediately upon appointment.
- **Tool Capabilities:**
  1. **Cleaning Schedule Generator & Manager:**
     - Build weekly and monthly general cleaning shift rotas.
     - Assign occupants to dorm cleaning sectors (Ground Floor, 2nd Floor, Stairwells, Restrooms, Yard).
     - Manage and approve shift-swap requests between occupants.
  2. **Cleaning Attendance & Fine Issuance:**
     - Conduct cleaning inspections and mark duty attendance (`Present`, `Absent`, `Excused`).
     - Auto-calculate and issue **Cleaning Fines** for unexcused absences based on active dorm fine rules.
  3. **Dormitory Fees & Gadget Audit:**
     - Monitor occupant **Maintenance Fee** payment status.
     - Perform periodic room gadget audits; log newly registered gadgets and auto-compute **Gadget Fees**.
  4. **Violation Records Management:**
     - Record rule violations against occupants with date, description, category, and evidence attachments.
     - Escalate major violations to the Adviser for formal disciplinary action.

### 3.2 President Tool
- **Role Context:** Elected by occupants via Officer Election.
- **Primary Direct Management:** **Announcements & Bulletin Board Management** (publishing, editing, scheduling, and pinning notices to **My Bulletin**).
- **Sub-Officer Tool Privileges:** The President is granted executive access to open and operate the **Secretary Tool**, **Treasurer Tool**, and **Media Officer Tool** (enabling full operational oversight, assistance, or step-in management).
- **Tool Capabilities:**
  1. **Announcements & Bulletin Board Management (Direct):**
     - Author, schedule, pin, edit, and delete official announcements published on **My Bulletin**.
     - Broadcast urgent alert notifications across all resident portals.
  2. **Executive Access to Sub-Officer Tools:**
     - **Secretary Tool Access:** Record event/assembly attendance, draft/publish meeting minutes, and access dorm document archives.
     - **Treasurer Tool Access:** Manage event dues/collectables, inspect collection ledgers, and upload financial reports.
     - **Media Officer Tool Access:** Upload bulletin graphic banners, manage media archives/galleries, and edit digital PR content.
  3. **Leave Dormitory Request Endorsements:**
     - Receive and review occupant "Leave Dormitory" requests.
     - Verify initial exit clearance (room key return, dorm property inspection, initial sign-off).
     - Attach President Endorsement notes and route the request to the Adviser for final approval.

### 3.3 Kitchen Manager (KM) Tool
- **Role Context:** Elected by occupants via Officer Election.
- **Tool Capabilities:**
  1. **Kitchen Roster Management:**
     - Add or remove occupants as **Kitchen Users** based on stove/kitchen usage registration.
     - Maintain strict time-bound membership timestamps (`added_at` and `removed_at`).
  2. **Kitchen Duty Schedule Generator:**
     - Create specialized weekly cleaning schedules exclusively for active Kitchen Users (Stoves, Sinks, Counters, Refrigerator, Waste Bin).
  3. **Kitchen Attendance & Kitchen Fine Issuance:**
     - Inspect kitchen cleanliness after assigned shifts and log kitchen attendance.
     - Compute and issue **Kitchen Fines** for unexcused absences (billed strictly to kitchen users).
  4. **Pantry & Equipment Audit:**
     - Manage communal fridge tagging rules, clean-out dates, and enforce kitchen hygiene policies.

### 3.4 Treasurer Tool
- **Role Context:** Elected by occupants via Officer Election.
- **Tool Capabilities:**
  1. **Event Contributions Ledger:**
     - Create collectable dues items for dorm events, projects, and social activities.
     - Assign per-occupant dues amounts, payment deadlines, and acceptable payment channels.
     - Mark payments as `Paid`, `Unpaid`, or `Waived`, and issue downloadable payment receipts.
  2. **Financial Reports Publisher:**
     - Upload monthly and semester-end Financial Reports (PDFs / Spreadsheets).
     - Maintain itemized ledgers of income sources, expenses, bank reserves, and petty cash balances.
  3. **Payment Reconciliation & Treasury Analytics:**
     - Reconcile collection summaries across Event Dues, Maintenance Fees, and Fines.
     - Generate financial summary cards and charts accessible under occupants' **Minutes & Records**.

### 3.5 Secretary Tool
- **Role Context:** Elected by occupants via Officer Election.
- **Tool Capabilities:**
  1. **Assembly & Event Attendance Recording:**
     - Execute live attendance tracking during general meetings, assemblies, and dorm activities (via digital roster check-in or QR scanning).
     - Categorize attendance states (`Present`, `Late`, `Excused`, `Unexcused`).
     - Export attendance summaries to SA and Adviser for penalty assessment.
  2. **Minutes of the Meeting Publisher:**
     - Draft, format, and publish official Minutes of the Meeting.
     - Attach PDF documents accessible in all occupants' **Minutes & Records** portal.
  3. **Dorm Repository & Document Archives:**
     - Maintain historical logs of house rules, resolutions, constitutions, and official communications.

### 3.6 Evaluator Tool
- **Role Context:** Nominated per room and elected by top-$N$ vote in Evaluator Election.
- **Tool Capabilities:**
  1. **Semester Evaluation Portal:**
     - Active during the evaluation window established by the Admin at semester end.
     - Access digital evaluation rubrics for assigned rooms and occupants.
  2. **Scoring & Performance Breakdown:**
     - Score occupants on standard criteria: Room Cleanliness, Dorm Duty Compliance, Conduct, and Community Participation.
     - Add qualitative remarks and improvement notes.
  3. **Evaluation Progress & Lock-In:**
     - Monitor completed vs. pending evaluations.
     - Lock and submit evaluation scorecards to finalize dorm rankings.

### 3.7 Media Officer Tool
- **Role Context:** Appointed or Elected officer role.
- **Tool Capabilities:**
  1. **Bulletin Banners & Graphics Management:**
     - Upload and manage promotional banners, digital posters, and visual headers for **My Bulletin**.
     - Style announcement typography and visual cards for maximum community engagement.
  2. **Event Photo/Video Gallery & Media Archives:**
     - Create and manage photo albums for dorm activities, sports events, and general assemblies.
     - Maintain the digital memory wall for the active Academic Year.
  3. **Newsletter & Digital PR Management:**
     - Draft and publish periodic digital newsletters highlighting residence hall milestones.

---

## 5. Workflows & Lifecycle Processes

### 5.1 Account Registration, Approval & Username Auto-Generation

Occupants self-register through a public sign-up form. Accounts are not immediately active; they require Admin approval to enforce roster control and strict non-backdating (`added_at`).

```
 Occupant fills Sign-Up Form (Email + Profile fields)
                       │ (No username/password entered)
                       ▼
         Registration status = PENDING
                       │
                       ▼
       Admin reviews in Admin Portal & Approves
                       │
       ┌───────────────┴───────────────┐
       ▼                               ▼
Assigns to AY/Semester          System Auto-Generates:
Roster                          • Status = ACTIVE
                                • added_at = Current Timestamp
                                • USERNAME (Pattern F)
                                • TEMPORARY PASSWORD
                                       │
                                       ▼
                     System emails Credentials to Occupant
                     (vsu.mahogany@gmail.com via SMTP)
                                       │
                                       ▼
                     Occupant logs in & sets new password
```

#### Username Auto-Generation Pattern (Pattern F)
- **Format:** `{lastname}.{firstInitials}{idTail}`
- **Rules:**
  - `lastname`: Family surname, all words joined, lowercased, spaces/hyphens removed. Suffixes (Jr./Sr./III) excluded.
  - `firstInitials`: Initial of every word in First Name field, lowercased (middle name excluded).
  - `idTail`: Last 5 digits of Student ID (digits only).
- **Examples:**
  - `Anthony Lumapat Celeres Jr.` (`23-1-02249`) → `celeres.a02249`
  - `Juan Miguel Dela Cruz` (`22-1-01234`) → `delacruz.jm01234`
  - `Jose Mari De Los Santos` (`24-1-00987`) → `delossantos.jm00987`

---

### 4.2 Leave Dormitory Request & Exit Clearance Workflow

When an occupant requests to formally exit Mahogany Men's Hall, the system executes a structured multi-stage clearance workflow:

```
[ Occupant Portal: Settings > Leave Dormitory ]
  │
  ├─ 1. Occupant submits request with exit reason & intended departure date.
  │
[ President Tool: Leave Request Endorsements ]
  │
  ├─ 2. President receives alert and performs initial clearance check:
  │  ├── Room key & physical asset return check
  │  ├── Room inventory condition verification
  │  └── Attaches endorsement notes & forwards to Adviser.
  │
[ Admin Portal: Final Adviser Clearance ]
  │
  ├─ 3. Adviser (Admin) performs final audit:
  │  ├── Financial ledger audit (unpaid dues, pending fines)
  │  ├── Disciplinary record audit
  │  └── Approves or Rejects the Leave Request.
  │
[ System Execution on Approval ]
  │
  ├─ 4. Account status updated to LEFT_DORMITORY / Inactive.
  ├─ 5. Effective departure date locked; billing & fine generation halts immediately.
  └─ 6. Record archived into dorm historical archives (preserving financial history).
```

---

### 4.3 Elections & Evaluator Framework

MMH Connect supports two distinct election processes managed by the Admin:

```
                      ┌──────────────────────────────┐
                      │   ADMIN CREATES ELECTION     │
                      └──────────────┬───────────────┘
                                     │
         ┌───────────────────────────┴───────────────────────────┐
         ▼                                                       ▼
  OFFICER ELECTION                                       EVALUATOR ELECTION
  ├── Admin sets Positions & Candidates                  ├── Occupants nominate 1 per room
  ├── Ballot includes ABSTAIN on all positions           ├── Final nominee pool assembled
  ├── Abstain is NO-CONFIDENCE vote                       ├── Admin sets cutoff N (e.g. 15)
  ├── Candidate MUST outnumber Abstain to win            ├── Occupants vote for nominees
  └── Winning auto-activates Special Role                └── Top N become active Evaluators
```

#### Officer Elections & The No-Confidence Rule
- **Candidate Sourcing:** Admin sets candidate lists per position. Single-candidate (unopposed) positions are permitted.
- **Mandatory Abstain Option:** Every position ballot includes **Abstain**.
- **No-Confidence Logic:** A candidate must receive strictly **more votes than Abstain** to be seated. If Abstain wins, no candidate is seated, and the position remains unfilled.
- **Auto-Activation:** Winning an Officer position (President, Treasurer, Secretary, Kitchen Manager) automatically creates the `RoleAssignment` and activates the corresponding tool on the occupant's portal.

---

## 6. System Permissions Matrix

Legend: **M** = Manage/Write, **VA** = View All, **V** = View Own Only, **P** = Participates, **—** = No Access

| Capability / Module | Admin | Developer | SA | Pres | KM | Treas | Sec | Eval | Media | Occupant |
|---|---|---|---|---|---|---|---|---|---|---|
| Admin Dashboard & KPI Overview | **M** | **VA** | — | — | — | — | — | — | — | — |
| User Roster CRUD | **M** | **VA** | — | — | — | — | — | — | — | — |
| Sign-up Approval & Username Gen | **M** | **M** | — | — | — | — | — | — | — | — |
| Developer System Tools & Audit Logs | — | **M** | — | — | — | — | — | — | — | — |
| Announcements & Bulletin Publishing | **M** | — | — | **M** | — | — | — | — | **M** | V |
| General Cleaning Schedule & Fines | **VA** | — | **M** | V | — | — | — | — | — | V |
| Maintenance & Gadget Fees | **VA** | — | **M** | V | — | — | — | — | — | V |
| Violation Logging | **M** | — | **M** | V | — | — | — | — | — | V |
| Kitchen Roster, Duty & Fines | **VA** | — | — | V | **M** | — | — | — | — | V (if KM) |
| Event Collectables & Fin. Reports (Treasurer Tool) | **VA** | — | — | **M** | — | **M** | — | — | — | V |
| Meeting Attendance & Minutes (Secretary Tool) | **VA** | — | — | **M** | — | — | **M** | — | — | V |
| Create Election & Add Candidates | **M** | — | — | — | — | — | — | — | — | — |
| Vote in Elections / Nominate | — | — | P | P | P | P | P | P | P | **P** |
| Create Evaluation & Set N | **M** | — | **—** | — | — | — | — | — | — | — |
| Submit Evaluation Scores | — | — | — | — | — | — | — | **M** | — | — |
| Media Gallery & Banners (Media Officer Tool) | **M** | — | — | **M** | — | — | — | — | **M** | V |
| Endorse Leave Request | — | — | — | **M** | — | — | — | — | — | — |
| Approve Leave Request | **M** | — | — | — | — | — | — | — | — | — |
| View Personal Portal Records | **VA** | **VA** | V | V | V | V | V | V | V | **V** |

---

## 7. Core Business Rules

1. **Strict Non-Backdating Rule (`effective_from` / `added_at`):**  
   Every occupant obligation (cleaning schedule, fines, maintenance fee, gadget fee) takes effect strictly from their approval/activation date (`added_at`). Obligations dated prior to `added_at` must never be charged or calculated.
2. **Time-Bound Kitchen User Membership:**  
   Kitchen user membership carries dedicated `added_at` and `removed_at` timestamps managed by the Kitchen Manager. Kitchen cleaning duty schedules and kitchen fines apply exclusively within this active window.
3. **Academic Year & Semester Scoping:**  
   All rosters, schedules, attendance records, financial reports, and meeting minutes are strictly scoped to an `(academic_year_id, semester)` context.
4. **Soft-Delete & Financial Integrity:**  
   Deactivating or removing an occupant soft-deletes access credentials while permanently retaining historical payment ledgers, violation logs, and attendance audit trails.
5. **Multi-Role Context Toggling:**  
   Occupants holding multiple special roles (e.g., Secretary + Evaluator) access all assigned tools through an integrated secondary navigation bar or role switcher in their portal header.
6. **Data Privacy Compliance (RA 10173):**  
   Personal sensitive data (home addresses, guardian contact information) is protected under strict role-based field masking, accessible only to authorized dorm officers on a strict need-to-know basis.

---

## 8. Recommended Data Entities & Schema Architecture

- `users`: Identity, authentication credentials, system roles (`admin`, `occupant`, `developer`), status (`pending`, `active`, `inactive`, `left_dormitory`), username, hashed password.
- `profiles`: First name, middle name, last name, suffix, birthdate, student ID, degree program, year level, photo URL, mobile number.
- `addresses`: Barangay, municipality/city, province.
- `emergency_contacts`: Parent/guardian full name, relationship, contact number, emergency address.
- `occupants`: Links `user_id` ↔ `(academic_year_id, semester)`, room number, `added_at`, status.
- `role_assignments`: Links `occupant_id` ↔ `special_role` (`student_assistant`, `president`, `kitchen_manager`, `treasurer`, `secretary`, `evaluator`, `media_officer`), term dates, sourcing (`appointed`, `elected`).
- `announcements`: Title, content, category, banner URL, author ID, pinned status, published date.
- `cleaning_schedules` & `cleaning_attendance`: Shift dates, assigned sector, occupant ID, attendance status (`Present`, `Absent`, `Excused`), fine amount.
- `kitchen_memberships`, `kitchen_schedules`, `kitchen_attendance`: Kitchen user mapping, time-bound membership dates, kitchen cleaning shifts, attendance, kitchen fines.
- `payments`: Polymorphic dues ledger (`maintenance_fee`, `gadget_fee`, `cleaning_fine`, `kitchen_fine`, `event_collectable`), occupant ID, amount, due date, status (`paid`, `unpaid`, `waived`), receipt URL.
- `gadgets`: Occupant ID, gadget name, brand/model, wattage/fee rate, registration approval status.
- `violations`: Offender occupant ID, reporter user ID, infraction date, description, severity level, warning count, status.
- `meeting_minutes` & `financial_reports`: Title, document URL, publisher ID, academic year ID, semester, upload date.
- `elections`, `positions`, `candidates`, `officer_votes`: Election metadata, positions, candidates, abstain vote tracking, vote tally.
- `evaluations`, `evaluator_nominations`, `evaluator_votes`, `evaluation_scores`: Evaluation cycle setup, room nominations, votes, scorecards, computed ranks.
- `leave_requests`: Occupant ID, exit reason, target leave date, endorsement status & notes (President), final approval status (Adviser), departure timestamp.

---

*Author:* MMH Development Team  
*Document Version:* 2.0 (Master Project Specification)
