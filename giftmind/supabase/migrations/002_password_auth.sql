alter table public.users
add column if not exists password_hash text;

create or replace function public.get_user_by_phone_for_auth(input_phone text)
returns table (
  id uuid,
  phone text,
  name text,
  email text,
  avatar_url text,
  role text,
  password_hash text,
  created_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    users.id,
    users.phone,
    users.name,
    users.email,
    users.avatar_url,
    users.role,
    users.password_hash,
    users.created_at
  from public.users
  where users.phone = input_phone
  limit 1;
$$;

create or replace function public.create_password_user(
  input_phone text,
  input_name text,
  input_password_hash text
)
returns public.users
language plpgsql
security definer
set search_path = public
as $$
declare
  created_user public.users;
begin
  insert into public.users (phone, name, password_hash, role)
  values (input_phone, input_name, input_password_hash, 'customer')
  returning * into created_user;

  return created_user;
end;
$$;
