import type { Answer, Question, QuestionStatus } from '../../types/domain'
import { supabase } from '../supabase/client'
import { RepositoryError } from './types'
import type { AnswerRepository, QuestionRepository } from './types'

interface QuestionRow {
  id: string
  user_id: string
  title: string
  content: string
  status: QuestionStatus
  created_at: string
  updated_at: string
  profiles?: { email: string } | null
}

interface AnswerRow {
  id: string
  question_id: string
  admin_id: string
  content: string
  created_at: string
  updated_at: string
}

function mapQuestion(row: QuestionRow): Question {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    content: row.content,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    authorName: row.profiles?.email,
  }
}

function mapAnswer(row: AnswerRow, adminName = '관리자'): Answer {
  return {
    id: row.id,
    questionId: row.question_id,
    adminId: row.admin_id,
    adminName,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function toRepositoryError(error: { code?: string; message: string }): RepositoryError {
  if (error.code === '23505') {
    return new RepositoryError('VALIDATION', '이미 처리된 요청입니다.')
  }
  if (error.code === '23514') {
    return new RepositoryError('VALIDATION', '입력값을 확인해주세요.')
  }
  if (error.code === '42501' || error.message?.includes('row-level security')) {
    return new RepositoryError('UNAUTHORIZED', '권한이 없거나 이미 처리된 요청입니다.')
  }
  return new RepositoryError('NETWORK', '요청을 처리하지 못했습니다.')
}

function validateText(value: string, max: number, fieldName: string) {
  const trimmed = value.trim()
  if (trimmed.length === 0 || trimmed.length > max) {
    throw new RepositoryError('VALIDATION', `${fieldName}을(를) 확인해주세요 (1-${max}자).`)
  }
  return trimmed
}

export const supabaseQuestionRepository: QuestionRepository = {
  async listMine(userId) {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw toRepositoryError(error)
    return (data ?? []).map((row) => mapQuestion(row as QuestionRow))
  },

  async listAll() {
    const { data, error } = await supabase
      .from('questions')
      .select('*, profiles(email)')
      .order('created_at', { ascending: false })
    if (error) throw toRepositoryError(error)
    return (data ?? []).map((row) => mapQuestion(row as unknown as QuestionRow))
  },

  async getById(id) {
    const { data, error } = await supabase.from('questions').select('*, profiles(email)').eq('id', id)
    if (error) throw toRepositoryError(error)
    if (!data || data.length === 0) return null
    return mapQuestion(data[0] as unknown as QuestionRow)
  },

  async create(userId, input) {
    const title = validateText(input.title, 100, '제목')
    const content = validateText(input.content, 5000, '내용')
    const { data, error } = await supabase
      .from('questions')
      .insert({ user_id: userId, title, content })
      .select()
    if (error) throw toRepositoryError(error)
    if (!data || data.length === 0) throw new RepositoryError('UNAUTHORIZED', '질문을 작성할 권한이 없습니다.')
    return mapQuestion(data[0] as QuestionRow)
  },

  async update(id, userId, input) {
    const title = validateText(input.title, 100, '제목')
    const content = validateText(input.content, 5000, '내용')
    const { data, error } = await supabase
      .from('questions')
      .update({ title, content })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
    if (error) throw toRepositoryError(error)
    if (!data || data.length === 0) {
      throw new RepositoryError('UNAUTHORIZED', '본인이 작성한 답변대기 질문만 수정할 수 있습니다.')
    }
    return mapQuestion(data[0] as QuestionRow)
  },

  async remove(id, userId) {
    const { data, error } = await supabase
      .from('questions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select()
    if (error) throw toRepositoryError(error)
    if (!data || data.length === 0) {
      throw new RepositoryError('UNAUTHORIZED', '본인이 작성한 답변대기 질문만 삭제할 수 있습니다.')
    }
  },
}

export const supabaseAnswerRepository: AnswerRepository = {
  async getByQuestionId(questionId) {
    const { data, error } = await supabase.from('answers').select('*').eq('question_id', questionId)
    if (error) throw toRepositoryError(error)
    if (!data || data.length === 0) return null
    return mapAnswer(data[0] as AnswerRow)
  },

  async create(questionId, adminId, adminName, content) {
    const { data: q, error: qErr } = await supabase
      .from('questions')
      .select('status')
      .eq('id', questionId)
    if (qErr) throw toRepositoryError(qErr)
    if (!q || q.length === 0) throw new RepositoryError('NETWORK', '질문을 찾을 수 없습니다.')
    if (q[0].status === 'answered') {
      throw new RepositoryError('UNAUTHORIZED', '이미 답변이 등록된 질문입니다.')
    }
    const text = validateText(content, 5000, '답변 내용')
    const { data, error } = await supabase
      .from('answers')
      .insert({ question_id: questionId, admin_id: adminId, content: text })
      .select()
    if (error) throw toRepositoryError(error)
    if (!data || data.length === 0) throw new RepositoryError('UNAUTHORIZED', '답변을 작성할 권한이 없습니다.')
    return mapAnswer(data[0] as AnswerRow, adminName)
  },

  async update(id, adminId, content) {
    const text = validateText(content, 5000, '답변 내용')
    const { data, error } = await supabase
      .from('answers')
      .update({ content: text })
      .eq('id', id)
      .eq('admin_id', adminId)
      .select()
    if (error) throw toRepositoryError(error)
    if (!data || data.length === 0) {
      throw new RepositoryError('UNAUTHORIZED', '본인이 작성한 답변만 수정할 수 있습니다.')
    }
    return mapAnswer(data[0] as AnswerRow)
  },
}
