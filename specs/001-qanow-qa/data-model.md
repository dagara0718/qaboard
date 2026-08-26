# Phase 1 Data Model: QANOW

spec.md `Key Entities` 섹션을 기준으로 하며, Phase 1-4는 TypeScript 타입(`src/types/domain.ts`)으로만 존재하고 Phase 5부터 Supabase Postgres 테이블로 구체화된다.

## User (Supabase: `profiles`, `auth.users`와 1:1)

| 필드       | 타입        | 규칙                                                | 근거                      |
| ---------- | ----------- | --------------------------------------------------- | ------------------------- |
| id         | uuid        | PK, `auth.users.id` 참조                            | FR-001                    |
| email      | text        | unique, not null                                    | FR-001 (이메일 중복 검사) |
| role       | text        | `'member' \| 'admin'`, not null, default `'member'` | Key Entities, FR-013      |
| created_at | timestamptz | not null, default now()                             | Key Entities              |

비밀번호는 Supabase Auth가 관리하므로 `profiles`에 별도 컬럼 없음(spec.md Assumptions: bcrypt 유사 해싱은 Supabase Auth 내부 처리로 위임).

## Question (Supabase: `questions`)

| 필드       | 타입        | 규칙                                                     | 근거           |
| ---------- | ----------- | -------------------------------------------------------- | -------------- |
| id         | uuid        | PK                                                       | Key Entities   |
| user_id    | uuid        | FK → profiles.id, not null                               | FR-005, FR-007 |
| title      | text        | 1-100자(trim 후), not null                               | FR-005         |
| content    | text        | 1-5000자(trim 후), not null                              | FR-005         |
| status     | text        | `'pending' \| 'answered'`, not null, default `'pending'` | FR-008         |
| created_at | timestamptz | not null, default now()                                  | Key Entities   |
| updated_at | timestamptz | not null, default now(), 수정 시 갱신                    | Key Entities   |

**State Transition**: `pending` → `answered`는 오직 Answer 생성 시에만 발생(FR-015). `answered` 상태에서는 title/content 수정 및 row 삭제가 애플리케이션과 RLS 양쪽에서 차단된다(FR-011, Constitution II).

**검증 규칙**: title/content는 trim 후 길이 검사(공백만 입력 시 무효, spec.md Edge Cases). 클라이언트(Mock 단계 `Input`/`Textarea` 컴포넌트)와 서버(Phase 5 Postgres CHECK 제약 또는 RLS 정책 조건)에서 이중 검증(Constitution III).

## Answer (Supabase: `answers`)

| 필드        | 타입        | 규칙                                                 | 근거           |
| ----------- | ----------- | ---------------------------------------------------- | -------------- |
| id          | uuid        | PK                                                   | Key Entities   |
| question_id | uuid        | FK → questions.id, unique(질문당 답변 1개), not null | FR-015         |
| admin_id    | uuid        | FK → profiles.id (role='admin'), not null            | FR-015, FR-018 |
| content     | text        | 1-5000자(trim 후), not null                          | FR-015         |
| created_at  | timestamptz | not null, default now()                              | Key Entities   |
| updated_at  | timestamptz | not null, default now(), 수정 시 갱신                | Key Entities   |

**동시성 규칙**: 동일 질문에 대해 여러 관리자가 동시에 답변 시도 시 먼저 저장된 것이 우선(낙관적 잠금, spec.md Assumptions) — `question_id` unique 제약으로 두 번째 insert가 자연스럽게 거부되도록 구현(Phase 5 세부 설계).

## 관계 요약

```
profiles (1) ── (N) questions        [questions.user_id]
profiles (1) ── (N) answers          [answers.admin_id, role=admin만]
questions (1) ── (0..1) answers      [answers.question_id, unique]
```

## 권한 매트릭스 (RLS 정책 설계 입력값, Phase 5에서 구체화)

| 동작             | 게스트 | 회원(본인)            | 회원(타인) | 관리자                                 |
| ---------------- | ------ | --------------------- | ---------- | -------------------------------------- |
| questions SELECT | 불가   | 본인 것만             | 불가       | 전체                                   |
| questions INSERT | 불가   | 가능                  | -          | 불가 (spec.md 관리자는 질문 작성 불가) |
| questions UPDATE | 불가   | status=pending일 때만 | 불가       | 불가                                   |
| questions DELETE | 불가   | status=pending일 때만 | 불가       | 불가                                   |
| answers INSERT   | 불가   | 불가                  | 불가       | 가능 (해당 question이 pending일 때만)  |
| answers UPDATE   | 불가   | 불가                  | 불가       | 본인이 작성한 답변만(FR-018)           |

이 표는 FR-007, FR-009~~FR-012, FR-015~~FR-018, FR-021을 그대로 옮긴 것이며 Phase 5 RLS 정책(Task 단위) 작성 시 1:1로 대응한다.
