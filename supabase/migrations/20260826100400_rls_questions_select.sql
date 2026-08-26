-- T046: questions SELECT — 회원은 본인 것만, 관리자는 전체 (FR-007, FR-013, FR-021)
create policy "questions_select_own_or_admin"
  on public.questions for select
  using (user_id = auth.uid() or public.is_admin());
