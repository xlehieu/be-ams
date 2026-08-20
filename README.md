# ✅ Checklist học NestJS

## Core NestJS
- [X] Module
- [X] Controller
- [X] Service
- [X] Dependency Injection (Provider, Scope, Custom Provider)

## Request Pipeline
- [ ] Middleware
- [X] Guard
- [X] Interceptor
- [X] Pipe
- [X] Filter (Exception Filter)

## Validation & Exception
- [X] DTO + class-validator
- [X] Global Pipe (ValidationPipe)
- [X] Exception (BadRequest, NotFound, Conflict...)
- [X] Custom Exception Filter - QueryFailedError(typeorm - postgres) - HTTPException của nestjs - Unkownerror 

## Database
- [X] PostgreSQL (TypeORM) - đang ở mức cơ bản
- [ ] Transaction, Migration, Relation

## Authentication & Authorization
- [X] JWT Auth (Register/Login)
- [X] Passport + bcrypt
- [X] RBAC (Role Guard)
- [ ] ABAC / CASL

## Tính năng bổ sung
- [ ] Upload File (Multer, S3/Cloudinary)
- [X] Swagger
- [X] Config (.env, ConfigModule, Joi)
- [ ] Logger (Pino/Winston)

## Nâng cao
- [X] Redis Cache - Cơ bản
- [ ] Cron / Schedule
- [ ] Event Emitter
- [X] Microservice Kafka - hiểu producer => brokers => bắn đến các consumers

## DevOps & Chất lượng
- [ ] Docker & docker-compose
- [ ] Testing (Jest, E2E, Supertest)
- [ ] Security (Helmet, CORS, Rate Limit, XSS/SQLi)
- [ ] Performance (Pagination, Cache, Connection Pool)
- [ ] CI/CD & Triển khai (VPS/Cloud, Nginx, PM2)

## Học thêm về elasticsearch
- [X] Kiến thức về index, cách lưu data của es - basic
- [ ] Code base ES, cấu hình service dùng mọi nơi thay vì mỗi module lại cấu hình lại
- [X] Lưu data và search tới ES - dùng bulk để lưu nhiều bản ghi ở operations
- [X] Mapping