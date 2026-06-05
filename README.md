# CodeMentor AI

AI code review platform untuk junior developer Indonesia.

## Stack
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: FastAPI (Python)
- **Database**: Supabase (PostgreSQL + Auth)
- **AI Engine**: Anthropic API (claude-sonnet-4-20250514)
- **Deploy**: Vercel (frontend) + Railway (backend)
- **Email**: Resend

---

## Setup Supabase (lakukan sekali)

1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka **SQL Editor**
3. Jalankan `supabase/01_schema.sql`
4. Jalankan `supabase/02_rls.sql`
5. Copy `SUPABASE_URL` dan kedua keys dari Settings → API

---

## Setup Frontend (Next.js)

```powershell
cd frontend
cp ../.env.example .env.local
# Edit .env.local dengan nilai Supabase kamu

npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## Setup Backend (FastAPI)

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Buat .env dari template
cp ../.env.example .env
# Edit .env dengan semua credentials

uvicorn app.main:app --reload
```

API berjalan di [http://localhost:8000](http://localhost:8000)

---

## Deploy

### Frontend → Vercel
```powershell
cd frontend
npx vercel --prod
```
Set environment variables di Vercel dashboard.

### Backend → Railway
Push repo ke GitHub, connect ke Railway, set environment variables.

---

## Upgrade Plan Manual (setelah user bayar)

Jalankan di Supabase SQL Editor:
```sql
SELECT upgrade_plan('email@user.com', 'pro');
-- atau
SELECT upgrade_plan('email@user.com', 'unlimited');
```

---

## Struktur File

```
codementor-ai/
├── frontend/
│   ├── app/
│   │   ├── (auth)/login/         ← halaman login
│   │   ├── (auth)/register/      ← halaman register
│   │   ├── (dashboard)/review/   ← core: editor + review
│   │   ├── (dashboard)/history/  ← list review lama
│   │   ├── (dashboard)/dashboard/← statistik
│   │   ├── (dashboard)/billing/  ← upgrade plan
│   │   └── api/                  ← server-side API routes
│   ├── components/               ← shared components
│   ├── lib/
│   │   ├── supabase/             ← client & server helpers
│   │   └── quota.ts              ← quota utilities
│   ├── types/index.ts            ← shared TypeScript types
│   └── middleware.ts             ← auth protection
├── backend/
│   ├── app/
│   │   ├── main.py               ← FastAPI app + CORS
│   │   └── routers/
│   │       ├── review.py         ← POST /api/review (core)
│   │       ├── profile.py        ← GET /api/profile/quota
│   │       └── health.py         ← GET /health
│   └── requirements.txt
└── supabase/
    ├── 01_schema.sql             ← tables
    └── 02_rls.sql                ← RLS + trigger + helper fn
```

---

## Quota Limits

| Plan      | Review/bulan | Harga          |
|-----------|-------------|----------------|
| Free      | 10          | Gratis         |
| Pro       | 100         | Rp 49.000/bln  |
| Unlimited | ∞           | Rp 99.000/bln  |

Reset otomatis setiap tanggal 1.
