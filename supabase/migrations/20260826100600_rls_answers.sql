-- T048: answers SELECT/INSERT/UPDATE — 관리자만 작성(pending 질문만), 본인 작성만 수정 (FR-015, FR-017, FR-018)
create policy "answers_select_owner_or_admin"
  on public.answers for select
  using (
    public.is_admin()
    or exists (
      select 1 from public.questions q
      where q.id = answers.question_id and q.user_id = auth.uid()
    )
  );

create policy "answers_insert_admin_pending"
  on public.answers for insert
  with check (
    public.is_admin()
    and admin_id = auth.uid()
    and exists (
      select 1 from public.questions q
      where q.id = question_id and q.status = 'pending'
    )
  );

create policy "answers_update_own_admin"
  on public.answers for update
  using (public.is_admin() and admin_id = auth.uid())
  with check (public.is_admin() and admin_id = auth.uid());
