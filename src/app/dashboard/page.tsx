// src/app/dashboard/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // STRICT AUTH CHECK: Cryptographically verify session against mock cookie session
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  // Redirect if unauthorized
  if (error || !user) {
    redirect('/?error=Session expired or unauthorized access')
  }

  return <DashboardClient initialUser={user} />
}
