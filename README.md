# ✅ Checklist học NestJS

## Core NestJS
- [V] Module
- [V] Controller
- [V] Service
- [V] Dependency Injection (Provider, Scope, Custom Provider)

## Request Pipeline
- [ ] Middleware
- [V] Guard
- [V] Interceptor
- [V] Pipe
- [V] Filter (Exception Filter)

## Validation & Exception
- [V] DTO + class-validator
- [V] Global Pipe (ValidationPipe)
- [V] Exception (BadRequest, NotFound, Conflict...)
- [V] Custom Exception Filter - QueryFailedError(typeorm - postgres) - HTTPException của nestjs - Unkownerror 

## Database
- [V] PostgreSQL (TypeORM) - đang ở mức cơ bản
- [ ] Transaction, Migration, Relation

## Authentication & Authorization
- [V] JWT Auth (Register/Login)
- [V] Passport + bcrypt
- [V] RBAC (Role Guard)
- [ ] ABAC / CASL

## Tính năng bổ sung
- [ ] Upload File (Multer, S3/Cloudinary)
- [V] Swagger
- [V] Config (.env, ConfigModule, Joi)
- [ ] Logger (Pino/Winston)

## Nâng cao
- [V] Redis Cache - Cơ bản
- [ ] Cron / Schedule
- [ ] Event Emitter
- [V] Microservice Kafka - hiểu producer => brokers => bắn đến các consumers

## DevOps & Chất lượng
- [ ] Docker & docker-compose
- [ ] Testing (Jest, E2E, Supertest)
- [ ] Security (Helmet, CORS, Rate Limit, XSS/SQLi)
- [ ] Performance (Pagination, Cache, Connection Pool)
- [ ] CI/CD & Triển khai (VPS/Cloud, Nginx, PM2)