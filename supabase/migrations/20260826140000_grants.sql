-- SQL Editor로 직접 만든 테이블은 dashboard 테이블 생성기와 달리 authenticated/anon role에
-- 기본 GRANT가 붙지 않는다. RLS 정책이 있어도 테이블 자체 권한이 없으면 PostgREST가 403을 반환한다.
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.questions to authenticated;
grant select, insert, update, delete on public.answers to authenticated;
