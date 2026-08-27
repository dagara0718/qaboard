import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { HeaderMain } from '../../src/components/layout/HeaderMain'
import type { Role } from '../../src/lib/dataAccess/types'

function renderHeader(role: Role, onLogout?: () => void) {
  return render(
    <MemoryRouter>
      <HeaderMain role={role} onRoleChange={() => {}} onLogout={onLogout} />
    </MemoryRouter>,
  )
}

describe('HeaderMain', () => {
  it('게스트는 로그인/회원가입 버튼을 본다', () => {
    renderHeader('guest')
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '회원가입' })).toBeInTheDocument()
  })

  it('회원은 내 질문 보기/질문 작성/로그아웃 버튼을 본다', () => {
    renderHeader('member')
    expect(screen.getByRole('button', { name: '내 질문 보기' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '질문 작성' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '로그아웃' })).toBeInTheDocument()
  })

  it('관리자는 관리자 태그와 문의 관리 버튼을 본다', () => {
    const { container } = renderHeader('admin')
    expect(container.querySelector('.role-tag')).toHaveTextContent('관리자')
    expect(screen.getByRole('button', { name: '문의 관리' })).toBeInTheDocument()
  })

  it('실 인증 모드(onLogout 제공)에서 로그아웃 클릭 시 onLogout이 호출된다', () => {
    const onLogout = vi.fn()
    renderHeader('member', onLogout)
    fireEvent.click(screen.getByRole('button', { name: '로그아웃' }))
    expect(onLogout).toHaveBeenCalledOnce()
  })
})
