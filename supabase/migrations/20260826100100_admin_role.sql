-- T049: 관리자 역할 판별 함수 (profiles.role='admin' 기준)
-- security definer로 RLS를 우회해 profiles 자기참조 재귀를 피한다 (questions/answers RLS가 이 함수를 사용)
create function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create policy "profiles_select_own_or_admin"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

-- questions/answers 공용 updated_at 자동 갱신 트리거 함수
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
