# GrowthDesk AI Deployment Guide

## Recommended Stack
- VPS or cloud server
- Docker
- PostgreSQL
- Node.js runtime
- Reverse proxy with SSL

## Backend
1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL`, `JWT_SECRET`, and `OPENAI_API_KEY`.
3. Run `npm install`.
4. Run `npx prisma migrate deploy`.
5. Run `npm run build`.
6. Start with `npm run start` or a process manager.

## Frontend
1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_API_URL`.
3. Run `npm install`.
4. Run `npm run build`.
5. Start with `npm start`.

## Production Notes
- Never commit real `.env` files.
- Use HTTPS only.
- Keep database backups.
- Monitor errors and AI usage cost.
