import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Role } from '../../lib/dataAccess/types'
import './HeaderMain.css'

interface HeaderMainProps {
  role: Role
  onRoleChange: (role: Role) => void
  /** 제공되면 실제 인증 모드로 전환한다: 프로토타입 뷰 전환 셀렉터를 숨기고 로그아웃 버튼에 연결한다. */
  onLogout?: () => void
}

export function HeaderMain({ role, onRoleChange, onLogout }: HeaderMainProps) {
  const navigate = useNavigate()
  const authMode = Boolean(onLogout)
  const [menuOpen, setMenuOpen] = useState(false)

  const go = (path: string) => {
    setMenuOpen(false)
    navigate(path)
  }

  const actions = (
    <>
      {role === 'guest' && (
        <>
          <button className="btn-header" onClick={() => go('/login')}>
            로그인
          </button>
          <button className="btn-header primary" onClick={() => go('/signup')}>
            회원가입
          </button>
        </>
      )}
      {role === 'member' && (
        <>
          <button className="btn-header primary" onClick={() => go('/questions')}>
            내 질문 보기
          </button>
          <button className="btn-header primary" onClick={() => go('/questions/new')}>
            질문 작성
          </button>
          <button
            className="btn-header"
            onClick={() => {
              setMenuOpen(false)
              ;(onLogout ?? (() => navigate('/')))()
            }}
          >
            로그아웃
          </button>
        </>
      )}
      {role === 'admin' && (
        <>
          <span className="role-tag">관리자</span>
          <button className="btn-header primary" onClick={() => go('/questions')}>
            문의 관리
          </button>
          <button
            className="btn-header"
            onClick={() => {
              setMenuOpen(false)
              ;(onLogout ?? (() => navigate('/')))()
            }}
          >
            로그아웃
          </button>
        </>
      )}
    </>
  )

  return (
    <header className={authMode ? 'header-main header-main--auth' : 'header-main'}>
      <div className="logo">QANOW</div>
      {!authMode && (
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
      )}
      <div className="header-actions">{actions}</div>
      {authMode && (
        <button
          className="hamburger-toggle"
          aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      )}
      {authMode && menuOpen && <div className="mobile-menu">{actions}</div>}
    </header>
  )
}
