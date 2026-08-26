import { beforeEach, describe, expect, it } from 'vitest'
import {
  mockAnswerRepository,
  mockQuestionRepository,
  __resetMockData,
} from '../../src/lib/dataAccess/mockRepository'
import { ADMIN_ID, MEMBER_USER_ID, OTHER_USER_ID } from '../../src/mocks/mockData'
import { RepositoryError } from '../../src/lib/dataAccess/types'

beforeEach(() => {
  __resetMockData()
})

describe('mockQuestionRepository', () => {
  it('listMine은 본인 질문만 반환한다 (FR-007, FR-021)', async () => {
    const result = await mockQuestionRepository.listMine(MEMBER_USER_ID)
    expect(result.every((q) => q.userId === MEMBER_USER_ID)).toBe(true)
    expect(result.some((q) => q.userId === OTHER_USER_ID)).toBe(false)
  })

  it('listAll은 전체 질문을 반환한다 (FR-013)', async () => {
    const result = await mockQuestionRepository.listAll()
    expect(result.some((q) => q.userId === MEMBER_USER_ID)).toBe(true)
    expect(result.some((q) => q.userId === OTHER_USER_ID)).toBe(true)
  })

  it('답변완료 질문은 수정할 수 없다 (FR-011)', async () => {
    await expect(mockQuestionRepository.update('q1', { title: 'x', content: 'y' })).rejects.toThrow(
      RepositoryError,
    )
  })

  it('답변완료 질문은 삭제할 수 없다 (FR-011)', async () => {
    await expect(mockQuestionRepository.remove('q1')).rejects.toThrow(RepositoryError)
  })

  it('답변대기 질문은 수정 가능하다 (FR-009)', async () => {
    const updated = await mockQuestionRepository.update('q2', {
      title: '수정된 제목',
      content: '수정된 내용',
    })
    expect(updated.title).toBe('수정된 제목')
  })

  it('빈 제목은 거부한다 (FR-006)', async () => {
    await expect(
      mockQuestionRepository.create(MEMBER_USER_ID, { title: '   ', content: '내용' }),
    ).rejects.toThrow(RepositoryError)
  })
})

describe('mockAnswerRepository', () => {
  it('답변 작성 시 질문 상태가 answered로 전환된다 (FR-015)', async () => {
    await mockAnswerRepository.create('q2', ADMIN_ID, '관리자', '답변 내용입니다')
    const question = await mockQuestionRepository.getById('q2')
    expect(question?.status).toBe('answered')
  })

  it('이미 답변된 질문에 재작성을 시도하면 차단한다', async () => {
    await expect(
      mockAnswerRepository.create('q1', ADMIN_ID, '관리자', '중복 답변'),
    ).rejects.toThrow(RepositoryError)
  })

  it('본인이 작성하지 않은 답변은 수정할 수 없다 (FR-018)', async () => {
    await expect(
      mockAnswerRepository.update('a1', 'admin-2', '다른 관리자 수정 시도'),
    ).rejects.toThrow(RepositoryError)
  })

  it('본인이 작성한 답변은 수정할 수 있다 (FR-017)', async () => {
    const updated = await mockAnswerRepository.update('a1', ADMIN_ID, '수정된 답변')
    expect(updated.content).toBe('수정된 답변')
  })
})
