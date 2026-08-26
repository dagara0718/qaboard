import type { Answer, Question } from '../../types/domain'

export type Role = 'guest' | 'member' | 'admin'

export interface Session {
  role: Role
  userId: string | null
  displayName: string | null
}

export type RepositoryErrorCode = 'UNAUTHORIZED' | 'VALIDATION' | 'NETWORK'

export class RepositoryError extends Error {
  code: RepositoryErrorCode
  constructor(code: RepositoryErrorCode, message: string) {
    super(message)
    this.code = code
  }
}

export interface QuestionRepository {
  listMine(userId: string): Promise<Question[]>
  listAll(): Promise<Question[]>
  getById(id: string): Promise<Question | null>
  create(userId: string, input: { title: string; content: string }): Promise<Question>
  update(id: string, input: { title: string; content: string }): Promise<Question>
  remove(id: string): Promise<void>
}

export interface AnswerRepository {
  getByQuestionId(questionId: string): Promise<Answer | null>
  create(questionId: string, adminId: string, adminName: string, content: string): Promise<Answer>
  update(id: string, adminId: string, content: string): Promise<Answer>
}
