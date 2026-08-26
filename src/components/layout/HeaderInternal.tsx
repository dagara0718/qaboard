import { useNavigate } from 'react-router-dom'
import type { Role } from '../../lib/dataAccess/types'
import './HeaderInternal.css'

interface HeaderInternalProps {
  role: Role
  onRoleChange: (role: Role) => void
  showBack?: boolean
}

export function HeaderInternal({ role, onRoleChange, showBack = false }: HeaderInternalProps) {
  const navigate = useNavigate()

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
      <div className="header-actions">
        {role === 'admin' && <span className="role-tag">관리자</span>}
        <span>{role === 'admin' ? '관리자' : '홍길동님'}</span>
        <button className="btn-logout" onClick={() => navigate('/')}>
          로그아웃
        </button>
      </div>
    </header>
  )
}
