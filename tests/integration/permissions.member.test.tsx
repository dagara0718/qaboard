import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { QuestionDetailPage } from '../../src/pages/QuestionDetailPage'
import {
  mockAnswerRepository,
  mockQuestionRepository,
  __resetMockData,
} from '../../src/lib/dataAccess/mockRepository'
import { ADMIN_ID, MEMBER_USER_ID, OTHER_USER_ID } from '../../src/mocks/mockData'
import { RepositoryError } from '../../src/lib/dataAccess/types'
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

describe('회원 권한 통합 테스트', () => {
  it('타 회원의 질문은 수정할 수 없다 (FR-012, SC-005)', async () => {
    await expect(
      mockQuestionRepository.update('q2', OTHER_USER_ID, { title: '해킹', content: '시도' }),
    ).rejects.toThrow(RepositoryError)
    await expect(
      mockQuestionRepository.update('q2', OTHER_USER_ID, { title: '해킹', content: '시도' }),
    ).rejects.toThrow('본인이 작성한 질문만 수정/삭제할 수 있습니다.')
  })

  it('타 회원의 질문은 삭제할 수 없다 (FR-012, SC-005)', async () => {
    await expect(mockQuestionRepository.remove('q2', OTHER_USER_ID)).rejects.toThrow(
      '본인이 작성한 질문만 수정/삭제할 수 있습니다.',
    )
  })

  it('수정 중 답변이 등록되어 상태가 바뀌면 저장 시 Toast로 차단 메시지를 보여준다 (FR-011, SC-006)', async () => {
    const memberSession: Session = { role: 'member', userId: MEMBER_USER_ID, displayName: '홍길동' }
    renderDetail(memberSession, 'q2')

    await waitFor(() => expect(screen.getByRole('button', { name: '수정' })).toBeInTheDocument())
    fireEvent.click(screen.getByRole('button', { name: '수정' }))

    // 편집 화면이 열려 있는 사이 관리자가 답변을 등록해 질문 상태가 answered로 바뀌는 동시성 상황을 시뮬레이션
    await mockAnswerRepository.create('q2', ADMIN_ID, '관리자', '답변 내용입니다')

    fireEvent.click(screen.getByRole('button', { name: '저장' }))

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('이미 답변된 질문은 수정할 수 없습니다.'),
    )
  })
})
