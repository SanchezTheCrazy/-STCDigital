-- Run in Supabase SQL editor
create table if not exists orders (
  id                uuid primary key default gen_random_uuid(),
  provider_order_id text not null,
  email             text not null,
  phone             text not null,
  carrier           text not null,
  value             numeric(10,2) not null,
  provider_cost     numeric(10,2) not null,
  customer_price    numeric(10,2) not null,
  profit            numeric(10,2) not null,
  pix_code          text not null,
  status            text not null default 'CREATED',
  created_at        timestamptz default now()
);

create index if not exists orders_provider_order_id_idx on orders(provider_order_id);
create index if not exists orders_created_at_idx on orders(created_at desc);

-- RLS: only service role can read/write (API routes use service role key)
alter table orders enable row level security;
