-- T047: questions INSERT/UPDATE/DELETE — 본인만, pending 상태일 때만 수정/삭제 (FR-009~012)
-- 관리자는 질문을 작성할 수 없음 (spec.md)
create policy "questions_insert_own_member"
  on public.questions for insert
  with check (user_id = auth.uid() and not public.is_admin());

create policy "questions_update_own_pending"
  on public.questions for update
  using (user_id = auth.uid() and status = 'pending' and not public.is_admin())
  with check (user_id = auth.uid() and status = 'pending');

create policy "questions_delete_own_pending"
  on public.questions for delete
  using (user_id = auth.uid() and status = 'pending' and not public.is_admin());
