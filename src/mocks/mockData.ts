import type { Answer, Question } from '../types/domain'

export const MEMBER_USER_ID = 'user-1'
export const OTHER_USER_ID = 'user-2'
export const ADMIN_ID = 'admin-1'

export const initialQuestions: Question[] = [
  {
    id: 'q1',
    userId: MEMBER_USER_ID,
    title: 'QANOW 가입 후 언제 답변을 받을 수 있나요?',
    content: '궁금한데 회원가입하고 얼마나 빨리 답변을 받을 수 있을지 궁금합니다.',
    status: 'answered',
    createdAt: '2026-08-20T00:00:00.000Z',
    updatedAt: '2026-08-20T00:00:00.000Z',
    authorName: '홍길동',
  },
  {
    id: 'q2',
    userId: MEMBER_USER_ID,
    title: '프로필 사진 변경은 어떻게 하나요?',
    content: '마이페이지에서 프로필 사진을 바꾸고 싶은데 어떤 메뉴에서 변경할 수 있나요?',
    status: 'pending',
    createdAt: '2026-08-21T00:00:00.000Z',
    updatedAt: '2026-08-21T00:00:00.000Z',
    authorName: '홍길동',
  },
  {
    id: 'q3',
    userId: OTHER_USER_ID,
    title: '비밀번호를 잊어버렸습니다',
    content: '비밀번호 재설정 방법을 알려주세요.',
    status: 'answered',
    createdAt: '2026-08-19T00:00:00.000Z',
    updatedAt: '2026-08-19T00:00:00.000Z',
    authorName: '이영희',
  },
]

export const initialAnswers: Answer[] = [
  {
    id: 'a1',
    questionId: 'q1',
    adminId: ADMIN_ID,
    adminName: '관리자',
    content:
      '안녕하세요. QANOW 관리자입니다. 대부분 24시간 이내에 답변하고 있으며, 복잡한 문제는 조금 더 걸릴 수 있습니다. 기다려 주셔서 감사합니다!',
    createdAt: '2026-08-20T02:00:00.000Z',
    updatedAt: '2026-08-20T02:00:00.000Z',
  },
  {
    id: 'a3',
    questionId: 'q3',
    adminId: ADMIN_ID,
    adminName: '관리자',
    content:
      '로그인 화면의 "비밀번호를 잊으셨나요?" 링크를 눌러 이메일로 재설정 링크를 받으실 수 있습니다.',
    createdAt: '2026-08-19T03:00:00.000Z',
    updatedAt: '2026-08-19T03:00:00.000Z',
  },
]
