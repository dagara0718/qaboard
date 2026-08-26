import { useEffect, useState, type ReactElement } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { MainPage } from './pages/MainPage'
import { QuestionListPage } from './pages/QuestionListPage'
import { QuestionDetailPage } from './pages/QuestionDetailPage'
import { SignupPage } from './pages/SignupPage'
import { LoginPage } from './pages/LoginPage'
import { sessionForRole } from './mocks/mockSession'
import { getCurrentSession, onSessionChange, signOut } from './lib/supabase/sessionProvider'
import { isSupabaseBackend } from './lib/dataAccess'
import type { Role, Session } from './lib/dataAccess/types'

const GUEST: Session = { role: 'guest', userId: null, displayName: null }

export function App() {
  const [mockRole, setMockRole] = useState<Role>('guest')
  const [authSession, setAuthSession] = useState<Session>(GUEST)
  const [authReady, setAuthReady] = useState(!isSupabaseBackend)

  useEffect(() => {
    if (!isSupabaseBackend) return
    getCurrentSession().then((s) => {
      setAuthSession(s)
      setAuthReady(true)
    })
    return onSessionChange(setAuthSession)
  }, [])

  if (isSupabaseBackend && !authReady) return null

  const session = isSupabaseBackend ? authSession : sessionForRole(mockRole)
  const onRoleChange = isSupabaseBackend ? () => {} : setMockRole
  const onLogout = isSupabaseBackend ? signOut : undefined

  const protectedRoute = (element: ReactElement) =>
    isSupabaseBackend && session.role === 'guest' ? <Navigate to="/login" replace /> : element

  return (
    <Routes>
      <Route
        path="/"
        element={<MainPage role={session.role} onRoleChange={onRoleChange} onLogout={onLogout} />}
      />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage onAuthChange={setAuthSession} />} />
      <Route
        path="/questions"
        element={protectedRoute(
          <QuestionListPage session={session} onRoleChange={onRoleChange} onLogout={onLogout} />,
        )}
      />
      <Route
        path="/questions/:id"
        element={protectedRoute(
          <QuestionDetailPage session={session} onRoleChange={onRoleChange} onLogout={onLogout} />,
        )}
      />
    </Routes>
  )
}
