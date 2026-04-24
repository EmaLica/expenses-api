# Expenses Tracker API

A personal finance tracking API built with NestJS and PostgreSQL. Designed both as a practical tool for managing personal expenses and as a showcase of serious backend architecture patterns.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | NestJS (v11) |
| Database | PostgreSQL 16 |
| ORM | Prisma (v5) |
| Auth | JWT + Argon2 |
| Frontend *(planned)* | Next.js / React |
| Caching *(planned)* | Redis |
| Deployment | Docker + VPS |

## Features

### Implemented
- [x] User registration (`POST /auth/signup`) with email/password validation
- [x] Password hashing with Argon2
- [x] Duplicate email detection — Prisma P2002 → `403 ForbiddenException`
- [x] User signin (`POST /auth/signin`) — credential lookup + Argon2 verify
- [x] Global `ValidationPipe` with whitelist (strips unexpected fields)
- [x] Prisma ORM integration with PostgreSQL
- [x] Database schema: `users` and `expenses` tables with relations
- [x] Expense table indexes on `userId` and `date` for query performance
- [x] Docker Compose setup for local development database
- [x] Empty module scaffolding: `UserModule`, `ExpenseModule`

### In Progress
- [ ] JWT access token returned on signin (`@nestjs/jwt` not yet installed)
- [ ] Auth guards for protected routes

### Planned
- [ ] Full JWT authentication flow (access + refresh tokens)
- [ ] Expense CRUD (`POST`, `GET`, `PATCH`, `DELETE /expenses`)
- [ ] Expense categories
- [ ] User profile management (`GET /users/me`, `PATCH /users/me`, `DELETE /users/me`)
- [ ] Monthly budget tracking
- [ ] Monthly spending charts (aggregated stats endpoint)
- [ ] CSV export
- [ ] Swagger / OpenAPI documentation
- [ ] Rate limiting
- [ ] Redis caching
- [ ] Unit tests (services)
- [ ] E2E tests (API flows)

## Project Structure

```
src/
├── auth/               # Auth module (signup, signin)
│   ├── dto/            # Validated request DTOs
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── user/               # User module (planned)
├── expense/            # Expense module (planned)
├── prisma/             # Global Prisma service
├── app.module.ts
└── main.ts

prisma/
├── schema.prisma       # Database schema
└── migrations/         # Applied migrations
```

## Database Schema

```prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  hash      String
  firstName String?
  lastName  String?
  expenses  Expense[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@map("users")
}

model Expense {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  amount      Decimal  @db.Decimal(10, 2)
  currency    String   @default("EUR")
  date        DateTime
  userId      Int
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("expenses")
}
```

## Getting Started

### Prerequisites

- Node.js >= 18
- Docker & Docker Compose

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/expenses-api.git
cd expenses-api

# Install dependencies
npm install

# Start the database
docker compose up -d

# Apply migrations
npx prisma migrate dev

# Start the development server
npm run start:dev
```

The API will be available at `http://localhost:3000`.

### Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL="postgresql://postgres:123@localhost:5434/expensestracker"
JWT_SECRET="your-secret-here"
PORT=3000
```

## API Endpoints

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/signup` | Register a new user | Public |
| `POST` | `/auth/signin` | Validate credentials (JWT pending) | Public |

#### `POST /auth/signup`

```json
{
  "email": "user@example.com",
  "password": "strongpassword"
}
```

#### `POST /auth/signin`

```json
{
  "email": "user@example.com",
  "password": "strongpassword"
}
```

### Expenses *(planned)*

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/expenses` | List all user expenses | JWT |
| `POST` | `/expenses` | Create a new expense | JWT |
| `GET` | `/expenses/:id` | Get expense by ID | JWT |
| `PATCH` | `/expenses/:id` | Update expense | JWT |
| `DELETE` | `/expenses/:id` | Delete expense | JWT |
| `GET` | `/expenses/stats/monthly` | Monthly summary | JWT |
| `GET` | `/expenses/export/csv` | Export to CSV | JWT |

### Users *(planned)*

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/users/me` | Get current user profile | JWT |
| `PATCH` | `/users/me` | Update profile | JWT |
| `DELETE` | `/users/me` | Delete account | JWT |

## Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Docker

```bash
# Start only the database (development)
docker compose up -d

# Stop the database
docker compose down
```

A full `docker-compose.yml` including the API service and Redis is planned for production deployment.

## Architecture Highlights

- **Module-based structure** — each domain (auth, user, expense) is an isolated NestJS module
- **Global PrismaModule** — single database connection shared across all modules
- **DTO validation** — all incoming data is validated and whitelisted before reaching service layer
- **Argon2 hashing** — more secure than bcrypt for password storage
- **Prisma migrations** — versioned, reproducible database schema changes

## Roadmap

1. Complete JWT auth (access + refresh token rotation)
2. Implement expense CRUD with ownership guards
3. Add categories to expenses
4. Monthly stats aggregation endpoint
5. CSV export
6. Swagger documentation
7. Redis caching for stats endpoints
8. Rate limiting on auth endpoints
9. Full test coverage (unit + e2e)
10. Production Docker Compose + VPS deployment guide

## License

MIT
