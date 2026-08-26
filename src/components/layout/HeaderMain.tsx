import { useNavigate } from 'react-router-dom'
import type { Role } from '../../lib/dataAccess/types'
import './HeaderMain.css'

interface HeaderMainProps {
  role: Role
  onRoleChange: (role: Role) => void
}

export function HeaderMain({ role, onRoleChange }: HeaderMainProps) {
  const navigate = useNavigate()

  return (
    <header className="header-main">
      <div className="logo">QANOW</div>
      <div className="proto-switch">
        <span>프로토타입 뷰 전환:</span>
        <select
          aria-label="프로토타입 역할 선택"
          value={role}
          onChange={(e) => onRoleChange(e.target.value as Role)}
        >
          <option value="guest">비회원</option>
          <option value="member">회원</option>
          <option value="admin">관리자</option>
        </select>
      </div>
      <div className="header-actions">
        {role === 'guest' && (
          <>
            <button className="btn-header">로그인</button>
            <button className="btn-header primary">회원가입</button>
          </>
        )}
        {role === 'member' && (
          <>
            <button className="btn-header primary" onClick={() => navigate('/questions')}>
              내 질문 보기
            </button>
            <button className="btn-header">로그아웃</button>
          </>
        )}
        {role === 'admin' && (
          <>
            <span className="role-tag">관리자</span>
            <button className="btn-header primary" onClick={() => navigate('/questions')}>
              문의 관리
            </button>
            <button className="btn-header">로그아웃</button>
          </>
        )}
      </div>
    </header>
  )
}
