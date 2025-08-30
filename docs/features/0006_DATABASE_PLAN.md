# Feature Plan: Database Setup and Prisma ORM

## Context

Implement database layer and Prisma ORM setup for the Next.js application. This plan focuses on database schema design, Prisma configuration, and database operations. The database will support authentication, user management, and usage tracking features.

## Technical Requirements

- **Database ORM**: Prisma
- **Database**: SQLite (for development) / PostgreSQL (for production)
- **Schema Design**: User authentication, sessions, and usage tracking
- **Migration Management**: Database schema migrations and seeding

## Files and Functions to Modify/Create

### Phase 1: Database Dependencies and Setup

#### New Dependencies (package.json)

- `@prisma/client` - Prisma client for database operations
- `prisma` - Prisma CLI (dev dependency)

#### Environment Configuration (.env.local)

- `DATABASE_URL` - Database connection string
- `DIRECT_URL` - Direct database connection (for migrations)

### Phase 2: Database Schema Design

#### Database Schema (prisma/schema.prisma)

- **User Model**: `id`, `email`, `name`, `emailVerified`, `image`, `createdAt`, `updatedAt`
- **Account Model**: `id`, `userId`, `type`, `provider`, `providerAccountId`, `refresh_token`, `access_token`, `expires_at`, `token_type`, `scope`, `id_token`, `session_state`
- **Session Model**: `id`, `sessionToken`, `userId`, `expires`
- **VerificationToken Model**: `identifier`, `token`, `expires`
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

## Integration Points

### Authentication Integration

This database plan provides the foundation for the authentication plan (0005_AUTHENTICATION_PLAN.md):

- User model for authentication
- Session management for NextAuth.js
- Account linking for OAuth providers

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

## Performance Considerations

- Database indexing strategy
- Connection pooling configuration
- Query optimization
- Migration performance for large datasets
