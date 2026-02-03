# Quickstart Guide: Authentication Integration

## Overview
This guide provides a quick overview of setting up and running the authentication system with Better Auth frontend and JWT verification backend. The system includes enhanced security features such as strict JWT claim validation, malformed token detection, and performance optimization.

## Prerequisites
- Node.js 18+ for frontend
- Python 3.11+ for backend
- PostgreSQL database (Neon recommended)
- UV package manager for Python dependencies
- Environment variables configured

## Setup Steps

### 1. Environment Variables
Create a `.env` file with the following:
```
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
DATABASE_URL=postgresql://username:password@localhost:5432/your_database_name
```

### 2. Frontend Setup (Next.js + Better Auth)
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install better-auth @better-auth/react

# Configure Better Auth with JWT plugin
# See frontend/src/lib/auth.ts for implementation
```

### 3. Backend Setup (FastAPI + JWT Middleware)
```bash
# Navigate to backend directory
cd backend

# Install dependencies using UV
uv pip install fastapi sqlmodel pyjwt psycopg2-binary cryptography

# Run migrations
python -m src.models.migrate

# Start the backend server
uvicorn src.main:app --reload
```

### 4. Running the Applications
```bash
# Terminal 1: Start backend
cd backend && uvicorn src.main:app --reload

# Terminal 2: Start frontend
cd frontend && npm run dev
```

## Key Components

### Frontend Authentication Flow
1. User registers/logins via Better Auth components
2. Better Auth generates JWT containing user_id, email, exp with strict validation
3. JWT automatically attached to API requests via axios interceptor
4. Backend verifies JWT and extracts user context

### Backend Authentication Flow
1. JWT middleware intercepts incoming requests
2. Token signature verified using BETTER_AUTH_SECRET
3. Strict validation of required claims (user_id, email, exp) with proper types
4. User_id extracted and attached to request context
5. Task operations filtered by user_id for data isolation
6. Malformed, expired, or tampered tokens rejected with 401 Unauthorized

## Testing Authentication
```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "password":"securePassword123"}'

# Login to get JWT
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com", "password":"securePassword123"}'

# Use JWT to access protected endpoints
curl -X GET http://localhost:8000/api/v1/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"

# Test invalid token handling
curl -X GET http://localhost:8000/api/v1/tasks \
  -H "Authorization: Bearer INVALID_TOKEN_HERE"
# Should return 401 Unauthorized
```

## Security Features
- JWT tokens validated for required claims (user_id, email, exp)
- Malformed tokens (wrong format, tampered signatures) rejected
- Expired tokens rejected with 401 Unauthorized
- Consistent error responses for all authentication failures
- Performance optimized for sub-100ms token validation

## Troubleshooting
- If JWT validation fails, verify that `BETTER_AUTH_SECRET` is identical in frontend and backend
- Check that the JWT contains the expected claims: `user_id`, `email`, `exp`
- Ensure all API requests include the Authorization header with Bearer token
- Verify that database connections are properly configured
- Check that JWT tokens have not expired