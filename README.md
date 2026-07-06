# Production & Stock Management API

REST API for production and inventory management, built with **Express 5**, **TypeScript** and **TypeORM** over **PostgreSQL**.

It handles users, products, stock movements (in/out) and stock adjustments, with JWT authentication stored in HTTP-only cookies, role-based access (admin), DTO validation, pagination and concurrency-safe stock mutations.

## Features

- 🔐 **JWT authentication** via HTTP-only cookies (access + refresh tokens) with logout and token refresh.
- 👤 **User management** (admin only): create, update, deactivate/reactivate and list users with filters.
- 📦 **Product catalog**: create, list (with filters & pagination), fetch by id and soft-delete.
- 🔄 **Stock movements**: register `IN` / `OUT` movements that update product stock.
- 🧮 **Stock adjustments** (admin only): set an absolute stock value while recording the expected stock and the difference.
- 🔒 **Concurrency-safe stock**: mutations run inside transactions with a `pessimistic_write` lock on the product row.
- ✅ **DTO validation** with `class-validator` / `class-transformer`.
- 📄 **Consistent responses** and **centralized error handling**.
- 🌱 **Startup seeding** of a default admin user and sample products.

## Tech Stack

| Area           | Technology                          |
| -------------- | ----------------------------------- |
| Runtime        | Node.js                             |
| Language       | TypeScript (ESM, `nodenext`)        |
| Framework      | Express 5                           |
| ORM            | TypeORM 0.3                         |
| Database       | PostgreSQL                          |
| Auth           | JSON Web Tokens + bcrypt            |
| Validation     | class-validator / class-transformer |
| Logging        | morgan                              |

## Architecture

Layered architecture, requests flow top-down:

```
routes → controllers → services → repositories → TypeORM entities
```

- **routes** — define endpoints and attach middleware (auth, validation).
- **controllers** — read the request, call a service, return the response.
- **services** — business logic; build the response envelope.
- **repositories** — TypeORM data access.
- **entities** — database models.

Cross-cutting pieces live in `middelwares/` (auth, validation, error handler) and `utills/` (tokens, cookies, pagination, seeding).

## Requirements

- Node.js 18+ (ESM + top-level await)
- PostgreSQL 13+

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file
cp .env.example .env
# then fill in the values (see below)

# 3. Run database migrations
npm run migration:run

# 4. Start the development server (hot reload)
npm run dev
```

The server starts on `http://localhost:<PORT>` (default `5004`). On first boot it seeds a default admin user and some sample products.

### Default admin credentials

```
email:    user@admind.com
password: <ADMIN_PASSWORD from your .env>
```

## Environment Variables

Defined in `.env` at the project root (see [`.env.example`](.env.example)):

| Variable         | Required | Default     | Description                          |
| ---------------- | -------- | ----------- | ------------------------------------ |
| `DB_HOST`        | no       | `localhost` | PostgreSQL host                      |
| `DB_PORT`        | no       | `5432`      | PostgreSQL port                      |
| `DB_USERNAME`    | no       | `postgres`  | PostgreSQL user                      |
| `DB_PASSWORD`    | **yes**  | —           | PostgreSQL password                  |
| `DB_DATABASE`    | no       | `postgres`  | Database name                        |
| `PORT`           | no       | `3000`      | HTTP server port                     |
| `JWT_SECRET`     | **yes**  | —           | Secret used to sign JWTs             |
| `ADMIN_PASSWORD` | **yes**  | —           | Password for the seeded admin user   |

Required variables are validated on boot — the app exits with a clear message if any is missing.

## Scripts

```bash
npm run dev                 # Start with hot reload (tsx watch)
npm run build               # Compile TypeScript to dist/
npm run start               # Run the compiled app (dist/server.js)
npm run users:list          # Print all registered users (maintenance utility)

npm run migration:generate src/migrations/<Name>   # Generate a migration from entity changes
npm run migration:create   src/migrations/<Name>   # Create an empty migration
npm run migration:run                              # Apply pending migrations
npm run migration:revert                           # Roll back the last migration
```

## Interactive API Docs (Swagger)

Once the server is running, open **[http://localhost:5004/api/docs](http://localhost:5004/api/docs)** for the full interactive Swagger UI. You can try every endpoint from the browser — log in via `POST /auth/login` first and the auth cookie is sent automatically on subsequent calls.

## API Reference

All routes are mounted under `/api`. Authentication uses HTTP-only cookies, so send requests with credentials included (e.g. `fetch(..., { credentials: "include" })` or `curl --cookie-jar`).

Legend: 🔓 public · 🔑 requires login · 👑 requires admin.

### Auth — `/api/auth`

| Method | Endpoint           | Access | Description                              |
| ------ | ------------------ | ------ | ---------------------------------------- |
| POST   | `/login`           | 🔓     | Log in; sets `accessToken` & `refreshToken` cookies |
| POST   | `/refresh`         | 🔓\*   | Issue new tokens from the `refreshToken` cookie |
| POST   | `/logout`          | 🔑     | Clear auth cookies                       |
| PATCH  | `/change-password` | 🔑     | Change the logged-in user's password     |

\* `/refresh` requires a valid `refreshToken` cookie.

**Login body**

```json
{ "email": "user@admind.com", "password": "your_password" }
```

### Users — `/api/user` 👑

| Method | Endpoint         | Description                          |
| ------ | ---------------- | ------------------------------------ |
| GET    | `/`              | List users (filters & pagination)    |
| GET    | `/:uuid`         | Get a user by UUID                   |
| POST   | `/`                 | Create a user                        |
| PATCH  | `/:uuid`            | Update a user                        |
| PATCH  | `/:uuid/reactivate` | Reactivate a deactivated user        |
| DELETE | `/:uuid`            | Deactivate a user (soft delete)      |

List filters (query params): `name`, `email`, `isAdmin`, `isActive`, `sortBy`, `order`, `page`, `limit`.

### Products — `/api/product` 🔑

| Method | Endpoint            | Description                       |
| ------ | ------------------- | --------------------------------- |
| GET    | `/`                 | List products (filters & pagination) |
| GET    | `/:uuid`            | Get a product by UUID             |
| POST   | `/`                 | Create a product                  |
| PATCH  | `/:uuid`            | Update a product                  |
| DELETE | `/:uuid`            | Soft-delete a product             |

**Create product body**

```json
{ "name": "Product name", "stock": 100 }
```

### Stock Movements — `/api/movements` 🔑

| Method | Endpoint                       | Description                          |
| ------ | ------------------------------ | ------------------------------------ |
| GET    | `/`                            | List movements (filters & pagination) |
| POST   | `/:productUuid`                | Register an `IN`/`OUT` movement      |

**Register movement body**

```json
{ "quantity": 10, "typeMovement": "IN", "note": "optional note" }
```

`typeMovement` is one of `IN` | `OUT`. `OUT` movements that would push stock below zero are rejected.

### Stock Adjustments — `/api/adjustment` 👑

| Method | Endpoint                          | Description                          |
| ------ | --------------------------------- | ------------------------------------ |
| GET    | `/`                | List adjustments (filters & pagination) |
| GET    | `/:adjustmentUuid` | Get an adjustment by UUID            |
| POST   | `/:productUuid`    | Set an absolute stock value          |

**Register adjustment body**

```json
{ "newStock": 80, "reason": "stocktake", "note": "optional note" }
```

## Response Conventions

Single-item endpoints return an `ApiResponse<T>`:

```json
{ "success": true, "message": "...", "data": { } }
```

List endpoints return a `PaginatedResponse<T>`:

```json
{
  "success": true,
  "message": "...",
  "total": 42,
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "data": []
}
```

## Error Handling

Errors are thrown as `AppError(message, statusCode)` and caught by a global error handler that returns:

```json
{ "status": "fail", "message": "Human-readable message" }
```

JWT errors map to `401`, validation errors to `400`, and any unexpected error to a generic `500`.

## License

[MIT](LICENSE) © Juan Martin Grado
