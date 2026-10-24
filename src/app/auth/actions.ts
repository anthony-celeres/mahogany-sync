// src/app/auth/actions.ts
'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Server Action to log in with Email/Username and Password.
 */
export async function loginWithEmail(formData: FormData): Promise<{ error?: string }> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const next = formData.get('next') as string || '/dashboard'

  if (!email || !password) {
    return { error: 'Email/Username and password are required' }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: error.message }
  }

  redirect(next)
}

/**
 * Registration: submits a new occupant to PENDING status in the mock DB and
 * RETURNS a result instead of redirecting, so the in-page slide panel can show the
 * outcome inline (no navigation away from the landing page).
 */
export async function registerOccupant(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const studentId = formData.get('studentId') as string
  const roomNumber = formData.get('roomNumber') as string
  const degreeProgram = formData.get('degreeProgram') as string
  const yearLevel = formData.get('yearLevel') as string
  const birthdate = formData.get('birthdate') as string
  const mobileNumber = formData.get('mobileNumber') as string
  const barangay = formData.get('barangay') as string
  const city = formData.get('city') as string
  const province = formData.get('province') as string
  const guardianName = formData.get('guardianName') as string
  const guardianRelationship = formData.get('guardianRelationship') as string
  const guardianContact = formData.get('guardianContact') as string
  const guardianAddress = formData.get('guardianAddress') as string
  const kitchenIntent = formData.get('kitchenIntent') === 'true'
  const consentData = formData.get('consentData') === 'on'
  const consentRules = formData.get('consentRules') === 'on'

  if (!email || !password || !fullName || !studentId) {
    return { error: 'Required fields (Email, Password, Name, Student ID) are missing.' }
  }
  if (!consentData || !consentRules) {
    return { error: 'You must agree to the Dorm rules and Data Privacy consent.' }
  }

  const { getDb, saveDb } = require('../../utils/mock-db')
  const db = getDb()

  const existing = db.users.find(
    (u: any) => u.email === email || (u.studentId === studentId && u.status !== 'removed')
  )
  if (existing) {
    return { error: 'A user with this email or Student ID already exists.' }
  }

  db.users.push({
    id: `p-${Date.now()}`,
    email,
    fullName,
    username: '',
    role: 'user',
    specialRoles: [],
    studentId,
    roomNumber,
    degreeProgram,
    yearLevel,
    birthdate,
    mobileNumber,
    barangay,
    city,
    province,
    guardianName,
    guardianRelationship,
    guardianContact,
    guardianAddress,
    kitchenIntent,
    status: 'pending',
    addedAt: new Date().toISOString().split('T')[0],
  })
  saveDb(db)

  return { success: true }
}

/**
 * Server Action to toggle the user's role between 'user' and 'admin' for testing.
 */
export async function toggleUserRole() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?error=Authentication required')
  }

  const currentRole = user.user_metadata?.role || 'user'
  const newRole = currentRole === 'admin' ? 'user' : 'admin'

  await supabase.auth.updateUser({
    data: { role: newRole }
  })

  redirect(newRole === 'admin' ? '/dashboard' : '/dashboard')
}

/**
 * Server Action to sign out.
 */
export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}
