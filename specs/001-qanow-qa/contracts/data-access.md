# Data Access Contract: QANOW

Mock 구현체(Phase 1-4)와 Supabase 구현체(Phase 5+)가 공통으로 만족해야 하는 TypeScript 인터페이스 계약. 페이지/컴포넌트는 이 인터페이스만 참조하고 구현체를 직접 알지 못한다(plan.md Structure Decision 근거).

## SessionProvider

```ts
type Role = 'guest' | 'member' | 'admin'

interface Session {
  role: Role
  userId: string | null // guest면 null
  displayName: string | null
}

interface SessionProvider {
  getSession(): Session // 현재 세션 조회 (FR-004)
  onSessionChange(cb: (s: Session) => void): () => void // 구독 해제 함수 반환
}
```

- Mock 구현체: `mockSession.ts`가 고정 세션 값을 반환(프로토타입의 뷰 전환 셀렉터와 동일한 개념, design.md §6 참조).
- Supabase 구현체: `supabase.auth.getSession()` + `onAuthStateChange` 래핑, `profiles.role` 조회로 `Role` 결정.

## QuestionRepository

```ts
interface Question {
  id: string
  userId: string
  title: string
  content: string
  status: 'pending' | 'answered'
  createdAt: string
  updatedAt: string
  authorName?: string // 관리자 뷰에서만 채워짐 (FR-013)
}

interface QuestionRepository {
  listMine(): Promise<Question[]> // 회원: 본인 질문만 (FR-007, FR-021)
  listAll(): Promise<Question[]> // 관리자: 전체 (FR-013)
  getById(id: string): Promise<Question | null>
  create(input: { title: string; content: string }): Promise<Question> // FR-005
  update(id: string, input: { title: string; content: string }): Promise<Question> // FR-009, pending만 허용
  remove(id: string): Promise<void> // FR-010, pending만 허용
}
```

- 모든 메서드는 실패 시 `{ code: 'UNAUTHORIZED' | 'VALIDATION' | 'NETWORK', message: string }` 형태의 에러를 throw해 UI의 Unauthorized/Error 상태(design.md §14)와 1:1 매핑한다.
- `update`/`remove`는 `status === 'answered'`인 질문에 대해 호출 시 반드시 `UNAUTHORIZED`(또는 전용 `LOCKED`) 에러를 던진다 — Mock 구현체도 동일 규칙을 강제해 Phase 5 RLS 전환 전에 UI 차단 로직을 미리 검증할 수 있게 한다(FR-011).

## AnswerRepository

```ts
interface Answer {
  id: string
  questionId: string
  adminId: string
  adminName: string
  content: string
  createdAt: string
  updatedAt: string
}

interface AnswerRepository {
  getByQuestionId(id: string): Promise<Answer | null>
  create(questionId: string, content: string): Promise<Answer> // FR-015, admin만
  update(id: string, content: string): Promise<Answer> // FR-017, 작성 본인만
}
```

- `create`는 Mock/Supabase 구현체 모두 대상 질문이 이미 `answered` 상태면 에러를 던진다(질문당 답변 1개, data-model.md unique 제약과 대응).
- `update`는 호출자(admin_id)가 답변 작성자가 아니면 `UNAUTHORIZED`(FR-018).

## 상태 매핑 규칙 (UI 계약)

| Repository 결과               | UI 상태 (design.md §14)    |
| ----------------------------- | -------------------------- |
| Promise pending               | LoadingState (스켈레톤)    |
| 빈 배열(`listMine`/`listAll`) | EmptyState                 |
| `NETWORK` 에러                | ErrorState (재시도 버튼)   |
| `UNAUTHORIZED` 에러           | UnauthorizedToast          |
| `VALIDATION` 에러             | 폼 인라인 `.error-message` |

이 표는 컴포넌트가 Repository 에러 코드만 보고 어떤 상태 컴포넌트를 렌더링할지 결정하도록 강제해, Mock/Supabase 전환 시 화면 쪽 코드를 변경하지 않아도 되게 한다.
