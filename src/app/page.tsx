// src/app/page.tsx
'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, useTransition } from 'react'
import { loginWithEmail, registerOccupant } from '@/app/auth/actions'
import { getDb } from '@/utils/mock-db'

interface LandingPageProps {
  searchParams?: Promise<{
    error?: string
    message?: string
    next?: string
  }>
}

// Latest news for the landing panel. Add more entries and the Next arrow enables.
const NEWS = [
  {
    tag: 'MMH News',
    title: "Mahogany Men's Hall unveils its new official logo",
    meta: 'Jul 21, 2026 · MMH Communications',
    href: '#',
    body: [
      'Mahogany Men’s Hall (MMH) formally unveiled its new official logo in a ceremony led by the Dormitory Adviser Board and the MMH Student Officers Council. The refreshed emblem marks the hall’s transition into the fully digital Mahogany Sync era while honoring its heritage since 1979.',
      'The new mark keeps the hall’s signature forest-green and gold palette, pairing a modern wordmark with a symbol that nods to both the mahogany tree and the sense of home the hall has offered generations of Viscan residents.',
      'Hall administration says the logo will roll out across the portal, official documents, and community materials over the coming weeks.',
    ],
  },
  {
    tag: 'MMH News',
    title: 'The story and symbolism behind the new MMH emblem',
    meta: 'Jul 18, 2026 · MMH Communications',
    href: '#',
    body: [
      'Every element of the new MMH emblem was chosen deliberately. The interlocking form represents the brotherhood and continuity of hall residents, while the upward motion signals growth, leadership, and academic perseverance.',
      'The gold accent carries forward the “est. 1979” legacy, a reminder of the decades of tradition the hall stands on, even as it modernizes its operations through the Mahogany Sync platform.',
    ],
  },
  {
    tag: 'MMH News',
    title: 'Logo design contest winners recognized at the hall',
    meta: 'Jul 10, 2026 · MMH Communications',
    href: '#',
    body: [
      'Ahead of the official unveiling, the hall recognized the winners of the internal logo design contest that invited residents to help shape the new identity.',
      'Winning concepts were reviewed by the Student Officers Council and refined with the adviser board before being finalized. Participants were commended for their creativity and pride in representing Mahogany Men’s Hall.',
    ],
  },
]

type PanelType = 'login' | 'about' | 'policy' | 'terms' | 'register' | 'article' | 'developers' | 'contact'

// The people behind Mahogany Sync — edit names/roles to your real team.
const DEVELOPERS = [
  { name: 'Anthony L. Celeres Jr.', role: 'Lead Developer & Systems Architect', initials: 'AC' },
  { name: 'Developer Name', role: 'Frontend Developer', initials: 'DN' },
  { name: 'Developer Name', role: 'Backend Developer', initials: 'DN' },
  { name: 'Developer Name', role: 'UI / UX Designer', initials: 'DN' },
]

// Registration wizard steps — required field names gate each step's Next button.
const REGISTER_STEPS = [
  { title: 'Account Credentials', required: ['email', 'password'] },
  { title: 'Personal Information', required: ['fullName', 'lastName', 'birthdate', 'mobileNumber'] },
  { title: 'Academic & Dorm', required: ['studentId', 'degreeProgram', 'roomNumber'] },
  { title: 'Address & Emergency Contact', required: ['barangay', 'city', 'province', 'guardianName', 'guardianRelationship', 'guardianContact'] },
  { title: 'Rules & Consent', required: [] as string[] },
]

// Content shown in the slide-in panel for the info pages (About / Policy / Terms).
const INFO_PANELS: Record<'about' | 'policy' | 'terms', {
  title: string
  meta: string
  sections: { h: string; p: string; list?: string[] }[]
  note: { label: string; body: string }
}> = {
  about: {
    title: 'About the Hall & Portal',
    meta: 'Established 1979 · VSU Dormitory Ecosystem',
    sections: [
      { h: '1. VSU Mahogany Men’s Hall', p: 'Mahogany Men’s Hall (MMH) has served as a central residential hall for male students at Visayas State University (VSU) since 1979. Located within the scenic university campus in Baybay City, Leyte, the dormitory provides more than just lodgings. It fosters academic perseverance, personal leadership, and lifelong brotherhood among its occupants.' },
      { h: '2. The Mahogany Sync Ecosystem', p: 'In 2026, the hall administration transitioned to a fully digitized management structure. The Mahogany Sync platform facilitates transparent dorm administration by synchronizing occupant records, kitchen rosters, financial ledgers, assembly minutes, and democratic candidate voting in real time.' },
      { h: '3. Democratic Dormitory Governance', p: 'MMH follows a structured governance protocol led by Student Officers and monitored by the Dormitory Adviser. Through democratic candidacies and elections, officers are designated to manage specific operations: the Secretary maintains minutes and attendance logs, the Treasurer coordinates collections, and the Kitchen Manager maintains culinary duty checklists.' },
    ],
    note: { label: 'Dormitory Information Desk:', body: 'Dormitory Adviser Board & MMH Student Officers Council, Visayas State University, Baybay City, Leyte, Philippines.' },
  },
  policy: {
    title: 'Portal Policy & Regulations',
    meta: 'Last Updated: July 2026 · Ref: MMH-PP-2026-V1',
    sections: [
      { h: '1. Institutional Intent & Governance', p: 'The Mahogany Sync portal is the official digital administration and registry platform for the Mahogany Men’s Hall (MMH) at Visayas State University (VSU). Its primary objective is to facilitate real-time synchronization of dormitory records, user credentials, financial ledgers, and student electoral operations.' },
      { h: '2. User Accountability & Registration', p: 'Access to the Mahogany Sync database is strictly restricted to approved residents, student assistants, evaluators, and hall advisers. All registration submissions are subject to manual verification by the designated Dormitory Adviser.', list: ['Users must submit valid VSU student identification credentials during signup.', 'Accounts are locked to a university-formatted identifier logic.', 'Users are responsible for safeguarding their access credentials.'] },
      { h: '3. Roster & Financial Ledger Transparency', p: 'To maintain hall accountability, financial rosters, kitchen fees, absent fines, and maintenance ledgers compiled by the Treasurer and Student Assistants are transparent and open to audit by any active hall resident. Ledger modifications cannot be retroactively backdated.' },
      { h: '4. Data Protection & Academic Integrity', p: 'Resident directories, registered gadgets, and roster violations are maintained in compliance with university housing privacy regulations. Personal information shall not be distributed, published, or shared outside of official Visayas State University housing channels.' },
    ],
    note: { label: 'Administrative Contact:', body: 'Office of the Dormitory Adviser, Mahogany Men’s Hall, Visayas State University, Baybay City, Leyte, Philippines.' },
  },
  terms: {
    title: 'Terms of Use & Statutes',
    meta: 'Last Updated: July 2026 · Ref: MMH-TOU-2026-V1',
    sections: [
      { h: '1. Acceptance of Terms & Regulations', p: 'By enrolling or accessing the Mahogany Sync ecosystem, you agree to comply with these terms, university policies, and the official hall code of conduct. If you do not consent to these administrative rules, you are prohibited from utilizing this platform and will be processed manually via regular paperwork.' },
      { h: '2. User Obligations & Conduct', p: 'As a resident or officer of the Mahogany Men’s Hall, you commit to maintaining honesty and accuracy in all logs submitted to the portal. Falsifying cleaning attendance, evaluator scores, gadget registrations, or treasury balances constitutes a violation of academic integrity and is subject to disciplinary action.' },
      { h: '3. Penalties & Fines Accumulation', p: 'Fines recorded within the ledger system (absent fines, kitchen clean-up fines, and device fees) are integrated with dormitory governance policies. Unpaid balances will trigger administrative holds during clearance processing at the end of the academic term.' },
      { h: '4. Account Revocation & Termination', p: 'The Dormitory Adviser reserves the right to suspend or terminate portal access for users who violate hall guidelines, commit cyber-security infractions against the database, or are officially dismissed from dormitory tenancy.' },
    ],
    note: { label: 'Hall Authority Note:', body: 'Terms and rules are subject to official revision by the Dormitory Advisers Board in coordination with the MMH Student Officers Council.' },
  },
}

export default function LandingPage({ searchParams }: LandingPageProps) {
  const [isPopping, setIsPopping] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [nextPath, setNextPath] = useState('/dashboard')
  const [showPassword, setShowPassword] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [panelType, setPanelType] = useState<PanelType>('login')
  const [newsIndex, setNewsIndex] = useState(0)
  const [articlesList, setArticlesList] = useState<any[]>(NEWS)

  useEffect(() => {
    try {
      const dbData = getDb()
      if (dbData?.articles && dbData.articles.length > 0) {
        const published = dbData.articles.filter((a: any) => a.status === 'published')
        if (published.length > 0) {
          setArticlesList(published)
        }
      }
    } catch {}
  }, [])

  const article = articlesList[newsIndex] || articlesList[0] || NEWS[0]

  const [registerStep, setRegisterStep] = useState(0)
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const registerFormRef = useRef<HTMLFormElement>(null)
  const [contactSent, setContactSent] = useState(false)
  const [contactError, setContactError] = useState<string | null>(null)

  const openPanel = (type: PanelType) => {
    if (type === 'register') {
      setRegisterStep(0)
      setRegisterError(null)
      setRegisterSuccess(false)
    }
    if (type === 'contact') {
      setContactSent(false)
      setContactError(null)
    }
    setPanelType(type)
    setPanelOpen(true)
    setMenuOpen(false)
  }
  const closePanel = () => setPanelOpen(false)

  // About / Policy / Terms / Article fill the whole panel (no card, no background).
  // Login / Register sit as a card on the tinted panel background.
  const isFullBleed =
    panelType === 'about' || panelType === 'policy' || panelType === 'terms' || panelType === 'article' || panelType === 'developers'

  const validateRegisterStep = (step: number) => {
    const form = registerFormRef.current
    if (!form) return true
    const fd = new FormData(form)
    if (step === 4) {
      if (fd.get('consentRules') !== 'on' || fd.get('consentData') !== 'on') {
        setRegisterError('Please accept both agreements to continue.')
        return false
      }
      return true
    }
    for (const name of REGISTER_STEPS[step].required) {
      if (!fd.get(name)?.toString().trim()) {
        setRegisterError('Please complete all required fields in this step.')
        return false
      }
    }
    return true
  }

  const registerNext = () => {
    if (validateRegisterStep(registerStep)) {
      setRegisterError(null)
      setRegisterStep((s) => Math.min(REGISTER_STEPS.length - 1, s + 1))
    }
  }
  const registerBack = () => {
    setRegisterError(null)
    setRegisterStep((s) => Math.max(0, s - 1))
  }
  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateRegisterStep(4)) return
    setRegisterError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      try {
        const res = await registerOccupant(formData)
        if (res?.error) setRegisterError(res.error)
        else setRegisterSuccess(true)
      } catch (err: any) {
        setRegisterError(err.message || 'Registration failed')
      }
    })
  }

  const handleContact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    if (
      !fd.get('name')?.toString().trim() ||
      !fd.get('email')?.toString().trim() ||
      !fd.get('message')?.toString().trim()
    ) {
      setContactError('Please fill in your name, email, and message.')
      return
    }
    setContactError(null)
    setContactSent(true)
  }

  useEffect(() => {
    if (searchParams) {
      Promise.resolve(searchParams)
        .then((params) => {
          if (params.error && !errorMsg) setErrorMsg(decodeURIComponent(params.error))
          if (params.message && !successMsg) setSuccessMsg(decodeURIComponent(params.message))
          if (params.next) setNextPath(params.next)
          // Open the login panel when arriving via a redirect (error/message or
          // a protected-route bounce that passes ?next=), so login is ready.
          if (params.error || params.message || params.next) {
            setPanelType('login')
            setPanelOpen(true)
          }
        })
        .catch(() => {})
    }
  }, [searchParams, errorMsg, successMsg])

  const handleLogoClick = () => {
    if (isPopping) return
    setIsPopping(true)
    setTimeout(() => setIsPopping(false), 300)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg(null)
    const formData = new FormData(e.currentTarget)
    formData.append('next', nextPath)

    startTransition(async () => {
      try {
        const res = await loginWithEmail(formData)
        if (res?.error) setErrorMsg(res.error)
      } catch (err: any) {
        setErrorMsg(err.message || 'Login failed')
      }
    })
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden flex flex-col lg:flex-row bg-neutral-50 text-neutral-900 font-sans">
      {/* Background vignette */}
      <div className="absolute inset-0 academic-vignette pointer-events-none z-0" />

      {/* Brand Intro Column */}
      <div className={`weave-bg relative ${panelOpen ? 'lg:w-[55%]' : 'lg:w-full'} flex flex-col justify-between border-t lg:border-t-0 lg:border-r border-[#01291c] bg-brand-deepest-green transition-[width] duration-500 ease-in-out h-full z-10 overflow-hidden`}>

        {/* Top Branding Row (header bar) */}
        <header className="shrink-0 w-full px-6 sm:px-8 lg:px-12 xl:px-16 py-3.5 sm:py-4 bg-[#012116] border-b border-white/10 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <img 
              onClick={handleLogoClick}
              src="/mahogany_sync-header.svg" 
              alt="mahogany-sync logo" 
              className={`h-8 w-8 object-contain cursor-pointer select-none ${isPopping ? 'animate-pop-once' : ''}`}
            />
            <div className="flex flex-col select-none">
              <span className="text-[8px] tracking-[0.25em] font-bold text-[#b8ecd2] uppercase block">
                Visayas State University
              </span>
              <span className="text-sm sm:text-base font-extrabold text-white tracking-tight mt-0.5">
                Mahogany Men&apos;s Hall <span className="text-[#efbe2b]">| est. 1979</span>
              </span>
            </div>
          </div>

          {/* Nav: inline links on the full landing; collapses into the menu icon when the login is open */}
          {panelOpen ? (
            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-150 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                </svg>
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-44 py-1.5 bg-[#0a2318] border border-white/10 rounded-lg shadow-xl z-50 animate-fade-in">
                    <button type="button" onClick={() => openPanel('about')} className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wide text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-150 cursor-pointer">About</button>
                    <button type="button" onClick={() => openPanel('policy')} className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wide text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-150 cursor-pointer">Policy</button>
                    <button type="button" onClick={() => openPanel('terms')} className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wide text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-150 cursor-pointer">Terms</button>
                    <button type="button" onClick={() => openPanel('article')} className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wide text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-150 cursor-pointer">Articles</button>
                    <div className="my-1 border-t border-white/10" />
                    <button type="button" onClick={() => openPanel('login')} className="block w-full text-left px-4 py-2 text-xs font-bold uppercase tracking-wide text-brand-leaf hover:text-white hover:bg-white/10 transition-colors duration-150 cursor-pointer">Log In</button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <nav className="flex items-center gap-5 sm:gap-7 shrink-0">
              <button type="button" onClick={() => openPanel('about')} className="text-xs font-bold uppercase tracking-wide text-white/80 hover:text-white transition-colors duration-150 cursor-pointer">About</button>
              <button type="button" onClick={() => openPanel('policy')} className="text-xs font-bold uppercase tracking-wide text-white/80 hover:text-white transition-colors duration-150 cursor-pointer">Policy</button>
              <button type="button" onClick={() => openPanel('terms')} className="text-xs font-bold uppercase tracking-wide text-white/80 hover:text-white transition-colors duration-150 cursor-pointer">Terms</button>
              <button
                type="button"
                onClick={() => openPanel('login')}
                className="px-4 py-1.5 rounded-lg border border-white/25 text-white text-xs font-bold uppercase tracking-wide hover:bg-white/10 hover:border-white/40 transition-colors duration-150 cursor-pointer"
              >
                Log In
              </button>
            </nav>
          )}
        </header>

        {/* Center Content Section */}
        <div className="flex-1 min-h-0 w-full px-6 sm:px-8 lg:px-12 xl:px-16 flex items-center z-10 overflow-hidden">
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 2xl:gap-16 items-center">
            
            {/* Left Hero Column */}
            <div className={`${panelOpen ? 'lg:col-span-12 max-w-xl mx-auto' : 'lg:col-span-7 xl:col-span-7'} flex flex-col justify-center transition-all duration-500`}>
              <div>
                <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-none mb-1 animate-fade-in-up">
                  Welcome Home.
                </h2>
                <h2 className="text-3xl sm:text-4xl xl:text-5xl font-normal tracking-tight leading-none mb-3 xl:mb-5 animate-fade-in-up-delay-1">
                  <span className="text-[#669b41]">mahogany</span> <span className="text-[#efbe2b]">sync</span>
                </h2>

                <span className="text-white text-sm sm:text-base xl:text-lg font-bold tracking-wide block mb-2 animate-fade-in-up-delay-2">
                  Smart. Simple. Seamless.
                </span>
                <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-4 xl:mb-5 max-w-md block animate-fade-in-up-delay-2">
                  The official platform for managing Mahogany Men&apos;s Hall (MMH) dormitory operations, occupants, records, and reports.
                </p>

                {/* Sign In CTA — reveals the login panel */}
                <div className="mb-5 xl:mb-6 inline-flex flex-col items-start animate-fade-in-up-delay-3">
                  <button
                    type="button"
                    onClick={() => (panelOpen ? closePanel() : openPanel('login'))}
                    className="inline-flex items-center gap-2 px-7 py-2.5 sm:py-3 rounded-lg bg-[#669b41] hover:bg-[#578537] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md transition-colors duration-150 cursor-pointer"
                  >
                    {panelOpen ? (
                      <>
                        <svg aria-hidden className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 12H4m0 0 3.5-3.5M4 12l3.5 3.5" />
                        </svg>
                        Step Out
                      </>
                    ) : (
                      <>
                        Step Inside
                        <svg aria-hidden className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h10m0 0-3.5-3.5M14 12l-3.5 3.5" />
                        </svg>
                      </>
                    )}
                  </button>
                  {!panelOpen && (
                    <p className="mt-1.5 text-left text-[11px] text-white/55 select-none pl-1">
                      Sign in to the resident portal
                    </p>
                  )}
                </div>

                {/* Feature List Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 pt-3.5 max-w-md xl:max-w-lg border-t border-white/10 animate-fade-in-delay-4">
                  {/* 1 — Occupant Directory */}
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#669b41] flex items-center justify-center text-white shrink-0 shadow-sm portal-avatar">
                      <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-white">Occupant Directory</span>
                  </div>

                  {/* 2 — Attendance Tracking */}
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#669b41] flex items-center justify-center text-white shrink-0 shadow-sm portal-avatar">
                      <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-white">Attendance Tracking</span>
                  </div>

                  {/* 3 — Financial Management */}
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#669b41] flex items-center justify-center text-white shrink-0 shadow-sm portal-avatar">
                      <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-white">Financial Management</span>
                  </div>

                  {/* 4 — Violation Monitoring */}
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#669b41] flex items-center justify-center text-white shrink-0 shadow-sm portal-avatar">
                      <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-white">Violation Monitoring</span>
                  </div>

                  {/* 5 — Records & Reports */}
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#669b41] flex items-center justify-center text-white shrink-0 shadow-sm portal-avatar">
                      <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-white">Records & Reports</span>
                  </div>

                  {/* 6 — Evaluation System */}
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#669b41] flex items-center justify-center text-white shrink-0 shadow-sm portal-avatar">
                      <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
                      </svg>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-white">Evaluation System</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right News Column */}
            <div className={`${panelOpen ? 'hidden' : 'hidden lg:flex'} lg:col-span-5 xl:col-span-5 flex-col justify-center transition-all duration-500`}>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-white font-bold text-xs sm:text-sm tracking-wide flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#efbe2b]" />
                  Latest News
                </h3>
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-[#efbe2b] hover:underline inline-flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
                  </svg>
                  Follow on Facebook
                </a>
              </div>

              {/* Featured article — expands into the right panel */}
              <button
                type="button"
                onClick={() => openPanel('article')}
                className="group block text-left w-full bg-[#0b2c1d] hover:bg-[#123c28] border border-white/10 hover:border-white/20 rounded-xl overflow-hidden transition-colors duration-150 shadow-lg cursor-pointer"
              >
                <div className="aspect-[16/9] bg-gradient-to-br from-[#0e3b26] via-[#062417] to-[#02140c] flex flex-col items-center justify-center border-b border-white/10 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,190,43,0.12)_0%,transparent_70%)]" />
                  <div className="relative z-10 flex flex-col items-center justify-center p-4 text-center">
                    <div className="w-16 h-16 xl:w-20 xl:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-2.5 sm:p-3 shadow-xl backdrop-blur-sm group-hover:scale-105 transition-transform duration-300">
                      <img
                        src="/mahogany_sync-header.png"
                        alt="Mahogany Men's Hall Official Logo"
                        className="w-full h-full object-contain select-none"
                      />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-[#efbe2b] uppercase mt-2 sm:mt-2.5">
                      Official Emblem · est. 1979
                    </span>
                  </div>
                </div>
                <div className="p-4 sm:p-5">
                  <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-[#efbe2b] bg-[#efbe2b]/10 px-2 py-0.5 rounded mb-2">{article.tag}</span>
                  <h4 className="text-white font-bold text-sm sm:text-base leading-snug group-hover:text-[#efbe2b] transition-colors duration-150 line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-white/70 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                    {article.body[0]}
                  </p>
                  <p className="text-white/50 text-[10px] sm:text-[11px] mt-2.5">{article.meta}</p>
                </div>
              </button>
            </div>

          </div>
        </div>

        {/* Bottom Section (footer bar) */}
        <footer className="shrink-0 w-full px-6 sm:px-8 lg:px-12 xl:px-16 py-3.5 sm:py-4 bg-[#012116] border-t border-white/10 flex items-center justify-between gap-4 sm:gap-6 z-20">
          <button
            type="button"
            onClick={() => openPanel('developers')}
            className="flex items-center gap-3 sm:gap-4 text-left group cursor-pointer"
            aria-label="Meet the mahogany sync developers"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center text-white shrink-0 portal-avatar transition-colors duration-150">
              <svg className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
              </svg>
            </div>
            <div className="flex flex-col text-xs sm:text-sm text-white/75 select-none leading-snug">
              <span className="font-bold text-white text-[11px] sm:text-xs xl:text-sm">Mahogany Men&apos;s Hall &copy; 2026</span>
              <span className="text-[9px] sm:text-[10px] xl:text-xs text-white/45 group-hover:text-[#efbe2b] transition-colors duration-150">mahogany sync team</span>
            </div>
          </button>
          
          <button
            type="button"
            onClick={() => openPanel('contact')}
            className="flex items-center gap-3 sm:gap-4 text-left group cursor-pointer"
            aria-label="Contact Dorm Administration"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center text-white shrink-0 portal-avatar transition-colors duration-150">
              <svg className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
            </div>
            <div className="flex flex-col text-xs sm:text-sm text-white/75 select-none leading-snug">
              <span className="font-bold text-white text-[11px] sm:text-xs xl:text-sm">Need help?</span>
              <span className="text-[9px] sm:text-[10px] xl:text-xs text-[#efbe2b] group-hover:underline font-bold">Contact Dorm Administration</span>
            </div>
          </button>
        </footer>
      </div>

{/* Action / Login Column — slides in from the right */}
      <div className={`${panelOpen ? 'flex' : 'hidden'} lg:flex ${panelOpen ? 'lg:translate-x-0' : 'lg:translate-x-full'} flex-col w-full lg:absolute lg:top-0 lg:right-0 lg:h-full lg:w-[45%] transition-transform duration-500 ease-in-out overflow-y-auto scrollbar-none relative z-20 ${isFullBleed ? 'bg-[#f7f3ea] items-stretch justify-start' : 'bg-gradient-to-b from-[#faf6ee] to-[#e7dcc8] items-center justify-start lg:justify-center py-8 lg:py-12 px-4 sm:px-10 lg:px-16'}`}>

        {/* Soft airy green backdrop — only behind the login/register/contact card */}
        {!isFullBleed && (
          <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
            {/* Zoomed-out square grid pattern with round intersection dots */}
            <div
              className="absolute inset-0 opacity-100"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3E%3Cpath d='M 30 0 H 0 V 30' fill='none' stroke='%23255f3d' stroke-width='1' stroke-opacity='0.14'/%3E%3Ccircle cx='0' cy='0' r='1.5' fill='%23255f3d' fill-opacity='0.4'/%3E%3Ccircle cx='30' cy='0' r='1.5' fill='%23255f3d' fill-opacity='0.4'/%3E%3Ccircle cx='0' cy='30' r='1.5' fill='%23255f3d' fill-opacity='0.4'/%3E%3Ccircle cx='30' cy='30' r='1.5' fill='%23255f3d' fill-opacity='0.4'/%3E%3C/svg%3E")`,
                backgroundSize: '30px 30px',
              }}
            />
            {/* bright halo behind the card */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[75%] rounded-full bg-white/55 blur-[90px]" />
            {/* gentle green depth in the corners */}
            <div className="absolute -top-1/4 -left-1/4 w-[65%] h-[65%] rounded-full bg-[#c8e0b6] opacity-45 blur-[100px]" />
            <div className="absolute -bottom-1/4 -right-1/4 w-[65%] h-[65%] rounded-full bg-[#b6d6a2] opacity-40 blur-[110px]" />
          </div>
        )}

        {/* Login Card */}
        {panelType === 'login' && (
        <div className="w-full max-w-md space-y-6 bg-white border border-neutral-100 p-6 sm:p-9 shadow-xl text-neutral-800 relative z-20 portal-card">

          {/* Close — hides the panel */}
          <button
            type="button"
            onClick={closePanel}
            aria-label="Close"
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors duration-150 cursor-pointer z-30"
          >
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Logo Header */}
          <div className="flex flex-col items-center text-center space-y-3 pb-2">
            <img src="/mahogany_sync-header.png" alt="mahogany sync logo" className="w-16 h-16 object-contain shrink-0 select-none" />
            <div className="space-y-1.5">
              <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Access Portal</h2>
              <p className="text-[11px] text-neutral-500 leading-relaxed max-w-sm">
                Sign in with your mahogany sync credentials.
              </p>
            </div>
          </div>

          {/* Error and Success Notices */}
          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex gap-3 items-start animate-fade-in shadow-sm portal-badge">
              <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
              </svg>
              <div>
                <strong className="font-bold block mb-0.5 text-red-800">Sign In Failed</strong>
                {errorMsg}
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-700 text-xs flex gap-3 items-start animate-fade-in shadow-sm portal-badge">
              <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
              </svg>
              <div>
                <strong className="font-bold block mb-0.5 text-emerald-800">Notice</strong>
                {successMsg}
              </div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-[11px] font-bold text-neutral-500">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  {/* User Icon */}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="text"
                  placeholder="username or email"
                  required
                  className="academic-input w-full bg-white border border-neutral-200 text-neutral-850 placeholder-neutral-400 portal-input focus:bg-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="text-[11px] font-bold text-neutral-500">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  {/* Padlock Outline Icon */}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="6" y="11" width="12" height="9" rx="1.5" ry="1.5" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 0 0-8 0v4" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="password"
                  required
                  className="academic-input w-full bg-white border border-neutral-200 text-neutral-850 placeholder-neutral-400 portal-input focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 cursor-pointer hover:text-neutral-600 focus:outline-none select-none z-30"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    /* Eye Slash Outline Icon */
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    /* Eye Outline Icon */
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3 bg-[#efbe2b] hover:bg-[#dfae1b] disabled:bg-neutral-200 font-bold text-xs uppercase tracking-wider text-neutral-900 transition-all duration-200 flex items-center justify-center shadow-sm cursor-pointer portal-btn"
            >
              {isPending ? 'Verifying...' : 'Sign In'}
            </button>
          </form>

          {/* Registration link */}
          <div className="flex flex-col items-center gap-2.5 pt-4 border-t border-neutral-200">
            <p className="text-[11px] text-neutral-500">
              Not on the hall roster yet?
            </p>
            <button
              type="button"
              onClick={() => openPanel('register')}
              className="portal-join-btn inline-flex items-center px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-wider text-[#4c8430] border border-[#669b41]/45 bg-[#669b41]/5 hover:bg-[#4c8430] hover:text-white hover:border-[#4c8430] transition-colors duration-150 cursor-pointer"
            >
              Register
            </button>
          </div>
        </div>
        )}

        {/* Info panel — About / Policy / Terms slide into this same panel */}
        {(panelType === 'about' || panelType === 'policy' || panelType === 'terms') && (
          <div className="w-full flex-1 min-h-0 paper-bg text-neutral-800 relative z-20 flex flex-col">
            <button
              type="button"
              onClick={closePanel}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors duration-150 cursor-pointer z-30"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex-1 overflow-y-auto scrollbar-none p-8 sm:p-12 lg:p-14 space-y-5">
              <div>
                <span className="text-[11px] font-bold tracking-[0.15em] text-[#0b3524] block mb-1">
                  mahogany <span className="text-[#efbe2b]">sync</span>
                </span>
                <h2 className="text-2xl font-bold text-neutral-900 tracking-tight leading-tight pr-8">{INFO_PANELS[panelType].title}</h2>
                <span className="text-[11px] text-neutral-400 block mt-1.5">{INFO_PANELS[panelType].meta}</span>
              </div>
              <hr className="border-neutral-200" />
              <div className="space-y-5 text-[13px] leading-relaxed text-neutral-700">
                {INFO_PANELS[panelType].sections.map((s) => (
                  <section key={s.h} className="space-y-2">
                    <h3 className="text-sm font-bold text-neutral-900">{s.h}</h3>
                    <p>{s.p}</p>
                    {s.list && (
                      <ul className="list-disc list-inside space-y-1 pl-1 text-[12px] text-neutral-600">
                        {s.list.map((li) => (<li key={li}>{li}</li>))}
                      </ul>
                    )}
                  </section>
                ))}
                <div className="p-3.5 border border-dashed border-neutral-300 bg-[#FCFAF7] rounded text-[12px]">
                  <span className="font-bold text-neutral-900 block mb-1">{INFO_PANELS[panelType].note.label}</span>
                  {INFO_PANELS[panelType].note.body}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Article panel — a clicked news article expands here */}
        {panelType === 'article' && (
          <div className="w-full flex-1 min-h-0 paper-bg text-neutral-800 relative z-20 flex flex-col">
            <button
              type="button"
              onClick={closePanel}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors duration-150 cursor-pointer z-30"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex-1 overflow-y-auto scrollbar-none p-8 sm:p-12 lg:p-14 space-y-5">
              <div className="pr-8">
                <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#2e7d32] bg-[#e8f5e9] border border-[#c8e6c9] px-2 py-0.5 rounded mb-3">{article.tag}</span>
                <h2 className="text-2xl font-bold text-neutral-900 tracking-tight leading-tight">{article.title}</h2>
                <span className="text-[11px] text-neutral-400 block mt-2">{article.meta}</span>
              </div>
              <div className="aspect-[16/9] w-full bg-gradient-to-br from-[#0e3b26] via-[#062417] to-[#02140c] rounded-lg flex flex-col items-center justify-center border border-white/10 relative overflow-hidden my-2">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,190,43,0.15)_0%,transparent_70%)]" />
                <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-3 shadow-xl backdrop-blur-sm">
                    <img
                      src="/mahogany_sync-header.png"
                      alt="Mahogany Men's Hall Official Logo"
                      className="w-full h-full object-contain select-none"
                    />
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.2em] text-[#efbe2b] uppercase mt-2.5">
                    Official Emblem · est. 1979
                  </span>
                </div>
              </div>
              <div className="space-y-3.5 text-[13px] leading-relaxed text-neutral-700">
                {article.body.map((p: string, i: number) => (<p key={i}>{p}</p>))}
              </div>
              <a
                href={article.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#4c8430] hover:text-[#2e7d32] transition-colors duration-150"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
                </svg>
                Read the full post on Facebook
              </a>
            </div>

            {/* Prev / Next — browse articles within the expanded panel */}
            <div className="shrink-0 flex items-center justify-between gap-3 px-8 sm:px-12 lg:px-14 py-4 border-t border-neutral-200">
              <button
                type="button"
                onClick={() => setNewsIndex((i) => Math.max(0, i - 1))}
                disabled={newsIndex === 0}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors duration-150"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                Prev
              </button>
              <span className="text-neutral-400 text-[10px] font-semibold tabular-nums">{newsIndex + 1} / {articlesList.length}</span>
              <button
                type="button"
                onClick={() => setNewsIndex((i) => Math.min(articlesList.length - 1, i + 1))}
                disabled={newsIndex === articlesList.length - 1}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors duration-150"
              >
                Next
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
              </button>
            </div>
          </div>
        )}

        {/* Developers panel — the mahogany sync team */}
        {panelType === 'developers' && (
          <div className="w-full flex-1 min-h-0 paper-bg text-neutral-800 relative z-20 flex flex-col">
            <button
              type="button"
              onClick={closePanel}
              aria-label="Close"
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors duration-150 cursor-pointer z-30"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex-1 overflow-y-auto scrollbar-none p-8 sm:p-12 lg:p-14 space-y-6">
              <div className="pr-8">
                <span className="text-[11px] font-bold tracking-[0.15em] text-[#0b3524] block mb-1">
                  mahogany <span className="text-[#efbe2b]">sync</span>
                </span>
                <h2 className="text-2xl font-bold text-neutral-900 tracking-tight leading-tight">Meet the Developers</h2>
                <span className="text-[11px] text-neutral-400 block mt-1.5">The team behind Mahogany Sync</span>
              </div>
              <hr className="border-neutral-200" />
              <p className="text-[13px] leading-relaxed text-neutral-700">
                Mahogany Sync was designed and built by a student developer team for Visayas State University&apos;s Mahogany Men&apos;s Hall — digitizing dorm operations from occupant records and financial ledgers to attendance and democratic elections.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DEVELOPERS.map((d, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 bg-neutral-50">
                    <div className="w-10 h-10 rounded-full bg-[#e8f5e9] text-[#4c8430] flex items-center justify-center font-bold text-xs shrink-0 portal-avatar uppercase">{d.initials}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-neutral-900 truncate">{d.name}</p>
                      <p className="text-[11px] text-neutral-500 truncate">{d.role}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3.5 border border-dashed border-neutral-300 bg-[#FCFAF7] rounded text-[12px]">
                <span className="font-bold text-neutral-900 block mb-1">mahogany sync team</span>
                Built with Next.js &amp; React for Mahogany Men&apos;s Hall, Visayas State University, Baybay City, Leyte, Philippines.
              </div>
            </div>
          </div>
        )}

        {/* Register wizard — Occupant Roster Registration, paginated */}
        {panelType === 'register' && (
          <div className="w-full max-w-2xl bg-white border border-neutral-100 shadow-xl text-neutral-800 relative z-20 portal-card flex flex-col max-h-[86vh]">
            <button
              type="button"
              onClick={closePanel}
              aria-label="Close"
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors duration-150 cursor-pointer z-30"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            {registerSuccess ? (
              <div className="p-8 sm:p-12 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#e8f5e9] flex items-center justify-center text-[#4c8430] portal-avatar shadow-inner">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Registration Submitted</h2>
                <p className="text-sm text-neutral-600 leading-relaxed max-w-sm">
                  Your account is <strong className="text-neutral-900">pending approval</strong>. The Dorm Adviser will confirm it and email your credentials.
                </p>
                <button
                  type="button"
                  onClick={() => openPanel('login')}
                  className="mt-2 px-6 py-2.5 rounded-lg bg-[#669b41] hover:bg-[#578537] text-white text-xs font-bold uppercase tracking-wider transition-colors duration-150 cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
            <form ref={registerFormRef} onSubmit={handleRegister} className="flex flex-col min-h-0 flex-1">
              <div className="overflow-y-auto scrollbar-none p-6 sm:p-8 space-y-5 flex-1">
                <div className="pr-8">
                  <span className="text-[11px] font-bold tracking-[0.15em] text-[#0b3524] block mb-1">
                    mahogany <span className="text-[#efbe2b]">sync</span>
                  </span>
                  <h2 className="text-xl font-bold text-neutral-900 tracking-tight leading-tight">Occupant Roster Registration</h2>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    Step {registerStep + 1} of {REGISTER_STEPS.length} · {REGISTER_STEPS[registerStep].title}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="flex gap-1.5">
                  {REGISTER_STEPS.map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-200 ${i <= registerStep ? 'bg-[#669b41]' : 'bg-neutral-200'}`} />
                  ))}
                </div>

                {registerError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex gap-2 items-start">
                    <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                    {registerError}
                  </div>
                )}

                {/* Step 1 — Account */}
                <div className={registerStep === 0 ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'hidden'}>
                  <div className="space-y-1.5">
                    <label className="academic-label">Email Address (Required)</label>
                    <input name="email" type="email" placeholder="e.g. occupant@vsu.edu.ph" className="academic-input" />
                    <span className="text-[10px] text-neutral-500 block">Your credentials and notices will be sent to this email.</span>
                  </div>
                  <div className="space-y-1.5">
                    <label className="academic-label">Temporary Password (Required)</label>
                    <input name="password" type="password" placeholder="Set password (e.g. password123)" className="academic-input" />
                  </div>
                </div>

                {/* Step 2 — Personal */}
                <div className={registerStep === 1 ? 'space-y-4' : 'hidden'}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5"><label className="academic-label">First Name (Required)</label><input name="fullName" type="text" placeholder="e.g. Anthony" className="academic-input" /></div>
                    <div className="space-y-1.5"><label className="academic-label">Last Name (Required)</label><input name="lastName" type="text" placeholder="e.g. Celeres" className="academic-input" /></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5"><label className="academic-label">Middle Name (Optional)</label><input name="middleName" type="text" placeholder="e.g. Lumapat" className="academic-input" /></div>
                    <div className="space-y-1.5"><label className="academic-label">Suffix (e.g. Jr./III)</label><input name="suffix" type="text" placeholder="e.g. Jr." className="academic-input" /></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5"><label className="academic-label">Birthdate (Required)</label><input name="birthdate" type="date" className="academic-input" /></div>
                    <div className="space-y-1.5"><label className="academic-label">Mobile Number (Required)</label><input name="mobileNumber" type="tel" placeholder="e.g. 0917xxxxxxx" className="academic-input" /></div>
                  </div>
                </div>

                {/* Step 3 — Academic & Dorm */}
                <div className={registerStep === 2 ? 'space-y-4' : 'hidden'}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5"><label className="academic-label">Student ID (Required)</label><input name="studentId" type="text" placeholder="e.g. 23-1-02249" className="academic-input" /></div>
                    <div className="space-y-1.5"><label className="academic-label">Degree Program (Required)</label><input name="degreeProgram" type="text" placeholder="e.g. BS in IT" className="academic-input" /></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="academic-label">Year Level</label>
                      <select name="yearLevel" className="academic-input" defaultValue="1st Year">
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>
                    <div className="space-y-1.5"><label className="academic-label">Assigned Room Number (Required)</label><input name="roomNumber" type="text" placeholder="e.g. 104" className="academic-input" /></div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="academic-label">Do you intend to use the kitchen?</label>
                    <div className="flex flex-wrap gap-4 pt-1 text-xs">
                      <label className="flex items-center gap-1.5 cursor-pointer text-neutral-700"><input type="radio" name="kitchenIntent" value="true" className="accent-brand-leaf" /> Yes, kitchen user</label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-neutral-700"><input type="radio" name="kitchenIntent" value="false" defaultChecked className="accent-brand-leaf" /> No, general only</label>
                    </div>
                  </div>
                </div>

                {/* Step 4 — Address & Emergency Contact */}
                <div className={registerStep === 3 ? 'space-y-5' : 'hidden'}>
                  <div className="space-y-3">
                    <h3 className="academic-section-header">Permanent Home Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5"><label className="academic-label">Barangay</label><input name="barangay" type="text" placeholder="e.g. Patag" className="academic-input" /></div>
                      <div className="space-y-1.5"><label className="academic-label">City / Town</label><input name="city" type="text" placeholder="e.g. Baybay" className="academic-input" /></div>
                      <div className="space-y-1.5"><label className="academic-label">Province</label><input name="province" type="text" placeholder="e.g. Leyte" className="academic-input" /></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="academic-section-header">Emergency Contact</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5"><label className="academic-label">Guardian Name</label><input name="guardianName" type="text" placeholder="Full name" className="academic-input" /></div>
                      <div className="space-y-1.5"><label className="academic-label">Relationship</label><input name="guardianRelationship" type="text" placeholder="e.g. Mother" className="academic-input" /></div>
                      <div className="space-y-1.5"><label className="academic-label">Contact Number</label><input name="guardianContact" type="tel" placeholder="Phone number" className="academic-input" /></div>
                    </div>
                  </div>
                </div>

                {/* Step 5 — Consent */}
                <div className={registerStep === 4 ? 'space-y-4' : 'hidden'}>
                  <h3 className="academic-section-header">Rules &amp; Consent (RA 10173 compliance)</h3>
                  <div className="space-y-3.5 text-xs text-neutral-600 leading-relaxed">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input type="checkbox" name="consentRules" className="mt-0.5 accent-brand-leaf w-4 h-4 shrink-0" />
                      <span>I agree to the Mahogany Men&apos;s Hall Dormitory policies, curfew regulations, cleaning schedule obligations, and payment terms as detailed in the resident handbook.</span>
                    </label>
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input type="checkbox" name="consentData" className="mt-0.5 accent-brand-leaf w-4 h-4 shrink-0" />
                      <span>I grant explicit consent to MMH management to collect, store, and process my personal data (address, birthdate, emergency contact, and academic status) in compliance with Republic Act 10173 (Data Privacy Act of 2012).</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer nav */}
              <div className="shrink-0 flex items-center justify-between gap-3 p-4 sm:px-8 border-t border-neutral-200">
                {registerStep === 0 ? (
                  <button type="button" onClick={() => openPanel('login')} className="text-[11px] font-bold text-neutral-500 hover:text-neutral-800 transition-colors duration-150 cursor-pointer">Back to Sign In</button>
                ) : (
                  <button type="button" onClick={registerBack} className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 transition-colors duration-150 cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                    Back
                  </button>
                )}
                {registerStep < REGISTER_STEPS.length - 1 ? (
                  <button type="button" onClick={registerNext} className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-lg bg-[#669b41] hover:bg-[#578537] text-white text-xs font-bold uppercase tracking-wider transition-colors duration-150 cursor-pointer">
                    Next
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                  </button>
                ) : (
                  <button type="submit" disabled={isPending} className="px-6 py-2.5 rounded-lg bg-[#efbe2b] hover:bg-[#dfae1b] disabled:opacity-60 text-neutral-900 text-xs font-bold uppercase tracking-wider transition-colors duration-150 cursor-pointer">
                    {isPending ? 'Submitting…' : 'Submit Registration'}
                  </button>
                )}
              </div>
            </form>
            )}
          </div>
        )}

        {/* Contact / Inquiry panel — card on the tinted background, like login */}
        {panelType === 'contact' && (
          <div className="w-full max-w-md bg-white border border-neutral-100 shadow-xl text-neutral-800 relative z-20 portal-card flex flex-col max-h-[86vh]">
            <button
              type="button"
              onClick={closePanel}
              aria-label="Close"
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors duration-150 cursor-pointer z-30"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>

            {contactSent ? (
              <div className="p-8 sm:p-12 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#e8f5e9] flex items-center justify-center text-[#4c8430] portal-avatar shadow-inner">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Inquiry Sent</h2>
                <p className="text-sm text-neutral-600 leading-relaxed max-w-sm">
                  Thanks for reaching out. The Dorm Administration will review your message and get back to you.
                </p>
                <button type="button" onClick={closePanel} className="mt-2 px-6 py-2.5 rounded-lg bg-[#669b41] hover:bg-[#578537] text-white text-xs font-bold uppercase tracking-wider transition-colors duration-150 cursor-pointer">
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleContact} className="flex flex-col min-h-0">
                <div className="overflow-y-auto scrollbar-none p-6 sm:p-8 space-y-5">
                  <div className="flex flex-col items-center text-center space-y-3 pb-1">
                    <div className="w-14 h-14 rounded-full bg-[#e8f5e9] flex items-center justify-center text-[#4c8430] portal-avatar shadow-inner">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                      </svg>
                    </div>
                    <div className="space-y-1.5">
                      <h2 className="text-xl font-bold text-neutral-900 tracking-tight">Contact Dorm Administration</h2>
                      <p className="text-[11px] text-neutral-500 leading-relaxed max-w-sm">Send your inquiry and the Dorm Adviser will get back to you.</p>
                    </div>
                  </div>

                  {contactError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-xs flex gap-2 items-start">
                      <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                      </svg>
                      {contactError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5"><label className="academic-label">Your Name (Required)</label><input name="name" type="text" placeholder="e.g. Juan Dela Cruz" className="academic-input" /></div>
                    <div className="space-y-1.5"><label className="academic-label">Email (Required)</label><input name="email" type="email" placeholder="e.g. you@vsu.edu.ph" className="academic-input" /></div>
                  </div>
                  <div className="space-y-1.5"><label className="academic-label">Subject</label><input name="subject" type="text" placeholder="What is your inquiry about?" className="academic-input" /></div>
                  <div className="space-y-1.5"><label className="academic-label">Message (Required)</label><textarea name="message" rows={5} placeholder="Write your inquiry here…" className="academic-input resize-none" /></div>

                  <button type="submit" className="w-full py-3 bg-[#efbe2b] hover:bg-[#dfae1b] font-bold text-xs uppercase tracking-wider text-neutral-900 transition-colors duration-150 cursor-pointer shadow-sm portal-btn">
                    Send Inquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
