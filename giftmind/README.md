# Luxentia

Luxentia is a full-stack AI-powered Mongolian online gift shop. It uses Next.js 14 apps for the customer store and admin dashboard, a Hono API, Supabase for PostgreSQL/Auth-compatible data/Storage, Anthropic Claude for shopping chat, Sent.dm for OTP, Tailwind CSS, Framer Motion, and Stripe payment intent support.

## Structure

```txt
giftmind/
├── apps/
│   ├── web/          # Next.js customer store
│   ├── admin/        # Next.js admin dashboard
│   └── api/          # Hono backend
├── packages/
│   ├── db/           # Supabase client + shared database types
│   └── ui/           # Shared UI components
├── supabase/
│   ├── migrations/   # Schema, indexes, RLS policies
│   └── seed/         # 50 sample products
└── package.json      # npm workspaces
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Fill in:

```txt
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
ANTHROPIC_API_KEY
SENTDM_API_KEY
STRIPE_SECRET_KEY
NEXT_PUBLIC_API_URL
ADMIN_SECRET
```

4. Apply Supabase SQL in order:

```bash
supabase db push
psql "$SUPABASE_DB_URL" -f supabase/seed/001_products.sql
```

If you are using the Supabase dashboard, paste `supabase/migrations/001_initial_schema.sql` into SQL Editor first, then paste `supabase/seed/001_products.sql`.

5. Run the apps:

```bash
npm run dev:api
npm run dev:web
npm run dev:admin
```

You can also start all three at once:

```bash
npm run dev
```

Default URLs:

- Web: `http://localhost:3000`
- Admin: `http://localhost:3001`
- API: `http://localhost:8787`

## OTP Auth

`POST /api/auth/send-otp` sends OTP through Sent.dm. `POST /api/auth/verify-otp` validates it, upserts the Supabase `users` row, and returns a Luxentia bearer session token for API calls. In non-production, OTP `000000` is accepted for local testing.

## AI Chat

`POST /api/chat` streams Claude (`claude-sonnet-4-20250514`) responses with SSE events:

- `token`: incremental assistant text
- `done`: final `{ response, recommendedProducts }`
- `error`: error text

The assistant uses `<products>{...}</products>` blocks internally, then the API strips them and resolves recommended products through Supabase full-text search.

## Database

The migration creates:

- `users`
- `products`
- `orders`
- `cart`
- `chat_sessions`
- `categories`

RLS is enabled on every table. Products and categories are publicly readable; user-specific records are scoped to their owner; admin operations require `users.role = 'admin'`.

## Admin Access

1. Verify OTP in the web app to create a user and copy `luxentia_session` from local storage.
2. Promote that user in Supabase:

```sql
update public.users set role = 'admin' where phone = '+97699001234';
```

3. Paste the token into the admin dashboard.

## Notes

- Stripe is implemented as `POST /api/payments/stripe-intent`.
- QPay can be added as a parallel payment route using the same order payload.
- PWA support includes `manifest.json`, `icon.svg`, and a small service worker with offline fallback.
