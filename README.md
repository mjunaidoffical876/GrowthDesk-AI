# GrowthDesk AI

GrowthDesk AI is a multi-tenant SaaS platform for agencies and service businesses. It includes CRM, projects/tasks, invoices, AI tools, and support ticket workflows.

## Current Milestones Included

- SaaS authentication foundation
- Tenant/workspace isolation
- Clients and leads CRM
- Projects and tasks module
- Kanban-style task workflow
- Invoice and billing module
- AI Tools Engine with usage tracking
- Support Ticket System with replies/internal notes
- PostgreSQL + Prisma schema
- Next.js dashboard UI
- GitHub Actions CI foundation

## Local Setup

### 1. Start Database

```bash
docker compose up -d
```

### 2. Backend

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

Backend runs on:

```txt
http://localhost:4000
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:3000
```

## AI Setup

AI tools work in demo fallback mode without an API key. For real generation, add this in `backend/.env`:

```env
OPENAI_API_KEY="your_openai_api_key"
OPENAI_MODEL="gpt-4o-mini"
AI_MONTHLY_LIMIT="1000"
```

## Push Commands

```bash
git add .
git commit -m "Add AI tools and support tickets modules"
git push
```

## Milestone 7 — Team & Workspace Settings

Added operational SaaS administration foundation:

- Team member list API
- Add team member API
- Update/deactivate team member API
- Tenant workspace settings API
- Team management dashboard page
- Workspace settings dashboard page
- Sidebar navigation updates

### New Backend Routes

```txt
GET    /users
POST   /users
PATCH  /users/:id
PATCH  /users/:id/deactivate
GET    /tenants/me
PATCH  /tenants/me
```

### New Frontend Routes

```txt
/dashboard/team
/dashboard/settings
```

## Milestone 8 — Subscription Plans + Usage Foundation

This milestone adds the first SaaS monetization foundation:

- Subscription plan model
- Tenant subscription history model
- Default Starter/Growth/Scale plans
- Tenant plan selection endpoint
- Usage counters for users, clients, projects, and monthly AI requests
- Dashboard subscription page
- Sidebar subscription navigation

### New Backend Endpoints

```http
GET /subscriptions/plans
GET /subscriptions/me
POST /subscriptions/change-plan
POST /subscriptions/plans
PATCH /subscriptions/plans/:id
```

### New Frontend Page

```txt
/dashboard/subscription
```

Payment provider integration is intentionally kept as manual foundation here. Stripe checkout/webhooks should be connected in the next billing milestone.


## Milestone 9 — Super Admin Panel

Added platform owner control center:

- Backend `SuperAdminModule`
- Platform dashboard API
- Tenant management API
- Analytics overview API
- Subscription plan monitoring API
- Frontend routes:
  - `/super-admin/dashboard`
  - `/super-admin/tenants`
  - `/super-admin/analytics`
  - `/super-admin/plans`

This milestone gives GrowthDesk AI a platform-level management layer for monitoring tenants, usage, invoices, subscriptions, tickets, and AI activity.
