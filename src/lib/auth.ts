import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import type { User } from '@/lib/supabase/types'

const SESSION_COOKIE = 'trace_session'

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies()
  const raw = cookieStore.get(SESSION_COOKIE)?.value
  if (!raw) return null
  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

export async function setSession(user: User) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 12,
    path: '/',
  })
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, '', { maxAge: 0, path: '/' })
}

export async function getUserByStaffId(staffId: string): Promise<User | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('users')
    .select('*, roles(*)')
    .eq('staff_id', staffId)
    .eq('is_active', true)
    .single()
  if (error || !data) return null
  return data as User
}
