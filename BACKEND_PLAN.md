# Senior Fullstack Development Plan: Job Application Tracker Backend

**Technology Stack:** Node.js (TypeScript, ESM), Prisma, Supabase (PostgreSQL DB & Auth)

**Goal:** Implement a RESTful API with Authentication and CRUD operations for job applications.

---

## I. Mockup Data Structure (JSON)

### User Model

Represents a user authenticated via Supabase/Firebase.

```json
// User Data (Stored in Supabase Auth, referenced in Prisma/DB)
{
	"id": "supabase-user-uuid-12345",
	"email": "user.one@example.com",
	"name": "Alex Johnson",
	"createdAt": "2024-07-01T10:00:00Z"
}
```

### Application Model (Main Data Entity)

Represents a single job application entry.

```json
[
	{
		"id": "app-uuid-501",
		"userId": "supabase-user-uuid-12345",
		"company": "TechCorp Innovations",
		"role": "Senior Software Engineer",
		"status": "Interview Scheduled",
		"dateApplied": "2024-10-20T00:00:00Z",
		"link": "https://careers.techcorp.com/sse-job-501",
		"notes": "Met with hiring manager Sarah L. Initial phone screen went well. Next step: technical interview on Oct 28th.",
		"salaryRange": "140k - 160k USD",
		"jobType": "Full-time",
		"location": "Remote (PST)",
		"createdAt": "2024-10-21T09:15:00Z",
		"updatedAt": "2024-10-25T14:30:00Z"
	},
	{
		"id": "app-uuid-502",
		"userId": "supabase-user-uuid-12345",
		"company": "FinanceFlow Solutions",
		"role": "Fullstack Developer",
		"status": "Applied",
		"dateApplied": "2024-10-25T00:00:00Z",
		"link": "https://boards.greenhouse.io/financeflow/jobs/1234567",
		"notes": "Used customized resume and cover letter emphasizing finance experience.",
		"salaryRange": null,
		"jobType": "Contract",
		"location": "New York, NY",
		"createdAt": "2024-10-25T11:00:00Z",
		"updatedAt": "2024-10-25T11:00:00Z"
	}
]
```

---

## II. Step-by-Step Development Plan

### Step 1: Project Setup and Initial Configuration

**Initialize Project:**

```bash
npm init -y
npx tsc --init
```

- Configure ESM: Add `"type": "module"` to package.json.

**Install Dependencies:**

```bash
npm install express @types/express typescript ts-node dotenv
npm install -D @types/node prisma
npx prisma init
```

- Configure `.env` with `DATABASE_URL` for Supabase.

**Prisma Schema Definition:**

- Define `Application` model, linking to `User` via Supabase UID.

### Step 2: Database Schema & Migration

```prisma
model User {
  id          String @id @db.Uuid
  applications Application[]
}

model Application {
  id          String   @id @default(uuid()) @db.Uuid
  userId      String   @db.Uuid
  company     String
  role        String
  status      String
  dateApplied DateTime @db.Date
  link        String?
  notes       String?
  salaryRange String?
  jobType     String?
  location    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user User @relation(fields: [userId], references: [id])

  @@index([userId])
}
```

**Apply Migration:**

```bash
npx prisma migrate dev --name init_application_tracker
```

- For production, deploy using Supabase dashboard or `db push`.

### Step 3: Core Structure (Server & Services)

**Project Structure:**

```
src/server.ts
src/routes/
src/controllers/
src/services/
src/middleware/
src/utils/
```

**Prisma Client Initialization:**

```ts
// src/utils/prisma.ts
import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
```

### Step 4: Middleware Implementation

**Authentication Middleware:** Verify JWT from Authorization header and attach `req.user`.

**Error Handling Middleware:** Catch runtime errors and return structured JSON responses.

### Step 5: Auth API Endpoints (Supabase Integration)

| HTTP Method | Route                 | Description                                             |
| ----------- | --------------------- | ------------------------------------------------------- |
| POST        | /api/v1/auth/register | Register user via Supabase and create Prisma User entry |
| POST        | /api/v1/auth/login    | Sign in via Supabase, return JWT/session                |
| POST        | /api/v1/auth/refresh  | Refresh token/session                                   |

### Step 6: CRUD API Endpoints

**Application Service:** Business logic with Prisma calls.

**RESTful Routes:**

| HTTP Method | Route                    | Description                                     |
| ----------- | ------------------------ | ----------------------------------------------- |
| POST        | /api/v1/applications     | Create application                              |
| GET         | /api/v1/applications     | List applications for user                      |
| GET         | /api/v1/applications/:id | Retrieve application by ID (ownership enforced) |
| PUT/PATCH   | /api/v1/applications/:id | Update application (ownership enforced)         |
| DELETE      | /api/v1/applications/:id | Delete application (ownership enforced)         |

- All routes use `isAuthenticated` middleware.

### Step 7: Finalize and Test

1. Mount routes in `src/server.ts`.

- Mount Routes: Import and use the auth.routes.ts and application.routes.ts in your main Express app (src/server.ts).Mount Routes: Import and use the auth.routes.ts and application.routes.ts in your main Express app (src/server.ts).

2. Apply Middleware Globally: Ensure the error handling middleware is the last thing mounted in Express.
3. Test with **unit** and **integration tests** (Supertest).

- Unit Tests: Test the application.service.ts functions in isolation (mocking Prisma).

- Integration Tests: Test the API routes using tools like Supertest, focusing on:

  - Successful CRUD operations with a valid token.

  - 401 Unauthorized responses for unauthenticated requests.

  - 404 Not Found or 403 Forbidden when attempting to access another user's application data.

---

## III. Middleware Summary

| Middleware Name     | Purpose                                                           | Applied To                         |
| ------------------- | ----------------------------------------------------------------- | ---------------------------------- |
| isAuthenticated     | Verifies JWT token, attaches userId, prevents unauthorized access | All `/api/v1/applications` routes  |
| errorHandler        | Catch runtime errors and format JSON response                     | Globally at the end of Express app |
| requestLogger (Opt) | Logs incoming requests for debugging/auditing                     | Globally, near top                 |

---

**End of Development Plan**
