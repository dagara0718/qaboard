import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { QuestionDetailPage } from '../../src/pages/QuestionDetailPage'
import { QuestionListPage } from '../../src/pages/QuestionListPage'
import { mockAnswerRepository, __resetMockData } from '../../src/lib/dataAccess/mockRepository'
import { ADMIN_ID } from '../../src/mocks/mockData'
import { RepositoryError } from '../../src/lib/dataAccess/types'
import type { Session } from '../../src/lib/dataAccess/types'

beforeEach(() => {
  __resetMockData()
})

describe('관리자 권한 통합 테스트', () => {
  it('다른 관리자가 작성한 답변은 수정할 수 없다 (FR-018)', async () => {
    await expect(
      mockAnswerRepository.update('a1', 'admin-2', '다른 관리자 수정 시도'),
    ).rejects.toThrow(RepositoryError)
    await expect(
      mockAnswerRepository.update('a1', 'admin-2', '다른 관리자 수정 시도'),
    ).rejects.toThrow('본인이 작성한 답변만 수정할 수 있습니다.')
  })

  it('관리자는 질문을 작성할 수 없다 — /questions/new 접근 시 목록으로 리다이렉트된다 (FR-013 반대 검증)', async () => {
    const adminSession: Session = { role: 'admin', userId: ADMIN_ID, displayName: '관리자' }
    render(
      <MemoryRouter initialEntries={['/questions/new']}>
        <Routes>
          <Route
            path="/questions/:id"
            element={<QuestionDetailPage session={adminSession} onRoleChange={() => {}} />}
          />
          <Route
            path="/questions"
            element={<QuestionListPage session={adminSession} onRoleChange={() => {}} />}
          />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => expect(screen.getByText('문의 관리')).toBeInTheDocument())
    expect(screen.queryByLabelText('제목')).not.toBeInTheDocument()
  })
})
