-- T044: questions 테이블 (data-model.md Question 엔티티, FR-005/FR-008)
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(trim(title)) between 1 and 100),
  content text not null check (char_length(trim(content)) between 1 and 5000),
  status text not null default 'pending' check (status in ('pending', 'answered')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.questions enable row level security;

create trigger questions_set_updated_at
  before update on public.questions
  for each row execute procedure public.set_updated_at();
