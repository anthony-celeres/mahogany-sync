// src/utils/supabase/client.ts
import { getDb } from '../mock-db'

function getCookie(name: string) {
  if (typeof document === 'undefined') return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

function setCookie(name: string, value: string, days = 7) {
  if (typeof document === 'undefined') return
  const d = new Date()
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000))
  const expires = "expires=" + d.toUTCString()
  document.cookie = `${name}=${value};${expires};path=/`
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`
}

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

export function createClient() {
  return {
    auth: {
      async getUser() {
        const sessionCookie = getCookie('mahogany_sync_session')
        if (!sessionCookie) {
          return { data: { user: null }, error: new Error('No active session') }
        }
        try {
          const user = JSON.parse(decodeURIComponent(sessionCookie))
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
        setCookie('mahogany_sync_session', encodeURIComponent(JSON.stringify(supabaseUser)))
        return { data: { user: supabaseUser }, error: null }
      },
      async signOut() {
        deleteCookie('mahogany_sync_session')
        return { error: null }
      },
      async updateUser({ data }: any) {
        const sessionCookie = getCookie('mahogany_sync_session')
        if (!sessionCookie) return { error: new Error('No active session') }
        try {
          const user = JSON.parse(decodeURIComponent(sessionCookie))
          if (data.role) {
            user.user_metadata.role = data.role
          }
          setCookie('mahogany_sync_session', encodeURIComponent(JSON.stringify(user)))
          return { data: { user }, error: null }
        } catch (e: any) {
          return { error: e }
        }
      },
      async exchangeCodeForSession(code: string) {
        return { error: null }
      }
    },
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
