import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// dataAccess/index.ts가 환경변수 유무로 Mock/Supabase 구현체를 스위칭하는 동안에도
// 이 모듈은 항상 import되므로(정적 import), 값이 없을 때 여기서 throw하면 Mock 모드까지 깨진다.
// 미사용 시 안전한 placeholder로 대체하고, 실제 사용 여부는 dataAccess/index.ts의 스위치가 책임진다.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
)
