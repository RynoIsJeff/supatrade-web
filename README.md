# 🧱 SupaTrade Group – Corporate Website

**Next.js 16 (Turbopack) · Prisma · PostgreSQL (Docker) · Tailwind CSS**

A modern corporate web platform for **Build It SupaTrade Group**, featuring careers management, HR workflow automation, and group-level information for all SupaTrade stores across KwaZulu-Natal.

---

## 🚀 Overview

The SupaTrade Group website is a full-stack **Next.js application** designed to manage:

- Public careers listings and job applications  
- Admin dashboard for HR staff  
- Secure applicant data and document handling  
- Store directory with map integration  
- Corporate information and POPIA-compliant privacy policies  

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Framework** | [Next.js 16](https://nextjs.org/) (Turbopack) |
| **Database** | PostgreSQL (Dockerized local instance) |
| **ORM** | Prisma |
| **Styling** | Tailwind CSS |
| **Forms & Validation** | React Hook Form + Zod |
| **Email** | (Planned) Resend or SendGrid |
| **Deployment** | Vercel (Frontend) + Railway / Render (Postgres for Production) |
| **CI / Linting** | TypeScript `--noEmit` · ESLint · GitHub Actions |

---

## ✅ Current Features (Completed)

### Core Infrastructure
- **Dockerized PostgreSQL** with Prisma schema and seed data  
- **NextAuth-free custom auth** (cookie-based admin login/logout)  
- **Middleware protection** for admin routes  
- **Type-safe API routes** with Prisma CRUD  
- **Continuous Integration (CI)** typecheck + lint workflows  

### Careers Portal
- Job listings page and individual job detail routes  
- Job application form (general + per-job)  
- PDF CV upload via API (validated and stored securely)  
- Application confirmation and validation  
- Responsive mobile-first UI for job cards and details  

### Admin Dashboard
- Admin login / logout  
- Application list with filters (by status, store/brand, and search)  
- Status update buttons: **Shortlist**, **Interview**, **Reject**  
- Live updates via API mutation (no page reloads)  
- “View CV” and “View Cover Letter” modal previews  
- Role-protected routes and session handling  
- Initial UI polish: responsive layout, hydration mismatch fixes  

---

## 🧭 Next Milestones

### 1. Store Directory (Active Development)
- `/stores` index with all SupaTrade branches  
- `/stores/[slug]` individual pages with details, phone numbers, maps  
- Integrated **Leaflet.js** map with store pins  
- Structured data (LocalBusiness JSON-LD) for SEO  

### 2. Application Timeline & Notes
- Track status changes and admin actions (audit trail)  
- Add private admin notes per candidate  
- Prisma models: `ApplicationEvent`, `ApplicationNote`  

### 3. Email Notifications
- HR notification on new application  
- Applicant auto-reply confirmation (Resend or SendGrid)  

### 4. CSV Export & Print View
- Export filtered application data  
- Print-friendly application summary (A4-optimized CSS)  

### 5. POPIA & Security Compliance
- File-type and size validation for uploads  
- Consent checkbox + privacy notice on all forms  
- Privacy Policy and Terms pages  
- Rate-limiting for forms and sensitive routes  

### 6. Admin UX Enhancements
- Persistent filters via URL params  
- Bulk actions (multi-select status updates)  
- Pagination and keyboard shortcuts  

### 7. Content & Marketing
- Group-level “About” and “Careers” copy updates  
- Meta + OG tags per page  
- Sitemap generation (jobs + stores)  

---

## 🧑‍💻 Local Development

```bash
# 1. Clone repo
git clone https://github.com/RynoIsJeff/supatrade-web.git
cd supatrade-web

# 2. Environment variables
cp .env.example .env.local
# Fill in DATABASE_URL, ADMIN_EMAIL, etc.

# 3. Start Docker Postgres
docker compose up -d

# 4. Run migrations & seed data
npx prisma migrate dev --name init
npx prisma db seed

# 5. Start dev server
npm run dev
```

## ⚙️ Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start development server (Turbopack) |
| `npm run build`     | Build for production                 |
| `npm run start`     | Run production server                |
| `npm run typecheck` | Run TypeScript type check            |
| `npm run lint`      | Run ESLint with Next.js config       |
| `npx prisma studio` | Launch Prisma Studio                 |

## 🧱 Database Schema Highlights

Job → title, description, location, brand

Application → applicant details, CV, cover letter, status

Admin → credentials (hashed), sessions

(upcoming) ApplicationEvent, ApplicationNote, Store

## 🛡️ Compliance & Security

POPIA-aligned data retention and consent

Secure document upload (PDF only)

Authenticated file access (signed URLs)

Input sanitization and server validation

## 🌍 Deployment Targets

| Environment  | Platform                      | Notes                           |
| ------------ | ----------------------------- | ------------------------------- |
| **Frontend** | [Vercel](https://vercel.com/) | Auto-deploy from `main` branch  |
| **Database** | Railway / Render              | PostgreSQL hosted instance      |
| **CI/CD**    | GitHub Actions                | Typecheck · Lint · Build checks |

## 📅 Roadmap Summary

| Stage       | Focus                                   | Status         |
| ----------- | --------------------------------------- | -------------- |
| **Phase 1** | Core HR Flow (Auth, Jobs, Applications) | ✅ Complete     |
| **Phase 2** | Store Directory + HR Notes/Timeline     | 🔄 In Progress |
| **Phase 3** | Email, Export, POPIA, Admin UX          | ⏳ Upcoming     |
| **Phase 4** | Marketing Pages, SEO, Launch            | ⏳ Upcoming     |

## 👨‍💼 Maintainer

Ryno Van der Walt
Founder & CEO – Ultimate Marketing Smash (UMS)
"Your Success is Our Priority!"

