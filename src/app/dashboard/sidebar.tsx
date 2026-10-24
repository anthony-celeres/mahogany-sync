// src/app/dashboard/sidebar.tsx
'use client'

import { useState } from 'react'
import { Menu, X, ChevronDown, type LucideIcon } from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  icon: LucideIcon
  accent?: 'brand' | 'sky' | 'gold' // active-state color; defaults to 'brand'
  badge?: number | string // notification count
  badgeColor?: string
  children?: NavItem[] // when present, the item renders as an expandable dropdown
}

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  currentUser: any
  roleLabel: string
  navItems: NavItem[]
  handleSignOut: () => void
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentUser,
  roleLabel,
  navItems,
  handleSignOut
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
    setMobileOpen(false) // auto-close drawer on mobile after selecting
  }

  const toggleGroup = (id: string, childActive: boolean) => {
    setOpenGroups(prev => ({ ...prev, [id]: !(prev[id] ?? childActive) }))
  }

  const activeClass = (accent: NavItem['accent']) => {
    switch (accent) {
      case 'sky':
        return 'bg-sky-500/15 text-sky-300 border-l-2 border-sky-400'
      case 'gold':
        return 'bg-[#efbe2b]/15 text-[#efbe2b] border-l-2 border-[#efbe2b]'
      default:
        return 'bg-brand-forest/20 text-brand-leaf border-l-2 border-brand-gold'
    }
  }

  const navContent = (
    <>
      <div className="space-y-4 lg:space-y-6 flex-1 overflow-y-auto">
        {/* Header Logo */}
        <div className="flex items-center gap-3 pb-4 border-b border-white/10">
          <img src="/mahogany_sync-header.png" alt="mahogany-sync logo" className="h-8 w-8 object-contain" />
          <span className="text-sm font-bold tracking-tight text-white">mahogany <span className="text-[#efbe2b]">sync</span></span>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex flex-col gap-1 text-xs font-semibold text-white/80">
          {navItems.map((item) => {
            const Icon = item.icon

            // Dropdown group (e.g. Directory or Officer Tools)
            if (item.children && item.children.length > 0) {
              const childActive = item.children.some(c => c.id === activeTab)
              const expanded = openGroups[item.id] ?? childActive

              return (
                <div key={item.id}>
                  <button
                    onClick={() => toggleGroup(item.id, childActive)}
                    aria-expanded={expanded}
                    className={`w-full py-2.5 px-3 rounded-xl text-left transition-all duration-150 flex items-center justify-between gap-2.5 cursor-pointer ${
                      childActive
                        ? 'text-white font-bold hover:bg-white/10'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                      {item.badge !== undefined && item.badge !== null && item.badge !== 0 && (
                        <span className={`h-5 min-w-[20px] px-1.5 rounded-full ${item.badgeColor || 'bg-rose-600'} text-white text-[10px] font-bold flex items-center justify-center shadow-xs`}>
                          {item.badge}
                        </span>
                      )}
                      <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  {expanded && (
                    <div className="mt-1 ml-4 pl-2 border-l border-white/10 flex flex-col gap-1">
                      {item.children.map((child) => {
                        const ChildIcon = child.icon
                        const childIsActive = activeTab === child.id
                        return (
                          <button
                            key={child.id}
                            onClick={() => handleTabClick(child.id)}
                            className={`w-full py-2 px-3 rounded-lg text-left transition-all duration-150 flex items-center justify-between gap-2 cursor-pointer ${
                              childIsActive
                                ? activeClass(item.accent)
                                : 'text-white/60 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <ChildIcon className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{child.label}</span>
                            </div>
                            {child.badge !== undefined && child.badge !== null && child.badge !== 0 && (
                              <span className={`h-4 min-w-[16px] px-1 rounded-full ${child.badgeColor || 'bg-rose-600'} text-white text-[9px] font-bold flex items-center justify-center shrink-0`}>
                                {child.badge}
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            // Leaf item
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full py-2.5 px-3 rounded-xl text-left transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer ${
                  isActive
                    ? activeClass(item.accent)
                    : 'text-white/80 hover:bg-white/10 hover:text-white hover:shadow-[0_2px_8px_-3px_rgba(37,95,61,0.2)]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge !== null && item.badge !== 0 && (
                  <span className={`h-5 min-w-[20px] px-1.5 rounded-full ${item.badgeColor || 'bg-rose-600'} text-white text-[10px] font-bold flex items-center justify-center shrink-0`}>
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Active Profile Info */}
      <div className="pt-4 border-t border-white/10 flex flex-col gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center font-extrabold text-[#efbe2b] uppercase text-sm select-none overflow-hidden">
            {currentUser?.user_metadata?.avatar_url ? (
              <img src={currentUser.user_metadata.avatar_url} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              currentUser?.user_metadata?.full_name?.[0] || currentUser?.email?.[0] || 'U'
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-bold text-white truncate">{currentUser?.user_metadata?.full_name}</div>
            <div className="text-[10px] text-white/50 capitalize truncate">
              {roleLabel}
            </div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full py-2 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-400/40 text-white/80 hover:text-red-200 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer"
        >
          Sign Out Session
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-brand-deepest-green border-b border-white/10 relative z-30 shrink-0">
        <div className="flex items-center gap-2.5">
          <img src="/mahogany_sync-header.png" alt="mahogany-sync logo" className="h-7 w-7 object-contain" />
          <span className="text-sm font-bold tracking-tight text-white">mahogany <span className="text-[#efbe2b]">sync</span></span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Slide-out Drawer */}
      <aside
        className={`
          lg:hidden fixed top-0 right-0 h-full w-72 z-50
          bg-brand-deepest-green p-5 flex flex-col
          border-l border-white/10
          shadow-2xl transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Close button inside drawer */}
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {navContent}
      </aside>

      {/* Desktop Sidebar (always visible on lg+) */}
      <aside className="hidden lg:flex w-64 shrink-0 h-full bg-brand-deepest-green border-r border-white/10 p-6 flex-col relative z-20 transition-colors duration-150">
        {navContent}
      </aside>
    </>
  )
}
