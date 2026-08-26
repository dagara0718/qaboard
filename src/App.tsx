import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { MainPage } from './pages/MainPage'
import { QuestionListPage } from './pages/QuestionListPage'
import { QuestionDetailPage } from './pages/QuestionDetailPage'
import { sessionForRole } from './mocks/mockSession'
import type { Role } from './lib/dataAccess/types'

export function App() {
  const [role, setRole] = useState<Role>('guest')
  const session = sessionForRole(role)

  return (
    <Routes>
      <Route path="/" element={<MainPage role={role} onRoleChange={setRole} />} />
      <Route
        path="/questions"
        element={<QuestionListPage session={session} onRoleChange={setRole} />}
      />
      <Route
        path="/questions/:id"
        element={<QuestionDetailPage session={session} onRoleChange={setRole} />}
      />
    </Routes>
  )
}
