# SKILL.md – E‑Commerce Next.js Project (No PHP)

**Role**: Senior Full‑Stack Engineer building a production‑ready e‑commerce site for household goods, inspired by the Betashop theme. The whole stack must run on **Node.js** – no PHP anywhere.

## Mandatory Stack
- **Framework**: Next.js 15 (App Router) + TypeScript.
- **Styling**: Tailwind CSS.
- **Database**: SQLite (file‑based) accessed via **Prisma** (you may replace with Drizzle if you prefer).
- **Auth**: `next-auth` (Auth.js) or `better-auth` – separate sessions for admin and customers.
- **API**: Next.js Route Handlers (no separate Express server).
- **Deployment**: `output: 'standalone'` in `next.config.js` to produce a minimal bundle (< 100 MB) suitable for cPanel Node.js apps or a light VPS.
- **Payments**: Stripe (international) + COD placeholder – additional VN‑local gateways can be added later.

## Prohibited
- Any PHP code or PHP‑based libraries.
- Heavy dependencies not required for the core functionality.
- Docker (optional Dockerfile can exist but must not be required for deployment).

## Project Layout (relative to repo root)
```
app/
  store/          # storefront pages (home, category, product, cart, checkout)
  admin/          # admin area (login, dashboard, CRUD UI)
  api/            # Next.js route handlers (products, orders, auth, etc.)
components/
  ui/             # reusable UI primitives (Button, Card, Modal, Table…)
  store/          # storefront‑specific components
  admin/          # admin‑specific components
lib/
  db/             # Prisma client & schema loader
  auth/           # next‑auth configuration
  utils/          # helpers (currency, validation, etc.)
prisma/
  schema.prisma   # data model definitions
  seed.ts         # seed script to populate demo data
public/
  images/         # product placeholders (Unsplash URLs can be used)
README.md          # deployment guide for cPanel and VPS
.env.example       # required environment variables (do NOT commit real secrets)
next.config.ts     # Next.js config with `output: 'standalone'`
postcss.config.js
tailwind.config.ts
tsconfig.json
```

## Naming & Coding Conventions
- Files & folders use **kebab‑case** for URLs (`/product/[id]`) and **camelCase** for JS/TS identifiers.
- API routes are placed under `app/api/...` and exported as **handler** functions.
- All UI text is in **Vietnamese**; use `next‑translate` or simple `t('key')` if i18n needed later.
- Admin routes must be protected by an `adminOnly` middleware that checks `session.user.role === 'admin'`.

## Evaluation Criteria
1. **Deployability** – can be built locally (`npm run build`) and the `.next/standalone` bundle uploaded to cPanel Node.js App **or** run on a VPS with `pm2 start server.js`.
2. **Bundle size** – < 100 MB when built in `standalone` mode.
3. **Build time** – < 5 minutes on a typical CI (Node 18, 2 CPU).
4. **Functionality** – meets the mandatory storefront and admin feature list (see user prompt).

---

*After creating this file, read it carefully before proceeding with any code generation.*

