# Feature Plan: Database Setup and Prisma ORM

## Context

Implement database layer and Prisma ORM setup for the Next.js application. This plan focuses on database schema design, Prisma configuration, and database operations. The database will support authentication, user management, and usage tracking features.

## Technical Requirements

- **Database ORM**: Prisma
- **Database**: SQLite (for development) / PostgreSQL (for production)
- **Schema Design**: User authentication, sessions, and usage tracking
- **Migration Management**: Database schema migrations and seeding
- **Current Status**: ⚠️ **NEEDS IMPLEMENTATION** - Only `@auth/prisma-adapter` installed via transitive dependency

## Files and Functions to Modify/Create

### Phase 1: Database Dependencies and Setup

#### New Dependencies (package.json)

**❌ MISSING - Need to Install:**

- `@prisma/client` - Prisma client for database operations (currently only via transitive dependency)
- `prisma` - Prisma CLI (dev dependency) - **NOT INSTALLED**

**✅ ALREADY INSTALLED:**

- `@auth/prisma-adapter@2.10.0` - NextAuth Prisma adapter (transitive dependency)

#### Environment Configuration (.env.local)

**❌ MISSING - Need to Add:**

- `DATABASE_URL` - Database connection string - **NOT SET**
- `DIRECT_URL` - Direct database connection (for migrations) - **NOT SET**
- `NEXTAUTH_SECRET` - NextAuth secret key - **NOT SET**

**✅ ALREADY CONFIGURED:**

- `GOOGLE_CLIENT_ID` - Google OAuth client ID (configured)
- Missing: `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_URL`

### Phase 2: Database Schema Design

#### Database Schema (prisma/schema.prisma)

**❌ CRITICAL: No schema file exists - needs to be created**

**Required Models for NextAuth.js Integration:**

- **User Model**: `id`, `email`, `name`, `emailVerified`, `image`, `createdAt`, `updatedAt`
- **Account Model**: `id`, `userId`, `type`, `provider`, `providerAccountId`, `refresh_token`, `access_token`, `expires_at`, `token_type`, `scope`, `id_token`, `session_state`
- **Session Model**: `id`, `sessionToken`, `userId`, `expires`
- **VerificationToken Model**: `identifier`, `token`, `expires`

**Application-Specific Models:**

- **UserUsage Model**: `id`, `userId`, `summaryCount`, `lastUsed`, `createdAt`, `updatedAt`

#### Prisma Configuration

- Database provider configuration (SQLite/PostgreSQL)
- Client generation settings
- Migration settings

### Phase 3: Prisma Client Setup

#### Prisma Client (src/lib/prisma.ts)

- Prisma client instance
- Connection management
- Error handling and connection pooling
- Development vs production configuration

#### Database Utilities (src/lib/db/)

- Database connection helpers
- Transaction management
- Connection health checks

### Phase 4: Database Operations

#### User Management Operations

- `createUser()` - Create new user account
- `findUserById()` - Find user by ID
- `findUserByEmail()` - Find user by email
- `updateUser()` - Update user information
- `deleteUser()` - Delete user account

#### Session Management Operations

- `createSession()` - Create new session
- `findSession()` - Find session by token
- `deleteSession()` - Delete session
- `cleanupExpiredSessions()` - Remove expired sessions

#### Usage Tracking Operations

- `createUserUsage()` - Initialize usage tracking for user
- `incrementUsage()` - Increment usage count
- `getUserUsage()` - Get current usage statistics
- `checkUsageLimit()` - Verify if user has exceeded limits
- `resetUsage()` - Reset usage for new period

### Phase 5: Database Migration and Seeding

#### Migration Setup

- Initialize Prisma with SQLite for development
- Create initial migration
- Database schema migration scripts

#### Data Seeding

- Development data seeding
- Test user accounts
- Sample usage data

### Phase 6: Usage Tracking System

#### Usage Management (src/lib/usage.ts)

- `trackUserUsage()` - Increment usage count for user
- `getUserUsage()` - Get current usage statistics
- `checkUsageLimit()` - Verify if user has exceeded limits
- `resetUsage()` - Reset usage for new period

#### Usage Components (src/components/usage/)

- **UsageDisplay**: Show current usage statistics
- **UsageLimit**: Display usage limits and warnings

#### API Integration Updates

- Modify existing summary generation to track usage
- Add usage validation before processing requests

#### Usage Tracking Flow

1. User requests summary generation
2. System checks if user is authenticated
3. If authenticated → Check current usage count
4. If within limits → Process request and increment usage
5. If limit exceeded → Show upgrade prompt or deny request

## Implementation Algorithm

### Database Setup Flow

1. Install Prisma dependencies
2. Initialize Prisma with database provider
3. Design and create schema
4. Generate Prisma client
5. Run initial migration
6. Seed development data

### Database Operations Flow

1. Prisma client handles database connections
2. Operations use Prisma's type-safe queries
3. Transactions ensure data consistency
4. Error handling for database failures
5. Connection pooling for performance

### Usage Tracking Flow

1. User requests summary generation
2. System validates authentication and usage limits
3. Database operations track and increment usage
4. Real-time usage statistics displayed to user
5. Limit enforcement prevents abuse

### Migration Flow

1. Schema changes in `schema.prisma`
2. Generate migration with `prisma migrate dev`
3. Apply migration to database
4. Update Prisma client
5. Verify schema consistency

## File Structure Changes

```
yt-scribe/
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   │   └── [timestamp]_[name]/
│   │       ├── migration.sql
│   │       └── migration_lock.toml
│   └── seed.ts
├── src/
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── usage.ts
│   │   └── db/
│   │       ├── users.ts
│   │       ├── sessions.ts
│   │       └── usage.ts
│   ├── components/
│   │   └── usage/
│   │       ├── UsageDisplay.tsx
│   │       └── UsageLimit.tsx
│   └── types/
│       └── database.ts
├── .env.local
└── package.json
```

## Database Schema Details

### User Model

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  usage         UserUsage?
}
```

### Account Model

```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
```

### Session Model

```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### VerificationToken Model

```prisma
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

### UserUsage Model

```prisma
model UserUsage {
  id           String   @id @default(cuid())
  userId       String   @unique
  summaryCount Int      @default(0)
  lastUsed     DateTime @default(now())
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Critical Integration Issues

### 🚨 Authentication Integration Problems

**Current State vs Plan Mismatch:**

1. **Session Strategy Conflict**:

   - Plan specifies: Database sessions with Prisma adapter
   - Current implementation: JWT-only strategy in `src/lib/auth.ts`
   - **Impact**: No database persistence, sessions not tracked

2. **Hardcoded Authentication**:

   - Demo credentials hardcoded in `src/lib/auth.ts` (lines 21-30)
   - **Security Risk**: Production code contains test credentials

3. **Missing Database Integration**:
   - NextAuth configured but not using Prisma adapter
   - No database operations for user management
   - Registration form simulates but doesn't create users

### 🔧 Usage Tracking Integration Issues

**Complete Feature Missing:**

- No usage tracking implementation found
- Dashboard exists but no usage limits enforced
- No API endpoints for tracking summary generation
- No components for displaying usage statistics

## Integration Points

### Authentication Integration

This database plan provides the foundation for the authentication plan (0005_AUTHENTICATION_PLAN.md):

- User model for authentication
- Session management for NextAuth.js
- Account linking for OAuth providers

**⚠️ REQUIRES IMMEDIATE FIXES:**

- Switch from JWT to database sessions
- Remove hardcoded credentials
- Implement Prisma adapter integration

### API Integration

- Database operations for user management
- Usage tracking for summary generation
- Session validation for protected routes
- Usage limit enforcement
- Real-time usage statistics

### Development Workflow

- Database schema versioning
- Development data seeding
- Migration testing and rollback

## Environment Configuration

### Development (SQLite)

```env
DATABASE_URL="file:./dev.db"
DIRECT_URL="file:./dev.db"
```

### Production (PostgreSQL)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
DIRECT_URL="postgresql://user:password@localhost:5432/dbname"
```

## Security Considerations

- Database connection security
- Environment variable protection
- SQL injection prevention (handled by Prisma)
- Database access control
- Connection pooling limits
- Usage tracking security (prevent manipulation)
- Rate limiting for database operations

## Implementation Priority

### 🔥 **CRITICAL - Immediate Actions Required**

1. **Install Missing Dependencies**

   ```bash
   npm install prisma @prisma/client
   npm install -D prisma
   ```

2. **Create Database Schema**

   - Initialize Prisma: `npx prisma init`
   - Create `prisma/schema.prisma` with NextAuth models
   - Configure SQLite for development

3. **Fix Environment Configuration**

   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_SECRET="your-secret-here"
   ```

4. **Update NextAuth Configuration**
   - Switch from JWT to database strategy
   - Integrate Prisma adapter
   - Remove hardcoded credentials

### 🚀 **HIGH PRIORITY - Core Features**

5. **Implement User Registration**

   - Create user creation API endpoint
   - Update registration form to use real backend
   - Add proper validation and error handling

6. **Implement Usage Tracking**
   - Create usage tracking database operations
   - Add usage validation to summary generation
   - Create usage display components

### 📈 **MEDIUM PRIORITY - Enhancements**

7. **Database Operations Layer**

   - Create `src/lib/db/` utilities
   - Implement user management functions
   - Add session management operations

8. **Migration and Seeding**
   - Set up development data seeding
   - Create migration scripts
   - Add database health checks

## Performance Considerations

- Database indexing strategy
- Connection pooling configuration
- Query optimization
- Migration performance for large datasets
