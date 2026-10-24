import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/logout-btn'
import { ThemeToggle } from '@/components/theme-toggle'

/**
 * Interface representing a system audit log.
 */
interface AuditLog {
  id: string
  user_email: string
  action: string
  created_at: string
  status: string
}

/**
 * Static mock logs to display as fallback/preview until user runs SQL migrations.
 * Defined statically outside the component function to ensure rendering purity.
 */
const mockLogs: AuditLog[] = [
  { id: 'MOCK-8023', user_email: 'admin@example.com', action: 'Updated metadata: role set to admin', created_at: '2026-06-28T14:20:00.000Z', status: 'SUCCESS' },
  { id: 'MOCK-8022', user_email: 'guest_dev@github.com', action: 'Initiated Google OAuth PKCE flow', created_at: '2026-06-28T14:08:00.000Z', status: 'SUCCESS' },
  { id: 'MOCK-8021', user_email: 'attacker@botnet.ru', action: 'Attempted brute-force auth bypass', created_at: '2026-06-28T13:40:00.000Z', status: 'BLOCKED' },
]

/**
 * Protected Admin Panel.
 * Validates session and role claims cryptographically on the server.
 * Reads real audit logs from Supabase database tables with Row Level Security (RLS) policies.
 */
export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // STRICT AUTH & ROLE CHECK: Verify session & check that 'role' === 'admin'
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/?error=Session expired or unauthorized access')
  }

  const role = user.user_metadata?.role || 'user'
  if (role !== 'admin' && role !== 'developer') {
    redirect('/dashboard?error=Access denied: Admin role required to view the Admin Dashboard')
  }

  // 1. QUERY REAL DATABASE: Fetch logs from Supabase audit_logs table
  const { data, error: dbError } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10)

  const fetchedLogs = data as AuditLog[] | null
  const isTableNotSetup = !!dbError || !fetchedLogs

  // Personalize the first mock log email dynamically with current user's email
  const logsToDisplay: AuditLog[] = isTableNotSetup
    ? mockLogs.map((log) =>
        log.id === 'MOCK-8023' ? { ...log, user_email: user.email || 'admin@example.com' } : log
      )
    : fetchedLogs

  const sqlSetupScript = `-- 1. Create the Audit Logs Table
create table public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_email text not null,
  action text not null,
  status text not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.audit_logs enable row level security;

-- 3. Create RLS Policies using User Metadata JWT Claims
-- Policy A: Allow admins (identified via auth metadata role claim) full access
create policy "Admins have full access"
on public.audit_logs
for all
to authenticated
using ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
with check ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- Policy B: Allow standard users to log their own actions (insert-only)
create policy "Users can insert their own actions"
on public.audit_logs
for insert
to authenticated
with check (auth.jwt() ->> 'email' = user_email);

-- Policy C: Allow standard users to view only their own logs (read-only)
create policy "Users can view their own actions"
on public.audit_logs
for select
to authenticated
using (auth.jwt() ->> 'email' = user_email);`

  return (
    <div className="dorm-panels min-h-screen bg-neutral-50 dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-100 font-sans px-4 py-8 md:py-16 transition-colors duration-150">
      
      {/* Container */}
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-850">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
              <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                System Admin Panel Active
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-black dark:text-white tracking-tight">
              Admin Dashboard & RLS Center
            </h1>
          </div>
          
          {/* Action Row */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <Link
              href="/dashboard"
              className="px-3 py-1.5 text-xs font-semibold rounded-lg shadow-sm border border-neutral-200 bg-white hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:bg-neutral-800 transition-colors duration-150 inline-flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              User Workspace
            </Link>
            <ThemeToggle />
            <LogoutButton />
          </div>
        </header>

        {/* RLS Informational Banner */}
        <div className="bg-white dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-850 rounded-xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-black dark:text-white flex items-center gap-2">
            🛡️ What is Row Level Security (RLS)?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            In Supabase, anyone with the public <code className="font-mono bg-neutral-100 dark:bg-neutral-900 px-1 py-0.5 rounded">anon_key</code> can theoretically query your tables directly from their browser. To prevent unauthorized reads/writes, you must enable <strong>Row Level Security (RLS)</strong> on your tables. RLS applies fine-grained access security directly inside the PostgreSQL engine, checking incoming tokens before executing operations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
            <div className="bg-neutral-50 dark:bg-neutral-950 p-4 border border-neutral-200 dark:border-neutral-900 rounded-lg space-y-2">
              <strong className="text-neutral-850 dark:text-neutral-200 block">How RLS utilizes Roles:</strong>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                When a user logs in, Supabase generates a JWT (JSON Web Token) containing their profile metadata. When they make an API request, PostgreSQL intercepts this JWT and evaluates your policy rules. By reading the role claim directly:
                <code className="block mt-1 font-mono text-[10px] bg-white dark:bg-neutral-900 p-1.5 rounded select-all border border-neutral-200 dark:border-neutral-800">
                  (auth.jwt() -{'>'} &apos;user_metadata&apos; -{'>'}{'>'} &apos;role&apos;) = &apos;admin&apos;
                </code>
                we grant administrative read/write access database-wide with zero extra server latency.
              </p>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-950 p-4 border border-neutral-200 dark:border-neutral-900 rounded-lg space-y-2">
              <strong className="text-neutral-850 dark:text-neutral-200 block">Why this matters for your scaffold:</strong>
              <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Using RLS prevents data exposure. A standard user can only insert logs matching their own email, and can only read their own logs. However, when you toggle your claim to <code className="font-mono">admin</code>, PostgreSQL immediately grants you access to view the entire system log table.
              </p>
            </div>
          </div>
        </div>

        {/* Database Table Connection Status */}
        {isTableNotSetup && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-250 dark:border-amber-900/40 rounded-xl p-5 shadow-sm space-y-3 animate-fade-in">
            <div className="flex gap-2.5 items-start">
              <span className="text-amber-500 text-base font-bold shrink-0 mt-0.5">⚠</span>
              <div className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 leading-normal flex-1">
                <strong>Database Table Not Configured:</strong> The application is currently displaying preview fallback data. To make this admin panel fully live, copy the SQL DDL setup script below, navigate to your <strong>Supabase Dashboard &gt; SQL Editor</strong>, paste it, and click **Run**.
              </div>
            </div>
            
            {/* Copyable SQL Box */}
            <div className="relative w-full overflow-hidden">
              <pre className="bg-neutral-900 text-neutral-100 p-4 rounded-lg font-mono text-[10px] sm:text-xs overflow-x-auto select-all max-h-60 scrollbar-thin border border-neutral-800">
                <code>{sqlSetupScript}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Audit Logs Table */}
        <div className="bg-white dark:bg-[#0d0d0d] border border-neutral-200 dark:border-neutral-850 rounded-xl p-6 shadow-sm space-y-4 min-w-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="text-base font-bold text-black dark:text-white">
                Live Audit Logs {isTableNotSetup ? '(FALLBACK PREVIEW)' : '(DATABASE LIVE)'}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Evaluated and secured under database Row Level Security (RLS) rules.
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className={`h-2 w-2 rounded-full ${isTableNotSetup ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
              <span className={isTableNotSetup ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}>
                {isTableNotSetup ? 'Waiting for SQL migrations...' : 'Connected to audit_logs table'}
              </span>
            </div>
          </div>

          {/* Table Container - Responsive Horizontal Scroll */}
          <div className="w-full overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-lg select-all scrollbar-thin">
            <table className="w-full min-w-[600px] text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-bold">
                  <th className="p-3">Log ID</th>
                  <th className="p-3">User Target</th>
                  <th className="p-3">Security Action</th>
                  <th className="p-3">Timestamp (UTC)</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono">
                {logsToDisplay.map((log: AuditLog) => (
                  <tr key={log.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20">
                    <td className="p-3 font-semibold text-black dark:text-white truncate max-w-[120px]">{log.id}</td>
                    <td className="p-3 break-all">{log.user_email}</td>
                    <td className="p-3">{log.action}</td>
                    <td className="p-3 whitespace-nowrap text-neutral-500">
                      {new Date(log.created_at).toUTCString()}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-250 dark:border-emerald-900/30'
                          : 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-250 dark:border-red-900/30'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3.5 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs text-neutral-600 dark:text-neutral-400 flex items-start gap-2.5">
            <span className="font-bold text-sm shrink-0">ℹ</span>
            <div className="leading-relaxed">
              <strong>Scaffold RLS Testing Tip:</strong> Promote your role to admin in your user dashboard, copy the SQL setup migration script to your SQL Editor, execute it, then toggle your role claims. Standard users will see only their own actions, while admins will be query-authorized to read everything!
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
