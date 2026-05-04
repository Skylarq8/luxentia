create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  phone text unique not null,
  name text,
  email text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  parent_id uuid references public.categories(id) on delete set null,
  image_url text
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  price integer not null check (price >= 0),
  category text not null references public.categories(slug) on update cascade,
  tags text[] not null default '{}',
  images text[] not null default '{}',
  stock integer not null default 0 check (stock >= 0),
  metadata jsonb not null default '{}'::jsonb,
  search_vector tsvector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  items jsonb not null default '[]'::jsonb,
  total integer not null check (total >= 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.cart (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references public.users(id) on delete cascade,
  items jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  messages jsonb not null default '[]'::jsonb,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists products_category_idx on public.products(category);
create index if not exists products_price_idx on public.products(price);
create index if not exists products_tags_idx on public.products using gin(tags);
create index if not exists products_search_idx on public.products using gin(search_vector);
create index if not exists orders_user_idx on public.orders(user_id);
create index if not exists chat_sessions_user_idx on public.chat_sessions(user_id);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.update_product_search_vector()
returns trigger
language plpgsql
as $$
begin
  new.search_vector :=
    setweight(to_tsvector('simple', coalesce(new.name, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(new.description, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(array_to_string(new.tags, ' '), '')), 'C');
  return new;
end;
$$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
before update on public.products
for each row execute function public.touch_updated_at();

drop trigger if exists products_update_search_vector on public.products;
create trigger products_update_search_vector
before insert or update on public.products
for each row execute function public.update_product_search_vector();

drop trigger if exists cart_touch_updated_at on public.cart;
create trigger cart_touch_updated_at
before update on public.cart
for each row execute function public.touch_updated_at();

create or replace function public.search_products(search_term text, max_results int default 24)
returns setof public.products
language sql
stable
as $$
  select *
  from public.products
  where search_vector @@ plainto_tsquery('simple', search_term)
     or name ilike '%' || search_term || '%'
     or description ilike '%' || search_term || '%'
     or exists (select 1 from unnest(tags) tag where tag ilike '%' || search_term || '%')
  order by ts_rank(search_vector, plainto_tsquery('simple', search_term)) desc, price asc
  limit max_results;
$$;

alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.cart enable row level security;
alter table public.chat_sessions enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;

drop policy if exists "Users can read own profile" on public.users;
create policy "Users can read own profile" on public.users
for select using (auth.uid() = id or public.is_admin());

drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile" on public.users
for update using (auth.uid() = id or public.is_admin());

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories" on public.categories
for select using (true);

drop policy if exists "Admins can manage categories" on public.categories;
create policy "Admins can manage categories" on public.categories
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products" on public.products
for select using (true);

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products" on public.products
for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Users can read own orders" on public.orders;
create policy "Users can read own orders" on public.orders
for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can create own orders" on public.orders;
create policy "Users can create own orders" on public.orders
for insert with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "Admins can update orders" on public.orders;
create policy "Admins can update orders" on public.orders
for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Users can manage own cart" on public.cart;
create policy "Users can manage own cart" on public.cart
for all using (auth.uid() = user_id or public.is_admin()) with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can manage own chat sessions" on public.chat_sessions;
create policy "Users can manage own chat sessions" on public.chat_sessions
for all using (auth.uid() = user_id or user_id is null or public.is_admin()) with check (auth.uid() = user_id or user_id is null or public.is_admin());
