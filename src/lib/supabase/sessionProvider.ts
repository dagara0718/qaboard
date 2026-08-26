import { supabase } from './client'
import type { Role, Session } from '../dataAccess/types'

const GUEST_SESSION: Session = { role: 'guest', userId: null, displayName: null }

async function resolveSession(userId: string | undefined, email: string | undefined): Promise<Session> {
  if (!userId) return GUEST_SESSION
  const { data } = await supabase.from('profiles').select('role').eq('id', userId)
  const role: Role = data?.[0]?.role === 'admin' ? 'admin' : 'member'
  return { role, userId, displayName: email ?? null }
}

export async function getCurrentSession(): Promise<Session> {
  const { data } = await supabase.auth.getSession()
  return resolveSession(data.session?.user.id, data.session?.user.email)
}

/** 인증 상태(로그인/로그아웃) 변경 시 최신 Session을 전달한다. */
export function onSessionChange(cb: (session: Session) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, authSession) => {
    resolveSession(authSession?.user.id, authSession?.user.email).then(cb)
  })
  return () => data.subscription.unsubscribe()
}

export async function signUp(email: string, password: string) {
  const { error } = await supabase.auth.signUp({ email, password })
  if (error) throw error
}

export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
}

export async function signOut() {
  await supabase.auth.signOut()
}
