import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { signUp } from '../lib/supabase/sessionProvider'
import './AuthPage.css'

/** FR-001: 이메일/비밀번호 회원가입, 이메일 중복은 Supabase Auth가 자체 검증한다. */
export function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const submit = async () => {
    setError(undefined)
    if (!email.trim() || password.length < 6) {
      setError('이메일과 6자 이상의 비밀번호를 입력해주세요.')
      return
    }
    setSubmitting(true)
    try {
      await signUp(email.trim(), password)
      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : '회원가입에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1 className="text-page-title">회원가입</h1>
        {done ? (
          <>
            <div className="auth-notice">
              가입 확인 이메일을 보냈습니다. 메일함을 확인한 후 로그인해주세요.
            </div>
            <p className="auth-switch">
              <Link to="/login">로그인 화면으로 이동</Link>
            </p>
          </>
        ) : (
          <>
            <Input
              id="signup-email"
              label="이메일"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              id="signup-password"
              label="비밀번호"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error}
            />
            <Button
              variant="primary"
              className="auth-submit"
              onClick={submit}
              disabled={submitting}
            >
              {submitting ? '처리 중...' : '가입하기'}
            </Button>
            <p className="auth-switch">
              이미 계정이 있으신가요? <Link to="/login">로그인</Link>
            </p>
          </>
        )}
      </div>
    </main>
  )
}
