# Quickstart Guide: JWT Authentication Implementation

## Prerequisites
- Python 3.8+
- FastAPI
- SQLModel
- Neon PostgreSQL database
- bcrypt for password hashing
- python-jose for JWT handling

## Required Dependencies
```bash
pip install fastapi sqlmodel uvicorn bcrypt python-jose[cryptography] python-dotenv
```

## Environment Variables
Create a `.env` file with:
```
DATABASE_URL=postgresql+asyncpg://username:password@localhost/dbname
JWT_SECRET_KEY=your-super-secret-key-here
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=15
```

## Implementation Order

### 1. Models First
- Create User and Task models with proper relationships
- Set up database engine and session

### 2. JWT Utilities
- Create JWT encoding/decoding functions
- Set up password hashing utilities

### 3. Auth Service
- Implement user registration/login logic
- Handle password verification

### 4. API Endpoints
- Create auth endpoints (signup, login, me)
- Protect task endpoints with JWT dependency

### 5. Task Ownership
- Enforce user_id checks in all task operations
- Filter tasks by authenticated user

## Key Components

### JWT Dependency Pattern
```python
def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = get_user_by_id(user_id)
    if user is None:
        raise credentials_exception
    return user
```

### Database Session Dependency
```python
def get_session():
    with Session(engine) as session:
        yield session
```