create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  password_hash text,
  role text not null check (role in ('ADMIN', 'PARENT', 'CHILD', 'CANTEEN')),
  status text not null check (status in ('active', 'pending', 'suspended')),
  created_at timestamptz not null default now()
);

create table if not exists public.parents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  phone text,
  address_optional text,
  created_at timestamptz not null default now()
);

create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.parents(id) on delete cascade,
  user_id uuid not null unique references public.users(id) on delete cascade,
  name text not null,
  school_name text,
  grade text,
  daily_limit integer not null default 25000 check (daily_limit >= 0),
  pin_hash text,
  created_at timestamptz not null default now()
);

alter table public.children add column if not exists pin_hash text;

create table if not exists public.canteens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  canteen_name text not null,
  owner_name text not null,
  school_name text,
  phone text,
  has_nfc_device boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'active', 'suspended')),
  created_at timestamptz not null default now()
);

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  card_uid text not null unique,
  card_label text,
  status text not null default 'active' check (status in ('active', 'frozen', 'blocked', 'replaced')),
  created_at timestamptz not null default now()
);

create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null unique references public.children(id) on delete cascade,
  balance integer not null default 0 check (balance >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  canteen_id uuid not null references public.canteens(id) on delete cascade,
  name text not null,
  price integer not null check (price >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references public.children(id) on delete set null,
  canteen_id uuid references public.canteens(id) on delete set null,
  card_id uuid references public.cards(id) on delete set null,
  amount integer not null check (amount > 0),
  status text not null check (status in ('success', 'failed', 'refunded')),
  failure_reason text,
  created_at timestamptz not null default now()
);

create table if not exists public.transaction_items (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references public.transactions(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  qty integer not null default 1 check (qty > 0),
  price integer not null check (price >= 0),
  subtotal integer not null check (subtotal >= 0)
);

create table if not exists public.savings_pockets (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  name text not null,
  target_amount integer not null default 0 check (target_amount >= 0),
  current_amount integer not null default 0 check (current_amount >= 0),
  status text not null default 'active' check (status in ('active', 'completed', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.saving_requests (
  id uuid primary key default gen_random_uuid(),
  saving_pocket_id uuid references public.savings_pockets(id) on delete set null,
  child_id uuid not null references public.children(id) on delete cascade,
  parent_id uuid not null references public.parents(id) on delete cascade,
  amount integer not null check (amount > 0),
  reason text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'partial')),
  payout_destination_type text,
  created_at timestamptz not null default now()
);

create table if not exists public.saving_movements (
  id uuid primary key default gen_random_uuid(),
  child_id uuid references public.children(id) on delete cascade,
  saving_pocket_id uuid references public.savings_pockets(id) on delete cascade,
  amount integer not null check (amount > 0),
  type text not null default 'deposit',
  created_at timestamptz not null default now()
);

create table if not exists public.missions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  parent_id uuid not null references public.parents(id) on delete cascade,
  title text not null,
  description text,
  reward_amount integer not null default 0 check (reward_amount >= 0),
  status text not null default 'pending' check (status in ('pending', 'completed', 'approved', 'rejected')),
  evidence_text text,
  evidence_url text,
  submitted_at timestamptz,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.missions add column if not exists evidence_text text;
alter table public.missions add column if not exists evidence_url text;
alter table public.missions add column if not exists submitted_at timestamptz;
alter table public.missions add column if not exists approved_at timestamptz;

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  description text,
  created_at timestamptz not null default now()
);

do $$ begin
  create type report_status as enum ('open', 'in_review', 'resolved', 'rejected');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.support_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_user_id uuid references public.users(id) on delete set null,
  related_transaction_id uuid references public.transactions(id) on delete set null,
  subject text not null,
  message text not null,
  status report_status not null default 'open',
  admin_reply text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_type where typname = 'topup_status') then
    create type topup_status as enum ('pending', 'settlement', 'failed', 'expired', 'cancelled');
  end if;
end $$;

create table if not exists public.topup_transactions (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.parents(id) on delete set null,
  child_id uuid references public.children(id) on delete set null,
  order_id text unique not null,
  amount integer not null,
  status topup_status not null default 'pending',
  midtrans_token text,
  midtrans_redirect_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.parents enable row level security;
alter table public.children enable row level security;
alter table public.canteens enable row level security;
alter table public.cards enable row level security;
alter table public.wallets enable row level security;
alter table public.products enable row level security;
alter table public.transactions enable row level security;
alter table public.transaction_items enable row level security;
alter table public.savings_pockets enable row level security;
alter table public.saving_requests enable row level security;
alter table public.saving_movements enable row level security;
alter table public.missions enable row level security;
alter table public.audit_logs enable row level security;
alter table public.support_reports enable row level security;
alter table public.topup_transactions enable row level security;

drop policy if exists "Users can read own profile" on public.users;
create policy "Users can read own profile" on public.users for select to authenticated using (auth.uid() = id);

drop policy if exists "Parents can read own row" on public.parents;
create policy "Parents can read own row" on public.parents for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Children can read own row" on public.children;
create policy "Children can read own row" on public.children for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Canteens can read own row" on public.canteens;
create policy "Canteens can read own row" on public.canteens for select to authenticated using (auth.uid() = user_id);

-- Admin dibuat manual:
-- insert into public.users (id, name, email, password_hash, role, status)
-- values ('AUTH_USER_UUID', 'Admin KOIN', 'admin@koin.id', null, 'ADMIN', 'active');
