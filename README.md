# KOIN MVP

Web app multi-role untuk MVP KOIN menggunakan Next.js App Router, Tailwind CSS, dan Supabase.

## Setup

1. Jalankan SQL di `supabase/schema.sql` pada Supabase SQL Editor.
2. Salin `.env.example` ke `.env.local`.
3. Isi `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, dan `SUPABASE_SERVICE_ROLE_KEY`.
4. Jalankan:

```bash
npm install
npm run dev
```

## Role

- `ADMIN`: dibuat manual di database.
- `PARENT`: register publik.
- `CHILD`: dibuat oleh parent dari dashboard.
- `CANTEEN`: register publik.

Belum ada payment gateway, QRIS, payout, atau AI.
