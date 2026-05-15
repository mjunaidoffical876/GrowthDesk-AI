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
