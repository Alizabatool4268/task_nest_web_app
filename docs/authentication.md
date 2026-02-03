# Authentication System Documentation

## Overview

This document describes the authentication system implemented using Better Auth for frontend and JWT verification on the backend.

## Architecture

The authentication system follows a clean separation architecture:

- **Frontend**: Next.js application using Better Auth for user registration, login, and JWT management
- **Backend**: FastAPI application with JWT middleware for token verification and user isolation
- **Database**: PostgreSQL with SQLModel for user and task management

## JWT Token Structure

JWT tokens contain the following claims:
- `user_id`: Unique identifier for the user
- `email`: User's email address
- `exp`: Expiration timestamp
- `iat`: Issued-at timestamp
- `sub`: Subject identifier (same as user_id)

## Security Features

- Strict JWT claim validation
- Malformed token detection
- Expired token rejection
- User isolation (users can only access their own data)
- Secure token transmission

## API Endpoints

### Task Endpoints (require authentication)

- `GET /api/v1/tasks` - Retrieve all tasks for the authenticated user
- `POST /api/v1/tasks` - Create a new task for the authenticated user
- `GET /api/v1/tasks/{id}` - Retrieve a specific task for the authenticated user
- `PUT /api/v1/tasks/{id}` - Update a specific task for the authenticated user
- `DELETE /api/v1/tasks/{id}` - Delete a specific task for the authenticated user
- `PATCH /api/v1/tasks/{id}/complete` - Mark a task as complete/incomplete

## Frontend Components

- `/auth/login` - User login page
- `/auth/signup` - User registration page
- `/tasks` - Task management page for authenticated users

## Environment Variables

- `BETTER_AUTH_SECRET` - Secret key for JWT signing and verification
- `DATABASE_URL` - Connection string for PostgreSQL database
- `NEXT_PUBLIC_API_BASE_URL` - Base URL for backend API calls