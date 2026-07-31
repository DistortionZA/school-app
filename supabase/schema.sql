create table if not exists schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists school_members (
  school_id uuid not null references schools(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner', 'admin', 'teacher', 'parent')),
  created_at timestamptz not null default now(),
  primary key (school_id, user_id)
);

create table if not exists learners (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  source_id text,
  first_name text not null,
  last_name text not null,
  grade text not null,
  class_name text not null,
  active boolean not null default true,
  unique (school_id, source_id)
);

create table if not exists guardian_links (
  learner_id uuid not null references learners(id) on delete cascade,
  guardian_id uuid not null references auth.users(id) on delete cascade,
  relationship text,
  whatsapp_opted_in_at timestamptz,
  primary key (learner_id, guardian_id)
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  author_id uuid not null references auth.users(id),
  title text not null,
  subject text not null,
  grade text not null,
  class_name text not null,
  due_date date not null,
  description text not null,
  materials text[] not null default '{}',
  status text not null default 'published' check (status in ('draft', 'published', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists project_acknowledgements (
  project_id uuid not null references projects(id) on delete cascade,
  guardian_id uuid not null references auth.users(id) on delete cascade,
  started_at timestamptz not null default now(),
  primary key (project_id, guardian_id)
);

create table if not exists notification_outbox (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('published', '14_day', '7_day', '3_day')),
  provider text,
  provider_message_id text,
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed', 'opted_out')),
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  unique (project_id, recipient_id, kind)
);

create table if not exists audit_events (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references schools(id) on delete cascade,
  actor_id uuid references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  created_at timestamptz not null default now()
);

alter table schools enable row level security;
alter table school_members enable row level security;
alter table learners enable row level security;
alter table guardian_links enable row level security;
alter table projects enable row level security;
alter table project_acknowledgements enable row level security;
alter table notification_outbox enable row level security;
alter table audit_events enable row level security;

-- Production policies should call a SECURITY DEFINER helper that resolves the
-- current user's school membership. No table is intentionally public.
