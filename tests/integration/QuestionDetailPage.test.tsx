import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { QuestionDetailPage } from '../../src/pages/QuestionDetailPage'
import { __resetMockData } from '../../src/lib/dataAccess/mockRepository'
import { MEMBER_USER_ID } from '../../src/mocks/mockData'
import type { Session } from '../../src/lib/dataAccess/types'

beforeEach(() => {
  __resetMockData()
})

function renderDetail(session: Session, questionId: string) {
  return render(
    <MemoryRouter initialEntries={[`/questions/${questionId}`]}>
      <Routes>
        <Route
          path="/questions/:id"
          element={<QuestionDetailPage session={session} onRoleChange={() => {}} />}
        />
      </Routes>
    </MemoryRouter>,
  )
}

describe('QuestionDetailPage', () => {
  it('답변완료 질문에는 회원용 수정/삭제 버튼이 렌더링되지 않는다 (FR-011)', async () => {
    const memberSession: Session = { role: 'member', userId: MEMBER_USER_ID, displayName: '홍길동' }
    renderDetail(memberSession, 'q1')
    await waitFor(() => expect(screen.getByText(/답변됨/)).toBeInTheDocument())
    expect(screen.queryByRole('button', { name: '수정' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '삭제' })).not.toBeInTheDocument()
  })

  it('회원 화면에는 답변 작성 폼(관리자 전용)이 노출되지 않는다 (FR-015 역방향 검증)', async () => {
    const memberSession: Session = { role: 'member', userId: MEMBER_USER_ID, displayName: '홍길동' }
    renderDetail(memberSession, 'q2')
    await waitFor(() => expect(screen.getByText(/답변 대기 중/)).toBeInTheDocument())
    expect(screen.queryByRole('button', { name: '답변 작성' })).not.toBeInTheDocument()
    expect(screen.getByText('관리자가 확인 후 답변할 예정입니다.')).toBeInTheDocument()
  })

  it('답변대기 + 본인 질문에는 수정/삭제 버튼이 렌더링된다 (FR-009, FR-010)', async () => {
    const memberSession: Session = { role: 'member', userId: MEMBER_USER_ID, displayName: '홍길동' }
    renderDetail(memberSession, 'q2')
    await waitFor(() => expect(screen.getByRole('button', { name: '수정' })).toBeInTheDocument())
    expect(screen.getByRole('button', { name: '삭제' })).toBeInTheDocument()
  })
})
