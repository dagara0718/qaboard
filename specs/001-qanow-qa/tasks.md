# Tasks: QANOW 질의응답 게시판

**Input**: `specs/001-qanow-qa/spec.md`, `design.md`, `plan.md`, `research.md`, `data-model.md`, `contracts/data-access.md`, `quickstart.md`
**Prerequisites**: plan.md ✅, spec.md ✅, design.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Organization**: 사용자가 지정한 8-Phase 구조(설정 → 디자인 시스템 → Mock 화면 → design-sync 검증 → Supabase → 회원 기능 → 관리자 기능 → 최종 검증)를 그대로 사용한다. Phase 6/7의 개별 Task는 spec.md 사용자 스토리(US1~US8)에 `[USn]` 라벨로 매핑한다. Phase 1/2/4/5/8은 특정 스토리에 속하지 않는 공용 인프라이므로 라벨을 생략한다.

**Tests**: 명세에 테스트가 명시적으로 요구됨(Constitution XIII, spec.md 없음 별도 요청) — 단위/통합 테스트 Task 포함.

## Format: `[ID] [P?] [Story?] Description — file path`

각 Task 하위에 **관련 요구사항 / design.md 섹션 / 검증 방법**을 명시한다.

---

## Phase 1: 프로젝트 설정

**Purpose**: React + Vite + TypeScript 스캐폴딩, lint/test/build 파이프라인 구축

- [X] T001 Vite React-TS 프로젝트 생성, plan.md Project Structure대로 `src/`, `tests/` 디렉터리 골격 생성 — `package.json`, `vite.config.ts`, `tsconfig.json`
  - 관련 요구사항: Constitution XI(MVP 단순성)
  - design.md: §(N/A, 인프라)
  - 검증: `npm run dev`로 빈 화면이 로컬에서 뜨는지 확인
- [X] T002 [P] 런타임/개발 의존성 설치 (`react-router-dom`, `@supabase/supabase-js`는 타입 참조용으로만 우선 설치) — `package.json`
  - 관련 요구사항: plan.md Technical Context
  - design.md: N/A
  - 검증: `npm ls`로 의존성 트리 확인, 버전 충돌 없음
- [X] T003 [P] ESLint + Prettier 설정 — `.eslintrc.cjs`, `.prettierrc`
  - 관련 요구사항: Constitution XIII
  - design.md: N/A
  - 검증: `npm run lint` 통과 (스캐폴딩 코드 기준)
- [X] T004 [P] Vitest + React Testing Library 설정 — `vitest.config.ts`, `tests/setup.ts`
  - 관련 요구사항: Constitution XIII
  - design.md: N/A
  - 검증: 더미 테스트 1개 작성 후 `npm run test` 통과
- [X] T005 npm scripts(`dev`/`build`/`lint`/`test`) 정리 및 CI 대비 확인 — `package.json`
  - 관련 요구사항: Constitution XIII (PR은 CI 통과 필수)
  - design.md: N/A
  - 검증: `npm run lint && npm run test && npm run build` 3종 연속 성공

**Checkpoint**: 빈 프로젝트가 lint/test/build 전부 통과 — Phase 2 착수 가능.

---

## Phase 2: 디자인 시스템 기반

**Purpose**: design.md 공통 규칙(토큰/타이포/헤더/버튼/입력/배지/상태)을 재사용 컴포넌트로 선구현 — 세 화면 모두가 이 컴포넌트를 참조

**🚧 이 Phase 완료 전에는 Phase 3의 화면 구현을 시작하지 않는다 (공용 컴포넌트 부재 시 화면마다 스타일이 갈라짐, Constitution V 위반 위험)**

- [X] T006 [P] 디자인 토큰 CSS 변수 선언 — `src/styles/tokens.css`
  - 관련 요구사항: Constitution V, CHK018/CHK019 해소
  - design.md: §15 (디자인 토�큰)
  - 검증: 컴포넌트에서 하드코딩 색상 없이 `var(--navy)` 등만 참조하는지 grep 확인
- [X] T007 [P] 전역 리셋/기본 스타일 — `src/styles/global.css`
  - 관련 요구사항: 없음(기반 스타일)
  - design.md: §16 (폰트 스택)
  - 검증: 브라우저 기본 마진/패딩이 제거됐는지 시각 확인
- [X] T008 [P] 타이포그래피 계층 유틸(H1/H2/Body/Small 클래스 또는 CSS 변수) — `src/styles/typography.css`
  - 관련 요구사항: SC-009 (대비 4.5:1)
  - design.md: §16
  - 검증: 각 클래스 렌더링 후 폰트 크기/weight가 §16 표와 일치하는지 스냅샷 확인
- [X] T009 [P] Button 컴포넌트(Primary/Secondary/Danger, min-height 44px) — `src/components/ui/Button.tsx`
  - 관련 요구사항: FR-031
  - design.md: §19
  - 검증: RTL로 렌더링 후 `getBoundingClientRect().height >= 44` 단위 테스트
- [X] T010 [P] Input 컴포넌트(focus ring, error 상태) — `src/components/ui/Input.tsx`
  - 관련 요구사항: FR-006, Constitution VIII(포커스 표시)
  - design.md: §19
  - 검증: `aria-invalid`/focus 스타일 렌더 테스트
- [X] T011 [P] Textarea 컴포넌트(글자수 카운터, 80% 경고) — `src/components/ui/Textarea.tsx`
  - 관련 요구사항: FR-005, FR-006
  - design.md: §12, §19
  - 검증: maxLength 초과 입력 시 카운터 warn 클래스 적용 테스트
- [X] T012 [P] Badge 컴포넌트(기호+텍스트+색상 병행 강제) — `src/components/ui/Badge.tsx`
  - 관련 요구사항: Constitution IX, FR-008
  - design.md: §13, §17
  - 검증: 컴포넌트 API가 `label` prop 없이는 렌더링 불가하도록 타입 강제(색상만 전달 불가 검증 테스트)
- [X] T013 [P] HeaderMain 컴포넌트(게스트/회원/관리자 분기) — `src/components/layout/HeaderMain.tsx`
  - 관련 요구사항: FR-029
  - design.md: §7, §9
  - 검증: `role` prop 3종 각각 렌더링 스냅샷 테스트
- [X] T014 [P] HeaderInternal 컴포넌트(리스트/상세 공용, 뒤로가기) — `src/components/layout/HeaderInternal.tsx`
  - 관련 요구사항: design-brief §6 페이지 이동 구조
  - design.md: §7, §8
  - 검증: 뒤로가기 버튼 클릭 시 `onBack` 콜백 호출 테스트
- [X] T015 [P] LoadingState(스켈레톤) 컴포넌트 — `src/components/states/LoadingState.tsx`
  - 관련 요구사항: FR-023, FR-024
  - design.md: §14
  - 검증: `prefers-reduced-motion` 모킹 시 shimmer 애니메이션 미적용 테스트
- [X] T016 [P] EmptyState 컴포넌트(역할별 메시지, CTA 없음) — `src/components/states/EmptyState.tsx`
  - 관련 요구사항: spec.md Edge Cases, FR-023
  - design.md: §14
  - 검증: `role` prop에 따라 문구가 "작성한 질문이 없습니다"/"질문이 없습니다"로 분기되는지 테스트
- [X] T017 [P] ErrorState 컴포넌트(재시도 버튼) — `src/components/states/ErrorState.tsx`
  - 관련 요구사항: FR-025
  - design.md: §14
  - 검증: 재시도 버튼 클릭 시 `onRetry` 콜백 호출 테스트
- [X] T018 [P] UnauthorizedToast 컴포넌트 — `src/components/states/UnauthorizedToast.tsx`
  - 관련 요구사항: FR-026, Edge Cases
  - design.md: §14 (CHK009/CHK025 해소)
  - 검증: 메시지 종류별(`권한이 없습니다` / `이미 답변된 질문은 수정할 수 없습니다`) 렌더 테스트
- [X] T019 [P] 위 컴포넌트 전체 단위 테스트 정리 — `tests/unit/ui/*.test.tsx`, `tests/unit/states/*.test.tsx`
  - 관련 요구사항: Constitution XIII
  - design.md: N/A
  - 검증: `npm run test` 커버리지 리포트에서 신규 컴포넌트 라인 커버리지 확인

**Checkpoint**: 공용 컴포넌트/토큰이 모두 렌더링·테스트 통과 — Phase 3 착수 가능.

---

## Phase 3: 세 핵심 화면과 Mock Data

**Purpose**: Mock Data/Mock Session으로 메인/리스트/상세 3화면을 완성해 `/design-sync` 검증 대상 산출물을 만든다.

### 데이터/세션 기반 (화면 구현 선행)

- [X] T020 [P] 도메인 타입 정의 — `src/types/domain.ts`
  - 관련 요구사항: spec.md Key Entities
  - design.md: N/A (data-model.md 기준)
  - 검증: `tsc --noEmit` 통과
- [X] T021 [P] Repository/SessionProvider 인터페이스 정의 — `src/lib/dataAccess/types.ts`
  - 관련 요구사항: FR-007, FR-013, FR-021
  - design.md: N/A (contracts/data-access.md 기준)
  - 검증: 타입 컴파일 성공, Mock/Supabase 구현체가 동일 인터페이스를 만족하는지 타입 체크
- [X] T022 Mock 질문/답변 데이터 작성(대기/완료 각 2건 이상) — `src/mocks/mockData.ts`
  - 관련 요구사항: FR-007, FR-013
  - design.md: §11 (카드 예시), §13 (질문/답변 예시)
  - 검증: 데이터 로드 후 상태별 개수 콘솔 확인
- [X] T023 Mock 세션(게스트/회원/관리자 전환) 구현 — `src/mocks/mockSession.ts`
  - 관련 요구사항: FR-029, design.md §6
  - design.md: §6
  - 검증: 세션 전환 시 `getSession().role` 값 변경 확인 단위 테스트
- [X] T024 MockRepository 구현(답변완료 질문 수정/삭제 시 에러, FR-011 강제) — `src/lib/dataAccess/mockRepository.ts`
  - 관련 요구사항: FR-009, FR-010, FR-011, FR-015~018
  - design.md: contracts/data-access.md
  - 검증: `status='answered'`인 질문에 `update`/`remove` 호출 시 에러 throw 단위 테스트

### 메인 페이지 (US1)

- [X] T025 [US1] MainPage 구현(Hero/CTA 2종/Flow 3단계/배지 쇼케이스/Footer) — `src/pages/MainPage.tsx`
  - 관련 요구사항: FR-027, FR-028, FR-029
  - design.md: §9, §11(배지), §7(헤더 상태)
  - 검증: RTL로 "질문 작성하기"/"내 질문 확인하기" 버튼 존재 및 클릭 시 라우팅 확인
- [X] T026 [US1] Aurora Gradient + Floating Card 애니메이션 CSS, `prefers-reduced-motion` 대응 — `src/pages/MainPage.css`
  - 관련 요구사항: SC-008, Constitution VI/VII
  - design.md: §10, §22
  - 검증: `matchMedia('(prefers-reduced-motion: reduce)')` 모킹 후 애니메이션 `none` 적용 테스트

### 질문 리스트 페이지 (US4, US7 일부)

- [X] T027 [US4][US7] QuestionListPage 구현(회원/관리자 뷰 분기, 탭 필터, 작성 버튼 표시 조건) — `src/pages/QuestionListPage.tsx`
  - 관련 요구사항: FR-007, FR-008, FR-013, FR-014
  - design.md: §11
  - 검증: role별 페이지 타이틀·작성자 컬럼·작성 버튼 노출 여부 스냅샷 테스트
- [X] T028 [US4] Loading/Empty/Error 상태 QuestionListPage에 연결 — `src/pages/QuestionListPage.tsx`
  - 관련 요구사항: FR-023~025
  - design.md: §14
  - 검증: Repository Promise 지연/빈 배열/에러 각각 모킹 후 해당 상태 컴포넌트 렌더 확인

### 질문 페이지 (US3, US5, US6, US7, US8 — Mock 기준)

- [X] T029 [US5] QuestionDetailPage 조회 모드(답변대기/답변완료) — `src/pages/QuestionDetailPage.tsx`
  - 관련 요구사항: FR-008, FR-011
  - design.md: §13
  - 검증: 답변완료 상태에서 수정/삭제 버튼이 DOM에 렌더되지 않는지(존재하지 않음, hidden 아님) 확인
  - 구현 시 보강: `/speckit-analyze` G2 지적사항(Detail 화면 Loading/Error 상태 누락) 해소 — LoadingState/ErrorState를 QuestionDetailPage에도 연결함
- [X] T030 [US3] 질문 작성/수정 폼 모드(글자수, 오류 메시지) — `src/pages/QuestionDetailPage.tsx`
  - 관련 요구사항: FR-005, FR-006
  - design.md: §12
  - 검증: 빈 제목 제출 시 오류 메시지 노출, 100/5000자 초과 입력 차단 테스트
- [X] T031 [US6] 수정/삭제 액션(답변 대기 + 본인 질문일 때만, 삭제 confirm) — `src/pages/QuestionDetailPage.tsx`
  - 관련 요구사항: FR-009, FR-010, spec.md User Story 6
  - design.md: §13
  - 검증: confirm 취소 시 삭제 미실행, 확인 시 목록으로 리다이렉트 테스트
- [X] T032 [US7] 관리자 답변 작성 폼(글자수, 오류 메시지) — `src/pages/QuestionDetailPage.tsx`
  - 관련 요구사항: FR-015, FR-016
  - design.md: §13
  - 검증: 빈 답변 제출 차단, 저장 시 질문 상태 `answered`로 전환 테스트
- [X] T033 [US8] 관리자 답변 수정 폼 — `src/pages/QuestionDetailPage.tsx`
  - 관련 요구사항: FR-017, FR-018
  - design.md: §13
  - 검증: 본인 작성 답변만 수정 가능(Mock에서 `adminId` 불일치 시 에러) 테스트

### 라우팅 및 반응형/접근성 공통 패스

- [X] T034 App 라우팅 구성(`/`, `/questions`, `/questions/:id`) — `src/App.tsx`, `src/main.tsx`
  - 관련 요구사항: design-brief §9 페이지 이동 구조
  - design.md: §5
  - 검증: 각 경로 직접 접근 시 대응 페이지 렌더 확인
- [ ] T035 [P] 데스크톱(1440px)/모바일(390px) 반응형 점검 및 수정 — 3개 페이지 CSS 전반
  - 관련 요구사항: FR-030, FR-031, SC-004
  - design.md: §20
  - 검증: Chrome DevTools 390px/1440px에서 버튼 44px 이상, 레이아웃 깨짐 없음 육안+자동(테스트 유틸) 확인
  - 진행 상태: CSS 미디어쿼리(`@media (max-width: 768px)`) 코드 구현 완료, `npm run build` 통과. **브라우저 실측(DevTools 390px/1440px) 미실시** — 이 세션에 브라우저 자동화 도구 연결 안 됨. 다음 세션에서 claude-in-chrome 등으로 시각 확인 필요
- [ ] T036 [P] `prefers-reduced-motion` 전체 점검(Aurora/Floating Card/Skeleton) — 관련 CSS 전반
  - 관련 요구사항: Constitution VII
  - design.md: §22
  - 검증: OS 설정 "동작 줄이기" 활성화 후 3개 화면 모두 애니메이션 정지 확인
  - 진행 상태: `prefers-reduced-motion` 규칙 3개 CSS 파일(global.css/MainPage.css/States.css)에 구현, 빌드 산출물에서 3회 출현 확인. **OS 설정 실측(육안 확인) 미실시** — 코드 검토로만 확인됨
- [X] T037 세 화면 렌더링/상태 전환 통합 테스트 — `tests/integration/pages/*.test.tsx`
  - 관련 요구사항: Constitution XIII
  - design.md: N/A
  - 검증: `npm run test` 전체 통과, `npm run build` 성공
  - 결과: `npm run lint && npm run test && npm run build` 3종 모두 통과 (테스트 15개, 3개 파일). `/speckit-analyze` G1(회원 답변작성 차단 검증 누락) 지적사항을 `tests/integration/QuestionDetailPage.test.tsx`의 "회원 화면에는 답변 작성 폼이 노출되지 않는다" 테스트로 해소

**Checkpoint — Phase 3 완료 기준**: 세 화면이 Mock Data/Mock Session만으로 완전히 동작하고 `npm run lint && npm run test && npm run build` 통과. **이 체크포인트를 통과해야 Phase 4를 시작한다.**

---

## Phase 4: Claude Design 동기화와 UI 수정

**Purpose**: 로컬 구현을 Claude Design 확정본(`QANOW_Main.html`, `QANOW_List.html`, `QANOW_Detail.html`)과 비교해 시각 불일치를 제거한다.

**⛔ GATE: Phase 3 체크포인트 통과 전에는 시작하지 않는다. 이 Phase의 T041(회귀 재검증) 통과 전에는 Phase 5를 시작하지 않는다.**

- [X] T038 `/design-sync` 실행 전 코드 구조 검사(토큰/컴포넌트가 design.md §6-19 규칙과 1:1 대응하는지 셀프 점검) — `src/styles/`, `src/components/`
  - 관련 요구사항: Constitution V
  - design.md: §6-19 전체
  - 검증: 체크리스트 형태로 각 규칙-컴포넌트 매핑표 작성, 누락 항목 없음 확인
  - 결과: tokens.css/typography.css/Button/Input/Textarea/Badge/HeaderMain/HeaderInternal가 design.md §15-19 값과 1:1 대응 확인(border-radius, box-shadow, backdrop-filter 등 grep으로 재확인)
- [ ] T039 `/design-sync` 실행 — 프로젝트 전체
  - 관련 요구사항: 사용자 지정 프로세스 순서
  - design.md: 전체 (Claude Design 확정본 대비)
  - 검증: `/design-sync` 리포트에서 심각도별(CRITICAL/HIGH/MEDIUM/LOW) 이슈 목록 확보
  - **미완료 사유**: 이 세션에 `/design-sync` 스킬이 등록되어 있지 않고, 연결된 `DesignSync` MCP 도구는 "디자인 시스템(컴포넌트 라이브러리)" 유형 프로젝트 동기화 전용이라 QANOW 목업 프로젝트(일반 프로젝트)에는 적용 불가. **대신 확정 HTML(`QANOW_Main/List/Detail.html`)과 구현 코드를 수동으로 대조**했으며(색상/반경/그림자/backdrop-filter/배지 기호 등), CRITICAL/HIGH 수준 불일치는 발견되지 않음. 단, 이는 공식 `/design-sync` 게이트를 대체하지 않음 — 실제 도구 사용 가능해지면 재검증 필요
- [ ] T040 CRITICAL·HIGH 시각 문제 수정 — 해당 페이지/컴포넌트 파일(리포트 기준)
  - 관련 요구사항: `/design-sync` 리포트 항목별 매핑
  - design.md: 리포트가 지목한 섹션
  - 검증: 수정 후 스크린샷 diff 육안 확인
  - **미완료 사유**: T039의 공식 리포트가 없어 수정 대상 확정 불가. 수동 비교에서는 발견된 CRITICAL/HIGH 없음(N/A일 가능성 높으나 공식 검증 아님)
- [ ] T041 디자인 회귀 검증 — `/design-sync` 재실행
  - 관련 요구사항: 동일
  - design.md: 동일
  - 검증: 신규 CRITICAL/HIGH 없음 확인 — **이 항목 통과가 Phase 5 시작 조건**
  - **미완료 사유**: T039와 동일 — 공식 도구 미가용으로 이 게이트를 통과 처리할 수 없음

**Checkpoint**: T041이 formal하게 통과되지 않았으므로 **Phase 5(Supabase) 관련 Task는 착수하지 않았다.** `/design-sync`를 실제로 실행할 수 있는 환경(스킬 활성화 또는 별도 승인)이 확보되면 T039-T041을 완료하고 재개할 것.

---

## Phase 5: Supabase 기반

**Purpose**: 커스텀 백엔드 없이 Supabase(Auth+Postgres+RLS)를 데이터 계층 권한 강제 지점으로 연동한다.

**⛔ GATE: Phase 4 T041 완료 전에는 시작하지 않는다 (사용자 지정 순서).**

- [X] T042 Supabase 클라이언트 초기화, 환경변수 템플릿 — `src/lib/supabase/client.ts`, `.env.local.example`
  - 관련 요구사항: plan.md Technical Context
  - design.md: N/A
  - 검증: 클라이언트 인스턴스 생성 시 에러 없음(연결 자체는 실 프로젝트 필요)
  - 결과: 실 프로젝트(qaboard, ref dtmjjfbhzscbtubsekcu) 연결 완료, `.env.local` + Vercel 대시보드에 `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` 등록, `npm run build` 통과
- [X] T043 [P] `profiles` 테이블 마이그레이션 — `supabase/migrations/20260826100000_profiles.sql`
  - 관련 요구사항: FR-001, Key Entities
  - design.md: N/A (data-model.md 기준)
  - 검증: 마이그레이션 적용 후 스키마 조회로 컬럼/제약 확인
  - 결과: Supabase SQL Editor에서 실행 완료(Success, no rows returned), Table Editor에서 `profiles` 테이블 존재 확인. auth.users 트리거로 자동 생성
- [X] T044 [P] `questions` 테이블 마이그레이션 — `supabase/migrations/20260826100200_questions.sql`
  - 관련 요구사항: FR-005, FR-008
  - design.md: N/A
  - 검증: title/content 길이 CHECK 제약, status enum 제약 확인
  - 결과: 실 프로젝트에 테이블 생성 확인(Table Editor). CHECK 제약(1-100/1-5000자, trim), status enum 포함
- [X] T045 [P] `answers` 테이블 마이그레이션(question_id unique) — `supabase/migrations/20260826100300_answers.sql`
  - 관련 요구사항: FR-015, spec.md Assumptions(동시성 제어)
  - design.md: N/A
  - 검증: 동일 question_id 두 번째 insert 시 unique violation 확인
  - 결과: 테이블 생성 확인. `question_id unique` 제약 + 답변 insert 시 질문 상태를 `answered`로 전환하는 트리거(`mark_question_answered`) 포함. 실제 unique violation 테스트는 T053(수동 QA)에서 수행
- [X] T046 RLS 정책: `questions` SELECT(본인만/관리자 전체) — `supabase/migrations/20260826100400_rls_questions_select.sql`
  - 관련 요구사항: FR-007, FR-013, FR-021, Constitution II
  - design.md: data-model.md 권한 매트릭스
  - 검증: 회원 A 세션으로 회원 B 질문 SELECT 시 결과 0건 확인
  - 결과: 정책 적용 완료(SQL 실행 성공). 실 세션 기준 교차 검증은 T053에서 수행
- [X] T047 RLS 정책: `questions` INSERT/UPDATE/DELETE(pending-lock, 본인만) — `supabase/migrations/20260826100500_rls_questions_write.sql`
  - 관련 요구사항: FR-009, FR-010, FR-011, FR-012
  - design.md: 동일
  - 검증: `answered` 상태 질문 UPDATE 시도 시 정책 위반 에러 확인
  - 결과: 정책 적용 완료. 실제 위반 시도 검증은 T053에서 수행
- [X] T048 RLS 정책: `answers` INSERT(관리자만, pending 질문만)/UPDATE(작성 본인만) — `supabase/migrations/20260826100600_rls_answers.sql`
  - 관련 요구사항: FR-015, FR-017, FR-018
  - design.md: 동일
  - 검증: 관리자 B가 관리자 A의 답변 UPDATE 시도 시 차단 확인
  - 결과: 정책 적용 완료. 실제 차단 검증은 T053에서 수행
- [X] T049 관리자 역할 판별 함수/정책(`profiles.role='admin'` 기준) — `supabase/migrations/20260826100100_admin_role.sql`
  - 관련 요구사항: Key Entities, FR-013
  - design.md: N/A
  - 검증: role='member' 세션으로 관리자 전용 정책 접근 시 차단 확인
  - 결과: `is_admin()` security definer 함수로 profiles 자기참조 재귀 회피, questions/answers RLS 전체가 이 함수 사용. 실 세션 검증은 T053에서 수행
- [ ] T050 SupabaseRepository 구현(QuestionRepository/AnswerRepository) — `src/lib/dataAccess/supabaseRepository.ts`
  - 관련 요구사항: contracts/data-access.md
  - design.md: N/A
  - 검증: MockRepository와 동일 인터페이스 타입 체크(`satisfies` 또는 타입 단언) 통과
- [ ] T051 SupabaseSessionProvider 구현(`supabase.auth` 래핑) — `src/lib/supabase/sessionProvider.ts`
  - 관련 요구사항: FR-002, FR-004
  - design.md: §6
  - 검증: 로그인/로그아웃 시 `getSession()` 값 변화 확인
- [ ] T052 Mock→Supabase 구현체 스위치 배선(환경변수/DI) — `src/lib/dataAccess/index.ts`
  - 관련 요구사항: plan.md Structure Decision
  - design.md: N/A
  - 검증: 페이지 코드 변경 없이 구현체만 교체되는지 확인(페이지 import 경로 불변)
- [ ] T053 quickstart.md §3 Supabase 시나리오 수동 검증 — 없음(수동 QA)
  - 관련 요구사항: SC-005, SC-006
  - design.md: N/A
  - 검증: quickstart.md 체크리스트 전항목 통과

**Checkpoint**: Supabase 연동 완료, RLS 정책이 data-model.md 권한 매트릭스와 1:1 일치 — Phase 6/7 착수 가능.

---

## Phase 6: 회원 기능

- [ ] T054 [US2] 회원가입 폼(이메일 중복 검사 연동) — `src/pages/SignupPage.tsx`
  - 관련 요구사항: FR-001
  - design.md: design-brief §9(범위 외 화면이나 라우팅은 필요) — 상세 디자인은 spec 범위 밖
  - 검증: 중복 이메일 가입 시도 시 에러 메시지 확인
- [ ] T055 [US2] 로그인/로그아웃 Supabase Auth 연동 — `src/pages/LoginPage.tsx`, `HeaderMain.tsx`/`HeaderInternal.tsx` 연결
  - 관련 요구사항: FR-002, FR-004
  - design.md: §7
  - 검증: 로그인 성공 시 세션 상태 반영, 로그아웃 시 게스트 상태 복귀 확인
- [ ] T056 [US2] 보호 라우트 가드(비로그인 시 로그인 페이지 리다이렉트) — `src/App.tsx` 라우팅 가드
  - 관련 요구사항: FR-003, FR-022
  - design.md: Edge Cases
  - 검증: 비로그인 상태로 `/questions`, `/questions/:id?mode=new` 접근 시 리다이렉트 확인
- [ ] T057 [US4] QuestionListPage(회원)를 `supabaseRepository.listMine`에 연결 — `src/pages/QuestionListPage.tsx`
  - 관련 요구사항: FR-007, FR-021
  - design.md: §11
  - 검증: 로그인 계정 전환 시 목록이 해당 계정 질문으로만 바뀌는지 확인
- [ ] T058 [US3] 질문 작성 폼을 `supabaseRepository.create`에 연결, 서버 검증 에러 표면화 — `src/pages/QuestionDetailPage.tsx`
  - 관련 요구사항: FR-005, FR-006
  - design.md: §12
  - 검증: 클라이언트 우회(개발자도구로 maxlength 제거) 후에도 서버가 5000자 초과를 거부하는지 확인
- [ ] T059 [US6] 수정/삭제를 `supabaseRepository.update/remove`에 연결(잠금 로직 종단 확인) — `src/pages/QuestionDetailPage.tsx`
  - 관련 요구사항: FR-009, FR-010, FR-011
  - design.md: §13
  - 검증: 답변 완료 후 API 직접 호출로 수정 시도해도 RLS가 차단하는지 확인
- [ ] T060 [US5] 상세 조회+답변 표시를 실제 데이터에 연결 — `src/pages/QuestionDetailPage.tsx`
  - 관련 요구사항: spec.md User Story 5
  - design.md: §13
  - 검증: 답변 등록 후 새로고침 시 답변 섹션이 즉시 반영되는지 확인
- [ ] T061 통합 테스트: 타 회원 질문 수정/삭제 차단(SC-005), 답변완료 질문 수정 차단(SC-006) — `tests/integration/permissions.member.test.ts`
  - 관련 요구사항: FR-011, FR-012, SC-005, SC-006
  - design.md: N/A
  - 검증: 두 테스트 모두 통과, 실패 시 Toast 메시지 텍스트까지 검증

**Checkpoint**: 회원 전체 시나리오(spec.md User Story 2,3,4,5,6)가 실제 Supabase 데이터로 동작.

---

## Phase 7: 관리자 기능

- [ ] T062 [US7] QuestionListPage(관리자)를 `listAll` + 작성자 표시에 연결 — `src/pages/QuestionListPage.tsx`
  - 관련 요구사항: FR-013, FR-014
  - design.md: §11
  - 검증: 관리자 계정 로그인 시 전체 질문 + 작성자명 노출 확인
- [ ] T063 [US7] 관리자 답변 작성 폼을 `answerRepository.create`에 연결, 저장 시 질문 상태 전환 — `src/pages/QuestionDetailPage.tsx`
  - 관련 요구사항: FR-015, FR-016
  - design.md: §13
  - 검증: 답변 저장 직후 회원 화면에서 상태가 "답변됨"으로 보이는지 확인
- [ ] T064 [US8] 관리자 답변 수정 폼을 `answerRepository.update`에 연결(본인 답변만) — `src/pages/QuestionDetailPage.tsx`
  - 관련 요구사항: FR-017, FR-018
  - design.md: §13
  - 검증: 다른 관리자 계정으로 수정 시도 시 차단 확인
- [ ] T065 통합 테스트: 다른 관리자의 답변 수정 차단(FR-018), 관리자 질문 작성 불가(FR-013 반대 검증) — `tests/integration/permissions.admin.test.ts`
  - 관련 요구사항: FR-013, FR-018
  - design.md: N/A
  - 검증: 두 테스트 모두 통과

**Checkpoint**: 관리자 전체 시나리오(spec.md User Story 7,8)가 실제 Supabase 데이터로 동작 — 전체 기능 완성.

---

## Phase 8: 테스트와 최종 검증

- [ ] T066 전체 테스트 스위트 + 커버리지 리포트 — 전체 `tests/`
  - 관련 요구사항: Constitution XIII (80% 커버리지)
  - design.md: N/A
  - 검증: `npm run test -- --coverage` 리포트 확인
- [ ] T067 Lighthouse 성능 감사(메인 페이지) — 없음(도구 실행)
  - 관련 요구사항: SC-008, Constitution VI
  - design.md: §10 (Aurora/Floating Card 성능)
  - 검증: Lighthouse 성능 점수 80 이상, 3G 시뮬레이션 FCP 3초 이내
- [ ] T068 접근성 감사(대비/키보드/색상 단독 전달 여부) — axe 또는 동급 도구
  - 관련 요구사항: SC-009, Constitution VIII, Constitution IX
  - design.md: §21
  - 검증: axe 리포트 critical/serious 이슈 0건
- [ ] T069 최종 `/design-sync` 회귀 확인(Supabase 연동 후 시각 변화 없는지) — 전체
  - 관련 요구사항: Constitution V
  - design.md: 전체
  - 검증: CRITICAL/HIGH 신규 이슈 0건
- [ ] T070 quickstart.md 전체 시나리오 최종 실행 및 서명 — 없음(수동 QA)
  - 관련 요구사항: 전체 FR/SC
  - design.md: 전체
  - 검증: quickstart.md 4개 섹션 전항목 체크 완료

---

## Dependencies & Execution Order

### Phase 순서 (순차 게이트 — 사용자 지정)

```
Phase 1 (설정)
  → Phase 2 (디자인 시스템)
    → Phase 3 (세 화면 + Mock, Phase 3 체크포인트: lint/test/build 통과)
      → Phase 4 (design-sync 검증) — ⛔ T041 통과 전 Phase 5 시작 금지
        → Phase 5 (Supabase 기반) — ⛔ Phase 4 완료 전 시작 금지
          → Phase 6 (회원 기능) ┐
          → Phase 7 (관리자 기능) ┘ (Phase 5 공통 완료 후 병렬 가능)
            → Phase 8 (최종 검증)
```

- Phase 1→2→3은 순차(각 Phase가 다음 Phase의 파일/컴포넌트에 의존).
- Phase 4는 Phase 3 체크포인트 없이는 비교 대상(로컬 UI)이 없으므로 시작 불가.
- **Phase 5는 Phase 4의 T041(회귀 재검증 통과) 없이는 시작하지 않는다** — 사용자 명시 제약.
- Phase 6/7은 둘 다 Phase 5(Supabase 인프라·RLS·Repository) 완료를 전제하며, 이후에는 서로 독립적으로 병렬 진행 가능(다른 페이지 영역을 다룸).
- Phase 8은 Phase 6/7 모두 완료 후 시작.

### Task 단위 병렬 가능([P] 표기)

- Phase 1: T002, T003, T004는 서로 다른 설정 파일 → 병렬 가능
- Phase 2: T006~T018은 각각 독립 컴포넌트/스타일 파일 → 병렬 가능 (단, T013/T014는 T006-T008 완료 후)
- Phase 3: T020, T021은 병렬 가능(타입/인터페이스, 서로 다른 파일). T035/T036은 화면 완성 후 교차 점검이라 T025~T033 완료 후 실행
- Phase 5: T043, T044, T045(테이블 마이그레이션)는 병렬 가능, T046~T049(RLS)는 해당 테이블 마이그레이션 이후 순차

## Implementation Strategy

### MVP 경로

1. Phase 1~3 완료 → Mock 기반 3화면 데모 가능(로그인 없이 UI 전체 시연)
2. Phase 4 완료 → 승인된 디자인과 시각적으로 일치함을 확인한 상태
3. Phase 5 완료 → 실제 인증/DB 연결, 권한 강제 지점(RLS) 확보
4. Phase 6 완료 → 회원 시나리오(spec.md P1 스토리 대부분) 실사용 가능 → 이 시점이 배포 가능한 최소 기능 단위
5. Phase 7 완료 → 관리자 시나리오까지 포함해 전체 스펙 충족
6. Phase 8 → 품질 게이트 통과 후 릴리스 준비 완료

### 체크포인트 요약

| Phase | 체크포인트 통과 조건                                        | 다음 Phase 시작 조건 |
| ----- | ----------------------------------------------------------- | -------------------- |
| 1     | lint/test/build 통과                                        | 2                    |
| 2     | 공용 컴포넌트 렌더+테스트 통과                              | 3                    |
| 3     | 3화면 Mock 완성, lint/test/build 통과                       | 4                    |
| 4     | `/design-sync` 회귀 재검증 CRITICAL/HIGH 0건(T041)          | 5                    |
| 5     | RLS 정책이 권한 매트릭스와 1:1 일치, Repository 스위치 완료 | 6, 7                 |
| 6     | 회원 시나리오 통합 테스트 통과                              | 8 (7과 병렬)         |
| 7     | 관리자 시나리오 통합 테스트 통과                            | 8 (6과 병렬)         |
| 8     | 커버리지/성능/접근성/디자인 회귀 전항목 통과                | 릴리스               |

## Notes

- `[P]` = 다른 파일, 의존성 없음
- `[USn]` = spec.md 사용자 스토리 매핑, Phase 1/2/4/5/8 Task는 특정 스토리에 속하지 않아 라벨 생략
- Phase 4→5 게이트와 Phase 3→4 게이트는 사용자가 명시적으로 요청한 순서 제약이므로 임의 재배치 금지
- 각 Task 완료 후 커밋, 체크포인트마다 독립 검증 후 다음 Phase 진행
- `checklists/plan-design-readiness.md`의 CHK029~032(plan.md 부재 지적)는 본 plan.md/tasks.md 생성으로 재평가 필요

---

## Phase 9: Convergence

**Purpose**: `/speckit-converge`가 constitution.md/spec.md/design-brief.md/design.md/plan.md/tasks.md 대비 코드베이스를 재검사해 발견한 미반영 항목. CRITICAL/HIGH 우선순위.

- [ ] T071 `eslint.config.js`의 `ignores` 배열에 `.ds-sync`, `ds-bundle`, `.design-sync`를 추가해 `npm run lint` 회귀(980 errors, `.ds-sync`/`ds-bundle` 내 번들/스크립트 파일이 스캔되어 `window is not defined` 등 대량 오류 발생)를 제거 per Constitution XIII (contradicts)
- [ ] T072 `src/pages/MainPage.css`의 모바일 `.hero{margin-top:6rem}`(96px)가 `HeaderMain`이 390px에서 `.proto-switch` 줄바꿈으로 2행(실측 ~120px)이 되는 상황을 반영하지 못해 Hero 상단이 고정 헤더에 가려지는 문제 수정 — margin-top 상향 또는 `HeaderMain.css`의 `.proto-switch`가 모바일에서도 1행을 유지하도록 조정 per FR-030, FR-031, SC-004, design.md §24 (contradicts)
- [ ] T073 `src/components/layout/HeaderMain.css`, `src/components/layout/HeaderInternal.css`의 `.proto-switch select{min-height:36px}`를 `min-height: var(--touch-min)`(44px)로 수정 per FR-031 (contradicts)
- [ ] T074 `src/components/ui/Badge.tsx`의 `admin` variant(`symbol:''`)에 기호(예: `■`)를 추가해 "기호+텍스트 항상 병행" 규칙을 충족 per Constitution IX (contradicts)
- [ ] T075 모바일 네비게이션에 햄버거 메뉴(내 질문/질문 작성/계정 등 토글)를 `HeaderMain.tsx`/`HeaderInternal.tsx`에 구현 — 현재 버튼 줄바꿈 방식만 존재하며 관련 Task가 전혀 없었음 per FR-032 (missing)
