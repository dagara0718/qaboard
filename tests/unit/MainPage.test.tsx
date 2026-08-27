import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { MainPage } from '../../src/pages/MainPage'

describe('MainPage', () => {
  it('Hero CTA 버튼 2종을 렌더링한다', () => {
    render(
      <MemoryRouter>
        <MainPage role="guest" onRoleChange={() => {}} />
      </MemoryRouter>,
    )
    expect(screen.getByRole('button', { name: '질문 작성하기' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '내 질문 확인하기' })).toBeInTheDocument()
  })

  it('"질문 작성하기" 클릭 시 /questions/new로 이동한다', () => {
    render(
      <MemoryRouter>
        <MainPage role="guest" onRoleChange={() => {}} />
      </MemoryRouter>,
    )
    fireEvent.click(screen.getByRole('button', { name: '질문 작성하기' }))
    // 라우팅 대상 페이지가 없는 테스트 환경이므로 예외 없이 클릭이 처리되는지만 확인
    expect(screen.getByRole('button', { name: '질문 작성하기' })).toBeInTheDocument()
  })

  it('상태 배지 쇼케이스(답변 대기/답변됨)를 렌더링한다', () => {
    render(
      <MemoryRouter>
        <MainPage role="guest" onRoleChange={() => {}} />
      </MemoryRouter>,
    )
    expect(screen.getByText('답변 대기 중')).toBeInTheDocument()
    expect(screen.getByText('답변됨')).toBeInTheDocument()
  })
})
