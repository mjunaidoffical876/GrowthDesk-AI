# Deployment Guide

## Recommended production stack
- Frontend: Next.js
- Backend: NestJS
- Database: PostgreSQL
- Cache/Queue: Redis
- Storage: S3/R2
- Reverse proxy: Nginx
- SSL: Let's Encrypt
- Deployment: Docker Compose or cloud container service

## Production steps
1. Set production environment variables.
2. Build backend and frontend.
3. Run Prisma migrations.
4. Start services.
5. Verify health endpoints.
6. Configure domain and SSL.
7. Test authentication, tenant creation, CRM, projects, invoices, AI tools, tickets, and client portal.
