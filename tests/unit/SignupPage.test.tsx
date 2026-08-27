import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { SignupPage } from '../../src/pages/SignupPage'

vi.mock('../../src/lib/supabase/sessionProvider', () => ({
  signUp: vi.fn().mockResolvedValue(undefined),
}))

describe('SignupPage', () => {
  it('이메일/비밀번호 입력 필드와 가입 버튼을 렌더링한다', () => {
    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>,
    )
    expect(screen.getByLabelText('이메일')).toBeInTheDocument()
    expect(screen.getByLabelText('비밀번호')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '가입하기' })).toBeInTheDocument()
  })

  it('6자 미만 비밀번호 입력 시 오류 메시지를 보여준다', async () => {
    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>,
    )
    fireEvent.change(screen.getByLabelText('이메일'), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: '123' } })
    fireEvent.click(screen.getByRole('button', { name: '가입하기' }))
    await waitFor(() =>
      expect(
        screen.getByText('이메일과 6자 이상의 비밀번호를 입력해주세요.'),
      ).toBeInTheDocument(),
    )
  })

  it('가입 성공 시 확인 이메일 안내와 로그인 링크를 보여준다', async () => {
    render(
      <MemoryRouter>
        <SignupPage />
      </MemoryRouter>,
    )
    fireEvent.change(screen.getByLabelText('이메일'), { target: { value: 'a@b.com' } })
    fireEvent.change(screen.getByLabelText('비밀번호'), { target: { value: 'password123' } })
    fireEvent.click(screen.getByRole('button', { name: '가입하기' }))
    await waitFor(() =>
      expect(screen.getByText(/가입 확인 이메일을 보냈습니다/)).toBeInTheDocument(),
    )
    expect(screen.getByRole('link', { name: '로그인 화면으로 이동' })).toBeInTheDocument()
  })
})
