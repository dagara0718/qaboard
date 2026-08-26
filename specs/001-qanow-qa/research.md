# Phase 0 Research: QANOW

## 1. 프론트엔드 스택

**Decision**: React 18 + Vite 5 + TypeScript 5, React Router로 3화면 라우팅.

**Rationale**: design.md의 확정 프로토타입이 정적 HTML/CSS/vanilla JS 상태 전환(모드 셀렉터)으로 구현되어 있어, 컴포넌트 기반 프레임워크로 옮길 때 상태(mode/role/status)를 React state로 자연스럽게 치환 가능. Vite는 빠른 로컬 개발 서버로 FCP 3초 목표(SC-008) 확인에 유리.

**Alternatives considered**: Next.js(SSR) — MVP 단순성(Constitution XI)에 비해 과함, 정적 SPA로 충분. Vue/Svelte — 별도 사유 없음, 생태계 친숙도 우선 React 채택.

## 2. 백엔드/데이터 계층

**Decision**: 커스텀 백엔드 서버 없이 Supabase(Postgres + Auth + RLS)를 BaaS로 직접 연동. Phase 1-4는 Mock Data/Mock Session으로 대체.

**Rationale**: spec.md Assumptions에 "세션 관리는 HTTP-only 쿠키 또는 서버 토큰"이라 명시되어 있으나 별도 API 서버를 만들 필요는 없음 — Supabase Auth가 세션/토큰을 관리하고, RLS가 Constitution II("데이터 계층 권한 강제")의 요구를 정책 형태로 충족한다. 이는 Constitution XI(MVP 단순성, 최소 의존성)와도 부합.

**Alternatives considered**: Express/NestJS 커스텀 API — 권한 로직을 애플리케이션 코드에 직접 작성 가능하나, 별도 서버·배포·인증 미들웨어를 추가로 구현해야 해 MVP 범위 초과.

## 3. Mock → Supabase 전환 방식

**Decision**: `QuestionRepository`/`AnswerRepository`/`SessionProvider` 인터페이스를 정의하고, Mock 구현체와 Supabase 구현체가 동일 인터페이스를 만족하도록 한다(contracts/data-access.md).

**Rationale**: 사용자 요청(Phase 3 완료 → `/design-sync` 검증 → Phase 5 Supabase)의 순서를 지키려면, Mock 단계 코드가 Supabase 전환 시 재작성되지 않아야 한다. 인터페이스 분리로 페이지/컴포넌트는 구현체를 몰라도 되며, 전환 시 `mockRepository.ts` → `supabaseRepository.ts` 교체만 필요.

**Alternatives considered**: MSW(Mock Service Worker)로 네트워크 계층 목킹 — Supabase JS SDK 자체를 목킹해야 해 설정 복잡도 증가, 이번 규모(3화면)에는 과함.

## 4. 애니메이션 구현

**Decision**: 순수 CSS `@keyframes` + `prefers-reduced-motion` 미디어 쿼리만 사용, 별도 애니메이션 라이브러리(Framer Motion 등) 미도입.

**Rationale**: design.md §10/§22가 이미 CSS 애니메이션(`gradient-shift`, `float-up`, `float-down`, `shimmer`)으로 확정 프로토타입에 구현되어 있음 — 동일 코드를 React 컴포넌트의 CSS 모듈/전역 스타일로 그대로 이식 가능. Constitution XI(의존성 최소화)에도 부합.

**Alternatives considered**: Framer Motion — reduced-motion 자동 처리 이점이 있으나 이미 CSS로 충분히 제어 가능해 신규 의존성 불필요.

## 5. 테스트 전략

**Decision**: Vitest + React Testing Library. Mock 단계(Phase 1-4)는 컴포넌트 렌더링/상태 전환 테스트 중심, Supabase 연동 후(Phase 5+)는 권한 시나리오(FR-012, FR-018, FR-021) 통합 테스트 추가.

**Rationale**: Constitution XIII(테스트/빌드 통과 필수)를 만족하되, RLS 정책 자체의 실제 차단 검증은 Supabase 프로젝트가 연결된 이후에만 의미가 있으므로 권한 테스트는 Phase 5+로 배치.

**Alternatives considered**: Playwright E2E — 3화면 규모에서는 RTL 통합 테스트로 충분, E2E는 Phase 8 최종 검증에서 선택적으로만 고려.

## 6. 디자인 토큰 반영 방식

**Decision**: `src/styles/tokens.css`에 CSS Custom Properties로 design.md §15 토큰을 1:1 선언, 컴포넌트는 토큰만 참조(하드코딩 색상 금지).

**Rationale**: design.md §18-19(체크리스트 CHK018/019)가 지적한 "토큰→CSS 변환 계획 부재" 공백을 Phase 2에서 해소. design-brief §13의 4px 스케일과 design.md §18의 rem 값 간 불일치는 rem 기준(현재 확정 프로토타입 실측값)을 단일 소스로 채택해 정리한다.

**Alternatives considered**: Tailwind CSS 유틸리티 — 토큰 매핑은 가능하나 신규 빌드 의존성 추가, MVP 단순성 원칙상 순수 CSS 변수로 충분.
