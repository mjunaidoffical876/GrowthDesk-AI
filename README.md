# GrowthDesk AI

GrowthDesk AI is a multi-tenant SaaS starter system built with:

- Backend: NestJS + TypeScript + Prisma + PostgreSQL
- Frontend: Next.js + TypeScript + Tailwind CSS
- Database: PostgreSQL via Docker

## Current Milestone

Milestone 4 includes:

- Multi-tenant SaaS foundation
- Auth register/login flow
- Tenant/workspace creation
- JWT authentication
- Clients CRM module
- Leads CRM module
- Projects CRUD module
- Tasks CRUD module
- Project detail workspace
- Kanban-style task board foundation
- Invoice CRUD module
- Invoice line items
- Tax, discount, subtotal, total, and paid amount calculation
- Manual mark-as-paid flow
- Invoice list, create invoice, and invoice detail UI
- Frontend dashboard navigation
- Docker PostgreSQL setup
- Prisma schema
- GitHub Actions CI

## Folder Structure

```bash
GrowthDesk-AI/
├── backend/
│   ├── prisma/schema.prisma
│   └── src/modules/
│       ├── auth/
│       ├── clients/
│       ├── leads/
│       ├── projects/
│       ├── tasks/
│       └── invoices/
├── frontend/
│   ├── app/dashboard/invoices/
│   ├── app/dashboard/projects/
│   ├── app/dashboard/tasks/
│   └── services/
├── docker-compose.yml
├── package.json
├── .gitignore
├── .github/workflows/ci.yml
└── README.md
```

## Setup

### 1. Start PostgreSQL

```bash
docker compose up -d
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run start:dev
```

Backend runs on:

```txt
http://localhost:4000
```

### 3. Frontend setup

Open a new terminal:

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

## GitHub Push After Extracting This ZIP

Extract this ZIP inside your cloned repository folder, then run:

```bash
git add .
git commit -m "Add invoice billing module"
git push -u origin main
```

## Milestone 4 API Endpoints

### Invoices

```txt
GET    /invoices
GET    /invoices/:id
POST   /invoices
PATCH  /invoices/:id
PATCH  /invoices/:id/mark-paid
DELETE /invoices/:id
```

### Projects

```txt
GET    /projects
GET    /projects/:id
POST   /projects
PATCH  /projects/:id
DELETE /projects/:id
```

### Tasks

```txt
GET    /tasks
GET    /tasks?projectId=<project_id>
GET    /tasks/:id
POST   /tasks
PATCH  /tasks/:id
DELETE /tasks/:id
```

## Notes

The frontend production build was checked locally. Backend Prisma validation requires Prisma engine download, so run `npx prisma generate` and `npx prisma validate` on your machine or GitHub Actions with internet access.

## Next Milestone

Milestone 5 will add:

- Support tickets module
- Ticket replies/comments
- Priority and status workflow
- Client support workspace
