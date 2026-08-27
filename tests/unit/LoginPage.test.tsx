import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { LoginPage } from '../../src/pages/LoginPage'

vi.mock('../../src/lib/supabase/sessionProvider', () => ({
  signIn: vi.fn().mockRejectedValue(new Error('invalid credentials')),
  getCurrentSession: vi.fn(),
}))

describe('LoginPage', () => {
  it('이메일/비밀번호 입력 필드와 로그인 버튼을 렌더링한다', () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )
    expect(screen.getByLabelText('이메일')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
  })

  it('빈 입력으로 제출 시 오류 메시지를 보여준다', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: '로그인' }))
    await waitFor(() =>
      expect(screen.getByText('이메일과 비밀번호를 입력해주세요.')).toBeInTheDocument(),
    )
  })

  it('로그인 실패 시 오류 메시지를 보여준다', async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    )
    fireEvent.change(screen.getByLabelText('이메일'), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'wrongpass' } })
    fireEvent.click(screen.getByRole('button', { name: '로그인' }))
    await waitFor(() =>
      expect(screen.getByText('이메일 또는 비밀번호가 올바르지 않습니다.')).toBeInTheDocument(),
    )
  })
})
