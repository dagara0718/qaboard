export type QuestionStatus = 'pending' | 'answered'

export interface Question {
  id: string
  userId: string
  title: string
  content: string
  status: QuestionStatus
  createdAt: string
  updatedAt: string
  authorName?: string
}

export interface Answer {
  id: string
  questionId: string
  adminId: string
  adminName: string
  content: string
  createdAt: string
  updatedAt: string
}
