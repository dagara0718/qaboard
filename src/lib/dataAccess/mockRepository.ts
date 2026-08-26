import type { Answer, Question } from '../../types/domain'
import { initialAnswers, initialQuestions } from '../../mocks/mockData'
import { RepositoryError } from './types'
import type { AnswerRepository, QuestionRepository } from './types'

let questions: Question[] = [...initialQuestions]
let answers: Answer[] = [...initialAnswers]

function assertEditable(question: Question, userId: string) {
  if (question.userId !== userId) {
    throw new RepositoryError('UNAUTHORIZED', '본인이 작성한 질문만 수정/삭제할 수 있습니다.')
  }
  if (question.status === 'answered') {
    throw new RepositoryError('UNAUTHORIZED', '이미 답변된 질문은 수정할 수 없습니다.')
  }
}

function validateText(value: string, max: number, fieldName: string) {
  const trimmed = value.trim()
  if (trimmed.length === 0 || trimmed.length > max) {
    throw new RepositoryError('VALIDATION', `${fieldName}을(를) 확인해주세요 (1-${max}자).`)
  }
  return trimmed
}

export const mockQuestionRepository: QuestionRepository = {
  async listMine(userId) {
    return questions
      .filter((q) => q.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },
  async listAll() {
    return [...questions].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },
  async getById(id) {
    return questions.find((q) => q.id === id) ?? null
  },
  async create(userId, input) {
    const title = validateText(input.title, 100, '제목')
    const content = validateText(input.content, 5000, '내용')
    const now = new Date().toISOString()
    const question: Question = {
      id: `q-${crypto.randomUUID()}`,
      userId,
      title,
      content,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    }
    questions = [question, ...questions]
    return question
  },
  async update(id, userId, input) {
    const question = questions.find((q) => q.id === id)
    if (!question) throw new RepositoryError('NETWORK', '질문을 찾을 수 없습니다.')
    assertEditable(question, userId)
    const title = validateText(input.title, 100, '제목')
    const content = validateText(input.content, 5000, '내용')
    const updated: Question = { ...question, title, content, updatedAt: new Date().toISOString() }
    questions = questions.map((q) => (q.id === id ? updated : q))
    return updated
  },
  async remove(id, userId) {
    const question = questions.find((q) => q.id === id)
    if (!question) return
    assertEditable(question, userId)
    questions = questions.filter((q) => q.id !== id)
  },
}

export const mockAnswerRepository: AnswerRepository = {
  async getByQuestionId(questionId) {
    return answers.find((a) => a.questionId === questionId) ?? null
  },
  async create(questionId, adminId, adminName, content) {
    const question = questions.find((q) => q.id === questionId)
    if (!question) throw new RepositoryError('NETWORK', '질문을 찾을 수 없습니다.')
    if (question.status === 'answered') {
      throw new RepositoryError('UNAUTHORIZED', '이미 답변이 등록된 질문입니다.')
    }
    const text = validateText(content, 5000, '답변 내용')
    const now = new Date().toISOString()
    const answer: Answer = {
      id: `a-${crypto.randomUUID()}`,
      questionId,
      adminId,
      adminName,
      content: text,
      createdAt: now,
      updatedAt: now,
    }
    answers = [...answers, answer]
    questions = questions.map((q) =>
      q.id === questionId ? { ...q, status: 'answered', updatedAt: now } : q,
    )
    return answer
  },
  async update(id, adminId, content) {
    const answer = answers.find((a) => a.id === id)
    if (!answer) throw new RepositoryError('NETWORK', '답변을 찾을 수 없습니다.')
    if (answer.adminId !== adminId) {
      throw new RepositoryError('UNAUTHORIZED', '본인이 작성한 답변만 수정할 수 있습니다.')
    }
    const text = validateText(content, 5000, '답변 내용')
    const updated: Answer = { ...answer, content: text, updatedAt: new Date().toISOString() }
    answers = answers.map((a) => (a.id === id ? updated : a))
    return updated
  },
}

/** 테스트 전용: 모듈 레벨 mutable 상태를 초기값으로 되돌린다. */
export function __resetMockData() {
  questions = [...initialQuestions]
  answers = [...initialAnswers]
}
