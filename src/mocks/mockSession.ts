import type { Role, Session } from '../lib/dataAccess/types'
import { ADMIN_ID, MEMBER_USER_ID } from './mockData'

/** 프로토타입 전용: 실제 인증 없이 역할을 즉시 전환해 회원/관리자 뷰 차이를 시연한다 (design.md §6). */
export function sessionForRole(role: Role): Session {
  switch (role) {
    case 'member':
      return { role, userId: MEMBER_USER_ID, displayName: '홍길동' }
    case 'admin':
      return { role, userId: ADMIN_ID, displayName: '관리자' }
    default:
      return { role: 'guest', userId: null, displayName: null }
  }
}
