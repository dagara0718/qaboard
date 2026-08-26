-- T045: answers 테이블 (data-model.md Answer 엔티티, FR-015, question_id unique로 질문당 답변 1개 강제)
create table public.answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null unique references public.questions (id) on delete cascade,
  admin_id uuid not null references public.profiles (id),
  content text not null check (char_length(trim(content)) between 1 and 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.answers enable row level security;

create trigger answers_set_updated_at
  before update on public.answers
  for each row execute procedure public.set_updated_at();

-- 답변 작성 시 질문 상태를 answered로 전환 (FR-015, questions RLS의 pending-only 제약을 우회하기 위해 security definer)
create function public.mark_question_answered()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.questions
  set status = 'answered', updated_at = now()
  where id = new.question_id;
  return new;
end;
$$;

create trigger answers_after_insert_mark_answered
  after insert on public.answers
  for each row execute procedure public.mark_question_answered();
