# CodeMentor AI — AI Code Review untuk Developer Indonesia

> Seperti punya senior developer 24 jam — review kode kamu dalam hitungan detik.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square)
![Groq](https://img.shields.io/badge/AI-Groq%20llama--3.3--70b-F55036?style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square)

**Live:** [codementor-ai-xi.vercel.app](https://codementor-ai-xi.vercel.app)

---

## Masalah yang Diselesaikan

Junior developer, mahasiswa IT, dan bootcamp graduate Indonesia sering tidak punya akses ke senior developer untuk review kode mereka. Akibatnya:

- Kode bermasalah lolos tanpa terdeteksi
- Tidak ada feedback untuk berkembang
- Tools review seperti GitHub Copilot berbayar dan berbahasa Inggris

CodeMentor AI memberikan review kode instan dalam Bahasa Indonesia — gratis untuk memulai.

---

## Fitur

| Fitur | Keterangan |
|-------|-----------|
| 🤖 AI Code Review | Powered by Groq llama-3.3-70b |
| 🐛 Bug Detection | Temukan bug beserta saran fix-nya |
| ✨ Improved Code | Kode yang sudah diperbaiki langsung tersedia |
| 📊 Score 0-100 | Skor kualitas kode dengan penjelasan |
| 🔗 Share Review | Bagikan hasil review via link publik |
| 📜 History | Riwayat semua review tersimpan |
| 🔐 Auth | Register/login via Supabase |
| 📦 Quota Management | Free tier dengan batas review per bulan |

---

## Stack

```
Frontend  : Next.js 15 + TypeScript → Vercel
AI        : Groq API (llama-3.3-70b-versatile) — gratis
Database  : Supabase (PostgreSQL + Auth + RLS)
```

---

## Struktur Project

```
codementor-ai/
└── frontend/
    ├── app/
    │   ├── (auth)/
    │   │   ├── login/
    │   │   └── register/
    │   ├── (dashboard)/
    │   │   ├── review/        # Core review page
    │   │   └── history/       # Riwayat review
    │   ├── share/
    │   │   └── [token]/       # Public share page
    │   └── api/
    │       ├── review/        # Groq AI integration
    │       ├── reviews/
    │       └── profile/quota/
    └── lib/
        ├── supabase/
        └── quota.ts
```

---

## Harga

| Plan | Harga | Review/bulan |
|------|-------|-------------|
| Free | Rp 0 | 10 review |
| Pro | Rp 49.000 / bulan | Unlimited |
| Unlimited | Rp 99.000 / bulan | Unlimited + prioritas |

---

## Menjalankan Lokal

```bash
cd frontend
cp .env.example .env.local   # isi dengan credentials kamu
npm install
npm run dev
# Buka localhost:3000
```

**Environment variables yang dibutuhkan:**

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=
GROQ_API_KEY=
```

---

## Roadmap

- [x] Auth (register/login)
- [x] AI code review dengan Groq
- [x] Score + bug detection
- [x] Share review via public link
- [x] History page
- [x] Quota management
- [ ] Dashboard statistik
- [ ] Email welcome via Resend
- [ ] Billing page
- [ ] Support lebih banyak bahasa pemrograman

---

## Developer

Dibangun oleh [darkknightidris](https://github.com/darkknightidris) — dari Padang, Indonesia.

---

> *"Tidak ada senior developer? CodeMentor AI siap review kode kamu kapanpun."*
