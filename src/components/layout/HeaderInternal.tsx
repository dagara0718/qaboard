import { useNavigate } from 'react-router-dom'
import type { Role } from '../../lib/dataAccess/types'
import './HeaderInternal.css'

interface HeaderInternalProps {
  role: Role
  onRoleChange: (role: Role) => void
  showBack?: boolean
  /** 제공되면 실제 인증 모드로 전환한다: 프로토타입 뷰 전환 셀렉터를 숨기고 로그아웃 버튼에 연결한다. */
  onLogout?: () => void
  displayName?: string | null
}

export function HeaderInternal({
  role,
  onRoleChange,
  showBack = false,
  onLogout,
  displayName,
}: HeaderInternalProps) {
  const navigate = useNavigate()
  const authMode = Boolean(onLogout)

  return (
    <header className="header-internal">
      {showBack ? (
        <button className="btn-back" onClick={() => navigate('/questions')}>
          ← 뒤로
        </button>
      ) : (
        <div
          className="logo"
          role="button"
          tabIndex={0}
          onClick={() => navigate('/')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              navigate('/')
            }
          }}
        >
          QANOW
        </div>
      )}
      {!authMode && (
        <div className="proto-switch">
          <span>뷰:</span>
          <select
            aria-label="역할 선택"
            value={role}
            onChange={(e) => onRoleChange(e.target.value as Role)}
          >
            <option value="member">회원</option>
            <option value="admin">관리자</option>
          </select>
        </div>
      )}
      <div className="header-actions">
        {role === 'admin' && <span className="role-tag">관리자</span>}
        <span>{role === 'admin' ? '관리자' : (displayName ?? '홍길동님')}</span>
        <button className="btn-logout" onClick={onLogout ?? (() => navigate('/'))}>
          로그아웃
        </button>
      </div>
    </header>
  )
}
