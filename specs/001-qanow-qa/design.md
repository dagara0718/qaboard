# QANOW Design Specification (design.md)

**Feature**: `001-qanow-qa`
**Source of truth**: Claude Design 프로젝트 `1bf2ca05-a515-4b6d-8856-ba36a48c39cd`
확정 파일 — `QANOW_Main.html`, `QANOW_List.html`, `QANOW_Detail.html`
**Based on**: `spec.md`, `design-brief.md`, `.specify/memory/constitution.md`
**Status**: 확정 (Claude Design 프로토타입 기준, 구현 전)

이 문서는 Claude Design에서 실제로 확정된 세 화면의 구조와 규칙을 그대로 문서화한다. 시안 재해석이나 새로운 규칙 추가 없이, 프로토타입에 존재하는 마크업/스타일/동작을 기준으로 기술한다.

---

## 1. 디자인 콘셉트와 목표

채택 시안: **A안 — Aurora Gradient** (어두운 네이비 Hero + 블루·바이올렛·핑크 그라데이션, 기술적이고 정교한 인상).

- 메인 페이지는 강한 시각적 인상으로 서비스 목적을 전달하고, 내부 화면(리스트/상세)은 가독성과 작업 효율을 우선한다 (design-brief §2).
- 톤: Professional + Approachable, 신뢰감·명확함·효율성 중심 (design-brief §3).
- 비회원이 메인 페이지에서 1분 내 이용 흐름을 이해하는 것이 목표 (SC-001, FR-027).

## 2. 브랜드 이름과 핵심 문구

- 서비스명: **QANOW**
- Hero Headline: "질문은 빠르게, 답변은 명확하게"
- Hero Subheading: "궁금한 점을 남기면 관리자가 확인하고 답변해드립니다."
- Primary CTA: "질문 작성하기"
- Secondary CTA: "내 질문 확인하기" (비회원 헤더에서는 "회원가입" / 회원 헤더에서는 "내 질문 보기")
- 이용 흐름 3단계 타이틀: "질문 작성" → "관리자 확인" → "답변 확인" (FR-027)

## 3. 세 핵심 화면의 정보 구조

| 화면        | 파일                | 목적                                              | 관련 요구사항                  |
| ----------- | ------------------- | ------------------------------------------------- | ------------------------------ |
| 메인        | `QANOW_Main.html`   | 서비스 소개, 이용 흐름 시각화, 회원 전환/진입     | FR-027, FR-028, FR-029         |
| 질문 리스트 | `QANOW_List.html`   | 질문 목록 조회, 상태별 스캔 (회원/관리자 뷰 분리) | FR-007, FR-008, FR-013, FR-014 |
| 질문 상세   | `QANOW_Detail.html` | 질문 열람, 작성/수정, 관리자 답변 작성/수정       | FR-005, FR-009~FR-018          |

메인 정보 우선순위: 이용 흐름(3단계) > CTA > 서비스 설명 (design-brief §5).
리스트 정보 우선순위: 제목 + 상태 배지 > 작성일/작성자 > 미리보기(생략).
상세 정보 우선순위: 제목+본문 > 답변 내용 > 메타데이터.

## 4. 화면별 레이아웃

**메인**: `header`(fixed) → `.hero`(그라데이션 배경, 2컬럼 그리드: 텍스트+CTA / 플로팅 카드) → `.flow-section`(3단계 + 배지 쇼케이스) → `footer`.

**리스트**: `header`(sticky) → `.container`(max-width 1000px) → `.page-header`(타이틀 + "+ 질문 작성" 버튼) → `.tabs`(전체/답변 대기/답변 완료) → `.question-list`(카드 그리드) 또는 상태 패널(Loading/Empty/Error) → 하단 프로토타입 상태 미리보기 패널.

**상세**: `header`(sticky, 뒤로가기) → `.container`(max-width 800px) → 모드별 `.mode-panel` (질문상세-대기 / 질문상세-완료 / 질문작성 / 질문수정 / 관리자답변작성 / 관리자답변수정) 중 활성 패널 1개 표시 → 하단 프로토타입 상태 미리보기 패널.

## 5. 화면 간 이동

```
메인 (QANOW_Main.html)
  ├─ "질문 작성하기" → QANOW_Detail.html?mode=new
  ├─ "내 질문 확인하기" / "내 질문 보기" → QANOW_List.html
  ├─ 헤더 뷰 전환(게스트/회원/관리자) → 헤더 액션만 변경, 페이지 이동 없음
  └─ 관리자 뷰 "문의 관리" → QANOW_List.html?role=admin

질문 리스트 (QANOW_List.html)
  ├─ 카드 클릭 → QANOW_Detail.html (답변완료) 또는 ?state=waiting (답변대기)
  ├─ "+ 질문 작성" → QANOW_Detail.html?mode=new (관리자 뷰에서는 버튼 숨김)
  ├─ 로고 클릭 → QANOW_Main.html
  └─ 로그아웃 → QANOW_Main.html

질문 상세 (QANOW_Detail.html)
  ├─ "← 뒤로" → QANOW_List.html
  ├─ "수정" (답변 대기중, 회원) → mode=edit 패널
  ├─ "삭제" → confirm 대화상자 → QANOW_List.html
  └─ 관리자 "저장" (답변 작성) → mode=adminAnswered 패널
```

이 구조는 design-brief §9 페이지 이동 구조와 일치하며, 회원가입/로그인 페이지는 명세 범위 밖이라 디자인 대상에서 제외됨.

## 6. 회원과 관리자 상태 차이

프로토타입은 실제 인증 없이 **뷰 전환 셀렉터**(`<select>`, 프로토타입 전용 라벨 명시)로 상태 차이를 시연한다.

| 요소                 | 회원 뷰                   | 관리자 뷰                                              |
| -------------------- | ------------------------- | ------------------------------------------------------ |
| 리스트 페이지 타이틀 | "내 질문"                 | "문의 관리"                                            |
| 작성자 컬럼          | 숨김                      | 표시 (`.author-col`, `[data-role="admin"]`에서만 노출) |
| "+ 질문 작성" 버튼   | 표시                      | 숨김 (`display:none`, JS로 제어)                       |
| 상세 페이지 액션     | 답변 대기 시 [수정][삭제] | [답변 작성] / [답변 수정]                              |
| 역할 배지            | 없음                      | `.role-tag` 바이올렛 배지 "관리자"                     |
| 빈 목록 메시지       | "작성한 질문이 없습니다"  | "질문이 없습니다"                                      |

FR-013, FR-014, design-brief §8(회원/관리자 상태 차이 표)과 일치.

## 7. Header와 Navigation 규칙

- 메인: `position:fixed; top:0`, 반투명 네이비 배경(`rgba(15,23,42,0.95)`) + `backdrop-filter: blur(8px)`, 하단 보더 `rgba(255,255,255,0.1)`.
- 리스트/상세: `position:sticky; top:0`, 흰 배경, 하단 보더 `var(--gray-200)`.
- 로고는 항상 좌측, 클릭 시 메인으로 이동 (리스트/상세).
- 상세 페이지는 로고 대신 좌측에 "← 뒤로" 버튼 우선 배치.
- 헤더 우측 액션 영역은 `flex-wrap:wrap`으로 모바일에서 줄바꿈 허용.
- 버튼 `min-height:44px` 고정 (FR-031).

## 8. Page Header 규칙

- 리스트: `.page-header`에 `<h1 class="page-title">`(1.75rem/700)과 Primary 버튼("+ 질문 작성")을 좌우 배치, 모바일에서는 세로 스택 + 버튼 전체 폭.
- 상세: 별도 페이지 타이틀 없이 `.section-title`(대문자, 0.85rem, letter-spacing 0.5px, gray-600)로 "질문"/"답변"/"답변 작성" 구획을 라벨링.

## 9. 메인 Hero 구조

```
.hero (min-height:90vh, padding 2rem, overflow hidden)
 └─ .hero-content (max-width 1200px, grid 1fr 1fr, gap 4rem)
     ├─ .hero-text
     │   ├─ h1 (그라데이션 텍스트 강조 span.hero-highlight)
     │   ├─ p (subheading)
     │   └─ .cta-buttons (Primary + Secondary, flex gap 1rem)
     └─ .hero-visual (플로팅 질문/답변 카드, 모바일에서 display:none)
```

모바일(≤768px): 1컬럼, `.hero-visual` 제거, CTA 버튼 세로 전체 폭.

## 10. Aurora Gradient, Grid Glow, Floating Card 효과

- **Aurora Gradient**: `.hero::before`, `linear-gradient(135deg, #0EA5E9 0%, #8B5CF6 50%, #EC4899 100%)`, opacity 0.15→0.25 사이 8초 주기 애니메이션(`gradient-shift`), `pointer-events:none`으로 클릭 방해 없음.
- **Grid Glow**: design-brief §15에 명시된 40px 격자 효과는 이번 확정 프로토타입 3화면에는 별도 레이어로 구현되지 않음 — 구현 단계에서 추가 시 동일한 `prefers-reduced-motion` 규칙 적용 필요.
- **Floating Card**: `.card-question`(우상단, `float-up` 4s), `.card-answer`(우하단, `float-down` 4s, 0.5s delay), 흰 배경 카드에 질문/답변 예시 텍스트, 회전 ±2도 + 상하 이동.
- 세 효과 모두 `@media (prefers-reduced-motion: reduce)`에서 애니메이션 정지 (§22 참조).

## 11. 질문 리스트 카드/행 구조

```
.card (white, border 1px gray-200, radius 8px, padding 1.5rem)
 ├─ .card-title (1.05rem/600)
 └─ .card-meta (flex space-between, wrap)
     ├─ 작성일 (+ .card-author, 관리자 뷰에서만 노출)
     └─ .badge (badge-waiting 또는 badge-answered)
```

- hover: 보더 블루 + box-shadow 강화, cursor pointer.
- 카드 전체 클릭 가능 (상세 페이지 이동).
- 탭(`전체`/`답변 대기`/`답변 완료`)은 `data-status` 속성 기준 JS 필터링으로 동작.
- 모바일: `.card-meta`가 세로 스택으로 전환, 표 형태 대신 카드 형태 유지 (design-brief "모바일에서는 표보다 카드 우선"과 일치, 원래 리스트도 표가 아닌 카드형).

## 12. 질문 작성 폼 구조

`mode-new` 패널 기준:

```
.section
 ├─ .section-title "새 질문 작성"
 ├─ .form-group (제목)
 │   ├─ label "제목"
 │   ├─ input[maxlength=100], oninput → 글자수 카운트
 │   └─ .field-footer (좌: .error-message "제목을 입력해주세요", 우: .char-count "n / 100")
 ├─ .form-group (내용)
 │   ├─ label "내용"
 │   ├─ textarea[maxlength=5000], oninput → 글자수 카운트
 │   └─ .field-footer (우: .char-count "n / 5000")
 └─ .submit-buttons ([작성] Primary, [취소] Secondary)
```

- 글자수 80% 초과 시 `.char-count.warn`(노란색) 적용.
- 빈 제목으로 제출 시 `.input-field.field-error`(빨간 보더) + `.error-message.show` 노출 (FR-006).
- "질문 수정"(`mode-edit`)은 동일 구조에 기존 값이 채워진 상태로 재사용 (spec.md User Story 6 "같은 폼 재사용" 원칙).

## 13. 질문 상세와 답변 영역 구조

**질문 섹션** (`.section`):

```
.section-title "질문"
h1.question-title
.question-meta (작성일, [관리자 뷰: 작성자], .badge)
.question-content (max-width 68ch, line-height 1.9)
.action-buttons ([수정][삭제] — 답변 대기 + 회원 뷰에서만 렌더링, 답변완료 상태에서는 아예 출력하지 않음 — FR-011)
```

**답변 섹션** (`.section.answer-section`):

- 답변 있음: `.answer-box`(좌측 블루 4px 보더) 안에 `.answer-meta`(작성자·작성일) + `.answer-content`.
- 답변 없음(회원 뷰, 답변 대기): `.waiting-notice`(노란 배경, 좌측 옐로 보더) "관리자가 확인 후 답변할 예정입니다" 안내.
- 관리자 답변 작성(`mode-adminWaiting`): textarea + 글자수 + 오류 메시지 + [저장][취소].
- 관리자 답변 수정(`mode-adminAnswered`): 기존 답변이 채워진 동일 textarea + [수정 저장][취소].

## 14. Loading, Empty, Error, Unauthorized 상태

리스트 페이지에 `.state-panel` 3종 구현:

- **Loading**: `.skeleton-row` 3개, `.skeleton-bar`(title/meta) shimmer 애니메이션(1.5s), reduced-motion에서 정적 회색으로 대체.
- **Empty**: 아이콘 + "작성한 질문이 없습니다"(회원)/"질문이 없습니다"(관리자) + 추가 CTA 없음 (spec.md Edge Cases, FR 근거).
- **Error**: 아이콘 + "목록을 불러오지 못했습니다" + [다시 시도] 버튼 → 목록 상태로 복귀.
- 하단 "프로토타입 상태 미리보기" 개발용 버튼으로 Loading/Empty/Error/기본 목록 전환 시연.

**Unauthorized**: 이번 확정 3화면 프로토타입에는 별도 "권한 없음" 화면/패널이 구현되어 있지 않다 — spec.md는 Toast 메시지("권한이 없습니다", "이미 답변된 질문은 수정할 수 없습니다")로 처리하도록 정의하므로(FR-026, Edge Cases), 구현 단계에서 Toast 컴포넌트로 별도 반영 필요. `QANOW_List.html`에 `.toast`(빨간 배경) 스타일만 선언되어 있고 트리거는 연결되어 있지 않음 — 실제 구현 시 권한 오류 액션에 연결할 것.

## 15. 디자인 토큰

```css
--navy: #0f172a; /* 메인 배경, 어두운 텍스트 */
--blue: #0ea5e9; /* Primary 액센트 */
--violet: #8b5cf6; /* 그라데이션 중간, 관리자 배지 계열 */
--pink: #ec4899; /* 그라데이션 끝 */
--white: #ffffff;
--gray-50: #f9fafb; /* 내부 페이지 배경 */
--gray-100: #f3f4f6; /* hover 배경 */
--gray-200: #e5e7eb; /* 보더 */
--gray-600: #4b5563; /* 보조 텍스트 */
--yellow: #f59e0b / #FEF3C7(bg) / #92400E(text) /* 답변 대기 */ --green: #10b981 / #DCFCE7(bg) /
  #15803D(text) /* 답변됨 */ --red: #ef4444 / #FEE2E2(bg) / #991B1B(text) /* 오류 */;
```

## 16. 타이포그래피 계층

| 요소                                    | 크기                          | Weight  | 비고                                      |
| --------------------------------------- | ----------------------------- | ------- | ----------------------------------------- |
| Hero H1                                 | `clamp(2.25rem, 5vw, 3.5rem)` | 700     | letter-spacing -1px                       |
| Flow Title / List Page Title            | 2.25rem / 1.75rem             | 700     |                                           |
| Step Title / Detail Question Title      | 1.25rem / 1.5rem              | 600–700 |                                           |
| Section Title (질문/답변 라벨)          | 0.85rem                       | 700     | uppercase, letter-spacing 0.5px, gray-600 |
| Card Title                              | 1.05rem                       | 600     |                                           |
| Body (question-content, answer-content) | 1rem                          | 400     | line-height 1.9, max-width 68ch           |
| Small (meta, char-count)                | 0.75–0.875rem                 | 400–500 | gray-600                                  |

폰트 패밀리: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', sans-serif` (design-brief §12 방향과 일치).

## 17. 색상 역할

- 메인 페이지: 네이비 배경 + 흰 텍스트, CTA는 블루→바이올렛 그라데이션.
- 내부 페이지: 회색(gray-50) 배경, 흰 카드, 네이비 텍스트, 블루 액센트.
- 상태 배지: 대기=노란 계열(bg #FEF3C7/text #92400E), 완료=초록 계열(bg #DCFCE7/text #15803D) — 색상+텍스트 병행 (Constitution IX, §10 참조).
- 오류: 빨강 계열, 삭제 버튼도 빨강 보더/텍스트.
- 관리자 역할 배지: 바이올렛 계열(#EDE9FE bg / #5B21B6 text).

## 18. 간격과 최대 콘텐츠 폭

- 메인 Hero/Flow 컨텐츠: `max-width: 1200px`.
- 리스트 컨테이너: `max-width: 1000px`.
- 상세 컨테이너: `max-width: 800px`, 본문 텍스트는 `max-width: 68ch`로 줄 길이 추가 제한 (가독성).
- 공통 패딩: 데스크톱 `2rem`, 모바일 `1rem`.
- 카드/섹션 내부 패딩: 1.5rem(리스트 카드) / 2rem(상세 섹션), 모바일에서 1.25rem으로 축소.
- 버튼/입력 간 gap: 0.75rem~1.5rem.

## 19. 버튼·입력창·카드·배지 규칙

- **버튼**: `border-radius:6px`(과도한 라운드 회피, design-brief 금지 패턴 준수), `min-height:44px`, Primary(블루/그라데이션 배경), Secondary(흰 배경+회색 보더), Danger(빨강 보더/텍스트).
- **입력창**: `border:1px solid gray-200`, `border-radius:6px`, focus 시 블루 보더 + `box-shadow:0 0 0 3px rgba(14,165,233,0.1)`, 오류 시 빨강 보더.
- **카드**: `border-radius:8px`, `border:1px solid gray-200`, 그림자는 hover 시에만 강화(기본은 그림자 없음 또는 미세함) — 과도한 그림자 회피.
- **배지**: `border-radius:4px`(각짐, 카드보다 덜 둥글게), padding `0.375rem 0.75rem`, 항상 아이콘 기호(●/✓) + 텍스트 병행.

## 20. 데스크톱과 모바일 반응형 규칙

- 단일 브레이크포인트 `max-width:768px`으로 모바일 스타일 전환 (요청된 1440px/390px 기준은 이 브레이크포인트 위/아래 구간에서 각각 검증 대상).
- 1440px(데스크톱): 컨텐츠는 각 화면의 max-width(1200/1000/800px)로 제한되고 중앙 정렬, 좌우 여백 자동 확보.
- 390px(모바일): 헤더 요소 줄바꿈 허용, Hero 비주얼(플로팅 카드) 숨김, CTA/버튼 전체 폭, 폼 버튼 세로 스택, 카드 메타 정보 세로 스택.
- 모든 클릭 가능 요소 `min-height:44px` 유지 (FR-031).
- hover 전용 정보 없음 — 상태 배지·버튼 텍스트가 항상 노출되어 모바일에서도 모든 행동 이해 가능 (배지 텍스트, 버튼 라벨이 항상 보이는 텍스트로 존재).

## 21. 키보드 포커스와 접근성

- 모든 인터랙티브 요소(button, input, textarea, select)는 네이티브 엘리먼트 사용 — 별도 커스텀 위젯 없이 기본 포커스 가능.
- 프로토타입은 브라우저 기본 포커스 스타일을 별도로 제거하지 않음 — 구현 단계에서 커스텀 포커스 스타일 적용 시 3:1 대비 이상 명시적 outline 유지 필요 (Constitution VIII).
- 폼 필드는 `<label>` + `<input>/<textarea>` 명시적 연결 필요 (현재 프로토타입은 시각적 label만 사용 — 구현 시 `for`/`id` 또는 `aria-label` 연결 보강 필요, FR-006/Constitution VIII 리뷰 기준).
- Tab 순서: 헤더 → 페이지 액션 → 리스트/폼 → 하단 순으로 DOM 순서와 시각 순서 일치.

## 22. prefers-reduced-motion 규칙

```css
@media (prefers-reduced-motion: reduce) {
  .hero::before {
    animation: none;
    opacity: 0.15;
  } /* Aurora */
  .card-question,
  .card-answer {
    animation: none;
  } /* Floating Card */
  .skeleton-bar {
    animation: none;
    background: var(--gray-200);
  } /* Loading */
}
```

- 애니메이션 제거 시에도 정적 상태(고정 opacity, 고정 회색)로 정보 전달은 유지됨 — 애니메이션이 기능적 필수 요소가 아님 (Constitution VII).
- hover 전환(border-color, background)은 즉시 반응이라 reduced-motion 규칙 대상 아님 (0.2s 이내, Constitution VII 허용 범위).

## 23. 금지할 디자인 패턴

design-brief §19 기준, 프로토타입에서 실제로 회피한 패턴:

- ❌ 과도한 Glassmorphism — 헤더 blur는 8px 정도로 제한, 텍스트 위에 blur 레이어 없음.
- ❌ 과도하게 둥근 모서리 — 버튼/입력 6px, 카드 8px, 플로팅 카드만 12px (모두 24px 미만).
- ❌ 색상만으로 상태 구분 — 모든 배지에 기호(●/✓) + 텍스트 병행.
- ❌ 모션 오버로드 — 화면당 애니메이션은 Aurora, Floating Card, Skeleton 각각 독립적으로 1개씩만 동작, 동시에 여러 효과 겹치지 않음.
- ❌ 모바일 무시 — 모든 화면에 `max-width:768px` 대응 규칙 존재.
- ❌ 폰트 오버로드 — 시스템 폰트 스택 1종만 사용.
- ❌ 가격표/고객 로고/후기 섹션 — 세 화면 어디에도 없음 (원 요청사항 준수).

## 24. 구현 후 시각 검증 항목

- [ ] 메인: 1440px/390px에서 Hero CTA 2개가 겹치거나 잘리지 않는지
- [ ] 메인: `prefers-reduced-motion` 켠 상태에서 Aurora/Floating Card 애니메이션이 완전히 멈추는지
- [ ] 리스트: 회원/관리자 뷰 전환 시 작성자 컬럼·작성 버튼·페이지 타이틀이 스펙대로 바뀌는지 (FR-013, FR-014)
- [ ] 리스트: 전체/답변 대기/답변 완료 탭 필터링이 실제 데이터 상태와 일치하는지
- [ ] 리스트: Loading/Empty/Error 상태가 실제 API 응답 상태와 연결되는지 (FR-023~025)
- [ ] 상세: 답변 완료 상태에서 [수정][삭제] 버튼이 DOM에 아예 없는지 (FR-011)
- [ ] 상세: 제목 100자/내용 5000자 초과 입력이 서버에서도 차단되는지 (FR-006, 클라이언트 maxlength는 UX 보조일 뿐)
- [ ] 상세: 빈 필드 제출 시 오류 메시지와 포커스 이동이 스크린리더에서도 인식되는지 (aria-live 등 보강 필요)
- [ ] 전체: 모든 배지/오류/성공 메시지가 색상 제거(그레이스케일) 상태에서도 텍스트로 구분되는지 (Constitution IX)
- [ ] 전체: 모든 버튼/입력 터치 영역이 실기기에서 44×44px 이상인지 (FR-031)
- [ ] 전체: 색상 대비가 WCAG AA(4.5:1) 이상인지, 특히 gray-600 보조 텍스트와 배경 조합 (SC-009)
- [ ] Unauthorized: Toast 컴포넌트 연결 후 "권한이 없습니다" / "이미 답변된 질문은 수정할 수 없습니다" 메시지가 올바른 트리거에서 노출되는지 (FR-026, Edge Cases)

---

**참고**: 본 문서는 Claude Design 프로젝트(`1bf2ca05-a515-4b6d-8856-ba36a48c39cd`)의 `QANOW_Main.html`, `QANOW_List.html`, `QANOW_Detail.html` 확정본을 그대로 기술한 것이며, 로컬 React/CSS 코드는 이 문서 작성 시점에 수정하지 않았다.
