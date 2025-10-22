# 🏗️ SupaTrade Corporate Website
Modern, high-performance corporate website for the **SupaTrade Group** (KZN, South Africa) — featuring a store directory, contact page, and a secure HR careers portal with application management.

Built by **Ultimate Marketing Smash (UMS)** using:
- ⚛️ [Next.js 14 (App Router)](https://nextjs.org/)
- 💨 [Tailwind CSS](https://tailwindcss.com/)
- 🧱 [shadcn/ui](https://ui.shadcn.com/)
- 🗄️ [Supabase](https://supabase.com/) (DB + Auth + File Storage)
- 🧩 [Prisma ORM](https://www.prisma.io/)
- ☁️ Hosted on [Vercel](https://vercel.com/)

---

## 🚀 Getting Started

### 1️⃣ Clone & Install
```bash
git clone https://github.com/<yourusername>/supatrade-web.git
cd supatrade-web
npm install

```

### 2️⃣ Environment Variables

Create a .env file (use .env.example as a guide):

```bash
NEXT_PUBLIC_SITE_NAME=SupaTrade
SITE_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@db:5432/supatrade
DIRECT_URL=postgresql://user:password@db:5432/supatrade
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=public-anon-key
SUPABASE_SERVICE_ROLE_KEY=service-role-key
EMAIL_FROM=no-reply@supatrade.co.za
RESEND_API_KEY=
SENDGRID_API_KEY=
```

### 3️⃣ Run Dev Server

```bash
npm run dev
```
Open http://localhost:3000

## 🧱 Project Structure

```bash
src/
  app/
    (marketing)/      # Public pages (Home, About, Stores, Careers, Contact)
    (admin)/          # HR portal (auth + job management)
    api/              # Next.js API routes (forms, jobs, etc.)
  components/
    site/             # Header, footer, layout components
    ui/               # shadcn/ui components
  styles/
    globals.css
```

## 🗓️ Planned Modules

| Feature                                | Status            |
| -------------------------------------- | ----------------- |
| Public website pages                   | ✅ Step 1 complete |
| Store directory (Leaflet maps)         | ⏳ Step 2          |
| Careers / Job board                    | ⏳ Step 2          |
| HR Admin Portal (Auth + CRUD)          | ⏳ Step 3          |
| Application database & email routing   | ⏳ Step 3          |
| POPIA-compliant privacy & contact form | ⏳ Step 4          |

## ⚙️ Scripts

| Command           | Description           |
| ----------------- | --------------------- |
| `npm run dev`     | Run dev server        |
| `npm run build`   | Production build      |
| `npm start`       | Run production server |
| `npm run lint`    | Lint code             |
| `npm run sitemap` | Generate sitemap      |

## 🧩 Deployment

This project is optimized for Vercel.
Ensure the same .env variables are added in your Vercel dashboard under Settings → Environment Variables.

## 🪪 License

© 2025 Ultimate Marketing Smash (Pty) Ltd.
All rights reserved. “Your Success is Our Priority!”