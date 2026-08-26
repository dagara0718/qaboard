import { mockAnswerRepository, mockQuestionRepository } from './mockRepository'
import { supabaseAnswerRepository, supabaseQuestionRepository } from './supabaseRepository'

/** Supabase 환경변수가 설정되면 실제 백엔드로 전환한다 (plan.md Structure Decision). */
const useSupabase = Boolean(import.meta.env.VITE_SUPABASE_URL)

export const questionRepository = useSupabase ? supabaseQuestionRepository : mockQuestionRepository
export const answerRepository = useSupabase ? supabaseAnswerRepository : mockAnswerRepository
export const isSupabaseBackend = useSupabase
