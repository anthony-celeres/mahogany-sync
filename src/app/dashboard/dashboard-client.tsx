// src/app/dashboard/dashboard-client.tsx
'use client'
import Sidebar from './sidebar'
import { 
  User, 
  Users, 
  UserCheck,
  UserPlus,
  Sparkles, 
  ChefHat, 
  CreditCard, 
  Laptop, 
  FileText, 
  FileDown,
  AlertTriangle, 
  Vote, 
  Star, 
  ShieldAlert, 
  LogOut,
  Calendar,
  CheckCircle,
  PlusCircle,
  TrendingUp,
  Coins,
  History,
  Trash2,
  Lock,
  Search,
  Check,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  Clock,
  Home,
  Terminal,
  Database,
  Download,
  RefreshCw,
  Copy,
  UserCog,
  ArrowLeft,
  Settings,
  Megaphone,
  CalendarDays,
  Wrench,
  Award,
  Trophy,
  Pencil,
  DoorOpen,
  BookOpen,
  LayoutDashboard
} from 'lucide-react';
import type { NavItem } from './sidebar'


import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  getDb,
  saveDb,
  resetDb,
  generateUsername,
  MockUser,
  CleaningSchedule,
  CleaningAttendance,
  CleaningType,
  CleaningRemark,
  DormLevel,
  MMH_LEVELS,
  getRoomLevel,
  Gadget,
  Payment,
  Violation,
  MeetingAttendance,
  OfficerElection,
  EvaluatorElection,
  EvaluationRating,
  FinancialReport,
  Article,
  MockDatabase
} from '@/utils/mock-db'

interface DashboardClientProps {
  initialUser: any
}

export default function DashboardClient({ initialUser }: DashboardClientProps) {
  const router = useRouter()
  const [db, setDb] = useState<MockDatabase | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(initialUser)
  const initialRole = initialUser?.user_metadata?.role
  const [activeTab, setActiveTab] = useState<string>(
    initialRole === 'admin' ? 'dashboard' : initialRole === 'developer' ? 'devconsole' : 'attendance'
  )
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Sub-states for forms
  const [ayContext, setAyContext] = useState('AY 2026-2027')
  const [semesterContext, setSemesterContext] = useState('1st Semester')
  
  // Modals / Trigger States
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showApprovalNotice, setShowApprovalNotice] = useState<{ username: string; tempPass: string; email: string } | null>(null)
  const [selectedPendingDetail, setSelectedPendingDetail] = useState<MockUser | null>(null)
  const [selectedRoomForClean, setSelectedRoomForClean] = useState('')
  const [selectedDayForClean, setSelectedDayForClean] = useState('Monday')
  const [cleaningTab, setCleaningTab] = useState<CleaningType>('daily')
  const [cleaningDate, setCleaningDate] = useState<string>(new Date().toISOString().split('T')[0])
  const [cleaningLevelFilter, setCleaningLevelFilter] = useState<DormLevel>('all')
  const [cleaningRoomFilter, setCleaningRoomFilter] = useState<string>('all')
  const [cleaningMonth, setCleaningMonth] = useState<string>('2026-08')
  const [cleaningViewMode, setCleaningViewMode] = useState<'sheet' | 'roster'>('sheet')
  const [cleaningActiveTool, setCleaningActiveTool] = useState<CleaningRemark | 'cycle'>('cycle')
  const [cleaningSearchQuery, setCleaningSearchQuery] = useState<string>('')
  const [cleaningLogFilter, setCleaningLogFilter] = useState<'all' | 'daily' | 'general'>('all')
  const [occupantAttFilter, setOccupantAttFilter] = useState<'all' | 'daily' | 'general'>('all')

  // Academic Term & Database Storage Management states
  const [ayList, setAyList] = useState<string[]>(['AY 2026-2027', 'AY 2025-2026', 'AY 2024-2025'])
  const [semList, setSemList] = useState<string[]>(['1st Semester', '2nd Semester', 'Summer Term'])
  const [showAddTermModal, setShowAddTermModal] = useState(false)
  const [showStorageModal, setShowStorageModal] = useState(false)
  const [newAyInput, setNewAyInput] = useState('')
  const [newSemInput, setNewSemInput] = useState('')
  const [termToPurge, setTermToPurge] = useState('AY 2024-2025')
  const [openAyDropdown, setOpenAyDropdown] = useState(false)
  const [openSemDropdown, setOpenSemDropdown] = useState(false)

  // Developer Console states
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showRawDb, setShowRawDb] = useState(false)

  // Occupant Settings states
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)

  // Article Publishing states
  const [showArticleModal, setShowArticleModal] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [articleTitle, setArticleTitle] = useState('')
  const [articleTag, setArticleTag] = useState('MMH News')
  const [articleMeta, setArticleMeta] = useState('Jul 2026 · MMH Communications')
  const [articleAuthor, setArticleAuthor] = useState('MMH Communications')
  const [articleBody, setArticleBody] = useState('')
  const [articleStatus, setArticleStatus] = useState<'published' | 'draft'>('published')

  const handleOpenCreateArticle = () => {
    setEditingArticle(null)
    setArticleTitle('')
    setArticleTag('MMH News')
    setArticleMeta(`${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · MMH Communications`)
    setArticleAuthor('MMH Communications')
    setArticleBody('')
    setArticleStatus('published')
    setShowArticleModal(true)
  }

  const handleOpenEditArticle = (art: Article) => {
    setEditingArticle(art)
    setArticleTitle(art.title)
    setArticleTag(art.tag || 'MMH News')
    setArticleMeta(art.meta || '')
    setArticleAuthor(art.author || 'MMH Communications')
    setArticleBody(art.body ? art.body.join('\n\n') : '')
    setArticleStatus(art.status || 'published')
    setShowArticleModal(true)
  }

  // Load database on mount
  useEffect(() => {
    setDb(getDb())
  }, [])

  // Show a quick auto-expiring toast
  const triggerAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 4000)
  }

  // Update localStorage and state
  const updateDbState = (newDb: MockDatabase) => {
    setDb(newDb)
    saveDb(newDb)
  }

  const handleCreateTerm = (e: React.FormEvent) => {
    e.preventDefault()
    let added = false
    if (newAyInput.trim() && !ayList.includes(newAyInput.trim())) {
      setAyList(prev => [newAyInput.trim(), ...prev])
      setAyContext(newAyInput.trim())
      added = true
    }
    if (newSemInput.trim() && !semList.includes(newSemInput.trim())) {
      setSemList(prev => [...prev, newSemInput.trim()])
      setSemesterContext(newSemInput.trim())
      added = true
    }
    if (added) {
      triggerAlert('success', 'New academic term created and selected as active context!')
      setNewAyInput('')
      setNewSemInput('')
      setShowAddTermModal(false)
    } else {
      triggerAlert('error', 'Please enter a valid new Academic Year or Semester.')
    }
  }

  const handlePurgeTermRecords = (targetAy: string) => {
    if (!db) return
    const updatedAttendance = db.cleaningAttendance.filter(c => !c.date.includes(targetAy))
    const updatedMeetings = db.meetings.filter(m => !m.date.includes(targetAy))
    const newDb = {
      ...db,
      cleaningAttendance: updatedAttendance,
      meetings: updatedMeetings
    }
    updateDbState(newDb)
    triggerAlert('success', `Database records for ${targetAy} purged! Freed up storage.`)
    setShowStorageModal(false)
  }

  if (!db) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-neutral-100 flex items-center justify-center font-mono">
        Loading mahogany sync prototype DB...
      </div>
    )
  }

  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault()
    if (!articleTitle.trim() || !articleBody.trim()) {
      triggerAlert('error', 'Article title and body content are required.')
      return
    }
    const bodyParagraphs = articleBody.split('\n').map(p => p.trim()).filter(Boolean)
    const currentArticles: Article[] = db.articles || []
    
    if (editingArticle) {
      const updated: Article[] = currentArticles.map(a => 
        a.id === editingArticle.id
          ? {
              ...a,
              title: articleTitle,
              tag: articleTag,
              meta: articleMeta,
              author: articleAuthor,
              body: bodyParagraphs,
              status: articleStatus,
            }
          : a
      )
      updateDbState({ ...db, articles: updated })
      triggerAlert('success', 'Article updated successfully.')
    } else {
      const newArt: Article = {
        id: `art-${Date.now()}`,
        title: articleTitle,
        tag: articleTag || 'MMH News',
        meta: articleMeta || `${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · MMH Communications`,
        href: '#',
        body: bodyParagraphs,
        date: new Date().toISOString().split('T')[0],
        author: articleAuthor || 'MMH Communications',
        status: articleStatus,
      }
      updateDbState({ ...db, articles: [newArt, ...currentArticles] })
      triggerAlert('success', 'New article published successfully.')
    }
    setShowArticleModal(false)
  }

  const handleTogglePublish = (artId: string) => {
    const updated: Article[] = (db.articles || []).map(a => 
      a.id === artId ? { ...a, status: (a.status === 'published' ? 'draft' : 'published') as 'published' | 'draft' } : a
    )
    updateDbState({ ...db, articles: updated })
    triggerAlert('success', 'Article status updated.')
  }

  const handleDeleteArticle = (artId: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return
    const updated: Article[] = (db.articles || []).filter(a => a.id !== artId)
    updateDbState({ ...db, articles: updated })
    triggerAlert('success', 'Article deleted.')
  }

  // Extract roles
  const mockUserRecord = db.users.find(u => u.id === currentUser?.id)
  const isSystemAdmin = currentUser?.user_metadata?.role === 'admin'
  const isDeveloper = currentUser?.user_metadata?.role === 'developer'
  const impersonatedBy = currentUser?.user_metadata?.impersonatedBy || null
  const specialRoles = mockUserRecord?.specialRoles || []
  const isSA = specialRoles.includes('SA')
  const isTreasurer = specialRoles.includes('Treasurer')
  const isSecretary = specialRoles.includes('Secretary')
  const isKitchenManager = specialRoles.includes('Kitchen Manager')
  const isEvaluator = specialRoles.includes('Evaluator')
  const isKitchenUser = specialRoles.includes('Kitchen User')
  const isMedia = specialRoles.includes('Media')
  const isOccupant = !isSystemAdmin && !isDeveloper // role === 'user' (plain occupant OR officer)

  // An officer is an occupant who also holds a governance role (Kitchen User is a
  // membership tag, not an officer role, so it is excluded here).
  const OFFICER_ROLES = ['SA', 'Treasurer', 'Secretary', 'Kitchen Manager', 'Evaluator', 'Media']
  const officerRoles = specialRoles.filter(r => OFFICER_ROLES.includes(r))
  const hasOfficerRole = isOccupant && officerRoles.length > 0

  // Role label shown in the sidebar footer.
  const roleLabel = isDeveloper
    ? 'Developer'
    : isSystemAdmin
    ? 'Adviser (Admin)'
    : officerRoles.includes('Media')
    ? 'Media Officer'
    : officerRoles[0] || 'Occupant'

  // Management tabs an officer reaches through the "Officer Tools" hub (not the occupant sidebar).
  const MGMT_TABS = ['cleaning', 'kitchen', 'payments', 'gadgets', 'meetings', 'violations', 'evaluations', 'articles']
  const isOfficerOnMgmtTab = hasOfficerRole && MGMT_TABS.includes(activeTab)

  // Per-officer-role management shortcuts surfaced in the Officer Tools hub + sidebar dropdown.
  const OFFICER_TOOLS: { [role: string]: { tab: string; label: string; desc: string; icon: NavItem['icon'] }[] } = {
    SA: [
      { tab: 'cleaning', label: 'General Cleaning', desc: 'Set schedules & mark attendance', icon: Sparkles },
      { tab: 'gadgets', label: 'Gadget Approvals', desc: 'Approve registrations & apply fees', icon: Laptop },
      { tab: 'payments', label: 'Payments Desk', desc: 'Verify and confirm occupant payments', icon: CreditCard },
      { tab: 'violations', label: 'Violation Records', desc: 'Record conduct violations', icon: AlertTriangle },
    ],
    Treasurer: [
      { tab: 'payments', label: 'Treasury Desk', desc: 'Assign dues, confirm payments, upload audits', icon: CreditCard },
    ],
    Secretary: [
      { tab: 'meetings', label: 'Minutes & Attendance', desc: 'Log meetings and record attendance', icon: FileText },
    ],
    'Kitchen Manager': [
      { tab: 'kitchen', label: 'Kitchen Registry', desc: 'Manage kitchen users & duties', icon: ChefHat },
    ],
    Evaluator: [
      { tab: 'evaluations', label: 'Evaluation Sheets', desc: 'Score residents for this cycle', icon: Star },
    ],
    Media: [
      { tab: 'articles', label: 'Article Publishing', desc: 'Manage & publish landing page news articles', icon: Megaphone },
    ],
  }

  // Flatten this occupant's officer tools into deduped sidebar dropdown children.
  const officerToolChildren: NavItem[] = []
  officerRoles.forEach(role => {
    (OFFICER_TOOLS[role] || []).forEach(tool => {
      if (!officerToolChildren.some(c => c.id === tool.tab)) {
        officerToolChildren.push({ id: tool.tab, label: tool.label, icon: tool.icon })
      }
    })
  })

  const soonBadge = 'Soon'
  const soonBadgeColor = 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'

  // Role-driven sidebar navigation.
  const navItems: NavItem[] = isSystemAdmin
    ? [
        { 
          id: 'command_center_group', 
          label: 'Command Center', 
          icon: LayoutDashboard,
          children: [
            { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
            { id: 'storage', label: 'Storage and History', icon: Database, badge: soonBadge, badgeColor: soonBadgeColor }
          ]
        },
        { 
          id: 'occupant_directory_group', 
          label: 'Directory', 
          icon: Users,
          children: [
            { id: 'pending_approvals', label: 'Registration', icon: UserPlus, badge: db?.users.filter(u => u.status === 'pending').length || 0 },
            { id: 'roster', label: 'Active Occupants', icon: UserCheck }
          ]
        },
        { id: 'cleaning', label: 'Cleaning Duties', icon: Sparkles },
        { id: 'kitchen', label: 'Kitchen Registry', icon: ChefHat, badge: soonBadge, badgeColor: soonBadgeColor },
        { id: 'payments', label: 'Financial Ledger', icon: CreditCard },
        { id: 'gadgets', label: 'Gadget Registry', icon: Laptop, badge: soonBadge, badgeColor: soonBadgeColor },
        { id: 'meetings', label: 'Attendance & Minutes', icon: FileText },
        { id: 'violations', label: 'Violation Record', icon: AlertTriangle },
        { id: 'elections', label: 'Officer Elections', icon: Vote, badge: soonBadge, badgeColor: soonBadgeColor },
        { id: 'evaluations', label: 'Evaluator Panel', icon: Star },
        { id: 'articles', label: 'Media & Articles', icon: Megaphone, badge: soonBadge, badgeColor: soonBadgeColor },
        { id: 'settings', label: 'Settings', icon: Settings, accent: 'gold' },
      ]
    : isDeveloper
    ? [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'devconsole', label: 'Developer Console', icon: Terminal, accent: 'sky' },
        { id: 'settings', label: 'Settings', icon: Settings, accent: 'gold' },
      ]
    : [
        // Occupant + Officer sidebar
        { id: 'bulletin', label: 'My Bulletin', icon: Home, badge: soonBadge, badgeColor: soonBadgeColor },
        { id: 'profile', label: 'Occupant Profile', icon: User },
        { id: 'attendance', label: 'Attendance & Schedules', icon: Calendar },
        { id: 'payrecords', label: 'Payment Records', icon: CreditCard },
        { id: 'records', label: 'Minutes & Records', icon: BookOpen },
        { id: 'myviolations', label: 'Violation Records', icon: AlertTriangle },
        { id: 'evaluation', label: 'Evaluation Performance', icon: Star },
        { id: 'myelections', label: 'Elections', icon: Vote, badge: soonBadge, badgeColor: soonBadgeColor },
        ...(isMedia
          ? [{ id: 'articles', label: 'Media Tools', icon: Megaphone, accent: 'gold' as const, badge: soonBadge, badgeColor: soonBadgeColor }]
          : []),
        ...(hasOfficerRole && !isMedia
          ? [{
              id: 'officertools',
              label: `${officerRoles[0]} Tools`,
              icon: Wrench,
              accent: 'gold' as const,
              children: officerToolChildren,
            }]
          : []),
        { id: 'settings', label: 'Settings', icon: Settings, accent: 'gold' },
      ]

  // Helper for cookie write
  const setSessionCookie = (userObj: any) => {
    const d = new Date()
    d.setTime(d.getTime() + (7 * 24 * 60 * 60 * 1000))
    const expires = "expires=" + d.toUTCString()
    document.cookie = `mahogany_sync_session=${encodeURIComponent(JSON.stringify(userObj))};${expires};path=/`
  }

  // Persona switching action (Developer Console impersonation)
  const handlePersonaSwitch = (userId: string) => {
    const target = db.users.find(u => u.id === userId)
    if (!target) return

    // Preserve the acting developer's identity so we can offer a "Return to Developer"
    // hop-back. Chained switches keep the ORIGINAL developer, and returning to the
    // developer themselves clears the marker.
    const actingDeveloper =
      currentUser?.user_metadata?.role === 'developer'
        ? { id: currentUser.id, email: currentUser.email, full_name: currentUser.user_metadata.full_name }
        : currentUser?.user_metadata?.impersonatedBy || null

    const supabaseUser: any = {
      id: target.id,
      email: target.email,
      app_metadata: { provider: 'credentials' },
      user_metadata: {
        role: target.role,
        specialRoles: target.specialRoles,
        full_name: target.fullName,
        username: target.username,
        student_id: target.studentId,
        room_number: target.roomNumber,
        degree_program: target.degreeProgram,
        year_level: target.yearLevel,
        avatar_url: target.avatarUrl,
      }
    }

    // Only stamp the marker while impersonating someone OTHER than the developer.
    if (actingDeveloper && actingDeveloper.id !== target.id) {
      supabaseUser.user_metadata.impersonatedBy = actingDeveloper
    }

    setSessionCookie(supabaseUser)
    setCurrentUser(supabaseUser)
    const switchLabel =
      target.role === 'developer' ? 'Developer'
      : target.role === 'admin' ? 'Adviser'
      : target.specialRoles.find(r => OFFICER_ROLES.includes(r)) || 'Occupant'
    triggerAlert('success', `Switched persona to ${target.fullName} (${switchLabel})`)

    // Pick default active tab for role
    if (target.role === 'developer') {
      setActiveTab('devconsole')
    } else if (target.role === 'admin') {
      setActiveTab('roster')
    } else {
      setActiveTab('bulletin')
    }
  }

  // Developer Console: hop back to the developer session after impersonating.
  const handleReturnToDeveloper = () => {
    if (!impersonatedBy) return
    handlePersonaSwitch(impersonatedBy.id)
  }

  // Developer Console: download the live mock DB as a JSON file.
  const handleExportDb = () => {
    const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mahogany-sync-db-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    triggerAlert('success', 'Exported mock database snapshot to JSON.')
  }

  // Developer Console: copy the live mock DB JSON to clipboard.
  const handleCopyDb = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(db, null, 2))
      triggerAlert('success', 'Copied mock database JSON to clipboard.')
    } catch {
      triggerAlert('error', 'Clipboard unavailable in this browser context.')
    }
  }

  // Developer Console: wipe localStorage and reseed the default dataset.
  const handleResetDb = () => {
    const fresh = resetDb()
    setDb(fresh)
    setShowResetConfirm(false)
    triggerAlert('success', 'Mock database reset to seed defaults.')
  }

  // Occupant Settings: save edits to the resident's own editable profile fields.
  const handleEditProfile = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!mockUserRecord) return
    const form = e.currentTarget
    const fd = new FormData(form)

    const updates = {
      mobileNumber: (fd.get('mobileNumber') as string) || mockUserRecord.mobileNumber,
      barangay: (fd.get('barangay') as string) || mockUserRecord.barangay,
      city: (fd.get('city') as string) || mockUserRecord.city,
      province: (fd.get('province') as string) || mockUserRecord.province,
      guardianName: (fd.get('guardianName') as string) || mockUserRecord.guardianName,
      guardianRelationship: (fd.get('guardianRelationship') as string) || mockUserRecord.guardianRelationship,
      guardianContact: (fd.get('guardianContact') as string) || mockUserRecord.guardianContact,
      avatarUrl: (fd.get('avatarUrl') as string) || mockUserRecord.avatarUrl,
    }

    const updatedUsers = db.users.map(u => (u.id === mockUserRecord.id ? { ...u, ...updates } : u))
    updateDbState({ ...db, users: updatedUsers })

    // Keep the live session avatar in sync so the sidebar reflects the change immediately.
    setCurrentUser((prev: any) => ({
      ...prev,
      user_metadata: { ...prev.user_metadata, avatar_url: updates.avatarUrl },
    }))

    setShowEditProfile(false)
    triggerAlert('success', 'Profile updated successfully.')
  }

  // Occupant Settings: file a Leave Dormitory request to the Adviser.
  const handleLeaveRequest = () => {
    if (!mockUserRecord) return
    const updatedUsers = db.users.map(u => (u.id === mockUserRecord.id ? { ...u, leaveRequested: true } : u))
    updateDbState({ ...db, users: updatedUsers })
    setShowLeaveConfirm(false)
    triggerAlert('success', 'Leave Dormitory request sent to the Adviser for review.')
  }

  // Approved resident sign-up workflow
  const handleApproveSignup = (pendingId: string) => {
    const userToApprove = db.users.find(u => u.id === pendingId)
    if (!userToApprove) return

    const username = generateUsername(
      userToApprove.fullName.split(' ').pop() || '',
      userToApprove.fullName,
      userToApprove.studentId || '00-0-00000'
    )

    const tempPassword = Math.random().toString(36).substring(2, 10)

    // Update database
    const updatedUsers = db.users.map(u => {
      if (u.id === pendingId) {
        return {
          ...u,
          status: 'active' as const,
          username: username,
          mustChangePassword: true,
          addedAt: new Date().toISOString().split('T')[0] // Rule 1 enforcement: effective from today
        }
      }
      return u
    })

    // Also auto-generate Maintenance Fee for this new active resident (Php 500)
    // Rule 1: Effective-from-add-date applies. Since they are added today, their maintenance fee is added today
    const newMaintenanceFee: Payment = {
      id: `py-${Date.now()}`,
      userId: pendingId,
      type: 'maintenance',
      description: `Maintenance Fee - Approved on ${new Date().toISOString().split('T')[0]}`,
      amount: 500,
      dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0], // 30 days due
      status: 'unpaid'
    }

    const updatedPayments = [...db.payments, newMaintenanceFee]

    updateDbState({
      ...db,
      users: updatedUsers,
      payments: updatedPayments
    })

    setShowApprovalNotice({
      username,
      tempPass: tempPassword,
      email: userToApprove.email
    })

    triggerAlert('success', `Approved signup for ${userToApprove.fullName}. Username generated: ${username}`)
  }

  // Deactivate User
  const handleToggleDeactivate = (userId: string) => {
    const target = db.users.find(u => u.id === userId)
    if (!target) return
    const newStatus = target.status === 'active' ? ('inactive' as const) : ('active' as const)
    
    const updatedUsers = db.users.map(u => {
      if (u.id === userId) {
        return { ...u, status: newStatus }
      }
      return u
    })
    updateDbState({ ...db, users: updatedUsers })
    triggerAlert('success', `User status toggled to: ${newStatus.toUpperCase()}`)
  }

  // Permanent Soft Delete
  const handleSoftDelete = (userId: string) => {
    const updatedUsers = db.users.map(u => {
      if (u.id === userId) {
        return { ...u, status: 'removed' as const }
      }
      return u
    })
    updateDbState({ ...db, users: updatedUsers })
    triggerAlert('success', `User soft-removed successfully from active directory (audit records preserved).`)
  }

  // Add active user directly (Admin Roster direct create)
  const handleDirectAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const email = formData.get('email') as string
    const fullName = formData.get('fullName') as string
    const studentId = formData.get('studentId') as string
    const roomNumber = formData.get('roomNumber') as string
    const specialRole = formData.get('specialRole') as string

    if (!email || !fullName || !studentId) return

    const username = generateUsername(fullName.split(' ').pop() || '', fullName, studentId)

    const newUser: MockUser = {
      id: `u-${Date.now()}`,
      email,
      fullName,
      username,
      role: 'user',
      specialRoles: specialRole ? [specialRole] : [],
      studentId,
      roomNumber,
      status: 'active',
      addedAt: new Date().toISOString().split('T')[0] // timebound starts today
    }

    // Auto maintenance fee
    const fee: Payment = {
      id: `py-${Date.now()}`,
      userId: newUser.id,
      type: 'maintenance',
      description: `Maintenance Fee - Direct Add`,
      amount: 500,
      dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      status: 'unpaid'
    }

    updateDbState({
      ...db,
      users: [...db.users, newUser],
      payments: [...db.payments, fee]
    })

    setShowAddUserModal(false)
    form.reset()
    triggerAlert('success', `Created direct resident account: ${username}`)
  }

  // SA: Add cleaning schedule room mapping
  const handleAddCleaningSchedule = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const rooms = selectedRoomForClean.split(',').map(r => r.trim()).filter(Boolean)
    if (rooms.length === 0) return

    const newSched: CleaningSchedule = {
      id: `cs-${Date.now()}`,
      dayOfWeek: selectedDayForClean,
      rooms,
      kitchenOnly: false
    }

    updateDbState({
      ...db,
      cleaningSchedule: [...db.cleaningSchedule, newSched]
    })
    setSelectedRoomForClean('')
    triggerAlert('success', `Assigned general cleaning schedule for ${selectedDayForClean}`)
  }

  // SA: Record Cleaning Attendance Checklist (supports Daily vs General + / , E , A , P , NA)
  const handleMarkCleaningAttendance = (
    userId: string,
    date: string,
    cleaningTypeOrStatus: CleaningType | 'present' | 'absent' | 'excused',
    remarkArg?: CleaningRemark
  ) => {
    let cleaningType: CleaningType = 'daily'
    let remark: CleaningRemark = 'check'

    if (cleaningTypeOrStatus === 'daily' || cleaningTypeOrStatus === 'general') {
      cleaningType = cleaningTypeOrStatus
      remark = remarkArg || 'check'
    } else {
      // Legacy 3-arg call fallback
      cleaningType = 'daily'
      remark = cleaningTypeOrStatus === 'present' ? 'check' : cleaningTypeOrStatus === 'excused' ? 'excuse' : 'absent'
    }

    const existIndex = db.cleaningAttendance.findIndex(
      c => c.userId === userId && c.date === date && (c.cleaningType === cleaningType || (!c.cleaningType && cleaningType === 'daily')) && !c.kitchenOnly
    )
    
    let updatedAttendance = [...db.cleaningAttendance]
    let updatedPayments = [...db.payments]
    const userRec = db.users.find(u => u.id === userId)
    const fineRate = cleaningType === 'daily' ? 10 : 50
    const fineDescription = `Fine - ${cleaningType === 'daily' ? 'Daily' : 'General'} Cleaning Absence on ${date}`

    if (existIndex > -1) {
      const prev = updatedAttendance[existIndex]
      const prevRemark = prev.remark || (prev.status === 'present' ? 'check' : prev.status === 'excused' ? 'excuse' : 'absent')
      
      // If was absent/paid and changed to check/excuse/na, remove unpaid fine
      if ((prevRemark === 'absent' || prevRemark === 'paid') && (remark === 'check' || remark === 'excuse' || remark === 'na')) {
        updatedPayments = updatedPayments.filter(p => !(p.userId === userId && p.type === 'fine' && (p.id === prev.finePaymentId || p.description.includes(date))))
      }

      // If was absent and now marked paid
      if (prevRemark === 'absent' && remark === 'paid') {
        updatedPayments = updatedPayments.map(p => {
          if (p.userId === userId && p.type === 'fine' && (p.id === prev.finePaymentId || p.description.includes(date))) {
            return { ...p, status: 'paid' as const, datePaid: new Date().toISOString().split('T')[0] }
          }
          return p
        })
      }

      // If was not absent and now marked absent
      let fineId = prev.finePaymentId
      if (prevRemark !== 'absent' && prevRemark !== 'paid' && remark === 'absent') {
        const newFine: Payment = {
          id: `py-fine-${Date.now()}`,
          userId,
          type: 'fine',
          description: fineDescription,
          amount: fineRate,
          dueDate: new Date(Date.now() + 10*24*60*60*1000).toISOString().split('T')[0],
          status: 'unpaid'
        }
        updatedPayments.push(newFine)
        fineId = newFine.id
      }

      // If marked paid directly
      if (prevRemark !== 'absent' && prevRemark !== 'paid' && remark === 'paid') {
        const newFine: Payment = {
          id: `py-fine-${Date.now()}`,
          userId,
          type: 'fine',
          description: fineDescription,
          amount: fineRate,
          dueDate: new Date(Date.now() + 10*24*60*60*1000).toISOString().split('T')[0],
          status: 'paid',
          datePaid: new Date().toISOString().split('T')[0]
        }
        updatedPayments.push(newFine)
        fineId = newFine.id
      }

      updatedAttendance[existIndex] = {
        ...prev,
        cleaningType,
        remark,
        status: remark === 'check' ? 'present' : remark === 'excuse' ? 'excused' : 'absent',
        fineAmount: (remark === 'absent' || remark === 'paid') ? fineRate : 0,
        finePaymentId: fineId,
        markedBy: currentUser.user_metadata.username
      }
    } else {
      // Create new
      let fineId: string | undefined = undefined
      if (remark === 'absent' || remark === 'paid') {
        const newFine: Payment = {
          id: `py-fine-${Date.now()}`,
          userId,
          type: 'fine',
          description: fineDescription,
          amount: fineRate,
          dueDate: new Date(Date.now() + 10*24*60*60*1000).toISOString().split('T')[0],
          status: remark === 'paid' ? 'paid' : 'unpaid',
          datePaid: remark === 'paid' ? new Date().toISOString().split('T')[0] : undefined
        }
        updatedPayments.push(newFine)
        fineId = newFine.id
      }

      const newAtt: CleaningAttendance = {
        id: `ca-${Date.now()}`,
        date,
        userId,
        cleaningType,
        remark,
        status: remark === 'check' ? 'present' : remark === 'excuse' ? 'excused' : 'absent',
        fineAmount: (remark === 'absent' || remark === 'paid') ? fineRate : 0,
        finePaymentId: fineId,
        kitchenOnly: false,
        markedBy: currentUser.user_metadata.username
      }
      updatedAttendance.push(newAtt)
    }

    const labelMap: Record<CleaningRemark, string> = {
      check: 'Check (/) - Present',
      excuse: 'Excuse (E)',
      absent: `Absent (A) - ₱${fineRate} fine billed`,
      paid: `Paid (P) - ₱${fineRate} fine settled`,
      na: 'Not Available (NA)'
    }

    updateDbState({
      ...db,
      cleaningAttendance: updatedAttendance,
      payments: updatedPayments
    })
    triggerAlert('success', `${userRec?.fullName}: marked ${labelMap[remark]}`)
  }

  // KM: Add Kitchen User (membership time-bound starts today)
  const handleAddKitchenUser = (userId: string) => {
    // Modify target user specialRole to include 'kitchen-user' or add to a custom kitchen list
    // In our simplified mock-db, we can toggle or add a specific kitchen tag inside userMetadata/specialRoles or add to kitchenMembership
    // Let's add 'Kitchen User' tag to specialRoles. KM manages this registry
    const targetUser = db.users.find(u => u.id === userId)
    if (!targetUser) return

    if (targetUser.specialRoles.includes('Kitchen User')) return

    const updatedUsers = db.users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          specialRoles: [...u.specialRoles, 'Kitchen User'],
          // We can record kitchen added_at timestamp
        }
      }
      return u
    })

    updateDbState({ ...db, users: updatedUsers })
    triggerAlert('success', `Added ${targetUser.fullName} to Communal Kitchen Registry. Duties start today.`)
  }

  // KM: Remove Kitchen User
  const handleRemoveKitchenUser = (userId: string) => {
    const targetUser = db.users.find(u => u.id === userId)
    if (!targetUser) return

    const updatedUsers = db.users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          specialRoles: u.specialRoles.filter(r => r !== 'Kitchen User')
        }
      }
      return u
    })

    updateDbState({ ...db, users: updatedUsers })
    triggerAlert('success', `Removed ${targetUser.fullName} from Communal Kitchen Registry.`)
  }

  // KM: Mark Kitchen Cleaning Attendance
  const handleMarkKitchenAttendance = (userId: string, date: string, status: 'present' | 'absent' | 'excused') => {
    const existIndex = db.cleaningAttendance.findIndex(c => c.userId === userId && c.date === date && c.kitchenOnly)
    let updatedAttendance = [...db.cleaningAttendance]
    const userRec = db.users.find(u => u.id === userId)

    if (existIndex > -1) {
      const prevStatus = updatedAttendance[existIndex].status
      updatedAttendance[existIndex] = {
        ...updatedAttendance[existIndex],
        status,
        markedBy: currentUser.user_metadata.username
      }

      if (prevStatus === 'absent' && status !== 'absent') {
        const dbPayments = db.payments.filter(p => !(p.userId === userId && p.type === 'fine' && p.description.includes(`Kitchen Absence on ${date}`)))
        updateDbState({
          ...db,
          cleaningAttendance: updatedAttendance,
          payments: dbPayments
        })
        triggerAlert('success', `Kitchen attendance updated. Fine removed for ${userRec?.fullName}.`)
        return
      }
    } else {
      const newAtt: CleaningAttendance = {
        id: `ca-k-${Date.now()}`,
        date,
        userId,
        status,
        kitchenOnly: true,
        markedBy: currentUser.user_metadata.username
      }
      updatedAttendance.push(newAtt)
    }

    let updatedPayments = [...db.payments]
    if (status === 'absent') {
      const finePayment: Payment = {
        id: `py-fine-k-${Date.now()}`,
        userId,
        type: 'fine',
        description: `Fine - Kitchen Absence on ${date}`,
        amount: 50,
        dueDate: new Date(Date.now() + 10*24*60*60*1000).toISOString().split('T')[0],
        status: 'unpaid'
      }
      updatedPayments.push(finePayment)
      triggerAlert('success', `Marked ${userRec?.fullName} ABSENT from kitchen duty. Php 50 fine added.`)
    } else {
      triggerAlert('success', `Kitchen attendance recorded for ${userRec?.fullName}.`)
    }

    updateDbState({
      ...db,
      cleaningAttendance: updatedAttendance,
      payments: updatedPayments
    })
  }

  // Treasurer: Add custom event collectable due
  const handleAddEventDue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const title = formData.get('title') as string
    const amountStr = formData.get('amount') as string
    const dueDate = formData.get('dueDate') as string

    if (!title || !amountStr || !dueDate) return
    const amount = parseFloat(amountStr)

    // Add event due payment for ALL active occupants
    const activeOccupants = db.users.filter(u => u.role === 'user' && u.status === 'active' && !!u.roomNumber)
    const newPayments: Payment[] = activeOccupants.map(occ => {
      // RULE 1: Effective-from-add-date check
      // If the occupant was added AFTER the event due creation date, technically they shouldn't pay it
      // Let's assume creation is today, so all currently active occupants are charged.
      return {
        id: `py-ev-${Date.now()}-${occ.id}`,
        userId: occ.id,
        type: 'event',
        description: `Event Dues: ${title}`,
        amount,
        dueDate,
        status: 'unpaid'
      }
    })

    updateDbState({
      ...db,
      payments: [...db.payments, ...newPayments]
    })

    form.reset()
    triggerAlert('success', `Assigned Php ${amount} collectable dues to all ${activeOccupants.length} residents for: ${title}`)
  }

  // Treasurer: Upload mock audited report
  const handleUploadFinancialReport = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const title = formData.get('title') as string
    if (!title) return

    const newReport: FinancialReport = {
      id: `fr-${Date.now()}`,
      title,
      date: new Date().toISOString().split('T')[0],
      url: `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`,
      uploadedBy: currentUser.user_metadata.full_name
    }

    updateDbState({
      ...db,
      financialReports: [...db.financialReports, newReport]
    })
    form.reset()
    triggerAlert('success', `Financial Audit report uploaded: ${newReport.url}`)
  }

  // Secretary: Record Program Attendance & Upload minutes
  const handleUploadMinutes = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const eventName = formData.get('eventName') as string
    const date = formData.get('date') as string

    if (!eventName || !date) return

    // Get list of active occupants to create a baseline attendance (defaulting to present)
    const activeOccupants = db.users.filter(u => u.role === 'user' && u.status === 'active' && !!u.roomNumber)
    const attendees = activeOccupants.map(occ => ({
      userId: occ.id,
      status: 'present' as const
    }))

    const newMeeting: MeetingAttendance = {
      id: `m-${Date.now()}`,
      eventName,
      date,
      attendees,
      minutesUrl: `${eventName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_minutes.pdf`,
      uploadedBy: currentUser.user_metadata.full_name
    }

    updateDbState({
      ...db,
      meetings: [...db.meetings, newMeeting]
    })
    form.reset()
    triggerAlert('success', `Meeting minutes saved for "${eventName}" (baseline attendance created).`)
  }

  // Secretary: Toggle attendance for meeting
  const handleToggleMeetingAttendance = (meetingId: string, userId: string, status: 'present' | 'absent' | 'excused') => {
    const updatedMeetings = db.meetings.map(m => {
      if (m.id === meetingId) {
        const attendeeIndex = m.attendees.findIndex(a => a.userId === userId)
        let updatedAttendees = [...m.attendees]
        if (attendeeIndex > -1) {
          updatedAttendees[attendeeIndex] = { userId, status }
        } else {
          updatedAttendees.push({ userId, status })
        }
        return { ...m, attendees: updatedAttendees }
      }
      return m
    })
    updateDbState({ ...db, meetings: updatedMeetings })
    triggerAlert('success', `Attendance updated.`)
  }

  // Occupant: Register a new gadget (submits pending gadget registry)
  const handleRegisterGadget = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const brand = formData.get('brand') as string
    const type = formData.get('type') as string
    const watts = parseInt(formData.get('watts') as string || '0')

    if (!brand || !type) return

    const newGadget: Gadget = {
      id: `g-${Date.now()}`,
      userId: currentUser.id,
      brand,
      type,
      watts,
      registeredDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    }

    updateDbState({
      ...db,
      gadgets: [...db.gadgets, newGadget]
    })
    form.reset()
    triggerAlert('success', `Gadget registration submitted! Awaiting SA approval.`)
  }

  // SA: Approve Gadget Registry & Automatically append Gadget Fee
  const handleApproveGadget = (gadgetId: string) => {
    const gadget = db.gadgets.find(g => g.id === gadgetId)
    if (!gadget) return

    const userRec = db.users.find(u => u.id === gadget.userId)

    const updatedGadgets = db.gadgets.map(g => {
      if (g.id === gadgetId) return { ...g, status: 'approved' as const }
      return g
    })

    // Auto-create Gadget Fee (Php 150) under occupant billing
    const gadgetFee: Payment = {
      id: `py-g-${Date.now()}`,
      userId: gadget.userId,
      type: 'gadget',
      description: `Gadget Fee - Approved: ${gadget.brand} ${gadget.type}`,
      amount: 150,
      dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
      status: 'unpaid'
    }

    updateDbState({
      ...db,
      gadgets: updatedGadgets,
      payments: [...db.payments, gadgetFee]
    })
    triggerAlert('success', `Approved gadget for ${userRec?.fullName}. Added Php 150 gadget fee.`)
  }

  // Occupant: Submit Mock Receipt Payment
  const handleSubmitReceipt = (paymentId: string) => {
    const updatedPayments = db.payments.map(p => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: 'pending' as const,
          receiptUrl: 'receipt_upload_mockup.jpg',
          datePaid: new Date().toISOString().split('T')[0]
        }
      }
      return p
    })
    updateDbState({ ...db, payments: updatedPayments })
    triggerAlert('success', `Mock receipt uploaded! Payment status is now PENDING verification.`)
  }

  // SA / Treasurer: Confirm Payment (automatically reconciles cleaning fine to Paid 'P')
  const handleConfirmPayment = (paymentId: string) => {
    const payment = db.payments.find(p => p.id === paymentId)
    const updatedPayments = db.payments.map(p => {
      if (p.id === paymentId) {
        return {
          ...p,
          status: 'paid' as const,
          datePaid: new Date().toISOString().split('T')[0]
        }
      }
      return p
    })

    // If this was an absence fine, update the corresponding cleaning attendance record remark to 'paid' (P)
    let updatedAttendance = [...db.cleaningAttendance]
    if (payment && payment.type === 'fine') {
      updatedAttendance = updatedAttendance.map(ca => {
        if (ca.finePaymentId === paymentId || (ca.userId === payment.userId && payment.description.includes(ca.date))) {
          return {
            ...ca,
            remark: 'paid' as CleaningRemark
          }
        }
        return ca
      })
    }

    updateDbState({ ...db, payments: updatedPayments, cleaningAttendance: updatedAttendance })
    triggerAlert('success', `Payment verified and marked PAID. Attendance remark updated to Paid (P).`)
  }

  // SA: Record violation
  const handleRecordViolation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const userId = formData.get('userId') as string
    const type = formData.get('type') as string
    const severity = formData.get('severity') as 'low' | 'medium' | 'high'
    const details = formData.get('details') as string

    if (!userId || !type) return

    const newViolation: Violation = {
      id: `v-${Date.now()}`,
      userId,
      date: new Date().toISOString().split('T')[0],
      type,
      severity,
      details,
      recordedBy: currentUser.user_metadata.username
    }

    updateDbState({
      ...db,
      violations: [...db.violations, newViolation]
    })
    form.reset()
    triggerAlert('success', `Violation recorded.`)
  }

  // Admin: Create Officer Election
  const handleCreateElection = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const title = formData.get('title') as string
    if (!title) return

    const newElection: OfficerElection = {
      id: `el-${Date.now()}`,
      title,
      status: 'active', // open immediately
      positions: [
        { id: 'pos-pres', name: 'President', candidates: [], votes: {} },
        { id: 'pos-sec', name: 'Secretary', candidates: [], votes: {} },
        { id: 'pos-treas', name: 'Treasurer', candidates: [], votes: {} },
        { id: 'pos-km', name: 'Kitchen Manager', candidates: [], votes: {} },
      ]
    }
    updateDbState({
      ...db,
      officerElections: [...db.officerElections, newElection]
    })
    form.reset()
    triggerAlert('success', `Created active election: ${title}`)
  }

  // Admin: Add Candidate to Position
  const handleAddCandidate = (electionId: string, positionId: string, userId: string) => {
    const userRec = db.users.find(u => u.id === userId)
    if (!userRec) return

    const updatedElections = db.officerElections.map(el => {
      if (el.id === electionId) {
        const updatedPositions = el.positions.map(pos => {
          if (pos.id === positionId) {
            // Check if already candidate
            if (pos.candidates.some(c => c.userId === userId)) return pos
            return {
              ...pos,
              candidates: [...pos.candidates, { userId, fullName: userRec.fullName }]
            }
          }
          return pos
        })
        return { ...el, positions: updatedPositions }
      }
      return el
    })

    updateDbState({ ...db, officerElections: updatedElections })
    triggerAlert('success', `Added candidate ${userRec.fullName}`)
  }

  // Occupant: Vote in Officer Election (includes Abstain option)
  const handleCastOfficerVote = (electionId: string, positionId: string, choiceUserId: string | 'abstain') => {
    const updatedElections = db.officerElections.map(el => {
      if (el.id === electionId) {
        const updatedPositions = el.positions.map(pos => {
          if (pos.id === positionId) {
            return {
              ...pos,
              votes: {
                ...pos.votes,
                [currentUser.id]: choiceUserId
              }
            }
          }
          return pos
        })
        return { ...el, positions: updatedPositions }
      }
      return el
    })

    updateDbState({ ...db, officerElections: updatedElections })
    triggerAlert('success', `Vote registered for position.`)
  }

  // Admin: Tally & Close Officer Election (Winners automatically seated to special roles!)
  const handleCloseOfficerElection = (electionId: string) => {
    const election = db.officerElections.find(el => el.id === electionId)
    if (!election) return

    let userRoleAssignmentsToCreate: { [userId: string]: string } = {} // maps userId -> specialRole string
    let unfilledPositions: string[] = []

    election.positions.forEach(pos => {
      // Tally votes
      const tallies: { [key: string]: number } = { abstain: 0 }
      pos.candidates.forEach(c => tallies[c.userId] = 0)

      Object.values(pos.votes).forEach(voteVal => {
        tallies[voteVal] = (tallies[voteVal] || 0) + 1
      })

      // Find top candidate
      let topCandidateId = ''
      let topVotes = -1
      let isTied = false

      Object.entries(tallies).forEach(([cId, count]) => {
        if (cId === 'abstain') return
        if (count > topVotes) {
          topVotes = count
          topCandidateId = cId
          isTied = false
        } else if (count === topVotes) {
          isTied = true
        }
      })

      const abstainCount = tallies['abstain'] || 0

      // Winner rule: Must outnumber Abstain, and no tie
      if (topCandidateId && topVotes > abstainCount && !isTied) {
        // Seat winner
        userRoleAssignmentsToCreate[topCandidateId] = pos.name
      } else {
        // Position unfilled (Abstain outvotes, or there is a tie, or no candidates)
        unfilledPositions.push(pos.name)
      }
    })

    // Apply special roles in users db
    const updatedUsers = db.users.map(u => {
      const newRole = userRoleAssignmentsToCreate[u.id]
      if (newRole) {
        return {
          ...u,
          specialRoles: Array.from(new Set([...u.specialRoles, newRole]))
        }
      }
      return u
    })

    const updatedElections = db.officerElections.map(el => {
      if (el.id === electionId) {
        return { ...el, status: 'closed' as const }
      }
      return el
    })

    updateDbState({
      ...db,
      users: updatedUsers,
      officerElections: updatedElections
    })

    const winnerSummary = Object.entries(userRoleAssignmentsToCreate)
      .map(([uId, roleName]) => `${db.users.find(usr => usr.id === uId)?.fullName} wins ${roleName}`)
      .join(', ')

    const unfilledSummary = unfilledPositions.length > 0
      ? `Vacant/Unfilled due to Abstain/Ties: ${unfilledPositions.join(', ')}`
      : ''

    triggerAlert('success', `Election Closed. Tallied Winners: ${winnerSummary || 'None'}. ${unfilledSummary}`)
  }

  // Admin: Create Evaluator Election
  const handleCreateEvaluatorElection = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const countStr = formData.get('qualifyingCount') as string
    if (!countStr) return
    const qualifyingCount = parseInt(countStr)

    const newElection: EvaluatorElection = {
      id: `ev-${Date.now()}`,
      status: 'nomination',
      qualifyingCount,
      nominations: {},
      votes: {},
      evaluators: []
    }

    updateDbState({
      ...db,
      evaluatorElections: [...db.evaluatorElections, newElection]
    })
    form.reset()
    triggerAlert('success', `Started Evaluator nomination phase. Required Evaluators: ${qualifyingCount}`)
  }

  // Occupant: Nominate one representative per room
  const handleNominateEvaluator = (electionId: string, nomineeId: string) => {
    const occupantRoom = mockUserRecord?.roomNumber || 'Unknown'
    if (occupantRoom === 'Unknown') {
      triggerAlert('error', `Cannot nominate. Room details not found.`)
      return
    }

    const updatedElections = db.evaluatorElections.map(el => {
      if (el.id === electionId) {
        return {
          ...el,
          nominations: {
            ...el.nominations,
            [occupantRoom]: nomineeId
          }
        }
      }
      return el
    })

    updateDbState({ ...db, evaluatorElections: updatedElections })
    triggerAlert('success', `Room ${occupantRoom} representative nominated!`)
  }

  // Admin: Close nominations & open voting
  const handleOpenEvaluatorVoting = (electionId: string) => {
    const updatedElections = db.evaluatorElections.map(el => {
      if (el.id === electionId) {
        return { ...el, status: 'voting' as const }
      }
      return el
    })
    updateDbState({ ...db, evaluatorElections: updatedElections })
    triggerAlert('success', `Nominations closed. Voting phase is now open.`)
  }

  // Occupant: Vote for Evaluator nominee
  const handleVoteEvaluator = (electionId: string, nomineeId: string) => {
    const updatedElections = db.evaluatorElections.map(el => {
      if (el.id === electionId) {
        return {
          ...el,
          votes: {
            ...el.votes,
            [currentUser.id]: nomineeId
          }
        }
      }
      return el
    })
    updateDbState({ ...db, evaluatorElections: updatedElections })
    triggerAlert('success', `Vote registered.`)
  }

  // Admin: Close Evaluator Election (Top N nominees become Evaluators!)
  const handleCloseEvaluatorElection = (electionId: string) => {
    const election = db.evaluatorElections.find(el => el.id === electionId)
    if (!election) return

    // Tally votes for each nominee
    const tallies: { [userId: string]: number } = {}
    Object.values(election.nominations).forEach(nomineeId => {
      tallies[nomineeId] = 0
    })

    Object.values(election.votes).forEach(votedId => {
      if (votedId in tallies) {
        tallies[votedId] += 1
      }
    })

    // Sort by votes
    const sorted = Object.entries(tallies)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])

    // Take top N (qualifyingCount)
    const winners = sorted.slice(0, election.qualifyingCount)

    // Update users in database to set 'Evaluator' role
    const updatedUsers = db.users.map(u => {
      if (winners.includes(u.id)) {
        return {
          ...u,
          specialRoles: Array.from(new Set([...u.specialRoles, 'Evaluator']))
        }
      }
      return u
    })

    const updatedElections = db.evaluatorElections.map(el => {
      if (el.id === electionId) {
        return {
          ...el,
          status: 'closed' as const,
          evaluators: winners
        }
      }
      return el
    })

    updateDbState({
      ...db,
      users: updatedUsers,
      evaluatorElections: updatedElections
    })

    const winnersNames = winners.map(wId => db.users.find(usr => usr.id === wId)?.fullName).join(', ')
    triggerAlert('success', `Evaluator election tallied. Top ${winners.length} Evaluators seated: ${winnersNames || 'None'}`)
  }

  // Evaluator: Submit occupant evaluation score
  const handleSubmitEvaluation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    const userId = formData.get('userId') as string
    const scoreStr = formData.get('score') as string
    const feedback = formData.get('feedback') as string

    if (!userId || !scoreStr) return
    const score = parseFloat(scoreStr)

    const newEval: EvaluationRating = {
      id: `evr-${Date.now()}`,
      evaluatorId: currentUser.id,
      userId,
      score,
      feedback,
      date: new Date().toISOString().split('T')[0]
    }

    updateDbState({
      ...db,
      evaluations: [...db.evaluations, newEval]
    })
    form.reset()
    triggerAlert('success', `Resident evaluation submitted.`)
  }

  // Sign out mock action
  const handleSignOut = () => {
    document.cookie = 'mahogany_sync_session=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/'
    router.push('/')
  }

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row bg-neutral-50 dark:bg-[#120e0d] text-neutral-900 dark:text-neutral-100 font-sans transition-colors duration-150 overflow-hidden relative">
      
      {/* Glow backgrounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-forest/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-leaf/5 rounded-full blur-[100px]" />
      </div>

      {/* Sidebar Panel Component */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        roleLabel={roleLabel}
        navItems={navItems}
        handleSignOut={handleSignOut}
      />

      {/* Main Content Workspace */}
      <main className="dorm-panels flex-1 min-w-0 h-full overflow-y-auto bg-[#f7f4ec] dark:bg-[#161412] p-6 sm:p-8 lg:p-10 flex flex-col gap-6 relative z-10 transition-colors duration-150">
          
          {/* Header Alert box */}
          {alert && (
            <div className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-3 animate-fade-in shadow-md ${
              alert.type === 'success'
                ? 'bg-emerald-950/30 border border-emerald-900/50 text-emerald-400'
                : 'bg-red-950/30 border border-red-900/50 text-red-400'
            }`}>
              <span>{alert.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-red-400" />}</span>
              <span>{alert.message}</span>
            </div>
          )}

          {/* Impersonation banner (Developer Console persona switch) */}
          {impersonatedBy && (
            <div className="p-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 bg-sky-950/30 border border-sky-800/50 text-sky-300 animate-fade-in shadow-md">
              <span className="flex items-center gap-2 min-w-0">
                <UserCog className="w-4 h-4 shrink-0" />
                <span className="truncate">
                  Impersonating <strong>{currentUser?.user_metadata?.full_name}</strong> — viewing the app as this resident.
                </span>
              </span>
              <button
                onClick={handleReturnToDeveloper}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-200 rounded-lg font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Return to Developer
              </button>
            </div>
          )}

          {/* Back to Officer Tools banner (officer navigated into a management workspace) */}
          {isOfficerOnMgmtTab && (
            <div className="p-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 bg-brand-forest/15 border border-brand-forest/40 text-brand-leaf animate-fade-in shadow-md">
              <span className="flex items-center gap-2 min-w-0">
                <Wrench className="w-4 h-4 shrink-0" />
                <span className="truncate">Officer Tools workspace — {officerRoles[0]} duties.</span>
              </span>
              <button
                onClick={() => setActiveTab('officertools')}
                className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-forest/25 hover:bg-brand-forest/40 border border-brand-forest/50 text-brand-leaf rounded-lg font-bold transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Officer Tools
              </button>
            </div>
          )}

          {/* ============================ OCCUPANT SECTIONS ============================ */}

          {/* SECTION: My Bulletin */}
          {activeTab === 'bulletin' && (() => {
            const room = mockUserRecord?.roomNumber || ''
            const myGeneralClean = db.cleaningSchedule.filter(s => !s.kitchenOnly && s.rooms.includes(room))
            const myKitchenClean = db.cleaningSchedule.filter(s => s.kitchenOnly && s.rooms.includes(room))
            const announcements = [...db.announcements].sort((a, b) => Number(b.pinned) - Number(a.pinned) || (a.date < b.date ? 1 : -1))
            const events = [...db.events].sort((a, b) => (a.date < b.date ? -1 : 1))
            return (
              <div className="space-y-6 animate-fade-in">
                {/* Welcome */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#01291c] via-[#04321e] to-[#0b3524] p-6 border border-[#0b3524] shadow-[3px_3px_0_rgba(0,0,0,0.18)]">
                  <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-brand-leaf/10 blur-3xl pointer-events-none z-0" />
                  <div className="relative z-10 space-y-1">
                    <span className="text-[9px] tracking-[0.2em] font-bold text-[#efbe2b] uppercase block">Resident Bulletin</span>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Welcome back, {mockUserRecord?.fullName}!</h2>
                    <p className="text-xs text-white/70">
                      Room {room || '—'} · {myGeneralClean.length} weekly cleaning {myGeneralClean.length === 1 ? 'duty' : 'duties'}{isKitchenUser ? ` · ${myKitchenClean.length} kitchen ${myKitchenClean.length === 1 ? 'duty' : 'duties'}` : ''}
                    </p>
                  </div>
                </div>

                {/* Phase 2 Modular Notice */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 shrink-0">
                      Phase 2 · Soon
                    </span>
                    <p className="text-xs leading-relaxed">
                      <strong>Resident Bulletin</strong> is marked as <em>Soon</em> to prioritize <strong>Occupant Records for Semestral Evaluation</strong> (Daily &amp; General Cleaning Attendance, Fines, and Financial Clearance).
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Announcements */}
                  <div className="lg:col-span-2 space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf flex items-center gap-2"><Megaphone className="w-4 h-4" /> Announcements</h3>
                    {announcements.length === 0 ? (
                      <p className="text-xs text-neutral-500 italic">No announcements.</p>
                    ) : announcements.map(a => (
                      <div key={a.id} className={`p-4 bg-white dark:bg-neutral-900/40 border rounded-xl space-y-1.5 ${a.pinned ? 'border-brand-gold/50' : 'border-neutral-200 dark:border-neutral-850'}`}>
                        <div className="flex items-start justify-between gap-3">
                          <strong className="text-sm text-neutral-900 dark:text-white">{a.title}</strong>
                          {a.pinned && <span className="shrink-0 px-2 py-0.5 rounded text-[9px] font-bold bg-brand-gold/20 text-brand-gold uppercase tracking-wide">Pinned</span>}
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{a.body}</p>
                        <div className="text-[10px] text-neutral-500 pt-1">{a.date} · {a.postedBy}</div>
                      </div>
                    ))}
                  </div>

                  {/* Upcoming Events + Assigned Area */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Upcoming Events</h3>
                      {events.length === 0 ? (
                        <p className="text-xs text-neutral-500 italic">No upcoming events.</p>
                      ) : events.map(ev => (
                        <div key={ev.id} className="p-4 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl space-y-1">
                          <strong className="text-xs text-neutral-900 dark:text-white block">{ev.title}</strong>
                          <div className="text-[10px] text-brand-leaf font-bold">{ev.date} · {ev.time}</div>
                          <div className="text-[10px] text-neutral-500">{ev.location}</div>
                          <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed pt-0.5">{ev.description}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf flex items-center gap-2"><Sparkles className="w-4 h-4" /> My Assigned Cleaning Area</h3>
                      <div className="p-4 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl space-y-2 text-xs">
                        <div className="flex justify-between"><span className="text-neutral-500">General Cleaning:</span><span className="font-bold text-neutral-900 dark:text-white">{myGeneralClean.length ? myGeneralClean.map(s => s.dayOfWeek).join(', ') : 'None'}</span></div>
                        {isKitchenUser && (
                          <div className="flex justify-between pt-1 border-t border-neutral-200 dark:border-neutral-850"><span className="text-neutral-500">Kitchen Duty:</span><span className="font-bold text-neutral-900 dark:text-white">{myKitchenClean.length ? myKitchenClean.map(s => s.dayOfWeek).join(', ') : 'None'}</span></div>
                        )}
                        <p className="text-[10px] text-neutral-500 pt-1">Room {room || '—'} · Absentees are fined Php 50.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}

          {/* SECTION: Attendance & Schedules */}
          {activeTab === 'attendance' && (() => {
            const room = mockUserRecord?.roomNumber || ''
            const myAllCleaningAtt = db.cleaningAttendance.filter(c => c.userId === currentUser.id && !c.kitchenOnly)
            const myDailyAtt = myAllCleaningAtt.filter(c => c.cleaningType === 'daily' || !c.cleaningType)
            const myGeneralAtt = myAllCleaningAtt.filter(c => c.cleaningType === 'general')
            const myKitchenAtt = db.cleaningAttendance.filter(c => c.userId === currentUser.id && c.kitchenOnly)
            const generalSched = db.cleaningSchedule.filter(s => !s.kitchenOnly)
            const kitchenSched = db.cleaningSchedule.filter(s => s.kitchenOnly)

            // Fines and clearance
            const myUnpaidCleaningFines = db.payments.filter(p => p.userId === currentUser.id && p.type === 'fine' && p.status === 'unpaid')
            const totalUnpaidFines = myUnpaidCleaningFines.reduce((sum, p) => sum + p.amount, 0)
            const hasUnpaidFines = totalUnpaidFines > 0

            // Daily cleaning breakdown
            const dailyChecked = myDailyAtt.filter(c => c.remark === 'check' || (!c.remark && c.status === 'present')).length
            const dailyExcused = myDailyAtt.filter(c => c.remark === 'excuse' || (!c.remark && c.status === 'excused')).length
            const dailyAbsent = myDailyAtt.filter(c => c.remark === 'absent' || (!c.remark && c.status === 'absent')).length
            const dailyPaid = myDailyAtt.filter(c => c.remark === 'paid').length
            const dailyNA = myDailyAtt.filter(c => c.remark === 'na').length

            // General cleaning breakdown
            const generalChecked = myGeneralAtt.filter(c => c.remark === 'check' || (!c.remark && c.status === 'present')).length
            const generalExcused = myGeneralAtt.filter(c => c.remark === 'excuse' || (!c.remark && c.status === 'excused')).length
            const generalAbsent = myGeneralAtt.filter(c => c.remark === 'absent' || (!c.remark && c.status === 'absent')).length
            const generalPaid = myGeneralAtt.filter(c => c.remark === 'paid').length
            const generalNA = myGeneralAtt.filter(c => c.remark === 'na').length

            // Filtered personal records
            const displayedRecords = myAllCleaningAtt
              .filter(c => {
                if (occupantAttFilter === 'daily') return c.cleaningType === 'daily' || !c.cleaningType
                if (occupantAttFilter === 'general') return c.cleaningType === 'general'
                return true
              })
              .sort((a, b) => (a.date < b.date ? 1 : -1))

            return (
              <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-850">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-brand-leaf uppercase tracking-wider mb-1">
                      <Sparkles className="w-4 h-4" /> Resident Attendance Portal
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                      My Attendance &amp; Semestral Clearance
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Personal duty tracking for Daily Cleaning (₱10 fine), General Cleaning (₱50 fine), and Event Attendance required for semestral evaluation.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-100 dark:bg-neutral-850 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800 font-mono">
                      Room {room || 'Unassigned'}
                    </span>
                  </div>
                </div>

                {/* Semestral Clearance Status Banner */}
                {hasUnpaidFines ? (
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                        <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                      </div>
                      <div>
                        <strong className="text-sm font-extrabold block">
                          Semestral Evaluation Hold Active: ₱{totalUnpaidFines} Outstanding Cleaning Fines
                        </strong>
                        <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">
                          You have {myUnpaidCleaningFines.length} unresolved absence fine(s). These must be settled with the Dormitory Treasurer before your Semestral Evaluation Clearance can be approved.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('payrecords')}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer shadow-xs"
                    >
                      View &amp; Settle at Treasury
                    </button>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center gap-3 shadow-xs">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <strong className="text-sm font-extrabold block">
                        Semestral Clearance Standing: Clean &amp; In Good Standing
                      </strong>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                        You have zero outstanding cleaning attendance fines or disciplinary holds. Your cleaning duty record satisfies all semestral evaluation criteria.
                      </p>
                    </div>
                  </div>
                )}

                {/* Dual-Tier Breakdown Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1: Daily Cleaning Breakdown */}
                  <div className="p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-2xl space-y-4 shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-brand-leaf" />
                        <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">Daily Cleaning Record</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono">
                        ₱10 fine per absence
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-2 text-center">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase block">/ Check</span>
                        <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{dailyChecked}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20">
                        <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold uppercase block">E Excuse</span>
                        <span className="text-lg font-extrabold text-sky-600 dark:text-sky-400">{dailyExcused}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                        <span className="text-[10px] text-red-600 dark:text-red-400 font-bold uppercase block">A Absent</span>
                        <span className="text-lg font-extrabold text-red-600 dark:text-red-400">{dailyAbsent}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20">
                        <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase block">P Paid</span>
                        <span className="text-lg font-extrabold text-teal-600 dark:text-teal-400">{dailyPaid}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-neutral-500/10 border border-neutral-500/20">
                        <span className="text-[10px] text-neutral-500 font-bold uppercase block">NA N/A</span>
                        <span className="text-lg font-extrabold text-neutral-600 dark:text-neutral-400">{dailyNA}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-neutral-500">Unpaid Daily Absences Fine:</span>
                      <span className={`font-mono font-bold ${dailyAbsent > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {dailyAbsent > 0 ? `₱${dailyAbsent * 10} Unpaid` : '₱0 (Clear)'}
                      </span>
                    </div>
                  </div>

                  {/* Card 2: General Cleaning Breakdown */}
                  <div className="p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-2xl space-y-4 shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">General Cleaning Record</h3>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono">
                        ₱50 fine per absence
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-2 text-center">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase block">/ Check</span>
                        <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{generalChecked}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20">
                        <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold uppercase block">E Excuse</span>
                        <span className="text-lg font-extrabold text-sky-600 dark:text-sky-400">{generalExcused}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                        <span className="text-[10px] text-red-600 dark:text-red-400 font-bold uppercase block">A Absent</span>
                        <span className="text-lg font-extrabold text-red-600 dark:text-red-400">{generalAbsent}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20">
                        <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase block">P Paid</span>
                        <span className="text-lg font-extrabold text-teal-600 dark:text-teal-400">{generalPaid}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-neutral-500/10 border border-neutral-500/20">
                        <span className="text-[10px] text-neutral-500 font-bold uppercase block">NA N/A</span>
                        <span className="text-lg font-extrabold text-neutral-600 dark:text-neutral-400">{generalNA}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-neutral-500">Unpaid General Absences Fine:</span>
                      <span className={`font-mono font-bold ${generalAbsent > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        {generalAbsent > 0 ? `₱${generalAbsent * 50} Unpaid` : '₱0 (Clear)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Personal Duty History Table */}
                <div className="bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-2xl overflow-hidden shadow-xs space-y-3 p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 dark:border-neutral-850">
                    <div>
                      <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
                        <History className="w-4 h-4 text-brand-leaf" />
                        <span>My Semestral Attendance Log</span>
                      </h3>
                      <p className="text-[11px] text-neutral-500">
                        Detailed history of all logged cleaning attendance and financial reconciliation.
                      </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs">
                      <button
                        onClick={() => setOccupantAttFilter('all')}
                        className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                          occupantAttFilter === 'all'
                            ? 'bg-[#255f3d] text-white'
                            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        All ({myAllCleaningAtt.length})
                      </button>
                      <button
                        onClick={() => setOccupantAttFilter('daily')}
                        className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                          occupantAttFilter === 'daily'
                            ? 'bg-[#255f3d] text-white'
                            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        Daily (₱10)
                      </button>
                      <button
                        onClick={() => setOccupantAttFilter('general')}
                        className={`px-2.5 py-1 rounded-md font-bold transition-colors cursor-pointer ${
                          occupantAttFilter === 'general'
                            ? 'bg-[#255f3d] text-white'
                            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        General (₱50)
                      </button>
                    </div>
                  </div>

                  {displayedRecords.length === 0 ? (
                    <div className="py-8 text-center text-xs text-neutral-500 italic">
                      No cleaning attendance records found for this view.
                    </div>
                  ) : (
                    <div className="overflow-x-auto max-h-72 overflow-y-auto scrollbar-thin">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                            <th className="py-2.5 px-3">Date</th>
                            <th className="py-2.5 px-3">Duty Tier</th>
                            <th className="py-2.5 px-3">Official Remark</th>
                            <th className="py-2.5 px-3">Fine Status</th>
                            <th className="py-2.5 px-3">Clearance Impact</th>
                            <th className="py-2.5 px-3">Recorded By</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800/60">
                          {displayedRecords.map((rec) => {
                            const type = rec.cleaningType || 'daily'
                            const rate = type === 'daily' ? 10 : 50
                            const remark = rec.remark || (rec.status === 'present' ? 'check' : rec.status === 'excused' ? 'excuse' : 'absent')
                            
                            return (
                              <tr key={rec.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-850/30">
                                <td className="py-2.5 px-3 font-mono text-neutral-700 dark:text-neutral-300">{rec.date}</td>
                                <td className="py-2.5 px-3">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    type === 'general' ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400' : 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                                  }`}>
                                    {type}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3">
                                  {remark === 'check' && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                      / Check (Present)
                                    </span>
                                  )}
                                  {remark === 'excuse' && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30">
                                      E Excuse
                                    </span>
                                  )}
                                  {remark === 'absent' && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
                                      A Absent
                                    </span>
                                  )}
                                  {remark === 'paid' && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30">
                                      P Paid (Cleared)
                                    </span>
                                  )}
                                  {remark === 'na' && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-500/15 text-neutral-600 dark:text-neutral-400 border border-neutral-500/30">
                                      NA Not Available
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 font-mono">
                                  {remark === 'absent' && (
                                    <span className="text-red-600 dark:text-red-400 font-bold">
                                      ₱{rate} (Unpaid)
                                    </span>
                                  )}
                                  {remark === 'paid' && (
                                    <span className="text-teal-600 dark:text-teal-400 font-bold">
                                      ₱{rate} (Paid)
                                    </span>
                                  )}
                                  {(remark === 'check' || remark === 'excuse' || remark === 'na') && (
                                    <span className="text-neutral-400">₱0</span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3">
                                  {remark === 'absent' ? (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400">
                                      Evaluation Hold
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                      Clear
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-3 text-neutral-500 text-[10px]">{rec.markedBy || 'SA'}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Schedules & Events Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* General Cleaning Assignment */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" /> My Assigned Room General Cleaning
                    </h3>
                    <div className="bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-2xl p-4 space-y-2 text-xs">
                      {generalSched.map(s => {
                        const isMyRoom = s.rooms.includes(room)
                        return (
                          <div key={s.id} className={`flex justify-between items-center p-2.5 rounded-xl ${isMyRoom ? 'bg-brand-forest/15 border border-brand-forest/40 text-brand-leaf' : 'bg-neutral-50 dark:bg-neutral-950/50'}`}>
                            <span className="font-bold">{s.dayOfWeek}</span>
                            <span className="font-mono text-neutral-600 dark:text-neutral-400">
                              Rooms: {s.rooms.join(', ')} {isMyRoom ? ' · (Your Room)' : ''}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Event & Assembly Attendance */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf flex items-center gap-2">
                      <Users className="w-4 h-4" /> Dorm Assembly &amp; Event Attendance
                    </h3>
                    <div className="bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-2xl p-4 space-y-2 text-xs">
                      {db.meetings.length === 0 ? (
                        <p className="text-neutral-500 italic py-2">No dorm events or general assemblies recorded.</p>
                      ) : (
                        db.meetings.map(m => {
                          const mine = m.attendees.find(a => a.userId === currentUser.id)
                          return (
                            <div key={m.id} className="flex justify-between items-center p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950/50">
                              <div className="min-w-0">
                                <span className="font-bold text-neutral-900 dark:text-white block truncate">{m.eventName}</span>
                                <span className="text-[10px] text-neutral-500">{m.date}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                                mine?.status === 'present' ? 'bg-emerald-500/15 text-emerald-500' :
                                mine?.status === 'excused' ? 'bg-sky-500/15 text-sky-500' :
                                mine?.status === 'absent' ? 'bg-red-500/15 text-red-500' :
                                'bg-neutral-500/15 text-neutral-500'
                              }`}>
                                {mine ? mine.status : 'N/A'}
                              </span>
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* Kitchen cleaning schedule if kitchen user */}
                {isKitchenUser && (
                  <div className="p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-2xl space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf flex items-center gap-2">
                      <ChefHat className="w-4 h-4" /> Kitchen Duty Schedule
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {kitchenSched.map(s => (
                        <div key={s.id} className="flex justify-between p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-950/50">
                          <span className="font-bold text-neutral-900 dark:text-white">{s.dayOfWeek}</span>
                          <span className="text-neutral-500 font-mono">Rooms: {s.rooms.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })()}

          {/* SECTION: Payment Records */}
          {activeTab === 'payrecords' && (() => {
            const mine = db.payments.filter(p => p.userId === currentUser.id)
            const events = mine.filter(p => p.type === 'event')
            const kitchenFines = mine.filter(p => p.type === 'fine' && p.description.includes('Kitchen'))
            const cleaningFines = mine.filter(p => p.type === 'fine' && !p.description.includes('Kitchen'))
            const gadgetFees = mine.filter(p => p.type === 'gadget')
            const maintenance = mine.filter(p => p.type === 'maintenance')
            const unpaid = mine.filter(p => p.status === 'unpaid').reduce((a, p) => a + p.amount, 0)
            const statusChip = (s: string) => s === 'paid' ? 'bg-emerald-500/15 text-emerald-500' : s === 'pending' ? 'bg-amber-500/15 text-amber-500' : 'bg-red-500/15 text-red-500'
            const PayGroup = ({ title, items, icon: Icon }: { title: string; items: Payment[]; icon: NavItem['icon'] }) => (
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf flex items-center gap-2"><Icon className="w-4 h-4" /> {title}</h3>
                <div className="bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl p-4 space-y-2 text-xs">
                  {items.length === 0 ? <p className="text-neutral-500 italic">None on record.</p> : items.map(p => (
                    <div key={p.id} className="flex items-center justify-between gap-3 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950/50">
                      <div className="min-w-0">
                        <span className="font-bold text-neutral-900 dark:text-white block truncate">{p.description}</span>
                        <span className="text-[10px] text-neutral-500">Due {p.dueDate} · ₱{p.amount.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusChip(p.status)}`}>{p.status}</span>
                        {p.status === 'unpaid' && (
                          <button onClick={() => handleSubmitReceipt(p.id)} className="px-2 py-1 rounded text-[10px] font-bold bg-brand-gold hover:bg-brand-gold/90 text-neutral-900 cursor-pointer">Upload Receipt</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
            return (
              <div className="space-y-6 animate-fade-in">
                <div className="pb-4 border-b border-neutral-200 dark:border-neutral-850 flex justify-between items-center gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Payment Records</h2>
                    <p className="text-xs text-neutral-500">All dues, fees, and fines on your account.</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] uppercase font-bold text-neutral-500">Outstanding</div>
                    <div className={`text-lg font-extrabold ${unpaid > 0 ? 'text-red-500' : 'text-emerald-500'}`}>₱{unpaid.toFixed(2)}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PayGroup title="Event Contributions" items={events} icon={CalendarDays} />
                  <PayGroup title="Maintenance Fee" items={maintenance} icon={Home} />
                  <PayGroup title="Cleaning Fines" items={cleaningFines} icon={Sparkles} />
                  {(isKitchenUser || kitchenFines.length > 0) && <PayGroup title="Kitchen Fines" items={kitchenFines} icon={ChefHat} />}
                  <PayGroup title="Gadget Fee" items={gadgetFees} icon={Laptop} />
                </div>
              </div>
            )
          })()}

          {/* SECTION: Minutes & Records */}
          {activeTab === 'records' && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-4 border-b border-neutral-200 dark:border-neutral-850">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Minutes & Records</h2>
                <p className="text-xs text-neutral-500">General meeting minutes and published financial reports.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf flex items-center gap-2"><FileText className="w-4 h-4" /> General Meeting Minutes</h3>
                  <div className="bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl p-4 space-y-2 text-xs">
                    {db.meetings.filter(m => m.minutesUrl).length === 0 ? <p className="text-neutral-500 italic">No minutes published.</p> : db.meetings.filter(m => m.minutesUrl).map(m => (
                      <div key={m.id} className="flex items-center justify-between gap-3 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950/50">
                        <div className="min-w-0"><span className="font-bold text-neutral-900 dark:text-white block truncate">{m.eventName}</span><span className="text-[10px] text-neutral-500">{m.date}</span></div>
                        <button onClick={() => triggerAlert('success', `Downloading ${m.minutesUrl} (mock)`)} className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-brand-forest/15 text-brand-leaf hover:bg-brand-forest/25 cursor-pointer"><FileDown className="w-3 h-3" /> PDF</button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf flex items-center gap-2"><Coins className="w-4 h-4" /> Financial Reports</h3>
                  <div className="bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl p-4 space-y-2 text-xs">
                    {db.financialReports.length === 0 ? <p className="text-neutral-500 italic">No reports published.</p> : db.financialReports.map(f => (
                      <div key={f.id} className="flex items-center justify-between gap-3 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-950/50">
                        <div className="min-w-0"><span className="font-bold text-neutral-900 dark:text-white block truncate">{f.title}</span><span className="text-[10px] text-neutral-500">{f.date} · by {f.uploadedBy}</span></div>
                        <button onClick={() => triggerAlert('success', `Downloading ${f.url} (mock)`)} className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-brand-forest/15 text-brand-leaf hover:bg-brand-forest/25 cursor-pointer"><FileDown className="w-3 h-3" /> PDF</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: Violation Records (occupant personal) */}
          {activeTab === 'myviolations' && (() => {
            const mine = db.violations.filter(v => v.userId === currentUser.id)
            const sevChip = (s: string) => s === 'high' ? 'bg-red-500/15 text-red-500' : s === 'medium' ? 'bg-amber-500/15 text-amber-500' : 'bg-neutral-500/15 text-neutral-500'
            return (
              <div className="space-y-6 animate-fade-in">
                <div className="pb-4 border-b border-neutral-200 dark:border-neutral-850 flex justify-between items-center gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Violation Records</h2>
                    <p className="text-xs text-neutral-500">Conduct violations recorded on your account.</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${mine.length ? 'bg-red-500/15 text-red-500' : 'bg-emerald-500/15 text-emerald-500'}`}>{mine.length ? `${mine.length} on record` : 'Clean record'}</span>
                </div>
                {mine.length === 0 ? (
                  <div className="p-8 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl text-center text-xs text-neutral-500">
                    <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" /> No violations on record. Keep it up!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mine.map(v => (
                      <div key={v.id} className="p-4 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl space-y-1.5 text-xs">
                        <div className="flex items-center justify-between gap-3">
                          <strong className="text-sm text-neutral-900 dark:text-white">{v.type}</strong>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${sevChip(v.severity)}`}>{v.severity}</span>
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{v.details}</p>
                        <div className="text-[10px] text-neutral-500 pt-1">{v.date} · recorded by {v.recordedBy}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })()}

          {/* SECTION: Evaluation Performance */}
          {activeTab === 'evaluation' && (() => {
            const myEvals = db.evaluations.filter(e => e.userId === currentUser.id)
            const avg = myEvals.length ? myEvals.reduce((a, e) => a + e.score, 0) / myEvals.length : 0
            // Rank among all occupants who have evaluations
            const perUser: { [id: string]: number[] } = {}
            db.evaluations.forEach(e => { (perUser[e.userId] ||= []).push(e.score) })
            const ranked = Object.entries(perUser)
              .map(([id, scores]) => ({ id, avg: scores.reduce((a, s) => a + s, 0) / scores.length }))
              .sort((a, b) => b.avg - a.avg)
            const myRank = ranked.findIndex(r => r.id === currentUser.id)
            const status = avg >= 4.5 ? 'Outstanding' : avg >= 4 ? 'Very Good' : avg >= 3 ? 'Good' : avg >= 2 ? 'Satisfactory' : avg > 0 ? 'Needs Improvement' : 'Not yet evaluated'
            const statusColor = avg >= 4 ? 'text-emerald-500' : avg >= 3 ? 'text-brand-leaf' : avg >= 2 ? 'text-amber-500' : 'text-neutral-500'
            return (
              <div className="space-y-6 animate-fade-in">
                <div className="pb-4 border-b border-neutral-200 dark:border-neutral-850">
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Evaluation Performance</h2>
                  <p className="text-xs text-neutral-500">Your semester evaluation scores, ranking, and standing.</p>
                </div>
                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl flex items-center gap-4">
                    <Award className="w-8 h-8 text-brand-gold shrink-0" />
                    <div><div className="text-2xl font-extrabold text-neutral-900 dark:text-white">{avg ? avg.toFixed(2) : '—'}<span className="text-xs text-neutral-500"> / 5.0</span></div><div className="text-[10px] uppercase font-bold text-neutral-500">Average Score</div></div>
                  </div>
                  <div className="p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl flex items-center gap-4">
                    <Trophy className="w-8 h-8 text-brand-gold shrink-0" />
                    <div><div className="text-2xl font-extrabold text-neutral-900 dark:text-white">{myRank >= 0 ? `#${myRank + 1}` : '—'}<span className="text-xs text-neutral-500">{myRank >= 0 ? ` of ${ranked.length}` : ''}</span></div><div className="text-[10px] uppercase font-bold text-neutral-500">Dorm Rank</div></div>
                  </div>
                  <div className="p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl flex items-center gap-4">
                    <Star className="w-8 h-8 text-brand-gold shrink-0" />
                    <div><div className={`text-lg font-extrabold ${statusColor}`}>{status}</div><div className="text-[10px] uppercase font-bold text-neutral-500">Standing</div></div>
                  </div>
                </div>
                {/* Breakdown */}
                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">Evaluation Breakdown</h3>
                  <div className="bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl p-4 space-y-3 text-xs">
                    {myEvals.length === 0 ? <p className="text-neutral-500 italic text-center">No evaluations posted for this cycle yet.</p> : myEvals.map(e => (
                      <div key={e.id} className="p-3 bg-neutral-50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-900 rounded-lg space-y-1.5">
                        <div className="flex justify-between items-center"><strong className="text-neutral-900 dark:text-white">Anonymous Evaluator Score</strong><span className="font-mono text-brand-leaf font-bold">★ {e.score} / 5.0</span></div>
                        <p className="text-neutral-600 dark:text-neutral-400 italic text-[11px] leading-relaxed">&ldquo;{e.feedback}&rdquo;</p>
                        <span className="text-[9px] text-neutral-500 block">Cycle: {e.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })()}

          {/* SECTION: Elections (occupant voting) */}
          {activeTab === 'myelections' && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-4 border-b border-neutral-200 dark:border-neutral-850">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Elections</h2>
                <p className="text-xs text-neutral-500">Cast your ballots for officer positions and semester evaluators.</p>
              </div>

              {/* Phase 2 Modular Notice */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 shrink-0">
                    Phase 2 · Soon
                  </span>
                  <p className="text-xs leading-relaxed">
                    <strong>Resident Voting &amp; Elections</strong> is marked as <em>Soon</em> to prioritize <strong>Occupant Records for Semestral Evaluation</strong> (Daily &amp; General Cleaning Attendance, Fines, and Financial Clearance).
                  </p>
                </div>
              </div>

              {/* Officer elections */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf flex items-center gap-2"><Vote className="w-4 h-4" /> Officer Elections</h3>
                {db.officerElections.filter(el => el.status !== 'setup').length === 0 ? (
                  <p className="text-xs text-neutral-500 italic">No officer elections open.</p>
                ) : db.officerElections.filter(el => el.status !== 'setup').map(el => (
                  <div key={el.id} className="p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl space-y-4 text-xs">
                    <div className="border-b border-neutral-200 dark:border-neutral-850 pb-3"><strong className="text-neutral-900 dark:text-white text-sm block">{el.title}</strong><span className="text-[10px] text-neutral-500">Status: {el.status.toUpperCase()}</span></div>
                    <div className="space-y-4">
                      {el.positions.map(pos => {
                        const userVote = pos.votes[currentUser.id]
                        return (
                          <div key={pos.id} className="p-3.5 bg-neutral-50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-900 rounded-xl space-y-3">
                            <strong className="text-brand-leaf font-bold">{pos.name}</strong>
                            <div className="space-y-2">
                              {pos.candidates.length === 0 && <p className="text-[10px] text-neutral-500 italic">No candidates yet.</p>}
                              {pos.candidates.map(cand => (
                                <div key={cand.userId} className="flex justify-between items-center bg-white dark:bg-neutral-900/40 p-2 rounded-lg border border-neutral-200 dark:border-neutral-900">
                                  <span className="font-bold text-neutral-900 dark:text-white">{cand.fullName}</span>
                                  {el.status === 'active' && <button onClick={() => handleCastOfficerVote(el.id, pos.id, cand.userId)} className={`px-3 py-1 rounded text-[10px] ${userVote === cand.userId ? 'bg-brand-gold text-black font-bold' : 'bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'}`}>{userVote === cand.userId ? 'Selected' : 'Vote'}</button>}
                                </div>
                              ))}
                              <div className="flex justify-between items-center bg-white dark:bg-neutral-900/40 p-2 rounded-lg border border-neutral-200 dark:border-neutral-900">
                                <span className="font-bold text-red-400">Abstain (No Confidence)</span>
                                {el.status === 'active' && <button onClick={() => handleCastOfficerVote(el.id, pos.id, 'abstain')} className={`px-3 py-1 rounded text-[10px] ${userVote === 'abstain' ? 'bg-red-600 text-white font-bold' : 'bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'}`}>{userVote === 'abstain' ? 'Abstained' : 'Abstain'}</button>}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Evaluator elections */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf flex items-center gap-2"><Star className="w-4 h-4" /> Evaluator Elections</h3>
                {db.evaluatorElections.filter(ev => ev.status !== 'setup' && ev.status !== 'closed').length === 0 ? (
                  <p className="text-xs text-neutral-500 italic">No evaluator elections open.</p>
                ) : db.evaluatorElections.filter(ev => ev.status !== 'setup' && ev.status !== 'closed').map(ev => (
                  <div key={ev.id} className="p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl space-y-4 text-xs">
                    <div className="border-b border-neutral-200 dark:border-neutral-850 pb-3"><strong className="text-neutral-900 dark:text-white text-sm block">Semester Evaluator Selection</strong><span className="text-[10px] text-neutral-500">Phase: {ev.status.toUpperCase()} · N = {ev.qualifyingCount}</span></div>
                    {ev.status === 'nomination' && (
                      <div className="space-y-2">
                        <label className="text-[10px] text-neutral-600 dark:text-neutral-400 block">Nominate a representative for Room {mockUserRecord?.roomNumber || 'N/A'}:</label>
                        <select onChange={(e) => { if (e.target.value) { handleNominateEvaluator(ev.id, e.target.value); e.target.value = '' } }} className="w-full p-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white">
                          <option value="">-- Nominate Room Member --</option>
                          {db.users.filter(u => u.status === 'active' && u.role !== 'admin' && u.roomNumber === mockUserRecord?.roomNumber).map(rm => <option key={rm.id} value={rm.id}>{rm.fullName}</option>)}
                        </select>
                      </div>
                    )}
                    {ev.status === 'voting' && (
                      <div className="space-y-2">
                        {Object.values(ev.nominations).map(nomId => {
                          const nom = db.users.find(u => u.id === nomId)
                          const voted = ev.votes[currentUser.id] === nomId
                          return (
                            <div key={nomId} className="flex justify-between items-center p-2.5 bg-neutral-50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-900 rounded-lg">
                              <div><span className="font-bold text-neutral-900 dark:text-white block">{nom?.fullName}</span><span className="text-[10px] text-neutral-500">Room {nom?.roomNumber}</span></div>
                              <button onClick={() => handleVoteEvaluator(ev.id, nomId)} className={`px-3 py-1 rounded text-[10px] ${voted ? 'bg-brand-gold text-black font-bold' : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'}`}>{voted ? 'Voted' : 'Vote'}</button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION: Officer Tools hub */}
          {activeTab === 'officertools' && hasOfficerRole && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-4 border-b border-neutral-200 dark:border-neutral-850 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-gold/15 border border-brand-gold/30 flex items-center justify-center"><Wrench className="w-4 h-4 text-brand-gold" /></div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Officer Tools</h2>
                  <p className="text-xs text-neutral-500">Management duties for your role{officerRoles.length > 1 ? 's' : ''}: {officerRoles.join(', ')}.</p>
                </div>
              </div>
              {officerRoles.map(role => (
                <div key={role} className="space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">{role}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {(OFFICER_TOOLS[role] || []).map(tool => {
                      const Icon = tool.icon
                      return (
                        <button key={tool.tab + role} onClick={() => setActiveTab(tool.tab)} className="flex items-start gap-3 p-4 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 hover:border-brand-forest/50 hover:bg-brand-forest/5 rounded-xl text-left transition-colors cursor-pointer group">
                          <div className="w-9 h-9 rounded-lg bg-brand-forest/10 flex items-center justify-center text-brand-leaf shrink-0 group-hover:scale-110 transition-transform"><Icon className="w-4 h-4" /></div>
                          <div className="min-w-0"><div className="text-xs font-bold text-neutral-900 dark:text-white">{tool.label}</div><div className="text-[10px] text-neutral-500 leading-snug mt-0.5">{tool.desc}</div></div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 0: Admin Executive Dashboard Overview */}
          {activeTab === 'dashboard' && isSystemAdmin && db && (
            <div className="space-y-6">
              {/* Executive Header */}
              <div className="pb-4 border-b border-neutral-350 dark:border-neutral-700">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white flex items-center gap-2.5">
                    <LayoutDashboard className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    Admin Command Center
                  </h2>
                  <p className="text-sm font-normal text-neutral-800 dark:text-neutral-200 mt-1">
                    Executive overview of Mahogany Men's Hall residence roster, collections, governance, and pending clearances.
                  </p>
                </div>
              </div>

              {/* Occupant-Styled Welcome Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#01291c] via-[#04321e] to-[#0b3524] p-6 border border-[#0b3524] shadow-[3px_3px_0_rgba(0,0,0,0.18)]">
                <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-brand-leaf/10 blur-3xl pointer-events-none z-0" />
                <div className="relative z-10 space-y-1.5">
                  <span className="text-[10px] tracking-[0.2em] font-bold text-[#efbe2b] uppercase block">Admin Command Center</span>
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                    Welcome back, {mockUserRecord?.fullName || 'Dorm Adviser'}!
                  </h2>
                  <p className="text-xs sm:text-sm font-normal text-white/80 mt-1 max-w-3xl">
                    Welcome to Mahogany Sync Admin Portal. You are currently managing residence hall governance, active roster records, fee collections, and applicant approvals for <span className="font-bold text-[#efbe2b]">{ayContext} • {semesterContext}</span>.
                  </p>
                </div>
              </div>

              {/* KPI Executive Summary Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Metric 1: Active Residents (Green = Active Roster) */}
                <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-[3px_3px_0_rgba(0,0,0,0.06)] relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">Active Roster</span>
                      <div className="text-3xl font-bold text-neutral-900 dark:text-white mt-1.5">
                        {db.users.filter(u => u.status === 'active' && u.role === 'user').length} <span className="text-sm font-normal text-neutral-800 dark:text-neutral-200">Occupants</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-3.5 flex items-center gap-2 text-xs font-normal text-neutral-800 dark:text-neutral-200">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    <span>100% Capacity • {ayContext}</span>
                  </div>
                </div>

                {/* Metric 2: Pending Sign-up Approvals (Warm Amber/Gold Accent) */}
                <div 
                  onClick={() => setActiveTab('pending_approvals')}
                  className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-[3px_3px_0_rgba(0,0,0,0.06)] relative overflow-hidden group cursor-pointer hover:border-emerald-500/50 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1.5">
                        Registration
                      </span>
                      <div className="text-3xl font-bold text-neutral-900 dark:text-white mt-1.5">
                        {db.users.filter(u => u.status === 'pending').length} <span className="text-sm font-normal text-neutral-800 dark:text-neutral-200">Requests</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 group-hover:scale-105 transition-transform">
                      <UserPlus className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-3.5 flex items-center justify-between text-xs font-normal text-amber-700 dark:text-amber-400">
                    <span className="flex items-center gap-1 font-semibold">Review Queue Active</span>
                    <span className="font-bold underline flex items-center gap-0.5 text-emerald-700 dark:text-emerald-400">View Queue &rarr;</span>
                  </div>
                </div>

                {/* Metric 3: Fee Collections (Gold = Finances) */}
                <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-[3px_3px_0_rgba(0,0,0,0.06)] relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">Financial Ledger</span>
                      <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1.5">
                        ₱{db.payments.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0).toLocaleString()}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      <CreditCard className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-3.5 flex items-center gap-2 text-xs font-normal text-neutral-800 dark:text-neutral-200">
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>₱{db.payments.filter(p => p.status === 'unpaid').reduce((acc, p) => acc + p.amount, 0).toLocaleString()} Pending Collections</span>
                  </div>
                </div>

                {/* Metric 4: Active Discipline & Violations (Rose = Violations / Warnings) */}
                <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-[3px_3px_0_rgba(0,0,0,0.06)] relative overflow-hidden group">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">Violation Records</span>
                      <div className="text-3xl font-bold text-rose-600 dark:text-rose-400 mt-1.5">
                        {db.violations.length} <span className="text-sm font-normal text-neutral-800 dark:text-neutral-200">Logged</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                      <AlertTriangle className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="mt-3.5 flex items-center gap-2 text-xs font-normal text-neutral-800 dark:text-neutral-200">
                    <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <span>Discipline & Compliance Monitored</span>
                  </div>
                </div>
              </div>

              {/* Database Storage Card (Dynamic Threshold Mode) */}
              {(() => {
                const dbBytes = typeof window !== 'undefined' ? (localStorage.getItem('mahogany_sync_db')?.length || JSON.stringify(db).length) : 1929384
                const dbMb = (dbBytes / (1024 * 1024)).toFixed(2)
                const dbPct = Math.min(100, Math.max(4, Math.round((parseFloat(dbMb) / 5.0) * 100)))
                const barColor = dbPct >= 85 ? 'bg-rose-600 dark:bg-rose-500' : dbPct >= 70 ? 'bg-amber-500 dark:bg-amber-400' : 'bg-emerald-600 dark:bg-emerald-500'
                const textColor = dbPct >= 85 ? 'text-rose-600 dark:text-rose-400' : dbPct >= 70 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'

                return (
                  <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-[3px_3px_0_rgba(0,0,0,0.06)] space-y-2.5">
                    <div className="flex justify-between items-center text-sm font-bold text-neutral-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Database Storage</span>
                        {dbPct >= 85 && (
                          <span className="px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400 text-[10px] uppercase font-bold tracking-wider border border-rose-500/20">
                            Critical Level
                          </span>
                        )}
                      </div>
                      <span className={`${textColor} font-bold transition-colors`}>{dbMb} MB / 5.00 MB ({dbPct}%)</span>
                    </div>
                    <div className="w-full bg-neutral-150 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                      <div className={`${barColor} h-full rounded-full transition-all duration-500`} style={{ width: `${dbPct}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-0.5">
                      <p className="text-neutral-500 dark:text-neutral-400 leading-normal">
                        Data includes resident rosters, cleaning duties, attendance records, gadget registries, payment ledgers, and violation logs.
                      </p>
                      <button
                        onClick={() => setActiveTab('storage')}
                        className="shrink-0 ml-4 text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        Manage Storage & History &rarr;
                      </button>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* TAB 0B: Database Storage & System Purge Control */}
          {activeTab === 'storage' && isSystemAdmin && db && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-200 dark:border-neutral-850">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Storage and History
                  </h2>
                  <p className="text-xs text-neutral-500">Monitor system local storage consumption, purge historic term records, and backup system data.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddTermModal(true)}
                    className="bg-[#255f3d] hover:bg-[#1e4c31] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    + New Term
                  </button>
                  <button
                    onClick={() => setShowStorageModal(true)}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    Purge Storage
                  </button>
                </div>
              </div>

              {/* Phase 2 Modular Notice */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 shrink-0">
                    Phase 2 · Soon
                  </span>
                  <p className="text-xs leading-relaxed">
                    <strong>Storage and History Management</strong> is marked as <em>Soon</em> to prioritize <strong>Occupant Records for Semestral Evaluation</strong> (Daily &amp; General Cleaning Attendance, Fines, and Financial Clearance).
                  </p>
                </div>
              </div>

              {/* Dynamic Capacity Meter Card */}
              {(() => {
                const dbBytes = typeof window !== 'undefined' ? (localStorage.getItem('mahogany_sync_db')?.length || JSON.stringify(db).length) : 1929384
                const dbMb = (dbBytes / (1024 * 1024)).toFixed(2)
                const dbPct = Math.min(100, Math.max(4, Math.round((parseFloat(dbMb) / 5.0) * 100)))
                const barColor = dbPct >= 85 ? 'bg-rose-600 dark:bg-rose-500' : dbPct >= 70 ? 'bg-amber-500 dark:bg-amber-400' : 'bg-emerald-600 dark:bg-emerald-500'
                const textColor = dbPct >= 85 ? 'text-rose-600 dark:text-rose-400' : dbPct >= 70 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'

                return (
                  <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">Storage Utilization</span>
                        <div className={`text-3xl font-extrabold ${textColor} mt-1`}>
                          {dbMb} MB <span className="text-sm font-normal text-neutral-500">/ 5.00 MB Limit ({dbPct}%)</span>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${dbPct >= 85 ? 'bg-rose-500/15 text-rose-600 border border-rose-500/20' : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'}`}>
                          {dbPct >= 85 ? 'Critical Warning' : 'Healthy Capacity'}
                        </span>
                        <p className="text-[11px] text-neutral-400">LocalStorage Standard Allocation</p>
                      </div>
                    </div>

                    <div className="w-full bg-neutral-150 dark:bg-neutral-800 h-3 rounded-full overflow-hidden">
                      <div className={`${barColor} h-full rounded-full transition-all duration-500`} style={{ width: `${dbPct}%` }}></div>
                    </div>
                  </div>
                )
              })()}

              {/* Data Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-900 dark:text-white">
                    <span>Resident & Officer Records</span>
                    <span className="text-emerald-600 font-mono">{db.users.length} Records</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">Active occupants, pending registrations, and adviser user profiles.</p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-900 dark:text-white">
                    <span>Financial Ledger Records</span>
                    <span className="text-amber-600 font-mono">{db.payments.length} Payments</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">Dorm dues, kitchen fees, amenities, and payment history.</p>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-neutral-900 dark:text-white">
                    <span>Attendance & Cleaning Logs</span>
                    <span className="text-emerald-600 font-mono">{db.cleaningAttendance.length} Entries</span>
                  </div>
                  <p className="text-[11px] text-neutral-500">Daily duty completion logs, duty mapping, and meeting minutes.</p>
                </div>
              </div>

              {/* Data Maintenance Controls */}
              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">JSON Database Export & Backup</h3>
                  <p className="text-xs text-neutral-500">Download a full JSON snapshot of all system tables before performing term purges.</p>
                </div>
                <button
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db, null, 2))
                    const downloadAnchor = document.createElement('a')
                    downloadAnchor.setAttribute("href", dataStr)
                    downloadAnchor.setAttribute("download", `mahogany_sync_backup_${new Date().toISOString().split('T')[0]}.json`)
                    document.body.appendChild(downloadAnchor)
                    downloadAnchor.click()
                    downloadAnchor.remove()
                  }}
                  className="bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0"
                >
                  Export JSON Backup
                </button>
              </div>
            </div>
          )}

          {/* TAB 1: Roster Control (Admin) */}
          {activeTab === 'roster' && isSystemAdmin && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-200 dark:border-neutral-850">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Occupant Directory</h2>
                  <p className="text-xs text-neutral-500">Manage resident statuses and active occupant records.</p>
                </div>
                <div className="flex gap-2">
                  <select
                    value={ayContext}
                    onChange={(e) => setAyContext(e.target.value)}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold px-2.5 py-1.5 text-neutral-900 dark:text-white"
                  >
                    <option value="AY 2025-2026">AY 2025-2026</option>
                    <option value="AY 2026-2027">AY 2026-2027</option>
                  </select>
                  <select
                    value={semesterContext}
                    onChange={(e) => setSemesterContext(e.target.value)}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-semibold px-2.5 py-1.5 text-neutral-900 dark:text-white"
                  >
                    <option value="1st Semester">1st Semester</option>
                    <option value="2nd Semester">2nd Semester</option>
                  </select>
                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs cursor-pointer"
                  >
                    + Add Resident
                  </button>
                </div>
              </div>

              {/* DIRECT ADD USER MODAL */}
              {showAddUserModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 w-full max-w-md space-y-4">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Directly Add Resident</h3>
                    <form onSubmit={handleDirectAddUser} className="space-y-3.5 text-xs">
                      <div className="space-y-1">
                        <label className="text-neutral-600 dark:text-neutral-400 font-bold">Full Name</label>
                        <input name="fullName" type="text" required placeholder="John Doe" className="w-full p-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-neutral-600 dark:text-neutral-400 font-bold">Email Address</label>
                        <input name="email" type="email" required placeholder="doe@vsu.edu.ph" className="w-full p-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-neutral-600 dark:text-neutral-400 font-bold">Student ID</label>
                        <input name="studentId" type="text" required placeholder="23-1-02249" className="w-full p-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-neutral-600 dark:text-neutral-400 font-bold">Room Number</label>
                        <input name="roomNumber" type="text" placeholder="101" className="w-full p-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-neutral-600 dark:text-neutral-400 font-bold">Assign Special Role (Optional)</label>
                        <select name="specialRole" className="w-full p-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white">
                          <option value="">None</option>
                          <option value="SA">Student Assistant (SA)</option>
                          <option value="Treasurer">Treasurer</option>
                          <option value="Secretary">Secretary</option>
                          <option value="Kitchen Manager">Kitchen Manager</option>
                        </select>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setShowAddUserModal(false)} className="px-3 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-lg">Cancel</button>
                        <button type="submit" className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg">Add User</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* APPROVAL NOTICE MODAL */}
              {showApprovalNotice && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-[#0c0c0c] border border-brand-forest/40 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
                    <div className="flex items-center gap-2 text-brand-leaf font-bold text-sm">
                      <span>✉️ Automated Credential Dispatch Email Simulator</span>
                    </div>
                    <div className="p-3 bg-neutral-100 dark:bg-neutral-950 border border-neutral-900 rounded-lg font-mono text-[10px] text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                      <p><strong>From:</strong> vsu.mahogany@gmail.com (SMTP)</p>
                      <p><strong>To:</strong> {showApprovalNotice.email}</p>
                      <p><strong>Subject:</strong> MMH Connect - Account Registration Approved</p>
                      <p className="border-t border-neutral-900 pt-2 text-neutral-900 dark:text-white">
                        Your registration has been approved. Use the following credentials to access your dashboard:
                      </p>
                      <p className="text-brand-leaf text-xs font-bold">
                        Username: {showApprovalNotice.username}
                        <br />
                        Temporary Password: {showApprovalNotice.tempPass}
                      </p>
                      <p className="text-[9px] text-neutral-500 italic">
                        Note: You will be prompted to change your temporary password upon first login.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowApprovalNotice(null)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
                    >
                      Close Notice & Proceed
                    </button>
                  </div>
                </div>
              )}

              {/* Active Resident Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">Active Directory ({db.users.filter(u => u.status !== 'pending' && u.status !== 'removed').length})</h3>
                <div className="bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-none overflow-hidden">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-neutral-50/70 dark:bg-[#0c1913] border-b border-neutral-200 dark:border-neutral-850 text-brand-dark dark:text-neutral-300 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Username</th>
                        <th className="py-3 px-4">Room</th>
                        <th className="py-3 px-4">Special Roles</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-850/60 text-neutral-700 dark:text-neutral-300">
                      {db.users.filter(u => u.status !== 'pending' && u.status !== 'removed').map((u) => (
                        <tr key={u.id}>
                          <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                            {u.fullName}
                            {u.id === currentUser.id && (
                              <span className="px-1.5 py-0.5 rounded text-[8px] bg-brand-gold/20 text-brand-leaf border border-brand-leaf/30">You</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-[11px] text-brand-leaf">{u.username}</td>
                          <td className="py-3.5 px-4">{u.roomNumber || '—'}</td>
                          <td className="py-3.5 px-4">
                            {u.role === 'admin' ? (
                              <span className="px-1.5 py-0.5 rounded text-[9px] bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-900/30 text-red-750 dark:text-red-400 font-bold">Adviser</span>
                            ) : (
                              u.specialRoles.map(sr => (
                                <span key={sr} className="px-1.5 py-0.5 rounded text-[9px] bg-brand-forest/5 dark:bg-brand-forest/10 border border-brand-forest/20 dark:border-brand-forest/30 text-brand-forest dark:text-brand-leaf font-bold mr-1">{sr}</span>
                              )) || 'Occupant'
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                              u.status === 'active' 
                                ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-250/30 dark:border-emerald-900/30' 
                                : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-550 border-neutral-200 dark:border-neutral-800'
                            }`}>
                              {u.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1">
                            <button
                              onClick={() => handleToggleDeactivate(u.id)}
                              className="px-2.5 py-1 bg-white dark:bg-neutral-900 hover:bg-brand-forest/5 dark:hover:bg-brand-forest/15 border border-neutral-200 dark:border-neutral-800 text-[10px] font-bold rounded transition-colors duration-150 cursor-pointer"
                            >
                              {u.status === 'active' ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleSoftDelete(u.id)}
                              className="px-2.5 py-1 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/40 border border-red-200/50 dark:border-red-900/30 text-red-750 dark:text-red-400 text-[10px] font-bold rounded transition-colors duration-150 cursor-pointer"
                            >
                              Remove
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

          {/* TAB 1B: Pending Approvals (Admin Occupant Directory Sub-choice) */}
          {activeTab === 'pending_approvals' && isSystemAdmin && db && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-neutral-200 dark:border-neutral-850">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                    {db.users.filter(u => u.status === 'pending').length}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Pending Approvals</h2>
                    <p className="text-xs text-neutral-500">Review pending resident registrations and generate access credentials.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-none shadow-[3px_3px_0_rgba(0,0,0,0.06)] overflow-hidden">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50/70 dark:bg-[#0c1913] border-b border-neutral-200 dark:border-neutral-800 text-brand-dark dark:text-neutral-300 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3.5 px-5">Name</th>
                      <th className="py-3.5 px-5">Email</th>
                      <th className="py-3.5 px-5">Student ID</th>
                      <th className="py-3.5 px-5">Room</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-800 dark:text-neutral-200">
                    {db.users.filter(u => u.status === 'pending').length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 px-5 text-center text-neutral-500 font-normal">
                          No pending registration requests at this time.
                        </td>
                      </tr>
                    ) : (
                      db.users.filter(u => u.status === 'pending').map((p) => (
                        <tr 
                          key={p.id} 
                          onClick={() => setSelectedPendingDetail(p)}
                          className="hover:bg-neutral-50 dark:hover:bg-neutral-850/60 cursor-pointer transition-colors duration-150 group"
                        >
                          <td className="py-4 px-5 font-bold text-neutral-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{p.fullName || '—'}</td>
                          <td className="py-4 px-5 font-normal text-neutral-800 dark:text-neutral-200">{p.email}</td>
                          <td className="py-4 px-5 font-normal text-neutral-800 dark:text-neutral-200">{p.studentId}</td>
                          <td className="py-4 px-5 font-normal text-neutral-800 dark:text-neutral-200">{p.roomNumber}</td>
                          <td className="py-4 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleApproveSignup(p.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm cursor-pointer transition-all shrink-0"
                            >
                              Approve & Generate
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Cleaning Schedule & Attendance */}
          {activeTab === 'cleaning' && (() => {
            const canManageCleaning = isSA || isSystemAdmin || isDeveloper
            const activeOccupants = db.users.filter(u => u.status === 'active' && u.role === 'user' && !!u.roomNumber)
            
            // Filter by Level (Ground, First, Second, Third, or All)
            const levelFilteredOccupants = activeOccupants.filter(u => {
              if (cleaningLevelFilter === 'all') return true
              return getRoomLevel(u.roomNumber) === cleaningLevelFilter
            })

            // Room options within the selected level
            const levelRooms = Array.from(new Set(levelFilteredOccupants.map(u => u.roomNumber).filter(Boolean) as string[])).sort()

            // Filter by Room & Search Query
            const filteredOccupants = levelFilteredOccupants.filter(u => {
              const matchRoom = cleaningRoomFilter === 'all' || u.roomNumber === cleaningRoomFilter
              const matchSearch = !cleaningSearchQuery.trim() || 
                u.fullName.toLowerCase().includes(cleaningSearchQuery.toLowerCase()) || 
                (u.studentId && u.studentId.toLowerCase().includes(cleaningSearchQuery.toLowerCase())) ||
                (u.roomNumber && u.roomNumber.toLowerCase().includes(cleaningSearchQuery.toLowerCase())) ||
                (u.degreeProgram && u.degreeProgram.toLowerCase().includes(cleaningSearchQuery.toLowerCase()))
              return matchRoom && matchSearch
            })

            const fineRate = cleaningTab === 'daily' ? 10 : 50

            // Helper to generate sheet dates for the selected month and cycle window
            const getSheetDates = (yearMonth: string) => {
              const [yStr, mStr] = yearMonth.split('-')
              const year = parseInt(yStr, 10)
              const month = parseInt(mStr, 10) - 1
              const daysInMonth = new Date(year, month + 1, 0).getDate()
              
              const dowMap = ['SU', 'M', 'T', 'W', 'TH', 'F', 'SA']
              const days: { date: string; dayNum: number; dayOfWeek: string }[] = []
              
              for (let d = 1; d <= daysInMonth; d++) {
                const dt = new Date(year, month, d)
                const dow = dt.getDay()
                if (dow >= 1 && dow <= 5) {
                  // Omit PH holidays if August 2026 (Aug 17: Ninoy Aquino Day, Aug 31: National Heroes Day)
                  if (yearMonth === '2026-08' && (d === 17 || d === 31)) {
                    continue
                  }
                  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
                  days.push({
                    date: dateStr,
                    dayNum: d,
                    dayOfWeek: dowMap[dow]
                  })
                }
              }
              return days
            }

            const allMonthWeekdays = getSheetDates(cleaningMonth)

            // Cycle 1 view matches Image 1 directly (Aug 10 - Aug 21)
            const sheetDates = allMonthWeekdays.filter(d => {
              if (cleaningMonth === '2026-08') {
                return (d.dayNum >= 10 && d.dayNum <= 21)
              }
              return true
            })

            // Format Month Display Header (e.g. "MONTH OF AUGUST 2026")
            const monthHeaderTitle = (() => {
              const [yStr, mStr] = cleaningMonth.split('-')
              const dt = new Date(parseInt(yStr, 10), parseInt(mStr, 10) - 1, 1)
              return `MONTH OF ${dt.toLocaleDateString('en-US', { month: 'long' }).toUpperCase()} ${yStr}`
            })()

            // Cell Click Interaction (Cycle or Stamp Tool)
            const handleCellClick = (userId: string, date: string, currentRemark?: CleaningRemark) => {
              if (!canManageCleaning) return

              if (cleaningActiveTool !== 'cycle') {
                handleMarkCleaningAttendance(userId, date, cleaningTab, cleaningActiveTool)
                return
              }

              // Cycle: clear -> check -> excuse -> absent -> paid -> na -> clear
              const cycleOrder: (CleaningRemark | 'clear')[] = ['check', 'excuse', 'absent', 'paid', 'na', 'clear']
              const curIdx = currentRemark ? cycleOrder.indexOf(currentRemark) : -1
              const next = cycleOrder[curIdx + 1] || 'check'

              if (next === 'clear') {
                const filteredAtt = db.cleaningAttendance.filter(c => !(c.userId === userId && c.date === date && (c.cleaningType === cleaningTab || (!c.cleaningType && cleaningTab === 'daily'))))
                const filteredPayments = db.payments.filter(p => !(p.userId === userId && p.type === 'fine' && p.description.includes(date)))
                updateDbState({ ...db, cleaningAttendance: filteredAtt, payments: filteredPayments })
                triggerAlert('success', 'Cleared attendance record')
              } else {
                handleMarkCleaningAttendance(userId, date, cleaningTab, next)
              }
            }

            // Audit log list
            const auditLogs = db.cleaningAttendance
              .filter(c => !c.kitchenOnly && (canManageCleaning || c.userId === currentUser.id))
              .filter(c => {
                if (cleaningLogFilter === 'daily') return c.cleaningType === 'daily' || !c.cleaningType
                if (cleaningLogFilter === 'general') return c.cleaningType === 'general'
                return true
              })
              .sort((a, b) => (a.date < b.date ? 1 : -1))

            return (
              <div className="space-y-6 animate-fade-in">
                {/* Header & Cleaning Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-850">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                      Cleaning Attendance
                    </h2>
                  </div>

                  {/* Cleaning Tabs */}
                  <div className="flex items-center p-1 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-xl shrink-0">
                    <button
                      onClick={() => setCleaningTab('daily')}
                      className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        cleaningTab === 'daily'
                          ? 'bg-[#255f3d] text-white shadow-sm'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Daily Cleaning</span>
                    </button>
                    <button
                      onClick={() => setCleaningTab('general')}
                      className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        cleaningTab === 'general'
                          ? 'bg-[#255f3d] text-white shadow-sm'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      <Home className="w-3.5 h-3.5" />
                      <span>General Cleaning</span>
                    </button>
                  </div>
                </div>

                {/* View Mode & Filter Controls */}
                <div className="p-4 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-2xl space-y-4 shadow-xs">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs shrink-0">
                      <button
                        onClick={() => setCleaningViewMode('sheet')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          cleaningViewMode === 'sheet'
                            ? 'bg-[#255f3d] text-white shadow-xs'
                            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        <CalendarDays className="w-3.5 h-3.5" />
                        <span>Monthly Sheet Ledger</span>
                      </button>
                      <button
                        onClick={() => setCleaningViewMode('roster')}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          cleaningViewMode === 'roster'
                            ? 'bg-[#255f3d] text-white shadow-xs'
                            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Daily Inspection Roster</span>
                      </button>
                    </div>

                    {/* Filters & Month Picker */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Level Dropdown Filter */}
                      <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg px-2.5 py-1.5">
                        <Layers className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <select
                          value={cleaningLevelFilter}
                          onChange={(e) => {
                            setCleaningLevelFilter(e.target.value as DormLevel)
                            setCleaningRoomFilter('all')
                          }}
                          className="bg-transparent text-xs font-bold text-neutral-900 dark:text-white outline-none cursor-pointer"
                        >
                          {MMH_LEVELS.map((lvl) => {
                            const count = activeOccupants.filter(u => lvl.id === 'all' || getRoomLevel(u.roomNumber) === lvl.id).length
                            return (
                              <option key={lvl.id} value={lvl.id}>
                                {lvl.name} ({count})
                              </option>
                            )
                          })}
                        </select>
                      </div>

                      {/* Room Filter within Level */}
                      <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg px-2.5 py-1.5">
                        <Filter className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <select
                          value={cleaningRoomFilter}
                          onChange={(e) => setCleaningRoomFilter(e.target.value)}
                          className="bg-transparent text-xs font-bold text-neutral-900 dark:text-white outline-none cursor-pointer"
                        >
                          <option value="all">
                            {cleaningLevelFilter === 'all' ? 'All Rooms' : `All Rooms in ${MMH_LEVELS.find(l => l.id === cleaningLevelFilter)?.name || 'Level'}`} ({levelRooms.length})
                          </option>
                          {levelRooms.map((rm) => (
                            <option key={rm} value={rm}>
                              Room {rm}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Month Picker for monthly sheet view */}
                      {cleaningViewMode === 'sheet' && (
                        <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg px-2.5 py-1.5">
                          <Calendar className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                          <select
                            value={cleaningMonth}
                            onChange={(e) => setCleaningMonth(e.target.value)}
                            className="bg-transparent text-xs font-bold text-neutral-900 dark:text-white outline-none cursor-pointer"
                          >
                            <option value="2026-08">August 2026 (Official Form)</option>
                            <option value="2026-09">September 2026</option>
                            <option value="2026-10">October 2026</option>
                            <option value="2026-11">November 2026</option>
                            <option value="2026-12">December 2026</option>
                          </select>
                        </div>
                      )}

                      {/* Date Picker for single-day roster view */}
                      {cleaningViewMode === 'roster' && (
                        <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg px-2.5 py-1.5">
                          <Calendar className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                          <input
                            type="date"
                            value={cleaningDate}
                            onChange={(e) => setCleaningDate(e.target.value)}
                            className="bg-transparent text-xs font-bold text-neutral-900 dark:text-white outline-none cursor-pointer"
                          />
                        </div>
                      )}

                      {/* Search Bar */}
                      <div className="relative min-w-[180px]">
                        <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search name or ID..."
                          value={cleaningSearchQuery}
                          onChange={(e) => setCleaningSearchQuery(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs text-neutral-900 dark:text-white placeholder:text-neutral-500 outline-none focus:border-brand-leaf/50"
                        />
                        {cleaningSearchQuery && (
                          <button
                            onClick={() => setCleaningSearchQuery('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stamp Tool Selector (for fast ledger entry) */}
                  {cleaningViewMode === 'sheet' && canManageCleaning && (
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-xs">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold text-neutral-500 mr-1">Action Tool:</span>
                        <button
                          onClick={() => setCleaningActiveTool('cycle')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            cleaningActiveTool === 'cycle'
                              ? 'bg-[#255f3d] text-white shadow-xs'
                              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                          }`}
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Cycle (/ &rarr; E &rarr; A &rarr; P &rarr; NA)</span>
                        </button>
                        <button
                          onClick={() => setCleaningActiveTool('check')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            cleaningActiveTool === 'check'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                          }`}
                        >
                          <span className="font-black text-sm">/</span>
                          <span>Mark Present (/)</span>
                        </button>
                        <button
                          onClick={() => setCleaningActiveTool('excuse')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            cleaningActiveTool === 'excuse'
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20 hover:bg-sky-500/20'
                          }`}
                        >
                          <span className="font-bold text-xs">E</span>
                          <span>Mark Excuse (E)</span>
                        </button>
                        <button
                          onClick={() => setCleaningActiveTool('absent')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            cleaningActiveTool === 'absent'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                          }`}
                        >
                          <span className="font-black text-xs">A</span>
                          <span>Mark Absent (A · ₱{fineRate})</span>
                        </button>
                        <button
                          onClick={() => setCleaningActiveTool('paid')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            cleaningActiveTool === 'paid'
                              ? 'bg-teal-600 text-white shadow-xs'
                              : 'bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20 hover:bg-teal-500/20'
                          }`}
                        >
                          <span className="font-bold text-xs">P</span>
                          <span>Mark Paid (P)</span>
                        </button>
                        <button
                          onClick={() => setCleaningActiveTool('na')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            cleaningActiveTool === 'na'
                              ? 'bg-neutral-600 text-white shadow-xs'
                              : 'bg-neutral-500/10 text-neutral-700 dark:text-neutral-400 border border-neutral-500/20 hover:bg-neutral-500/20'
                          }`}
                        >
                          <span className="font-mono font-bold text-[10px]">NA</span>
                          <span>Mark N/A</span>
                        </button>
                      </div>

                      <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-400" />
                        <span>Click any cell to apply tool or advance cycle</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* =========================================================================
                    VIEW 1: MONTHLY SHEET LEDGER (Mahogany Sync Theme)
                   ========================================================================= */}
                {cleaningViewMode === 'sheet' && (
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs">
                    {/* Header Bar */}
                    <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-[#0c1913] flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#255f3d]/10 text-[#255f3d] dark:text-brand-leaf border border-[#255f3d]/20 flex items-center justify-center shrink-0">
                          <CalendarDays className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                              {monthHeaderTitle}
                            </h3>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#255f3d]/15 text-[#255f3d] dark:text-brand-leaf border border-[#255f3d]/30">
                              {MMH_LEVELS.find(l => l.id === cleaningLevelFilter)?.name}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {cleaningTab === 'daily' ? 'Daily Cleaning' : 'General Cleaning'} attendance sheet · Fine: <strong className="text-neutral-800 dark:text-neutral-200 font-mono">₱{fineRate}.00</strong> per absence
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-600 dark:text-neutral-400 font-mono px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                          {filteredOccupants.length} Residents
                        </span>
                      </div>
                    </div>

                    {filteredOccupants.length === 0 ? (
                      <div className="p-8 m-4 text-center text-xs text-neutral-500 italic border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
                        No residents found matching the selected level or room filter.
                      </div>
                    ) : (
                      /* Clean Table with single-tier header — NO rowSpan, NO blur smudges */
                      <div className="overflow-x-auto dark-scrollbar">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-neutral-50/90 dark:bg-[#0c1913] border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider text-[11px]">
                              {/* Sticky Resident Name Header */}
                              <th className="py-3 px-4 text-left font-bold min-w-[220px] max-w-[260px] sticky left-0 z-20 bg-neutral-50 dark:bg-[#0c1913] border-r border-neutral-200 dark:border-neutral-800 shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)]">
                                Resident Name
                              </th>

                              {/* Program Header */}
                              <th className="py-3 px-3 text-center font-bold min-w-[95px] border-r border-neutral-200 dark:border-neutral-800">
                                Program
                              </th>

                              {/* Room Header */}
                              <th className="py-3 px-3 text-center font-bold min-w-[75px] border-r border-neutral-200 dark:border-neutral-800">
                                Room
                              </th>

                              {/* Clean Date Headers: Weekday & Day number stacked in a single cell */}
                              {sheetDates.map((d) => (
                                <th
                                  key={d.date}
                                  className="py-2.5 px-1 text-center border-r border-neutral-200/80 dark:border-neutral-800/80 min-w-[44px]"
                                >
                                  <div className="text-[10px] font-bold text-neutral-400 uppercase leading-none">
                                    {d.dayOfWeek}
                                  </div>
                                  <div className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 mt-1 leading-none">
                                    {d.dayNum}
                                  </div>
                                </th>
                              ))}

                              {/* Total Absences Header */}
                              <th className="py-3 px-4 text-center font-bold min-w-[110px] text-neutral-700 dark:text-neutral-300">
                                Total Absences
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-800 dark:text-neutral-200">
                            {filteredOccupants.map((occ) => {
                              // Tally absences in the active cycle
                              const cycleAbsences = db.cleaningAttendance.filter(c =>
                                c.userId === occ.id &&
                                (c.cleaningType === cleaningTab || (!c.cleaningType && cleaningTab === 'daily')) &&
                                (c.remark === 'absent' || c.remark === 'paid' || (!c.remark && c.status === 'absent')) &&
                                sheetDates.some(d => d.date === c.date)
                              ).length

                              return (
                                <tr key={occ.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-850/50 transition-colors group">
                                  {/* Resident Name: Sticky column */}
                                  <td className="py-3 px-4 sticky left-0 z-10 bg-white dark:bg-neutral-900 group-hover:bg-neutral-50 dark:group-hover:bg-neutral-850 border-r border-neutral-200 dark:border-neutral-800 shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)] transition-colors">
                                    <div className="font-semibold text-neutral-900 dark:text-white text-xs truncate">
                                      {occ.fullName}
                                    </div>
                                    {occ.studentId && (
                                      <div className="text-[10px] font-mono text-neutral-400 truncate mt-0.5">
                                        {occ.studentId}
                                      </div>
                                    )}
                                  </td>

                                  {/* Program */}
                                  <td className="py-3 px-3 text-center font-normal text-neutral-600 dark:text-neutral-400 text-xs border-r border-neutral-200/80 dark:border-neutral-800/80">
                                    {occ.degreeProgram || '—'}
                                  </td>

                                  {/* Room */}
                                  <td className="py-3 px-3 text-center font-mono font-medium text-neutral-800 dark:text-neutral-200 text-xs border-r border-neutral-200/80 dark:border-neutral-800/80">
                                    {occ.roomNumber || '—'}
                                  </td>

                                  {/* Day Cells */}
                                  {sheetDates.map((d) => {
                                    const att = db.cleaningAttendance.find(c => 
                                      c.userId === occ.id && 
                                      c.date === d.date && 
                                      (c.cleaningType === cleaningTab || (!c.cleaningType && cleaningTab === 'daily')) &&
                                      !c.kitchenOnly
                                    )

                                    const remark = att?.remark || (
                                      att?.status === 'present' ? 'check' : 
                                      att?.status === 'excused' ? 'excuse' : 
                                      att?.status === 'absent' ? 'absent' : undefined
                                    )

                                    return (
                                      <td
                                        key={d.date}
                                        onClick={() => handleCellClick(occ.id, d.date, remark)}
                                        title={`${occ.fullName} · Room ${occ.roomNumber} · ${d.date} (${d.dayOfWeek}): ${remark ? remark.toUpperCase() : 'Click to mark'}`}
                                        className={`py-2 px-1 text-center border-r border-neutral-200/60 dark:border-neutral-800/60 transition-colors h-10 ${
                                          canManageCleaning ? 'cursor-pointer hover:bg-emerald-500/10' : 'cursor-default'
                                        }`}
                                      >
                                        {remark === 'check' && (
                                          <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm leading-none">
                                            /
                                          </span>
                                        )}
                                        {remark === 'excuse' && (
                                          <span className="font-bold text-sky-600 dark:text-sky-400 text-xs leading-none">
                                            E
                                          </span>
                                        )}
                                        {remark === 'absent' && (
                                          <span className="font-black text-rose-600 dark:text-rose-400 text-xs leading-none">
                                            A
                                          </span>
                                        )}
                                        {remark === 'paid' && (
                                          <span className="font-bold text-teal-600 dark:text-teal-400 text-xs leading-none">
                                            P
                                          </span>
                                        )}
                                        {remark === 'na' && (
                                          <span className="font-mono text-neutral-400 text-[10px] leading-none">
                                            NA
                                          </span>
                                        )}
                                        {!remark && (
                                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-neutral-250 dark:bg-neutral-700 group-hover:bg-neutral-400 transition-colors" />
                                        )}
                                      </td>
                                    )
                                  })}

                                  {/* Total Absences */}
                                  <td className="py-3 px-4 text-center">
                                    {cycleAbsences > 0 ? (
                                      <div className="inline-flex flex-col items-center">
                                        <span className="font-bold text-xs text-rose-600 dark:text-rose-400">
                                          {cycleAbsences}
                                        </span>
                                        <span className="text-[10px] font-mono text-rose-500">
                                          ₱{cycleAbsences * fineRate}
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-neutral-400 dark:text-neutral-600 text-xs">
                                        0
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Legend Footer */}
                    <div className="px-5 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500">
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="font-bold text-neutral-600 dark:text-neutral-400 text-[11px]">Legend:</span>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">/</span>
                          <span>Checked / Present</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="font-bold text-sky-600 dark:text-sky-400 text-xs">E</span>
                          <span>Excused</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="font-black text-rose-600 dark:text-rose-400 text-xs">A</span>
                          <span>Absent (Fine: ₱{fineRate})</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="font-bold text-teal-600 dark:text-teal-400 text-xs">P</span>
                          <span>Paid</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <span className="font-mono text-neutral-400 text-[10px]">NA</span>
                          <span>Not Available</span>
                        </span>
                      </div>

                      <div className="text-[11px] text-neutral-400">
                        Click cell to stamp or cycle remarks
                      </div>
                    </div>
                  </div>
                )}

                {/* =========================================================================
                    VIEW 2: DAILY INSPECTION ROSTER (Mobile / Single-Day Inspection)
                   ========================================================================= */}
                {cleaningViewMode === 'roster' && canManageCleaning && (
                  <div className="bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-2xl overflow-hidden shadow-xs">
                    <div className="px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-850 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
                          <span>Inspection Roster for {cleaningDate}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#255f3d]/15 text-[#255f3d] dark:text-brand-leaf border border-[#255f3d]/30 uppercase">
                            {cleaningTab}
                          </span>
                        </h3>
                        <p className="text-[11px] text-neutral-500">
                          Single-day check for {MMH_LEVELS.find(l => l.id === cleaningLevelFilter)?.name}. Fines (₱{fineRate}) update automatically.
                        </p>
                      </div>
                      <span className="text-xs text-neutral-500 font-mono">
                        {filteredOccupants.length} residents
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/50 text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                            <th className="py-3 px-4">Resident</th>
                            <th className="py-3 px-4">Room</th>
                            <th className="py-3 px-4">Status for {cleaningDate}</th>
                            <th className="py-3 px-4 text-center">Mark Attendance Remark</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800/60">
                          {filteredOccupants.map((occ) => {
                            const att = db.cleaningAttendance.find(c => 
                              c.userId === occ.id && 
                              c.date === cleaningDate && 
                              (c.cleaningType === cleaningTab || (!c.cleaningType && cleaningTab === 'daily')) && 
                              !c.kitchenOnly
                            )
                            const currentRemark: CleaningRemark | 'unrecorded' = att?.remark || (
                              att?.status === 'present' ? 'check' : 
                              att?.status === 'excused' ? 'excuse' : 
                              att?.status === 'absent' ? 'absent' : 'unrecorded'
                            )

                            return (
                              <tr key={occ.id} className="hover:bg-neutral-50/70 dark:hover:bg-neutral-850/30">
                                <td className="py-3 px-4">
                                  <div className="font-bold text-neutral-900 dark:text-white leading-tight">
                                    {occ.fullName}
                                  </div>
                                  <div className="text-[10px] text-neutral-500 font-mono">
                                    {occ.studentId || occ.username} · {occ.degreeProgram || 'Resident'}
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                                    Room {occ.roomNumber || '—'}
                                  </span>
                                </td>
                                <td className="py-3 px-4">
                                  {currentRemark === 'check' && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                      <Check className="w-3 h-3" /> / Check (Present)
                                    </span>
                                  )}
                                  {currentRemark === 'excuse' && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30">
                                      E Excuse
                                    </span>
                                  )}
                                  {currentRemark === 'absent' && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30">
                                      A Absent (₱{fineRate} Unpaid)
                                    </span>
                                  )}
                                  {currentRemark === 'paid' && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30">
                                      P Paid (₱{fineRate} Cleared)
                                    </span>
                                  )}
                                  {currentRemark === 'na' && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-neutral-500/15 text-neutral-600 dark:text-neutral-400 border border-neutral-500/30">
                                      NA Not Available
                                    </span>
                                  )}
                                  {currentRemark === 'unrecorded' && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium text-neutral-400 border border-dashed border-neutral-300 dark:border-neutral-800">
                                      Unrecorded
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center justify-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleMarkCleaningAttendance(occ.id, cleaningDate, cleaningTab, 'check')}
                                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                        currentRemark === 'check'
                                          ? 'bg-emerald-600 text-white shadow-xs'
                                          : 'bg-neutral-100 dark:bg-neutral-900 hover:bg-emerald-500/15 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800'
                                      }`}
                                    >
                                      /
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleMarkCleaningAttendance(occ.id, cleaningDate, cleaningTab, 'excuse')}
                                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                        currentRemark === 'excuse'
                                          ? 'bg-sky-600 text-white shadow-xs'
                                          : 'bg-neutral-100 dark:bg-neutral-900 hover:bg-sky-500/15 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800'
                                      }`}
                                    >
                                      E
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleMarkCleaningAttendance(occ.id, cleaningDate, cleaningTab, 'absent')}
                                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                        currentRemark === 'absent'
                                          ? 'bg-red-600 text-white shadow-xs'
                                          : 'bg-neutral-100 dark:bg-neutral-900 hover:bg-red-500/15 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800'
                                      }`}
                                    >
                                      A
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleMarkCleaningAttendance(occ.id, cleaningDate, cleaningTab, 'paid')}
                                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                        currentRemark === 'paid'
                                          ? 'bg-teal-600 text-white shadow-xs'
                                          : 'bg-neutral-100 dark:bg-neutral-900 hover:bg-teal-500/15 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800'
                                      }`}
                                    >
                                      P
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleMarkCleaningAttendance(occ.id, cleaningDate, cleaningTab, 'na')}
                                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                                        currentRemark === 'na'
                                          ? 'bg-neutral-700 text-white shadow-xs'
                                          : 'bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-500/15 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800'
                                      }`}
                                    >
                                      NA
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Semestral Attendance Audit Logs & Room Schedule Setup */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Schedule Day Mapping */}
                  <div className="p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-2xl space-y-3">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf flex items-center gap-2">
                      <CalendarDays className="w-4 h-4" /> General Cleaning Day Assignment Map
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Weekly room assignments for dormitory general cleaning duties.
                    </p>
                    <div className="space-y-2 text-xs">
                      {db.cleaningSchedule.filter(s => !s.kitchenOnly).map((s) => (
                        <div key={s.id} className="flex justify-between items-center p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800">
                          <span className="font-bold text-neutral-900 dark:text-white">{s.dayOfWeek}</span>
                          <span className="text-neutral-600 dark:text-neutral-400 font-mono">Rooms: {s.rooms.join(', ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SA Configure Clean Mapping */}
                  {canManageCleaning && (
                    <div className="p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-2xl space-y-3">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">
                        Configure Room Cleaning Schedule
                      </h3>
                      <p className="text-xs text-neutral-500">
                        Assign rooms to weekly general cleaning schedule days.
                      </p>
                      <form onSubmit={handleAddCleaningSchedule} className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <label className="text-neutral-600 dark:text-neutral-400 font-bold">Rooms (comma separated)</label>
                          <input
                            type="text"
                            value={selectedRoomForClean}
                            onChange={(e) => setSelectedRoomForClean(e.target.value)}
                            placeholder="e.g. 004-A, 004-B, 101, 321"
                            className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white outline-none focus:border-brand-leaf/50"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-neutral-600 dark:text-neutral-400 font-bold">Assigned Day</label>
                          <select
                            value={selectedDayForClean}
                            onChange={(e) => setSelectedDayForClean(e.target.value)}
                            className="w-full p-2.5 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white outline-none cursor-pointer"
                          >
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                          </select>
                        </div>
                        <button
                          type="submit"
                          className="w-full py-2.5 bg-[#255f3d] hover:bg-[#1e4c31] text-white font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
                        >
                          Save Schedule Assignment
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            )
          })()}

          {/* TAB 3: Kitchen Hub */}
          {activeTab === 'kitchen' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-neutral-200 dark:border-neutral-850">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Communal Kitchen Hub</h2>
                <p className="text-xs text-neutral-500">Manage kitchen user lists, kitchen duties schedule, and track kitchen absence fines.</p>
              </div>

              {/* Phase 2 Modular Notice */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 shrink-0">
                    Phase 2 · Soon
                  </span>
                  <p className="text-xs leading-relaxed">
                    <strong>Communal Kitchen Hub</strong> is marked as <em>Soon</em> to prioritize <strong>Occupant Records for Semestral Evaluation</strong> (Daily &amp; General Cleaning Attendance, Fines, and Financial Clearance).
                  </p>
                </div>
              </div>

              {/* Kitchen Manager Actions */}
              {isKitchenManager && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Registry Card */}
                  <div className="p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">Kitchen User Registry</h3>
                    
                    <div className="space-y-3.5 text-xs">
                      {/* Add occupant dropdown */}
                      <div className="space-y-1">
                        <label className="text-neutral-600 dark:text-neutral-400 font-bold">Add Occupant to Kitchen (Time-bound starts today)</label>
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              handleAddKitchenUser(e.target.value)
                              e.target.value = ''
                            }
                          }}
                          className="w-full p-2 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-white text-xs"
                        >
                          <option value="">-- Choose Resident --</option>
                          {db.users
                            .filter(u => u.status === 'active' && u.role !== 'admin' && !u.specialRoles.includes('Kitchen User'))
                            .map(occ => (
                              <option key={occ.id} value={occ.id}>{occ.fullName} (Room {occ.roomNumber || 'N/A'})</option>
                            ))}
                        </select>
                      </div>

                      {/* Active Kitchen Users list */}
                      <div className="space-y-2 border-t border-neutral-200 dark:border-neutral-850 pt-3">
                        <h4 className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400">Current Kitchen Users:</h4>
                        <div className="max-h-40 overflow-auto scrollbar-thin space-y-1.5">
                          {db.users.filter(u => u.specialRoles.includes('Kitchen User')).length === 0 ? (
                            <p className="text-[10px] text-neutral-500">No active kitchen users registered.</p>
                          ) : (
                            db.users.filter(u => u.specialRoles.includes('Kitchen User')).map(ku => (
                              <div key={ku.id} className="flex justify-between items-center p-1.5 bg-neutral-100 dark:bg-neutral-950 border border-neutral-900 rounded-lg">
                                <span>{ku.fullName} (Room {ku.roomNumber})</span>
                                <button
                                  onClick={() => handleRemoveKitchenUser(ku.id)}
                                  className="text-[10px] text-red-400 hover:underline"
                                >
                                  Remove
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kitchen Attendance Card */}
                  <div className="p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">Mark Kitchen Cleaning Checklist</h3>
                    <div className="space-y-3.5 text-xs">
                      <div className="p-3 bg-neutral-100 dark:bg-neutral-950 border border-neutral-900 rounded-lg space-y-2 max-h-56 overflow-auto scrollbar-thin">
                        <p className="text-[10px] text-neutral-500">Date: {new Date().toISOString().split('T')[0]} (Today)</p>
                        {db.users.filter(u => u.status === 'active' && u.specialRoles.includes('Kitchen User')).map((ku) => {
                          const todayAtt = db.cleaningAttendance.find(c => c.userId === ku.id && c.date === new Date().toISOString().split('T')[0] && c.kitchenOnly)
                          return (
                            <div key={ku.id} className="flex justify-between items-center border-b border-neutral-900 pb-2">
                              <span>{ku.fullName}</span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleMarkKitchenAttendance(ku.id, new Date().toISOString().split('T')[0], 'present')}
                                  className={`px-2 py-0.5 rounded text-[10px] ${
                                    todayAtt?.status === 'present' ? 'bg-emerald-950 border border-emerald-900 text-emerald-400 font-bold' : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                                  }`}
                                >
                                  Pres
                                </button>
                                <button
                                  onClick={() => handleMarkKitchenAttendance(ku.id, new Date().toISOString().split('T')[0], 'absent')}
                                  className={`px-2 py-0.5 rounded text-[10px] ${
                                    todayAtt?.status === 'absent' ? 'bg-red-950 border border-red-900 text-red-400 font-bold' : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                                  }`}
                                >
                                  Abs
                                </button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Kitchen Schedule and log table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                
                {/* Kitchen schedules */}
                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">Kitchen Duty Schedule</h3>
                  <div className="bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl p-4 space-y-3 text-xs">
                    {db.cleaningSchedule.filter(s => s.kitchenOnly).map((s) => (
                      <div key={s.id} className="flex justify-between border-b border-neutral-200 dark:border-neutral-850 pb-2 last:border-b-0 last:pb-0">
                        <span className="font-bold text-neutral-900 dark:text-white">{s.dayOfWeek}</span>
                        <span className="text-neutral-600 dark:text-neutral-400">Rooms: {s.rooms.join(', ')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Kitchen Attendance Logs */}
                <div className="space-y-3">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">
                    {isKitchenManager ? 'Kitchen Attendance Logs' : 'My Kitchen Duties'}
                  </h3>
                  <div className="bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl p-4 max-h-60 overflow-auto scrollbar-thin space-y-2 text-xs">
                    {db.cleaningAttendance
                      .filter(c => c.kitchenOnly && (isKitchenManager || c.userId === currentUser.id))
                      .map((c) => {
                        const targetUser = db.users.find(u => u.id === c.userId)
                        return (
                          <div key={c.id} className="flex justify-between items-center border-b border-neutral-900 pb-2">
                            <div>
                              {isKitchenManager && <span className="font-bold text-neutral-900 dark:text-white block">{targetUser?.fullName}</span>}
                              <span className="text-neutral-500 text-[10px]">Logged Date: {c.date}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              c.status === 'present' ? 'bg-emerald-950/40 text-emerald-400' : 'bg-red-950/40 text-red-400'
                            }`}>
                              {(c.status || c.remark || 'present').toUpperCase()}
                            </span>
                          </div>
                        )
                      })}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 4: Financial Ledger */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-neutral-200 dark:border-neutral-850">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Financial Ledger & Billing</h2>
                <p className="text-xs text-neutral-500">Track occupant payments, verify submitted transaction slips, and configure billing events.</p>
              </div>

              {/* Roles scoped forms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Treasurer Billing Creation */}
                {isTreasurer && (
                  <div className="p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">Create Event Collectable Due</h3>
                    <form onSubmit={handleAddEventDue} className="space-y-3.5 text-xs">
                      <div className="space-y-1">
                        <label className="text-neutral-600 dark:text-neutral-400 font-bold">Event Title</label>
                        <input name="title" type="text" placeholder="e.g. Dorm Welcoming Night" required className="w-full p-2 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-white text-xs" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-neutral-600 dark:text-neutral-400 font-bold">Amount (Php)</label>
                          <input name="amount" type="number" placeholder="100" required className="w-full p-2 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-white text-xs" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-neutral-600 dark:text-neutral-400 font-bold">Due Date</label>
                          <input name="dueDate" type="date" required className="w-full p-2 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-white text-xs" />
                        </div>
                      </div>
                      <button type="submit" className="w-full py-2 bg-brand-gold hover:bg-brand-gold/90/90 text-neutral-900 font-bold rounded-lg cursor-pointer">
                        Charge Roster
                      </button>
                    </form>
                  </div>
                )}

                {/* Treasurer Financial Audits upload */}
                {isTreasurer && (
                  <div className="p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">Upload Financial Audit Report</h3>
                    <form onSubmit={handleUploadFinancialReport} className="space-y-3.5 text-xs">
                      <div className="space-y-1">
                        <label className="text-neutral-600 dark:text-neutral-400 font-bold">Report Title</label>
                        <input name="title" type="text" placeholder="e.g. July 2026 Financial Audit" required className="w-full p-2 bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-white text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-neutral-600 dark:text-neutral-400 font-bold">Mock Document File Attachment</label>
                        <div className="p-3 bg-neutral-100 dark:bg-neutral-950 border border-neutral-900 border-dashed rounded-lg text-center text-neutral-500 hover:text-neutral-350 cursor-pointer">
                          📎 Click to attach report spreadsheet/PDF
                        </div>
                      </div>
                      <button type="submit" className="w-full py-2 bg-brand-gold hover:bg-brand-gold/90/90 text-neutral-900 font-bold rounded-lg cursor-pointer">
                        Publish Audit Report
                      </button>
                    </form>
                  </div>
                )}

                {/* Occupant personal billing view */}
                {!isSystemAdmin && !isSA && !isTreasurer && (
                  <div className="p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl space-y-4 md:col-span-2">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">My Outstanding Ledger</h3>
                    <div className="bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl overflow-hidden text-xs">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-neutral-50/70 dark:bg-[#0c1913] border-b border-neutral-200 dark:border-neutral-850 text-brand-dark dark:text-neutral-300 font-bold uppercase tracking-wider text-[10px]">
                            <th className="py-3 px-4">Charge Description</th>
                            <th className="py-3 px-4">Type</th>
                            <th className="py-3 px-4">Amount</th>
                            <th className="py-3 px-4">Due Date</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-850/60 text-neutral-700 dark:text-neutral-300">
                          {db.payments.filter(p => p.userId === currentUser.id).length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-4 px-4 text-center text-neutral-500">Your ledger is completely clear! No payments due.</td>
                            </tr>
                          ) : (
                            db.payments.filter(p => p.userId === currentUser.id).map(p => (
                              <tr key={p.id} className="hover:bg-brand-forest/5 dark:hover:bg-brand-forest/10 transition-colors duration-150">
                                <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">{p.description}</td>
                                <td className="py-3.5 px-4 capitalize">{p.type}</td>
                                <td className="py-3.5 px-4 text-brand-gold font-mono font-bold">₱{p.amount.toFixed(2)}</td>
                                <td className="py-3.5 px-4">{p.dueDate || '—'}</td>
                                <td className="py-3.5 px-4">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                                    p.status === 'paid' 
                                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-250/30 dark:border-emerald-900/30' 
                                      : p.status === 'pending'
                                      ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200/40 dark:border-amber-900/30'
                                      : 'bg-red-50 dark:bg-red-950/20 text-red-750 dark:text-red-400 border-red-200/40 dark:border-red-900/30'
                                  }`}>
                                    {p.status.toUpperCase()}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  {p.status === 'unpaid' && (
                                    <button
                                      onClick={() => handleSubmitReceipt(p.id)}
                                      className="px-2.5 py-1 bg-[#efbe2b] hover:bg-[#dfae1b] text-neutral-900 font-bold rounded text-[10px] cursor-pointer transition-colors duration-150 shadow-sm"
                                    >
                                      Submit Receipt
                                    </button>
                                  )}
                                  {p.status === 'pending' && <span className="text-[10px] text-neutral-500 font-bold">Awaiting Verif</span>}
                                  {p.status === 'paid' && <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">Verified ✓</span>}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Global payments ledger list (For verification by SA or Treasurer) */}
              {(isSystemAdmin || isSA || isTreasurer) && (
                <div className="space-y-3 pt-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">Verified & Pending Global Receipts</h3>
                    <span className="text-[10px] text-neutral-500">Unpaid: {db.payments.filter(p => p.status === 'unpaid').length} | Verification Queue: {db.payments.filter(p => p.status === 'pending').length}</span>
                  </div>
                  <div className="bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-neutral-50/70 dark:bg-[#0c1913] border-b border-neutral-200 dark:border-neutral-850 text-brand-dark dark:text-neutral-300 font-bold uppercase tracking-wider text-[10px]">
                          <th className="py-3 px-4">Occupant</th>
                          <th className="py-3 px-4">Billing</th>
                          <th className="py-3 px-4">Amount</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Receipt Document</th>
                          <th className="py-3 px-4 text-right">Verify</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 dark:divide-neutral-850/60 text-neutral-700 dark:text-neutral-300">
                        {db.payments.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-4 px-4 text-center text-neutral-500">No transactions recorded.</td>
                          </tr>
                        ) : (
                          db.payments.map((p) => {
                            const resident = db.users.find(u => u.id === p.userId)
                            return (
                              <tr key={p.id} className="hover:bg-brand-forest/5 dark:hover:bg-brand-forest/10 transition-colors duration-150">
                                <td className="py-3.5 px-4">
                                  <span className="font-bold text-neutral-900 dark:text-white block">{resident?.fullName || '—'}</span>
                                  <span className="text-[10px] text-neutral-500">Room {resident?.roomNumber || '—'}</span>
                                </td>
                                <td className="py-3.5 px-4">
                                  <span className="font-medium block">{p.description}</span>
                                  <span className="text-[9px] text-neutral-500 capitalize">{p.type}</span>
                                </td>
                                <td className="py-3.5 px-4 font-mono font-bold text-brand-leaf">₱{p.amount.toFixed(2)}</td>
                                <td className="py-3.5 px-4">
                                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                                    p.status === 'paid' 
                                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-250/30 dark:border-emerald-900/30' 
                                      : p.status === 'pending'
                                      ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200/40 dark:border-amber-900/30'
                                      : 'bg-red-50 dark:bg-red-950/20 text-red-750 dark:text-red-400 border-red-200/40 dark:border-red-900/30'
                                  }`}>
                                    {p.status.toUpperCase()}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4">
                                  {p.receiptUrl ? (
                                    <span className="text-brand-leaf hover:text-brand-forest hover:underline cursor-pointer font-mono text-[10px] font-semibold flex items-center gap-1.5 transition-colors duration-150">
                                      <FileText className="w-3.5 h-3.5 shrink-0" /> {p.receiptUrl}
                                    </span>
                                  ) : (
                                    <span className="text-neutral-500 italic">No receipt</span>
                                  )}
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  {p.status === 'pending' ? (
                                    <button
                                      onClick={() => handleConfirmPayment(p.id)}
                                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-[10px] cursor-pointer transition-colors duration-150"
                                    >
                                      Verify Slip
                                    </button>
                                  ) : p.status === 'paid' ? (
                                    <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">Confirmed ✓</span>
                                  ) : (
                                    <span className="text-red-400/70 text-[10px]">Unpaid</span>
                                  )}
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Financial Audit reports listing (Visible to All) */}
              <div className="space-y-3 pt-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">Audited Financial Statements</h3>
                <div className="bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl p-4 text-xs space-y-2">
                  {db.financialReports.length === 0 ? (
                    <p className="text-neutral-500 italic text-center">No audit reports uploaded yet.</p>
                  ) : (
                    db.financialReports.map(fr => (
                      <div key={fr.id} className="flex justify-between items-center p-2 bg-neutral-100 dark:bg-neutral-950 border border-neutral-900 rounded-lg">
                        <div>
                          <strong className="text-neutral-900 dark:text-white block">{fr.title}</strong>
                          <span className="text-[10px] text-neutral-500">Date: {fr.date} | Uploaded by: {fr.uploadedBy}</span>
                        </div>
                        <a href={`/documents/${fr.url}`} download onClick={(e) => { e.preventDefault(); triggerAlert('success', `Simulating download of ${fr.url}`); }} className="text-brand-leaf hover:underline">
                          ⬇️ Download Spreadsheet
                        </a>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: Gadget Registry */}
          {activeTab === 'gadgets' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-neutral-200 dark:border-neutral-850">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Registered Gadget Registry</h2>
                <p className="text-xs text-neutral-500">Residents declare electrical electronics to register gadget fees, checked by Student Assistants.</p>
              </div>

              {/* Phase 2 Modular Notice */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 shrink-0">
                    Phase 2 · Soon
                  </span>
                  <p className="text-xs leading-relaxed">
                    <strong>Electrical Gadget Registry</strong> is marked as <em>Soon</em> to prioritize <strong>Occupant Records for Semestral Evaluation</strong> (Daily &amp; General Cleaning Attendance, Fines, and Financial Clearance).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Occupant Register Gadget form */}
                {!isSystemAdmin && !isSA && (
                  <div className="md:col-span-1 p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl space-y-4 h-fit">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">Register Electrical Gadget</h3>
                    <form onSubmit={handleRegisterGadget} className="space-y-3.5 text-xs">
                      <div className="space-y-1">
                        <label className="text-neutral-600 dark:text-neutral-400 font-bold">Device Type</label>
                        <input name="type" type="text" placeholder="e.g. Laptop, Rice Cooker" required className="w-full p-2 bg-neutral-955 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-neutral-600 dark:text-neutral-400 font-bold">Brand</label>
                        <input name="brand" type="text" placeholder="e.g. Asus, Standard" required className="w-full p-2 bg-neutral-955 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-neutral-600 dark:text-neutral-400 font-bold">Watts Power Consumption (Optional)</label>
                        <input name="watts" type="number" placeholder="65" className="w-full p-2 bg-neutral-955 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white" />
                      </div>
                      <button type="submit" className="w-full py-2 bg-brand-gold hover:bg-brand-gold/90/90 text-neutral-900 font-bold rounded-lg cursor-pointer">
                        Submit for Approval
                      </button>
                    </form>
                  </div>
                )}

                {/* Gadgets listings table (Visible to All: Occupants see own; SA/Adviser see all) */}
                <div className={`${!isSystemAdmin && !isSA ? 'md:col-span-2' : 'md:col-span-3'} space-y-3`}>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">Registered Devices Inventory</h3>
                  <div className="bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-neutral-50/70 dark:bg-[#0c1913] border-b border-neutral-200 dark:border-neutral-850 text-brand-dark dark:text-neutral-300 font-bold uppercase tracking-wider text-[10px]">
                          {(isSystemAdmin || isSA) && <th className="py-3 px-4">Occupant</th>}
                          <th className="py-3 px-4">Device Brand & Type</th>
                          <th className="py-3 px-4">Watts</th>
                          <th className="py-3 px-4">Registered Date</th>
                          <th className="py-3 px-4">Status</th>
                          {(isSystemAdmin || isSA) && <th className="py-3 px-4 text-right">Approve</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 dark:divide-neutral-850/60 text-neutral-700 dark:text-neutral-300">
                        {db.gadgets.filter(g => (isSystemAdmin || isSA || g.userId === currentUser.id)).length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-4 px-4 text-center text-neutral-500">No gadgets registered.</td>
                          </tr>
                        ) : (
                          db.gadgets
                            .filter(g => (isSystemAdmin || isSA || g.userId === currentUser.id))
                            .map((g) => {
                              const owner = db.users.find(u => u.id === g.userId)
                              return (
                                <tr key={g.id} className="hover:bg-brand-forest/5 dark:hover:bg-brand-forest/10 transition-colors duration-150">
                                  {(isSystemAdmin || isSA) && (
                                    <td className="py-3.5 px-4">
                                      <span className="font-bold text-neutral-900 dark:text-white block">{owner?.fullName || '—'}</span>
                                      <span className="text-[10px] text-neutral-500">Room {owner?.roomNumber || '—'}</span>
                                    </td>
                                  )}
                                  <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">{g.brand} {g.type}</td>
                                  <td className="py-3.5 px-4 font-mono">{g.watts ? `${g.watts}W` : 'N/A'}</td>
                                  <td className="py-3.5 px-4">{g.registeredDate}</td>
                                  <td className="py-3.5 px-4">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                                      g.status === 'approved' 
                                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-250/30 dark:border-emerald-900/30' 
                                        : 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200/40 dark:border-amber-900/30'
                                    }`}>
                                      {g.status.toUpperCase()}
                                    </span>
                                  </td>
                                  {(isSystemAdmin || isSA) && (
                                    <td className="py-3.5 px-4 text-right">
                                      {g.status === 'pending' ? (
                                        <button
                                          onClick={() => handleApproveGadget(g.id)}
                                          className="px-2.5 py-1 bg-[#efbe2b] hover:bg-[#dfae1b] text-neutral-900 font-bold rounded text-[10px] cursor-pointer transition-colors duration-150 shadow-sm"
                                        >
                                          Approve
                                        </button>
                                      ) : (
                                        <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">Approved ✓</span>
                                      )}
                                    </td>
                                  )}
                                </tr>
                              )
                            })
                        )}
                      </tbody>
                    </table>
                  </div>
                  <span className="text-[10px] text-neutral-500 italic block">
                    * Note: Approving a gadget registry will automatically generate a billing gadget fee due (Php 150) under the occupant's ledger.
                  </span>
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: Attendance & Minutes */}
          {activeTab === 'meetings' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-neutral-200 dark:border-neutral-850">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">General Assemblies & Attendance Logs</h2>
                <p className="text-xs text-neutral-500">Recorded by Hall Secretary. Minutes pdf attachments available for download.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Secretary actions */}
                {isSecretary && (
                  <div className="md:col-span-1 p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl space-y-4 h-fit">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">Record Assembly Minutes</h3>
                    <form onSubmit={handleUploadMinutes} className="space-y-3.5 text-xs">
                      <div className="space-y-1">
                        <label className="text-neutral-600 dark:text-neutral-400 font-bold">Assembly/Program Title</label>
                        <input name="eventName" type="text" placeholder="e.g. 1st General Assembly" required className="w-full p-2 bg-neutral-955 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-neutral-600 dark:text-neutral-400 font-bold">Conducted Date</label>
                        <input name="date" type="date" required className="w-full p-2 bg-neutral-955 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-neutral-600 dark:text-neutral-400 font-bold">Minutes Document Upload</label>
                        <div className="p-3 bg-neutral-955 border border-neutral-200 dark:border-neutral-800 border-dashed rounded-lg text-center text-neutral-500">
                          📎 Attach minutes transcript PDF
                        </div>
                      </div>
                      <button type="submit" className="w-full py-2 bg-brand-gold hover:bg-brand-gold/90/90 text-neutral-900 font-bold rounded-lg cursor-pointer">
                        Record Assembly
                      </button>
                    </form>
                  </div>
                )}

                {/* Meetings index */}
                <div className={`${isSecretary ? 'md:col-span-2' : 'md:col-span-3'} space-y-4`}>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">Dormitory General Assembly Logs</h3>
                  {db.meetings.length === 0 ? (
                    <p className="text-xs text-neutral-500 italic">No assembly logs found.</p>
                  ) : (
                    db.meetings.map((m) => {
                      const personalAtt = m.attendees.find(a => a.userId === currentUser.id)
                      return (
                        <div key={m.id} className="p-4 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl space-y-3 text-xs">
                          <div className="flex justify-between items-start">
                            <div>
                              <strong className="text-white text-sm">{m.eventName}</strong>
                              <p className="text-[10px] text-neutral-550">Date: {m.date} | Secretary: {m.uploadedBy}</p>
                            </div>
                            <div className="flex gap-2">
                              {m.minutesUrl && (
                                <button
                                  onClick={() => triggerAlert('success', `Simulated download of: ${m.minutesUrl}`)}
                                  className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-955 hover:bg-brand-forest/5 dark:hover:bg-brand-forest/15 border border-neutral-200 dark:border-neutral-800 hover:border-brand-forest/30 dark:hover:border-brand-forest/50 text-neutral-600 dark:text-neutral-400 hover:text-brand-leaf dark:hover:text-brand-leaf font-bold rounded-lg text-[10px] transition-all duration-150 flex items-center gap-1.5 cursor-pointer shadow-sm"
                                >
                                  <FileDown className="w-3.5 h-3.5 shrink-0 text-brand-leaf" /> Download Minutes PDF
                                </button>
                              )}
                              {!isSecretary && personalAtt && (
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  personalAtt.status === 'present' ? 'bg-emerald-950/40 text-emerald-400' : 'bg-red-950/40 text-red-400'
                                }`}>
                                  {personalAtt.status.toUpperCase()}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Attendance Checklist for Secretary */}
                          {isSecretary && (
                            <div className="pt-3 border-t border-neutral-950 space-y-1.5">
                              <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">Mark Resident Attendance Checklist:</h4>
                              <div className="max-h-36 overflow-auto scrollbar-thin space-y-1 bg-neutral-100 dark:bg-neutral-950 p-2 rounded-lg">
                                {db.users.filter(u => u.status === 'active' && u.role !== 'admin').map((occ) => {
                                  const att = m.attendees.find(a => a.userId === occ.id)
                                  return (
                                    <div key={occ.id} className="flex justify-between items-center border-b border-neutral-900 pb-1.5 last:border-b-0 last:pb-0">
                                      <span>{occ.fullName} (Room {occ.roomNumber})</span>
                                      <div className="flex gap-1">
                                        <button
                                          onClick={() => handleToggleMeetingAttendance(m.id, occ.id, 'present')}
                                          className={`px-2 py-0.5 rounded text-[9px] ${
                                            att?.status === 'present' ? 'bg-emerald-950 border border-emerald-900 text-emerald-400 font-bold' : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                                          }`}
                                        >
                                          Present
                                        </button>
                                        <button
                                          onClick={() => handleToggleMeetingAttendance(m.id, occ.id, 'absent')}
                                          className={`px-2 py-0.5 rounded text-[9px] ${
                                            att?.status === 'absent' ? 'bg-red-950 border border-red-900 text-red-400 font-bold' : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
                                          }`}
                                        >
                                          Absent
                                        </button>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 7: Violations Log */}
          {activeTab === 'violations' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-neutral-200 dark:border-neutral-850">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Resident Violation Logbook</h2>
                <p className="text-xs text-neutral-500">Record infractions and review curfew warnings or cleanliness notes.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* SA direct record violation */}
                {isSA && (
                  <div className="p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl space-y-4 h-fit">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">File Incident Infraction</h3>
                    <form onSubmit={handleRecordViolation} className="space-y-3.5 text-xs">
                      <div className="space-y-1">
                        <label className="text-neutral-600 dark:text-neutral-400 font-bold">Occupant Name</label>
                        <select name="userId" required className="w-full p-2 bg-neutral-955 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white">
                          <option value="">-- Choose Occupant --</option>
                          {db.users.filter(u => u.status === 'active' && u.role !== 'admin').map(occ => (
                            <option key={occ.id} value={occ.id}>{occ.fullName} (Room {occ.roomNumber})</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-neutral-600 dark:text-neutral-400 font-bold">Infraction Type</label>
                        <input name="type" type="text" placeholder="e.g. Curfew / Noise violation" required className="w-full p-2 bg-neutral-955 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-neutral-600 dark:text-neutral-400 font-bold">Severity</label>
                        <select name="severity" className="w-full p-2 bg-neutral-955 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white">
                          <option value="low">Low (Warning)</option>
                          <option value="medium">Medium</option>
                          <option value="high">High (Eviction Risk)</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-neutral-600 dark:text-neutral-400 font-bold">Details</label>
                        <textarea name="details" rows={3} placeholder="Incident context description..." className="w-full p-2 bg-neutral-955 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white" />
                      </div>
                      <button type="submit" className="w-full py-2 bg-brand-gold hover:bg-brand-gold/90/90 text-neutral-900 font-bold rounded-lg cursor-pointer">
                        File Warning
                      </button>
                    </form>
                  </div>
                )}

                {/* Violation list */}
                <div className={`${isSA ? 'md:col-span-2' : 'md:col-span-3'} space-y-4`}>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">Incident Infraction Logbook</h3>
                  <div className="bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl p-4 text-xs space-y-3">
                    {db.violations.filter(v => (isSA || v.userId === currentUser.id)).length === 0 ? (
                      <p className="text-neutral-500 italic text-center">No infractions on file. Excellent work!</p>
                    ) : (
                      db.violations
                        .filter(v => (isSA || v.userId === currentUser.id))
                        .map(v => {
                          const violator = db.users.find(u => u.id === v.userId)
                          return (
                            <div key={v.id} className="p-3 bg-neutral-100 dark:bg-neutral-950 border border-neutral-900 rounded-lg space-y-2">
                              <div className="flex justify-between items-start">
                                <div>
                                  {isSA && <span className="font-bold text-neutral-900 dark:text-white block">Occupant: {violator?.fullName}</span>}
                                  <strong className="text-red-400 block">{v.type}</strong>
                                  <span className="text-[10px] text-neutral-500">Date: {v.date} | Logged by SA: {v.recordedBy}</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                  v.severity === 'high' ? 'bg-red-950/40 text-red-400 border border-red-900/30' : v.severity === 'medium' ? 'bg-brand-forest/20 text-brand-leaf border border-brand-forest/30' : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400'
                                }`}>
                                  {v.severity.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-neutral-600 dark:text-neutral-400 text-xs leading-relaxed">{v.details}</p>
                            </div>
                          )
                        })
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 8: Officer Elections */}
          {activeTab === 'elections' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-neutral-200 dark:border-neutral-850">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Officers Elections (MMH Officers)</h2>
                <p className="text-xs text-neutral-500">Create positions, cast ballots (including Abstain for no-confidence), and automatically assign roles to winners.</p>
              </div>

              {/* Phase 2 Modular Notice */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 shrink-0">
                    Phase 2 · Soon
                  </span>
                  <p className="text-xs leading-relaxed">
                    <strong>Officers Elections Management</strong> is marked as <em>Soon</em> to prioritize <strong>Occupant Records for Semestral Evaluation</strong> (Daily &amp; General Cleaning Attendance, Fines, and Financial Clearance).
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Admin Create Election */}
                {isSystemAdmin && (
                  <div className="p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl space-y-4 h-fit">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">Configure Election</h3>
                    <form onSubmit={handleCreateElection} className="space-y-3.5 text-xs">
                      <div className="space-y-1">
                        <label className="text-neutral-600 dark:text-neutral-400 font-bold">Election Title</label>
                        <input name="title" type="text" placeholder="e.g. Officer Election Sem 1" required className="w-full p-2 bg-neutral-955 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white" />
                      </div>
                      <button type="submit" className="w-full py-2 bg-brand-gold hover:bg-brand-gold/90/90 text-neutral-900 font-bold rounded-lg cursor-pointer">
                        Open Election Ballot
                      </button>
                    </form>
                  </div>
                )}

                {/* Elections List */}
                <div className={`${isSystemAdmin ? 'md:col-span-2' : 'md:col-span-3'} space-y-6`}>
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">MMH Election Portal</h3>
                  {db.officerElections.length === 0 ? (
                    <p className="text-xs text-neutral-500 italic">No elections established.</p>
                  ) : (
                    db.officerElections.map((el) => (
                      <div key={el.id} className="p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl space-y-4 text-xs">
                        <div className="flex justify-between items-center border-b border-neutral-950 pb-3">
                          <div>
                            <strong className="text-white text-sm block">{el.title}</strong>
                            <span className="text-[10px] text-neutral-500">Status: {el.status.toUpperCase()}</span>
                          </div>
                          {isSystemAdmin && el.status === 'active' && (
                            <button
                              onClick={() => handleCloseOfficerElection(el.id)}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg cursor-pointer"
                            >
                              Tally & Close Ballot
                            </button>
                          )}
                        </div>

                        {/* Positions to vote */}
                        <div className="space-y-4">
                          {el.positions.map((pos) => {
                            const userVote = pos.votes[currentUser.id]
                            const abstainCount = Object.values(pos.votes).filter(v => v === 'abstain').length
                            const totalVotesCast = Object.keys(pos.votes).length

                            return (
                              <div key={pos.id} className="p-3.5 bg-neutral-100 dark:bg-neutral-950 border border-neutral-900 rounded-xl space-y-3">
                                <div className="flex justify-between items-center">
                                  <strong className="text-brand-leaf font-bold">{pos.name} Position</strong>
                                  <span className="text-[10px] text-neutral-550">Votes logged: {totalVotesCast}</span>
                                </div>

                                {/* Candidates selection / votes tallies */}
                                <div className="space-y-2">
                                  {pos.candidates.map(cand => {
                                    const candVotes = Object.values(pos.votes).filter(v => v === cand.userId).length
                                    return (
                                      <div key={cand.userId} className="flex justify-between items-center bg-white dark:bg-neutral-900/40 p-2 rounded-lg border border-neutral-900">
                                        <div>
                                          <span className="font-bold text-neutral-900 dark:text-white block">{cand.fullName}</span>
                                          {el.status === 'closed' && (
                                            <span className="text-[10px] text-neutral-500">Tallied Votes: {candVotes}</span>
                                          )}
                                        </div>
                                        {el.status === 'active' && (
                                          <button
                                            onClick={() => handleCastOfficerVote(el.id, pos.id, cand.userId)}
                                            className={`px-3 py-1 rounded text-[10px] ${
                                              userVote === cand.userId ? 'bg-brand-gold text-black font-bold' : 'bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 hover:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                                            }`}
                                          >
                                            {userVote === cand.userId ? 'Selected' : 'Vote'}
                                          </button>
                                        )}
                                      </div>
                                    )
                                  })}

                                  {/* ABSTAIN option */}
                                  <div className="flex justify-between items-center bg-white dark:bg-neutral-900/40 p-2 rounded-lg border border-neutral-900">
                                    <div>
                                      <span className="font-bold text-red-400 block">Abstain (No Confidence)</span>
                                      {el.status === 'closed' && (
                                        <span className="text-[10px] text-neutral-550">Abstain Votes: {abstainCount}</span>
                                      )}
                                    </div>
                                    {el.status === 'active' && (
                                      <button
                                        onClick={() => handleCastOfficerVote(el.id, pos.id, 'abstain')}
                                        className={`px-3 py-1 rounded text-[10px] ${
                                          userVote === 'abstain' ? 'bg-red-650 text-white font-bold' : 'bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 hover:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                                        }`}
                                      >
                                        {userVote === 'abstain' ? 'Abstained' : 'Abstain'}
                                      </button>
                                    )}
                                  </div>
                                </div>

                                {/* Winner disclosure if closed */}
                                {el.status === 'closed' && (
                                  <div className="mt-2 pt-2 border-t border-neutral-900 flex justify-between text-[11px]">
                                    <span className="text-neutral-500">Results:</span>
                                    <span className="font-bold text-neutral-900 dark:text-white">
                                      {(() => {
                                        // Calculate winner logic locally
                                        const tallies: { [key: string]: number } = { abstain: abstainCount }
                                        pos.candidates.forEach(c => tallies[c.userId] = Object.values(pos.votes).filter(v => v === c.userId).length)

                                        let topId = ''
                                        let topVal = -1
                                        let tie = false
                                        Object.entries(tallies).forEach(([cId, count]) => {
                                          if (cId === 'abstain') return
                                          if (count > topVal) {
                                            topVal = count
                                            topId = cId
                                            tie = false
                                          } else if (count === topVal) {
                                            tie = true
                                          }
                                        })

                                        if (topId && topVal > abstainCount && !tie) {
                                          return `✓ ${db.users.find(usr => usr.id === topId)?.fullName} wins (Special Role Assigned)`
                                        } else {
                                          return '❌ Position Unfilled (Abstain/No-confidence outvoted candidates)'
                                        }
                                      })()}
                                    </span>
                                  </div>
                                )}

                                {/* Admin Add Candidate Widget */}
                                {isSystemAdmin && el.status === 'active' && (
                                  <div className="pt-2 flex gap-2">
                                    <select
                                      onChange={(e) => {
                                        if (e.target.value) {
                                          handleAddCandidate(el.id, pos.id, e.target.value)
                                          e.target.value = ''
                                        }
                                      }}
                                      className="flex-1 p-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded text-[10px] text-neutral-700 dark:text-neutral-300"
                                    >
                                      <option value="">-- Add Candidate to Position --</option>
                                      {db.users
                                        .filter(u => u.status === 'active' && u.role !== 'admin')
                                        .map(occ => (
                                          <option key={occ.id} value={occ.id}>{occ.fullName}</option>
                                        ))}
                                    </select>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 9: Evaluator Panel */}
          {activeTab === 'evaluations' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-neutral-200 dark:border-neutral-850">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Resident Evaluation Sheets</h2>
                <p className="text-xs text-neutral-500">Occupants nominate and vote room evaluators. Seated evaluators score residents at semester end.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Admin create evaluation */}
                {isSystemAdmin && (
                  <div className="p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl space-y-4 h-fit">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">Initialize Semester Evaluations</h3>
                    <form onSubmit={handleCreateEvaluatorElection} className="space-y-3.5 text-xs">
                      <div className="space-y-1">
                        <label className="text-neutral-600 dark:text-neutral-400 font-bold">Number of Qualifying Evaluators (N)</label>
                        <input name="qualifyingCount" type="number" placeholder="15" required className="w-full p-2 bg-neutral-955 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white" />
                      </div>
                      <button type="submit" className="w-full py-2 bg-brand-gold hover:bg-brand-gold/90/90 text-neutral-900 font-bold rounded-lg cursor-pointer">
                        Open Room Nominations
                      </button>
                    </form>
                  </div>
                )}

                {/* Evaluations & nomination list */}
                <div className={`${isSystemAdmin ? 'md:col-span-2' : 'md:col-span-3'} space-y-6`}>
                  
                  {/* Evaluator Elections */}
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">Evaluator Selection Portal</h3>
                  {db.evaluatorElections.length === 0 ? (
                    <p className="text-xs text-neutral-500 italic">No evaluations active.</p>
                  ) : (
                    db.evaluatorElections.map((ev) => (
                      <div key={ev.id} className="p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl space-y-4 text-xs">
                        <div className="flex justify-between items-center border-b border-neutral-950 pb-3">
                          <div>
                            <strong className="text-white text-sm block">Semester Evaluation Setup</strong>
                            <span className="text-[10px] text-neutral-500">Active Phase: {ev.status.toUpperCase()} (N = {ev.qualifyingCount})</span>
                          </div>
                          {isSystemAdmin && ev.status === 'nomination' && (
                            <button
                              onClick={() => handleOpenEvaluatorVoting(ev.id)}
                              className="px-3 py-1.5 bg-brand-gold hover:bg-brand-gold/90/90 text-neutral-900 font-bold rounded-lg cursor-pointer"
                            >
                              Close Nominations & Open Vote
                            </button>
                          )}
                          {isSystemAdmin && ev.status === 'voting' && (
                            <button
                              onClick={() => handleCloseEvaluatorElection(ev.id)}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg cursor-pointer"
                            >
                              Tally & Seated Evaluators
                            </button>
                          )}
                        </div>

                        {/* NOMINATION PHASE */}
                        {ev.status === 'nomination' && (
                          <div className="space-y-3">
                            <h4 className="text-[11px] font-bold text-brand-leaf">Room Representative Nominations (1 per room)</h4>
                            <div className="p-3 bg-neutral-100 dark:bg-neutral-950 border border-neutral-900 rounded-xl space-y-3">
                              
                              {/* Submit Nomination Form for Occupant */}
                              {!isSystemAdmin && (
                                <div className="space-y-2">
                                  <label className="text-[10px] text-neutral-600 dark:text-neutral-400">Nominate representative for Room {mockUserRecord?.roomNumber || 'N/A'}:</label>
                                  <select
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        handleNominateEvaluator(ev.id, e.target.value)
                                        e.target.value = ''
                                      }
                                    }}
                                    className="w-full p-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white"
                                  >
                                    <option value="">-- Nominate Room Member --</option>
                                    {db.users
                                      .filter(u => u.status === 'active' && u.role !== 'admin' && u.roomNumber === mockUserRecord?.roomNumber)
                                      .map(roommate => (
                                        <option key={roommate.id} value={roommate.id}>{roommate.fullName}</option>
                                      ))}
                                  </select>
                                </div>
                              )}

                              {/* Nomination List Display */}
                              <div className="space-y-1.5 pt-2 border-t border-neutral-900">
                                <span className="text-[10px] text-neutral-500">Active Room Nominees:</span>
                                {Object.entries(ev.nominations).length === 0 ? (
                                  <p className="text-[10px] text-neutral-600 italic">No nominees submitted yet.</p>
                                ) : (
                                  Object.entries(ev.nominations).map(([room, nomineeId]) => (
                                    <div key={room} className="flex justify-between text-[11px]">
                                      <span>Room {room} Nominee:</span>
                                      <span className="text-white font-bold">{db.users.find(u => u.id === nomineeId)?.fullName}</span>
                                    </div>
                                  ))
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* VOTING PHASE */}
                        {ev.status === 'voting' && (
                          <div className="space-y-3">
                            <h4 className="text-[11px] font-bold text-brand-leaf">Vote for Semester Evaluators</h4>
                            <div className="space-y-2">
                              {Object.values(ev.nominations).map((nomineeId) => {
                                const nomineeUser = db.users.find(u => u.id === nomineeId)
                                const voted = ev.votes[currentUser.id] === nomineeId
                                return (
                                  <div key={nomineeId} className="flex justify-between items-center p-2.5 bg-neutral-100 dark:bg-neutral-950 border border-neutral-900 rounded-lg">
                                    <div>
                                      <span className="font-bold text-neutral-900 dark:text-white block">{nomineeUser?.fullName}</span>
                                      <span className="text-[10px] text-neutral-550">Room {nomineeUser?.roomNumber}</span>
                                    </div>
                                    {!isSystemAdmin && (
                                      <button
                                        onClick={() => handleVoteEvaluator(ev.id, nomineeId)}
                                        className={`px-3 py-1 rounded text-[10px] ${
                                          voted ? 'bg-brand-gold text-black font-bold' : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 text-neutral-600 dark:text-neutral-400'
                                        }`}
                                      >
                                        {voted ? 'Voted' : 'Vote'}
                                      </button>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}

                        {/* CLOSED & WINNERS DISPLAY */}
                        {ev.status === 'closed' && (
                          <div className="space-y-2">
                            <h4 className="text-[11px] font-bold text-brand-leaf">Seated Semester Evaluators:</h4>
                            <div className="p-3 bg-neutral-100 dark:bg-neutral-950 border border-neutral-900 rounded-xl space-y-1.5">
                              {ev.evaluators.map(winnerId => (
                                <div key={winnerId} className="text-xs font-bold text-neutral-900 dark:text-white">
                                  ⭐ {db.users.find(u => u.id === winnerId)?.fullName} (Room {db.users.find(u => u.id === winnerId)?.roomNumber})
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                    ))
                  )}

                  {/* EVALUATOR RATING SUBMISSION SHEET */}
                  {isEvaluator && (
                    <div className="p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl space-y-4">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">Resident Evaluations Sheet</h3>
                      <form onSubmit={handleSubmitEvaluation} className="space-y-3.5 text-xs">
                        <div className="space-y-1">
                          <label className="text-neutral-600 dark:text-neutral-400 font-bold">Select Occupant to Score</label>
                          <select name="userId" required className="w-full p-2 bg-neutral-955 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white">
                            <option value="">-- Choose Resident --</option>
                            {db.users
                              .filter(u => u.status === 'active' && u.role !== 'admin' && u.id !== currentUser.id)
                              .map(occ => (
                                <option key={occ.id} value={occ.id}>{occ.fullName} (Room {occ.roomNumber})</option>
                              ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-neutral-600 dark:text-neutral-400 font-bold">Cleanliness & Compliance Score (1 to 5)</label>
                          <select name="score" className="w-full p-2 bg-neutral-955 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white">
                            <option value="5">5.0 - Outstanding</option>
                            <option value="4.5">4.5 - Excellent</option>
                            <option value="4">4.0 - Very Good</option>
                            <option value="3">3.0 - Good</option>
                            <option value="2">2.0 - Satisfactory</option>
                            <option value="1">1.0 - Needs Improvement</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-neutral-600 dark:text-neutral-400 font-bold">Qualitative Feedback</label>
                          <textarea name="feedback" rows={3} required placeholder="Observations on room cleanliness, cooperative attitude..." className="w-full p-2 bg-neutral-955 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white" />
                        </div>
                        <button type="submit" className="w-full py-2 bg-brand-gold hover:bg-brand-gold/90/90 text-neutral-900 font-bold rounded-lg cursor-pointer">
                          Submit Evaluation
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Evaluations Results list (Residents see own anonymous scores, Admin sees all) */}
                  <div className="space-y-3 pt-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">
                      {isSystemAdmin ? 'Global Evaluation Database' : 'My Semester Evaluation Feedback'}
                    </h3>
                    <div className="bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl p-4 text-xs space-y-3">
                      {db.evaluations.filter(e => (isSystemAdmin || e.userId === currentUser.id)).length === 0 ? (
                        <p className="text-neutral-500 italic text-center">No evaluations posted for this cycle yet.</p>
                      ) : (
                        db.evaluations
                          .filter(e => (isSystemAdmin || e.userId === currentUser.id))
                          .map(e => {
                            const resident = db.users.find(u => u.id === e.userId)
                            return (
                              <div key={e.id} className="p-3 bg-neutral-100 dark:bg-neutral-950 border border-neutral-900 rounded-lg space-y-1.5">
                                <div className="flex justify-between items-center text-xs">
                                  <strong className="text-neutral-900 dark:text-white">
                                    {isSystemAdmin ? `Occupant: ${resident?.fullName}` : 'Anonymous Evaluator Score'}
                                  </strong>
                                  <span className="font-mono text-brand-leaf font-bold">★ {e.score} / 5.0</span>
                                </div>
                                <p className="text-neutral-600 dark:text-neutral-400 italic text-[11px] leading-relaxed">
                                  "{e.feedback}"
                                </p>
                                <span className="text-[9px] text-neutral-550 block">Evaluation cycle: {e.date}</span>
                              </div>
                            )
                          })
                      )}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* DEFAULT TAB: Profile Sheet */}
          {activeTab === 'profile' && (() => {
            // Helper stats computations
            const myCleaningDays = db?.cleaningSchedule.filter(s => s.rooms.includes(mockUserRecord?.roomNumber || '')) || []

            const myPayments = db?.payments.filter(p => p.userId === mockUserRecord?.id) || []
            const unpaidBalance = myPayments.reduce((acc, p) => p.status === 'unpaid' ? acc + p.amount : acc, 0)

            const myGadgetsCount = db?.gadgets.filter(g => g.userId === mockUserRecord?.id).length || 0
            const myViolationsCount = db?.violations.filter(v => v.userId === mockUserRecord?.id).length || 0

            return (
              <div className="space-y-6 animate-fade-in">
                {/* Dashboard Banner — deep green + gold, matching the landing hero */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#01291c] via-[#04321e] to-[#0b3524] p-6 border border-[#0b3524] shadow-[3px_3px_0_rgba(0,0,0,0.18)]">
                  <div className="absolute inset-0 archival-grid opacity-10 pointer-events-none z-0" />
                  <div className="absolute inset-0 academic-vignette opacity-20 pointer-events-none z-0" />
                  <div className="absolute -top-16 -right-10 w-56 h-56 rounded-full bg-brand-leaf/10 blur-3xl pointer-events-none z-0" />

                  <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <span className="text-[9px] tracking-[0.2em] font-bold text-[#efbe2b] uppercase block">
                        Dormitory Registry
                      </span>
                      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                        Welcome back, {mockUserRecord?.fullName}!
                      </h2>
                      <p className="text-xs text-white/70">
                        Mahogany Men&apos;s Hall portal is synchronized. You have {myCleaningDays.length} scheduled weekly cleaning duties.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 shrink-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#efbe2b] animate-pulse" />
                      <div className="text-right">
                        <span className="text-[8px] text-white/60 block uppercase font-bold tracking-wider">Room Assignment</span>
                        <span className="text-xs font-bold text-[#efbe2b]">Room {mockUserRecord?.roomNumber || '—'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Cleaning duties */}
                  <div className="p-4 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl flex items-center gap-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand-forest/30 dark:hover:border-brand-forest/50 hover:shadow-md hover:shadow-brand-forest/5 dark:hover:shadow-brand-forest/5 group">
                    <div className="w-10 h-10 rounded-xl bg-brand-forest/10 dark:bg-brand-forest/20 flex items-center justify-center text-brand-leaf shrink-0 group-hover:scale-110 transition-transform duration-300 ease-out">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-neutral-500 block uppercase font-semibold">Cleaning Duty</span>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white truncate block">
                        {myCleaningDays.length > 0 ? myCleaningDays.map(d => d.dayOfWeek).join(', ') : 'No Duty Assigned'}
                      </span>
                      <span className="text-[9px] text-neutral-450 dark:text-neutral-500 truncate block mt-0.5">
                        {myCleaningDays.length > 0 ? 'Assigned weekly cleaning' : 'Fully cleared'}
                      </span>
                    </div>
                  </div>

                  {/* Card 2: Financial Ledger */}
                  <div className="p-4 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl flex items-center gap-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand-forest/30 dark:hover:border-brand-forest/50 hover:shadow-md hover:shadow-brand-forest/5 dark:hover:shadow-brand-forest/5 group">
                    <div className="w-10 h-10 rounded-xl bg-[#efbe2b]/10 flex items-center justify-center text-brand-gold shrink-0 group-hover:scale-110 transition-transform duration-300 ease-out">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-neutral-500 block uppercase font-semibold">Dorm Dues</span>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white truncate block">
                        ₱{unpaidBalance.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-neutral-450 dark:text-neutral-500 truncate block mt-0.5">
                        {unpaidBalance > 0 ? 'Pending payments due' : 'Account fully paid'}
                      </span>
                    </div>
                  </div>

                  {/* Card 3: Gadgets count */}
                  <div className="p-4 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl flex items-center gap-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand-forest/30 dark:hover:border-brand-forest/50 hover:shadow-md hover:shadow-brand-forest/5 dark:hover:shadow-brand-forest/5 group">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-550 shrink-0 group-hover:scale-110 transition-transform duration-300 ease-out">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-neutral-500 block uppercase font-semibold">Gadget Registry</span>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white truncate block">
                        {myGadgetsCount} Registered
                      </span>
                      <span className="text-[9px] text-neutral-450 dark:text-neutral-500 truncate block mt-0.5">
                        {myGadgetsCount > 0 ? 'Devices recorded' : 'No registered devices'}
                      </span>
                    </div>
                  </div>

                  {/* Card 4: Violations status */}
                  <div className="p-4 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl flex items-center gap-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-brand-forest/30 dark:hover:border-brand-forest/50 hover:shadow-md hover:shadow-brand-forest/5 dark:hover:shadow-brand-forest/5 group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 ease-out ${
                      myViolationsCount > 0 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] text-neutral-500 block uppercase font-semibold">Conduct Violations</span>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white truncate block">
                        {myViolationsCount} Violations
                      </span>
                      <span className="text-[9px] text-neutral-450 dark:text-neutral-500 truncate block mt-0.5">
                        {myViolationsCount > 0 ? 'Requires attention' : 'Clean record'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile Details Sheet */}
                <div className="pb-4 border-b border-neutral-200 dark:border-neutral-850 flex justify-between items-center gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Profile Picture — uploaded avatar or initials fallback */}
                    <div className="w-14 h-14 rounded-2xl bg-brand-forest/15 border border-brand-forest/30 flex items-center justify-center text-brand-leaf font-extrabold text-xl uppercase select-none overflow-hidden shrink-0">
                      {mockUserRecord?.avatarUrl ? (
                        <img src={mockUserRecord.avatarUrl} alt="Profile picture" className="w-full h-full object-cover" />
                      ) : (
                        mockUserRecord?.fullName?.[0] || 'U'
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-neutral-900 dark:text-white truncate">My Resident Profile</h2>
                      <p className="text-xs text-neutral-500">View registered details, credentials, and dormitory assignment.</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-forest/20 border border-brand-forest/40 text-brand-leaf uppercase tracking-wide shrink-0">
                    Active Occupant
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-neutral-700 dark:text-neutral-300">
                  {/* Details list */}
                  <div className="p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl space-y-4">
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-leaf">Occupancy Specifications</h3>
                    <div className="space-y-2.5">
                      <div className="flex justify-between border-b border-neutral-200 dark:border-neutral-850/60 pb-1.5">
                        <span className="text-neutral-500">Full Name:</span>
                        <span className="font-bold text-neutral-900 dark:text-white">{mockUserRecord?.fullName}</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-200 dark:border-neutral-850/60 pb-1.5">
                        <span className="text-neutral-500">Username:</span>
                        <span className="font-mono text-brand-leaf font-bold">{mockUserRecord?.username}</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-200 dark:border-neutral-850/60 pb-1.5">
                        <span className="text-neutral-500">Email:</span>
                        <span className="font-mono">{mockUserRecord?.email || '—'}</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-200 dark:border-neutral-850/60 pb-1.5">
                        <span className="text-neutral-500">Student ID:</span>
                        <span className="font-mono">{mockUserRecord?.studentId || '—'}</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-200 dark:border-neutral-850/60 pb-1.5">
                        <span className="text-neutral-500">Room Number:</span>
                        <span className="font-bold text-neutral-900 dark:text-white">{mockUserRecord?.roomNumber || '—'}</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-200 dark:border-neutral-850/60 pb-1.5">
                        <span className="text-neutral-500">Degree Program:</span>
                        <span>{mockUserRecord?.degreeProgram || '—'}</span>
                      </div>
                      <div className="flex justify-between pb-1.5">
                        <span className="text-neutral-500">Year Level:</span>
                        <span>{mockUserRecord?.yearLevel || '—'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Permanent home address and emergency contact details */}
                  <div className="space-y-6">
                    {/* Address */}
                    <div className="p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl space-y-3">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">Home Address</h4>
                      <p className="leading-relaxed">
                        Barangay {mockUserRecord?.barangay || '—'}, {mockUserRecord?.city || '—'}, {mockUserRecord?.province || '—'}
                      </p>
                      <span className="text-[10px] text-neutral-500">Primary contact: {mockUserRecord?.mobileNumber || 'N/A'}</span>
                    </div>

                    {/* Emergency Contact */}
                    <div className="p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl space-y-2.5">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">Guardian / Emergency Contact</h4>
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Name:</span>
                          <span className="text-neutral-900 dark:text-white">{mockUserRecord?.guardianName || '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Relationship:</span>
                          <span>{mockUserRecord?.guardianRelationship || '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-500">Mobile:</span>
                          <span>{mockUserRecord?.guardianContact || '—'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}

          {/* TAB: Developer Console (Developer role only) */}
          {activeTab === 'devconsole' && isDeveloper && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-neutral-200 dark:border-neutral-850 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-sky-500/15 border border-sky-400/30 flex items-center justify-center">
                  <Terminal className="w-4 h-4 text-sky-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Developer Console</h2>
                  <p className="text-xs text-neutral-500">Impersonate residents, inspect the prototype data store, and manage seed state.</p>
                </div>
              </div>

              {/* System snapshot */}
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3">System Snapshot</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { label: 'Users', value: db.users.length },
                    { label: 'Payments', value: db.payments.length },
                    { label: 'Gadgets', value: db.gadgets.length },
                    { label: 'Violations', value: db.violations.length },
                    { label: 'Meetings', value: db.meetings.length },
                    { label: 'Elections', value: db.officerElections.length + db.evaluatorElections.length },
                  ].map(stat => (
                    <div key={stat.label} className="p-4 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl">
                      <div className="text-2xl font-extrabold text-sky-500">{stat.value}</div>
                      <div className="text-[10px] font-bold uppercase tracking-wide text-neutral-500 mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impersonation */}
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-1 flex items-center gap-2">
                  <UserCog className="w-4 h-4 text-sky-500" /> Impersonate Resident
                </h3>
                <p className="text-xs text-neutral-500 mb-3">Load any account&apos;s session to reproduce their exact dashboard view. Use “Return to Developer” to hop back.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {db.users
                    .filter(u => u.status === 'active' && u.id !== currentUser?.id)
                    .map(u => {
                      const label = u.role === 'developer' ? 'Developer' : u.role === 'admin' ? 'Adviser (Admin)' : u.specialRoles[0] || 'Occupant'
                      return (
                        <button
                          key={u.id}
                          onClick={() => handlePersonaSwitch(u.id)}
                          className="flex items-center justify-between gap-2 p-3 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 hover:border-sky-400/50 hover:bg-sky-50 dark:hover:bg-sky-950/20 rounded-xl text-left transition-colors cursor-pointer group"
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">{u.fullName}</div>
                            <div className="text-[10px] text-neutral-500 truncate">{label} · {u.email}</div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-sky-500 shrink-0" />
                        </button>
                      )
                    })}
                </div>
              </div>

              {/* Data store tools */}
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                  <Database className="w-4 h-4 text-sky-500" /> Mock Data Store
                </h3>
                <div className="flex flex-wrap gap-2.5">
                  <button onClick={() => setShowRawDb(v => !v)} className="inline-flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-sky-400/50 text-neutral-700 dark:text-neutral-200 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                    <Database className="w-3.5 h-3.5" /> {showRawDb ? 'Hide' : 'Inspect'} Raw DB
                  </button>
                  <button onClick={handleCopyDb} className="inline-flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-sky-400/50 text-neutral-700 dark:text-neutral-200 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                    <Copy className="w-3.5 h-3.5" /> Copy JSON
                  </button>
                  <button onClick={handleExportDb} className="inline-flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-sky-400/50 text-neutral-700 dark:text-neutral-200 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                    <Download className="w-3.5 h-3.5" /> Export JSON
                  </button>
                  <button onClick={() => setShowResetConfirm(true)} className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-950/30 border border-red-250 dark:border-red-900/50 hover:border-red-400/60 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold transition-colors cursor-pointer">
                    <RefreshCw className="w-3.5 h-3.5" /> Reset to Seed
                  </button>
                </div>

                {showRawDb && (
                  <pre className="mt-3 max-h-96 overflow-auto bg-neutral-900 text-neutral-100 p-4 rounded-lg font-mono text-[10px] leading-relaxed border border-neutral-800 scrollbar-thin">
                    <code>{JSON.stringify(db, null, 2)}</code>
                  </pre>
                )}
              </div>

              {/* Reset confirmation modal */}
              {showResetConfirm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-[#0d0d0d] border border-red-900/50 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                      <AlertTriangle className="w-4 h-4" /> Reset Prototype Database
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      This wipes all locally stored changes (residents, payments, elections, etc.) and reseeds the default demo dataset. This cannot be undone.
                    </p>
                    <div className="flex justify-end gap-2 pt-1">
                      <button onClick={() => setShowResetConfirm(false)} className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 text-neutral-400 rounded-lg text-xs font-bold cursor-pointer">Cancel</button>
                      <button onClick={handleResetDb} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg text-xs cursor-pointer">Reset Database</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'articles' && (
            <div className="space-y-6 animate-fade-in">
              {/* Phase 2 Modular Notice */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-2.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 shrink-0">
                    Phase 2 · Soon
                  </span>
                  <p className="text-xs leading-relaxed">
                    <strong>Media &amp; Article Publishing Desk</strong> is marked as <em>Soon</em> to prioritize <strong>Occupant Records for Semestral Evaluation</strong> (Daily &amp; General Cleaning Attendance, Fines, and Financial Clearance).
                  </p>
                </div>
              </div>

              {/* Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-850 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-brand-leaf uppercase tracking-wider mb-1">
                    <Megaphone className="w-4 h-4" /> Media &amp; Article Publishing Desk
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                    Landing Page Articles
                  </h2>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xl">
                    Publish, edit, and manage news stories and feature articles displayed on the Mahogany Sync landing portal.
                  </p>
                </div>
                <button
                  onClick={handleOpenCreateArticle}
                  className="px-4 py-2.5 bg-brand-forest hover:bg-brand-forest/90 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> Publish New Article
                </button>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-neutral-900/40 p-5 rounded-xl border border-neutral-200 dark:border-neutral-850 shadow-sm flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-brand-forest/10 text-brand-forest dark:text-brand-leaf flex items-center justify-center font-bold">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-neutral-900 dark:text-white">{(db.articles || []).length}</div>
                    <div className="text-xs text-neutral-500 font-medium">Total Articles</div>
                  </div>
                </div>
                <div className="bg-white dark:bg-neutral-900/40 p-5 rounded-xl border border-neutral-200 dark:border-neutral-850 shadow-sm flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-emerald-600">{(db.articles || []).filter(a => a.status === 'published').length}</div>
                    <div className="text-xs text-neutral-500 font-medium">Live on Landing Page</div>
                  </div>
                </div>
                <div className="bg-white dark:bg-neutral-900/40 p-5 rounded-xl border border-neutral-200 dark:border-neutral-850 shadow-sm flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-amber-600">{(db.articles || []).filter(a => a.status === 'draft').length}</div>
                    <div className="text-xs text-neutral-500 font-medium">Drafts</div>
                  </div>
                </div>
              </div>

              {/* Article Roster */}
              <div className="space-y-4">
                {(db.articles || []).length === 0 ? (
                  <div className="p-12 text-center bg-white dark:bg-neutral-900/40 rounded-2xl border border-neutral-200 dark:border-neutral-850 text-neutral-500">
                    No articles found. Click &quot;Publish New Article&quot; to add your first post.
                  </div>
                ) : (
                  (db.articles || []).map((art) => (
                    <div
                      key={art.id}
                      className="bg-white dark:bg-neutral-900/40 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-850 shadow-sm space-y-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-850">
                        <div className="flex items-center gap-2.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-gold bg-brand-gold/10 px-2.5 py-1 rounded-md">
                            {art.tag}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${art.status === 'published' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'}`}>
                            {art.status === 'published' ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-400 font-medium">{art.meta || art.date}</div>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-neutral-900 dark:text-white leading-snug mb-2">{art.title}</h3>
                        <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                          {(art.body || []).map((p, idx) => (
                            <p key={idx}>{p}</p>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-850">
                        <button
                          onClick={() => handleTogglePublish(art.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${art.status === 'published' ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300'}`}
                        >
                          {art.status === 'published' ? 'Unpublish to Draft' : 'Publish Article'}
                        </button>
                        <button
                          onClick={() => handleOpenEditArticle(art)}
                          className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Pencil className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(art.id)}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-300 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* CREATE / EDIT ARTICLE MODAL */}
          {showArticleModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-4 animate-fade-in max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-brand-leaf" />
                    {editingArticle ? 'Edit Article' : 'Publish New Article'}
                  </h3>
                  <button onClick={() => setShowArticleModal(false)} className="text-neutral-400 hover:text-neutral-600 font-bold text-sm">✕</button>
                </div>

                <form onSubmit={handleSaveArticle} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">Article Title *</label>
                    <input
                      type="text"
                      required
                      value={articleTitle}
                      onChange={(e) => setArticleTitle(e.target.value)}
                      placeholder="e.g. Mahogany Men's Hall unveils new facilities"
                      className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">Tag / Category</label>
                      <input
                        type="text"
                        value={articleTag}
                        onChange={(e) => setArticleTag(e.target.value)}
                        placeholder="e.g. MMH News"
                        className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">Author / Subtitle</label>
                      <input
                        type="text"
                        value={articleAuthor}
                        onChange={(e) => setArticleAuthor(e.target.value)}
                        placeholder="e.g. MMH Communications"
                        className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">Date &amp; Bylines (Meta)</label>
                    <input
                      type="text"
                      value={articleMeta}
                      onChange={(e) => setArticleMeta(e.target.value)}
                      placeholder="e.g. Jul 21, 2026 · MMH Communications"
                      className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">Body Content (Paragraphs separated by new lines) *</label>
                    <textarea
                      required
                      rows={6}
                      value={articleBody}
                      onChange={(e) => setArticleBody(e.target.value)}
                      placeholder="Write article paragraphs here. Separate each paragraph with a blank line..."
                      className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-medium leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">Publish Status</label>
                    <select
                      value={articleStatus}
                      onChange={(e) => setArticleStatus(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white font-medium"
                    >
                      <option value="published">Published (Live on Landing Page)</option>
                      <option value="draft">Draft (Saved in Dashboard)</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                    <button
                      type="button"
                      onClick={() => setShowArticleModal(false)}
                      className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl font-bold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-brand-forest hover:bg-brand-forest/90 text-white rounded-xl font-bold transition-all shadow-sm cursor-pointer"
                    >
                      {editingArticle ? 'Save Changes' : 'Publish Article'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-neutral-200 dark:border-neutral-850 flex justify-between items-start gap-4">
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Settings</h2>
                  <p className="text-xs text-neutral-500">Manage your account and dormitory membership.</p>
                </div>
              </div>

              {isOccupant ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Edit Profile */}
                  <div className="p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl space-y-3">
                    <div className="flex items-center gap-2"><Pencil className="w-4 h-4 text-brand-leaf" /><h3 className="text-sm font-bold text-neutral-900 dark:text-white">Edit Profile</h3></div>
                    <p className="text-xs text-neutral-500">Update your contact details, home address, guardian, and profile picture.</p>
                    <button onClick={() => setShowEditProfile(true)} className="px-3 py-2 bg-brand-gold hover:bg-brand-gold/90 text-neutral-900 text-xs font-bold rounded-lg cursor-pointer">Edit My Profile</button>
                  </div>

                  {/* Leave Dormitory */}
                  <div className="p-5 bg-white dark:bg-neutral-900/40 border border-red-250 dark:border-red-900/40 rounded-xl space-y-3">
                    <div className="flex items-center gap-2"><DoorOpen className="w-4 h-4 text-red-500" /><h3 className="text-sm font-bold text-neutral-900 dark:text-white">Leave Dormitory</h3></div>
                    <p className="text-xs text-neutral-500">File a request to the Adviser to be checked out of the dormitory. The Adviser will review and approve your move-out.</p>
                    {mockUserRecord?.leaveRequested ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400"><Clock className="w-3.5 h-3.5" /> Request pending with Adviser</span>
                    ) : (
                      <button onClick={() => setShowLeaveConfirm(true)} className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg cursor-pointer">Request to Leave Dormitory</button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="max-w-md p-5 bg-white dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-850 rounded-xl text-xs text-neutral-500">
                  No configurable preferences at this time.
                </div>
              )}

              {/* EDIT PROFILE MODAL */}
              {showEditProfile && mockUserRecord && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 w-full max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">Edit My Profile</h3>
                    <form onSubmit={handleEditProfile} className="space-y-3 text-xs">
                      <div className="space-y-1"><label className="text-neutral-600 dark:text-neutral-400 font-bold">Profile Picture URL</label><input name="avatarUrl" type="url" defaultValue={mockUserRecord.avatarUrl || ''} placeholder="https://…/photo.jpg (leave blank for initials)" className="w-full p-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white" /></div>
                      <div className="space-y-1"><label className="text-neutral-600 dark:text-neutral-400 font-bold">Mobile Number</label><input name="mobileNumber" type="text" defaultValue={mockUserRecord.mobileNumber || ''} className="w-full p-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white" /></div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1"><label className="text-neutral-600 dark:text-neutral-400 font-bold">Barangay</label><input name="barangay" type="text" defaultValue={mockUserRecord.barangay || ''} className="w-full p-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white" /></div>
                        <div className="space-y-1"><label className="text-neutral-600 dark:text-neutral-400 font-bold">City</label><input name="city" type="text" defaultValue={mockUserRecord.city || ''} className="w-full p-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white" /></div>
                        <div className="space-y-1"><label className="text-neutral-600 dark:text-neutral-400 font-bold">Province</label><input name="province" type="text" defaultValue={mockUserRecord.province || ''} className="w-full p-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white" /></div>
                      </div>
                      <div className="space-y-1"><label className="text-neutral-600 dark:text-neutral-400 font-bold">Guardian Name</label><input name="guardianName" type="text" defaultValue={mockUserRecord.guardianName || ''} className="w-full p-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white" /></div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1"><label className="text-neutral-600 dark:text-neutral-400 font-bold">Relationship</label><input name="guardianRelationship" type="text" defaultValue={mockUserRecord.guardianRelationship || ''} className="w-full p-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white" /></div>
                        <div className="space-y-1"><label className="text-neutral-600 dark:text-neutral-400 font-bold">Guardian Contact</label><input name="guardianContact" type="text" defaultValue={mockUserRecord.guardianContact || ''} className="w-full p-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white" /></div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setShowEditProfile(false)} className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-lg cursor-pointer">Cancel</button>
                        <button type="submit" className="px-3 py-1.5 bg-brand-gold hover:bg-brand-gold/90 text-neutral-900 font-bold rounded-lg cursor-pointer">Save Changes</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* LEAVE DORMITORY CONFIRM MODAL */}
              {showLeaveConfirm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white dark:bg-[#0d0d0d] border border-red-900/50 rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-2xl">
                    <div className="flex items-center gap-2 text-red-500 font-bold text-sm"><DoorOpen className="w-4 h-4" /> Request to Leave Dormitory</div>
                    <p className="text-xs text-neutral-500 leading-relaxed">This sends a move-out request to the Dorm Adviser. Settle any outstanding balance before your checkout is approved. Continue?</p>
                    <div className="flex justify-end gap-2 pt-1">
                      <button onClick={() => setShowLeaveConfirm(false)} className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-500 rounded-lg text-xs font-bold cursor-pointer">Cancel</button>
                      <button onClick={handleLeaveRequest} className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg text-xs cursor-pointer">Send Request</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* GLOBAL PENDING APPLICANT DETAIL MODAL */}
          {selectedPendingDetail && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-fade-in">
                <div className="flex justify-between items-start pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 dark:text-rose-400 block">Pending Application Review</span>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mt-0.5">{selectedPendingDetail.fullName}</h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">{selectedPendingDetail.email} • Student ID: {selectedPendingDetail.studentId}</p>
                  </div>
                  <button
                    onClick={() => setSelectedPendingDetail(null)}
                    className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white text-base font-bold px-2 py-0.5 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-neutral-500 dark:text-neutral-400 font-normal text-xs block">Assigned Room</span>
                    <div className="text-sm font-bold text-neutral-900 dark:text-white">Room {selectedPendingDetail.roomNumber || 'Unassigned'}</div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-neutral-500 dark:text-neutral-400 font-normal text-xs block">Degree Program</span>
                    <div className="text-sm font-bold text-neutral-900 dark:text-white">{selectedPendingDetail.degreeProgram || '—'}</div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-neutral-500 dark:text-neutral-400 font-normal text-xs block">Year Level</span>
                    <div className="text-sm font-bold text-neutral-900 dark:text-white">{selectedPendingDetail.yearLevel || '—'}</div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-neutral-500 dark:text-neutral-400 font-normal text-xs block">Mobile Number</span>
                    <div className="text-sm font-bold text-neutral-900 dark:text-white">{selectedPendingDetail.mobileNumber || '—'}</div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-neutral-500 dark:text-neutral-400 font-normal text-xs block">Home Address</span>
                    <div className="text-sm font-bold text-neutral-900 dark:text-white">
                      {[selectedPendingDetail.barangay, selectedPendingDetail.city, selectedPendingDetail.province].filter(Boolean).join(', ') || '—'}
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-neutral-500 dark:text-neutral-400 font-normal text-xs block">Kitchen User Intent</span>
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      {selectedPendingDetail.kitchenIntent ? 'Yes (Kitchen Access Requested)' : 'No (General Dorm Only)'}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                  <button
                    onClick={() => setSelectedPendingDetail(null)}
                    className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl text-xs cursor-pointer hover:bg-neutral-200"
                  >
                    Close Preview
                  </button>
                  <button
                    onClick={() => {
                      const pid = selectedPendingDetail.id
                      setSelectedPendingDetail(null)
                      handleApproveSignup(pid)
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer transition-all shadow-sm"
                  >
                    Approve & Generate Credentials
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* CREATE NEW ACADEMIC TERM MODAL */}
          {showAddTermModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl animate-fade-in">
                <div className="flex justify-between items-center pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white">Register New Academic Term</h3>
                  </div>
                  <button onClick={() => setShowAddTermModal(false)} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white font-bold text-base cursor-pointer">✕</button>
                </div>
                <form onSubmit={handleCreateTerm} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 dark:text-neutral-300 block">New Academic Year (e.g. AY 2027-2028)</label>
                    <input
                      type="text"
                      placeholder="AY 2027-2028"
                      value={newAyInput}
                      onChange={(e) => setNewAyInput(e.target.value)}
                      className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-neutral-700 dark:text-neutral-300 block">New Semester (e.g. Midyear / Summer Term)</label>
                    <input
                      type="text"
                      placeholder="Midyear / Summer Term"
                      value={newSemInput}
                      onChange={(e) => setNewSemInput(e.target.value)}
                      className="w-full p-2.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white font-semibold"
                    />
                  </div>
                  <p className="text-[11px] text-neutral-500 italic">
                    Note: Registering a new term adds it directly into the Command Center context selector for active dormitory governance.
                  </p>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={() => setShowAddTermModal(false)} className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl text-xs cursor-pointer">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer">Save & Set Active Term</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* DATABASE STORAGE & TERM PURGE MODAL */}
          {showStorageModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 w-full max-w-lg space-y-5 shadow-2xl animate-fade-in">
                <div className="flex justify-between items-center pb-3 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white">Database Storage & Historical Purge</h3>
                  </div>
                  <button onClick={() => setShowStorageModal(false)} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white font-bold text-base cursor-pointer">✕</button>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-neutral-900 dark:text-white">
                      <span>Local Storage Utilization</span>
                      <span className="text-emerald-600 dark:text-emerald-400">1.84 MB / 5.00 MB (36.8%)</span>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full w-[36.8%]"></div>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-1">
                      Data includes resident rosters, cleaning duties, attendance records, gadget registries, payment ledgers, and violation logs.
                    </p>
                  </div>

                  <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-2 text-xs text-neutral-900 dark:text-neutral-100">
                    <div className="font-bold flex items-center gap-1.5 text-amber-900 dark:text-amber-300">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      Purge Prior Term Historical Records
                    </div>
                    <p className="text-[11px] text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      Select a prior Academic Year to purge historical duty check-ins and meeting logs from active database memory. Export a backup before purging!
                    </p>
                    <div className="flex gap-2 pt-1">
                      <select
                        value={termToPurge}
                        onChange={(e) => setTermToPurge(e.target.value)}
                        className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-bold px-3 py-1.5 text-neutral-900 dark:text-white"
                      >
                        {ayList.map(ay => (
                          <option key={ay} value={ay}>{ay}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handlePurgeTermRecords(termToPurge)}
                        className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        Purge Selected Term Records
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-neutral-200 dark:border-neutral-800 text-xs">
                  <button
                    onClick={() => {
                      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(db))
                      const downloadAnchor = document.createElement('a')
                      downloadAnchor.setAttribute("href", dataStr)
                      downloadAnchor.setAttribute("download", `mahogany_sync_backup_${new Date().toISOString().slice(0,10)}.json`)
                      document.body.appendChild(downloadAnchor)
                      downloadAnchor.click()
                      downloadAnchor.remove()
                      triggerAlert('success', 'Database backup downloaded successfully!')
                    }}
                    className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Export Backup (.json)
                  </button>
                  <button
                    onClick={() => setShowStorageModal(false)}
                    className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold rounded-xl text-xs cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>

    </div>
  )
}
