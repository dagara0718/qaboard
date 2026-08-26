# Quickstart Validation: QANOW

## 전제 조건

- Node.js 18+, npm
- Phase 1-4 구간에서는 Supabase 프로젝트 불필요 (Mock Data/Mock Session만 사용)
- Phase 5부터는 `.env.local`에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 필요

## 1. Mock 단계 검증 (Phase 1-4 완료 후)

```bash
npm install
npm run dev
```

- `http://localhost:5173/` 접속 → Hero 문구("질문은 빠르게, 답변은 명확하게"), Aurora Gradient, Floating Card 확인 (design.md §9-10)
- 헤더 뷰 전환(게스트/회원/관리자)으로 CTA·네비게이션 변화 확인 (design.md §6, spec.md FR-029)
- `/questions` 접속 → 회원/관리자 Mock 세션 전환 시 목록 필터·작성자 컬럼·"질문 작성" 버튼 노출 여부 확인 (FR-013, FR-014)
- `/questions/:id` 접속 → 질문작성/수정/답변대기/답변완료/관리자답변작성/관리자답변수정 6개 상태 각각 렌더링 확인 (design.md §12-13)
- OS 설정에서 "동작 줄이기(Reduce Motion)" 활성화 후 재확인 → 모든 애니메이션 정지, 정적 상태 유지 확인 (design.md §22)
- Chrome DevTools에서 390px / 1440px 뷰포트 전환, 버튼 44px 이상·레이아웃 깨짐 없음 확인 (design.md §20)

```bash
npm run lint
npm run test
npm run build
```

세 명령 모두 통과해야 Phase 1-4 완료로 간주(Constitution XIII).

## 2. `/design-sync` 검증 (Phase 4)

```bash
/design-sync
```

- Claude Design 프로젝트(`1bf2ca05-a515-4b6d-8856-ba36a48c39cd`)의 `QANOW_Main.html`, `QANOW_List.html`, `QANOW_Detail.html` 확정본과 로컬 구현을 비교
- CRITICAL/HIGH로 분류된 시각 불일치를 모두 수정한 뒤에만 Phase 5로 진행 (사용자 지정 순서 제약)
- 회귀 검증: 수정 후 다시 `/design-sync` 실행해 새로운 CRITICAL/HIGH가 발생하지 않았는지 확인

## 3. Supabase 연동 검증 (Phase 5, `/design-sync` 통과 후에만 시작)

```bash
# .env.local 설정 후
npm run dev
```

- `profiles`/`questions`/`answers` 테이블 생성 및 RLS 정책 적용 확인 (data-model.md 권한 매트릭스)
- 회원 A로 로그인 → 질문 작성 → 회원 B로 로그인 후 회원 A의 질문 수정/삭제 시도 → 차단 확인 (FR-012, SC-005)
- 관리자로 로그인 → 미답변 질문에 답변 작성 → 회원 A 계정으로 재확인 시 해당 질문 수정/삭제 버튼이 사라졌는지 확인 (FR-011, SC-006)
- 비로그인 상태로 `/questions`, `/questions/:id?mode=new` 직접 접근 → 로그인 페이지 리다이렉트 확인 (FR-003, FR-022)

## 4. 최종 검증 (Phase 8)

- `npm run test` 커버리지 리포트로 Constitution XIII(80%) 기준 확인
- Lighthouse로 메인 페이지 성능(≥80점) 및 FCP(3G, ≤3초) 측정 (SC-008)
- axe 또는 동급 접근성 도구로 색상 대비(SC-009) 및 색상만으로 상태 전달 여부(Constitution IX) 자동 검사
