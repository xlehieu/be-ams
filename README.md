# 🚀 Lộ trình học NestJS từ Cơ bản → Nâng cao

> Mục tiêu: Sau khi hoàn thành lộ trình này bạn có thể tự xây dựng Backend Production với NestJS, PostgreSQL/MongoDB, Redis, Docker, Authentication, Queue, WebSocket và triển khai lên VPS/Cloud.

---

# Giai đoạn 0. Kiến thức nền (Bắt buộc)

Nếu chưa vững thì nên học trước NestJS.

## TypeScript

- Interface
- Type
- Generic
- Utility Types
- Enum
- Union
- Intersection
- Decorator
- Module
- Async/Await
- Promise
- Class
- OOP

Thực hành

- CRUD Todo bằng TypeScript
- Class UserService
- Generic Repository

---

## NodeJS

Hiểu:

- Event Loop
- Call Stack
- Callback Queue
- Promise
- Async
- Streams
- Buffer
- File System
- HTTP Server

Biết dùng

- Express
- Middleware
- Cookie
- JWT
- REST API

---

## HTTP

Hiểu

- GET
- POST
- PUT
- PATCH
- DELETE

Status Code

- 200
- 201
- 204
- 400
- 401
- 403
- 404
- 409
- 422
- 500

Headers

- Authorization
- Content-Type
- Cookie
- Cache-Control

---

# Giai đoạn 1. Làm quen NestJS

## Cài đặt

```bash
npm i -g @nestjs/cli

nest new project-name
```

Cấu trúc

```
src
 ├── app.module.ts
 ├── app.controller.ts
 ├── app.service.ts
 └── main.ts
```

Hiểu:

- main.ts
- bootstrap()
- AppModule

---

## Kiến trúc NestJS

Hiểu vai trò

```
Request

↓

Middleware

↓

Guard

↓

Interceptor(before)

↓

Pipe

↓

Controller

↓

Service

↓

Repository

↓

Database

↓

Interceptor(after)

↓

Response
```

---

## Module

Hiểu

```
@Module({
 imports:[],
 controllers:[],
 providers:[],
 exports:[]
})
```

Tạo module

```bash
nest g module users
```

---

## Controller

```bash
nest g controller users
```

Decorator

```
@Controller()

@Get()

@Post()

@Put()

@Delete()

@Patch()
```

Parameter

```
@Body()

@Param()

@Query()

@Headers()

@Req()

@Res()
```

---

## Service

```bash
nest g service users
```

Dependency Injection

```ts
constructor(
   private readonly usersService: UsersService
){}
```

---

# Giai đoạn 2. Dependency Injection

Hiểu

- Provider
- Singleton
- Scope
- Injectable
- Injection Token

Ví dụ

```ts
@Injectable()
export class UserService {}
```

---

## Custom Provider

```
useClass

useValue

useFactory

useExisting
```

---

## Module Export

```
Module A

↓

Export Service

↓

Module B Import
```

---

# Giai đoạn 3. Validation

Cài

```bash
npm i class-validator class-transformer
```

DTO

```ts
class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
```

Global Pipe

```ts
app.useGlobalPipes(new ValidationPipe());
```

Học

- whitelist
- forbidNonWhitelisted
- transform

---

# Giai đoạn 4. Exception

Exception

```
BadRequestException

UnauthorizedException

ForbiddenException

ConflictException

NotFoundException
```

Custom Exception

Exception Filter

---

# Giai đoạn 5. Database

## PostgreSQL

ORM

- TypeORM
- Prisma

Thực hành

- CRUD
- Relation
- Transaction
- Migration

---

## MongoDB

Mongoose

Học

- Schema
- Model
- Index
- Aggregate
- Populate

---

# Giai đoạn 6. Authentication

JWT

```
Register

↓

Login

↓

JWT

↓

Guard

↓

Current User
```

Học

- Passport
- JWT
- bcrypt
- Refresh Token

Decorator

```ts
@CurrentUser()
```

---

# Giai đoạn 7. Authorization

RBAC

```
Admin

Teacher

Student
```

Role Guard

Permission

ABAC

CASL (khuyến nghị)

---

# Giai đoạn 8. Middleware

Tạo middleware

```bash
nest g middleware logger
```

Ứng dụng

- Logging
- Request ID
- IP
- Rate Limit

---

# Giai đoạn 9. Guard

Hiểu

```
CanActivate
```

Ví dụ

```
JwtAuthGuard

RolesGuard
```

---

# Giai đoạn 10. Pipe

Pipe

```
ValidationPipe

ParseIntPipe

ParseUUIDPipe

ParseBoolPipe
```

Custom Pipe

---

# Giai đoạn 11. Interceptor

Ứng dụng

- Response Format
- Logging
- Cache
- Timeout

Ví dụ

```json
{
  "success": true,
  "data": {}
}
```

---

# Giai đoạn 12. Exception Filter

Global Error

```json
{
  "statusCode": 400,
  "message": "..."
}
```

---

# Giai đoạn 13. Config

```
.env
```

Dùng

```
ConfigModule

ConfigService
```

Validation env

Joi

---

# Giai đoạn 14. Upload File

Multer

```
FileInterceptor
```

Upload

- Local
- AWS S3
- Cloudinary

---

# Giai đoạn 15. Static File

ServeStaticModule

---

# Giai đoạn 16. Swagger

```
@nestjs/swagger
```

Sinh API

```
/api/docs
```

Decorator

```
@ApiTags

@ApiBody

@ApiResponse
```

---

# Giai đoạn 17. Logger

Nest Logger

Pino

Winston

Request Log

Error Log

---

# Giai đoạn 18. Caching

Redis

CacheModule

TTL

Invalidate Cache

---

# Giai đoạn 19. Queue

BullMQ

Redis

Ví dụ

```
Send Email

↓

Queue

↓

Worker
```

---

# Giai đoạn 20. Schedule

Cron

```
@Cron()

@Interval()

@Timeout()
```

---

# Giai đoạn 21. Event

EventEmitter

```
User Register

↓

Emit Event

↓

Send Email

↓

Create Notification
```

---

# Giai đoạn 22. WebSocket

Gateway

Socket.IO

Chat App

Notification

Realtime

---

# Giai đoạn 23. Microservice

Transport

- TCP
- Redis
- RabbitMQ
- Kafka
- NATS
- gRPC

Hiểu

```
API Gateway

↓

Microservice
```

---

# Giai đoạn 24. Docker

Dockerfile

docker-compose

Compose

```
Nest

Postgres

Redis

Nginx
```

---

# Giai đoạn 25. Testing

Unit Test

Jest

E2E

Supertest

Mock

Coverage

---

# Giai đoạn 26. Security

Helmet

CORS

Rate Limit

CSRF

XSS

SQL Injection

NoSQL Injection

Validation

Hash Password

Refresh Token Rotation

---

# Giai đoạn 27. Performance

Compression

Cache

Pagination

Cursor Pagination

Streaming

Connection Pool

Lazy Loading

Index Database

---

# Giai đoạn 28. Triển khai

Deploy

- VPS
- Docker
- Railway
- Render
- AWS EC2
- DigitalOcean

Reverse Proxy

Nginx

HTTPS

SSL

PM2

CI/CD

GitHub Actions

---

# Giai đoạn 29. Kiến trúc dự án

```
src
├── auth
├── users
├── posts
├── comments
├── common
│   ├── decorators
│   ├── filters
│   ├── guards
│   ├── interceptors
│   ├── pipes
│   └── utils
├── config
├── database
└── main.ts
```

---

# Giai đoạn 30. Design Pattern

- Repository Pattern
- Service Pattern
- Factory Pattern
- Strategy Pattern
- Adapter Pattern
- CQRS
- Clean Architecture
- DDD (cơ bản)

---

# Dự án thực hành theo từng cấp độ

## Level 1

- Todo API
- Notes API
- Blog API

Học

- CRUD
- Validation
- Swagger

---

## Level 2

- Ecommerce API

Có

- User
- Product
- Category
- Cart
- Order

---

## Level 3

- LMS (Hệ thống học trực tuyến)

Có

- Authentication
- Authorization
- Upload Video
- Comment
- Notification

---

## Level 4

- HRM

Có

- Attendance
- Leave
- Payroll
- Permission
- Shift
- Location

---

## Level 5

- Microservice Ecommerce

Service

- Auth
- User
- Product
- Payment
- Notification
- Order
- Search

Redis

Kafka

RabbitMQ

Docker

CI/CD

---

# Tài nguyên học

## Tài liệu chính thức

- https://docs.nestjs.com

## Kênh YouTube

- NestJS Official
- Code with Vlad
- freeCodeCamp
- Academind

## Khóa học

- NestJS Zero to Hero (Udemy)
- Ultimate NestJS (Udemy)

---

# Checklist hoàn thành

- [ ] Hiểu Dependency Injection
- [ ] Tạo Module
- [ ] Viết Controller
- [ ] Viết Service
- [ ] Validation DTO
- [ ] Exception Filter
- [ ] Authentication JWT
- [ ] Authorization RBAC
- [ ] Upload File
- [ ] PostgreSQL
- [ ] MongoDB
- [ ] Redis
- [ ] Queue
- [ ] WebSocket
- [ ] Cron Job
- [ ] Swagger
- [ ] Docker
- [ ] Testing
- [ ] Logging
- [ ] CI/CD
- [ ] Triển khai VPS
- [ ] Xây dựng API Production hoàn chỉnh

---

# Thứ tự ưu tiên học

1. TypeScript
2. Node.js & HTTP
3. NestJS Core (Module, Controller, Service)
4. Dependency Injection
5. DTO & Validation
6. Exception Handling
7. Database (PostgreSQL hoặc MongoDB)
8. Authentication (JWT)
9. Authorization (RBAC/ABAC)
10. Middleware, Guard, Pipe, Interceptor
11. Upload File & Swagger
12. Config & Logger
13. Redis & Cache
14. Queue (BullMQ)
15. Cron & Event
16. WebSocket
17. Testing
18. Docker
19. Security
20. Performance Optimization
21. Microservices
22. Clean Architecture & Design Patterns
23. CI/CD và triển khai Production
