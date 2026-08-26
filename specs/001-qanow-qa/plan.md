# Implementation Plan: QANOW 질의응답 게시판

**Branch**: `001-qanow-qa` | **Date**: 2026-08-25 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-qanow-qa/spec.md`, design specification from `/specs/001-qanow-qa/design.md` (Claude Design 확정 3화면 기준)

## Summary

QANOW는 회원이 질문을 작성하고 관리자가 답변하는 Q&A 게시판이다(spec.md Overview). 핵심 화면은 메인/질문 리스트/질문 상세 3개이며, Claude Design에서 확정된 Aurora Gradient 컨셉(design.md §1)을 시각 기준으로 구현한다.

기술 접근: React + Vite + TypeScript SPA를 Mock Data/Mock Session으로 먼저 완성해 세 화면을 확정 디자인과 `/design-sync`로 검증한 뒤(Phase 1~4), 그 검증이 끝난 후에만 Supabase(Auth+Postgres+RLS)를 연동한다(Phase 5+). 커스텀 백엔드 서버를 두지 않고 Supabase RLS를 데이터 계층 권한 강제 지점으로 사용해 Constitution II를 충족한다(MVP 단순성, Constitution XI).

## Technical Context

**Language/Version**: TypeScript 5.x, React 18 (Vite 5 빌드)

**Primary Dependencies**: React, React Router (3화면+상태 라우팅), `@supabase/supabase-js`(Phase 5부터 실사용, Phase 1-4는 타입만 참조), ESLint + Prettier, Vitest + React Testing Library

**Storage**: Phase 1-4는 인메모리 Mock Data(`src/mocks/`)만 사용, N/A(영속 저장 없음). Phase 5부터 Supabase Postgres(테이블: profiles, questions, answers) + RLS

**Testing**: Vitest(단위) + React Testing Library(컴포넌트/화면), 커버리지 목표는 Constitution XIII 기준 준용(80%는 회원/관리자 기능 Phase부터 적용, Mock-only UI 단계는 렌더링/상태 테스트 중심)

**Target Platform**: 웹 브라우저, 데스크톱 1440px / 모바일 390px 기준(design.md §20)

**Project Type**: web-app — 단일 프론트엔드 SPA + Supabase BaaS (커스텀 백엔드 서버 없음)

**Performance Goals**: 메인 페이지 FCP 3초 이내(3G, SC-008), Lighthouse 80점 이상(Constitution VI), 애니메이션 60fps(design-brief §15)

**Constraints**: WCAG AA 색상 대비 4.5:1 이상(SC-009), 터치 영역 44×44px 이상(FR-031), `prefers-reduced-motion` 완전 대응(design.md §22, Constitution VII), 클라이언트 권한 정보 불신·서버(RLS) 재검증 필수(Constitution II)

**Scale/Scope**: 핵심 화면 3개, 사용자 역할 3종(게스트/회원/관리자), spec.md Out of Scope 항목(첨부/댓글/검색/페이지네이션/소셜로그인/통계) 제외

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| #    | 원칙                            | 상태             | 근거/메커니즘                                                                                                                                 |
| ---- | ------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| I    | 명확한 권한 분리                | PASS             | 역할 3종(게스트/회원/관리자) spec.md Key Entities에 정의, design.md §6에 UI 차이 명시                                                         |
| II   | 데이터 계층 권한 강제           | PASS (조건부)    | 커스텀 서버 없음 → Supabase RLS 정책이 데이터 계층 강제 지점. Phase 5 RLS 설계 시 FR-007/012/018/021 전부 정책으로 구현 필요                  |
| III  | 사용자 입력 검증                | PASS (조건부)    | Mock 단계는 클라이언트 검증만 존재(UX용, design.md §12) → Phase 5+에서 Supabase Postgres CHECK 제약 + (필요 시) DB 함수로 서버 검증 보강 필수 |
| IV   | 명세 준수                       | PASS             | 본 계획은 spec.md/design.md 범위만 구현, Out of Scope 항목 제외                                                                               |
| V    | 세 화면 정보 구조·디자인 일관성 | PASS             | design.md §7-9(Header/Page Header/Hero), §15-19(토큰/타이포/버튼) 공통 규칙을 Phase 2에서 공유 컴포넌트로 선구현                              |
| VI   | 메인 시각 효과 제약             | PASS             | Aurora/Floating Card 성능 목표 SC-008 연동, Phase 3에서 Lighthouse 측정 포함                                                                  |
| VII  | 애니메이션 접근성               | PASS             | design.md §22 규칙 그대로 Phase 3 Task에 포함                                                                                                 |
| VIII | 키보드 접근성                   | PASS (보강 필요) | design.md §21이 "라벨 연결 미비, 구현 시 보강 필요"로 명시 → Phase 2/3 Task에 `label for` 연결 명시적으로 포함                                |
| IX   | 상태 표현 이중성                | PASS             | 배지 색상+기호+텍스트 병행이 design.md §13/17에 이미 정의됨, Phase 2 Badge 컴포넌트로 강제                                                    |
| X    | 데스크톱/모바일 완성도          | PASS             | design.md §20 단일 브레이크포인트(768px) 규칙, 1440/390 검증 항목 존재                                                                        |
| XI   | MVP 단순성 우선                 | PASS             | 커스텀 백엔드 미도입(Supabase BaaS만 사용), 상태관리 라이브러리 미도입(React 내장 state/Context로 충분)                                       |
| XII  | Task 요구사항·설계 추적성       | PASS             | 모든 Task에 spec FR-ID + design.md 섹션 명시(사용자 요청 형식)                                                                                |
| XIII | 테스트 및 빌드 검증             | PASS             | Phase 1에 lint/test/build 파이프라인 선구축, Phase 8에 최종 검증                                                                              |

**Complexity Tracking**: 위반 없음 — 표 생략.

## Project Structure

### Documentation (this feature)

```text
specs/001-qanow-qa/
├── spec.md
├── design-brief.md
├── design.md
├── plan.md              # 본 문서
├── research.md          # Phase 0 output
├── data-model.md         # Phase 1 output
├── quickstart.md         # Phase 1 output
├── contracts/            # Phase 1 output
│   └── data-access.md
├── checklists/
│   ├── requirements.md
│   └── plan-design-readiness.md
└── tasks.md              # Phase 2 output (/speckit-tasks, 별도 실행)
```

### Source Code (repository root)

커스텀 백엔드 서버가 없는 단일 프론트엔드 SPA(Supabase는 BaaS로 클라이언트에서 직접 연동, Phase 5부터). "Option 2: Web application(frontend+backend)" 구조는 사용하지 않는다 — Constitution XI(MVP 단순성)에 따라 별도 backend/ 디렉터리를 만들지 않음.

```text
src/
├── main.tsx
├── App.tsx                     # 라우터 진입점 (/, /questions, /questions/:id)
├── styles/
│   ├── tokens.css               # design.md §15 디자인 토큰 (CSS 변수)
│   ├── global.css               # 리셋 + 기본 폰트/배경
│   └── typography.css           # design.md §16 타이포그래피 계층
├── components/
│   ├── layout/
│   │   ├── HeaderMain.tsx        # 메인 전용 헤더 (design.md §7, 게스트/회원/관리자)
│   │   └── HeaderInternal.tsx    # 리스트/상세 공용 헤더 (뒤로가기 포함)
│   ├── ui/
│   │   ├── Button.tsx            # Primary/Secondary/Danger, min-height 44px
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx          # 글자수 카운터 내장
│   │   └── Badge.tsx             # 상태 배지 (기호+텍스트+색상)
│   └── states/
│       ├── LoadingState.tsx       # 스켈레톤
│       ├── EmptyState.tsx
│       ├── ErrorState.tsx         # 재시도 버튼 포함
│       └── UnauthorizedToast.tsx  # design.md §14 Unauthorized 보강
├── pages/
│   ├── MainPage.tsx               # design.md §9-10 Hero/Aurora/Floating Card
│   ├── QuestionListPage.tsx       # design.md §11
│   └── QuestionDetailPage.tsx     # design.md §12-13 (작성/수정/상세/답변작성)
├── mocks/
│   ├── mockSession.ts             # 게스트/회원/관리자 세션 목킹
│   └── mockData.ts                # 질문/답변 목 데이터
├── lib/
│   ├── dataAccess/
│   │   ├── types.ts               # QuestionRepository/AnswerRepository 인터페이스 (contracts/data-access.md)
│   │   ├── mockRepository.ts      # Mock 구현체 (Phase 1-4)
│   │   └── supabaseRepository.ts  # Supabase 구현체 (Phase 5+)
│   └── supabase/
│       └── client.ts               # Supabase 클라이언트 초기화 (Phase 5)
└── types/
    └── domain.ts                   # User/Question/Answer 타입 (data-model.md 기준)

tests/
├── unit/                # Button/Badge/Input 등 컴포넌트 단위 테스트
└── integration/         # 화면 단위 렌더링 + 권한 시나리오 테스트 (Phase 5+ RLS 연동 후 추가)
```

**Structure Decision**: Vite 기반 단일 React SPA. 백엔드는 Supabase(BaaS)로 대체하여 별도 서버 디렉터리를 두지 않는다. `lib/dataAccess/types.ts` 인터페이스를 Mock과 Supabase 구현체가 공통으로 만족하도록 하여, Phase 1-4(Mock)에서 Phase 5+(Supabase)로 전환 시 페이지/컴포넌트 코드를 재작성하지 않고 구현체만 교체한다(Constitution XI 단순성 + 사용자 요청 "Mock 완성 후 Supabase 전환" 순서 요건을 코드 구조로 뒷받침).

## Complexity Tracking

> 위반 없음 — Constitution Check 전 항목 PASS.
