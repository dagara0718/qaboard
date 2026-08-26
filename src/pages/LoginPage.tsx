import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { getCurrentSession, signIn } from '../lib/supabase/sessionProvider'
import type { Session } from '../lib/dataAccess/types'
import './AuthPage.css'

interface LoginPageProps {
  /** 로그인 성공 시 App의 세션 state를 즉시 갱신한다. 없으면 onAuthStateChange 구독이 비동기로 처리한다. */
  onAuthChange?: (session: Session) => void
}

/** FR-002: 이메일/비밀번호 로그인. */
export function LoginPage({ onAuthChange }: LoginPageProps) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [submitting, setSubmitting] = useState(false)

  const submit = async () => {
    setError(undefined)
    if (!email.trim() || !password) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return
    }
    setSubmitting(true)
    try {
      await signIn(email.trim(), password)
      // onAuthStateChange 구독이 비동기로 처리되기 전에 navigate하면 보호 라우트 가드가
      // 아직 게스트인 세션을 보고 다시 /login으로 튕겨낸다 — 세션을 직접 갱신하고 이동한다.
      const session = await getCurrentSession()
      onAuthChange?.(session)
      navigate('/questions')
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="text-page-title">로그인</h1>
        <Input
          id="login-email"
          label="이메일"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          id="login-password"
          label="비밀번호"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error}
        />
        <Button variant="primary" className="auth-submit" onClick={submit} disabled={submitting}>
          {submitting ? '로그인 중...' : '로그인'}
        </Button>
        <p className="auth-switch">
          계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </p>
      </div>
    </div>
  )
}
