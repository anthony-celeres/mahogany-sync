// src/utils/supabase/server.ts
import { cookies } from 'next/headers'
import { getDb } from '../mock-db'

function toSupabaseUser(mockUser: any) {
  if (!mockUser) return null
  return {
    id: mockUser.id,
    email: mockUser.email,
    app_metadata: { provider: 'credentials' },
    user_metadata: {
      role: mockUser.role,
      specialRoles: mockUser.specialRoles || [],
      full_name: mockUser.fullName,
      username: mockUser.username,
      student_id: mockUser.studentId,
      room_number: mockUser.roomNumber,
      degree_program: mockUser.degreeProgram,
      year_level: mockUser.yearLevel,
    }
  }
}

export async function createClient() {
  const cookieStore = await cookies()

  return {
    auth: {
      async getUser() {
        const sessionCookie = cookieStore.get('mahogany_sync_session')
        if (!sessionCookie) {
          return { data: { user: null }, error: new Error('No active session') }
        }
        try {
          const user = JSON.parse(sessionCookie.value)
          return { data: { user }, error: null }
        } catch {
          return { data: { user: null }, error: new Error('Session parse error') }
        }
      },
      async signInWithPassword({ email, password }: any) {
        const db = getDb()
        const user = db.users.find(u => (u.email === email || u.username === email) && u.status === 'active')
        if (!user) {
          return { data: {}, error: new Error('Invalid email/username or account is not active') }
        }
        if (password !== 'password123') {
          return { data: {}, error: new Error('Incorrect password (use password123)') }
        }

        const supabaseUser = toSupabaseUser(user)
        cookieStore.set('mahogany_sync_session', JSON.stringify(supabaseUser), { path: '/' })
        return { data: { user: supabaseUser }, error: null }
      },
      async signUp({ email, password, options }: any) {
        const db = getDb()
        const existing = db.users.find(u => u.email === email)
        if (existing) {
          return { data: {}, error: new Error('User already exists') }
        }
        const newUser = {
          id: `p-${Date.now()}`,
          email,
          fullName: options?.data?.full_name || email.split('@')[0],
          username: '',
          role: 'user' as const,
          specialRoles: [],
          status: 'pending' as const,
          addedAt: new Date().toISOString().split('T')[0],
        }
        db.users.push(newUser)
        if (typeof window !== 'undefined') {
          localStorage.setItem('mahogany_sync_db', JSON.stringify(db))
        }
        return { data: { user: toSupabaseUser(newUser) }, error: null }
      },
      async signOut() {
        cookieStore.delete('mahogany_sync_session')
        return { error: null }
      },
      async updateUser({ data }: any) {
        const sessionCookie = cookieStore.get('mahogany_sync_session')
        if (!sessionCookie) return { error: new Error('No active session') }
        try {
          const user = JSON.parse(sessionCookie.value)
          if (data.role) {
            user.user_metadata.role = data.role
          }
          cookieStore.set('mahogany_sync_session', JSON.stringify(user), { path: '/' })
          return { data: { user }, error: null }
        } catch (e: any) {
          return { error: e }
        }
      },
      async exchangeCodeForSession(code: string) {
        return { error: null }
      }
    },
    // Mock database operations with chainable interfaces
    from(table: string) {
      const chain: any = {
        order: () => chain,
        limit: () => chain,
        insert: async (data: any) => ({ data, error: null }),
        select: () => chain,
        then: (onfulfilled: any) => onfulfilled({ data: [], error: null })
      }
      return chain
    }
  }
}
