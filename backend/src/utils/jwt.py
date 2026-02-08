from datetime import datetime, timedelta
from typing import Optional
import os
from jose import JWTError, jwt
from dotenv import load_dotenv

load_dotenv()

# Use BETTER_AUTH_SECRET to match your middleware
SECRET_KEY = os.getenv("BETTER_AUTH_SECRET")
if not SECRET_KEY:
    raise ValueError("BETTER_AUTH_SECRET environment variable is not set")

SECRET_KEY = SECRET_KEY.strip()

print(f"STARTUP DEBUG: SECRET_KEY length: {len(SECRET_KEY)}")
print(f"STARTUP DEBUG: SECRET_KEY repr: {repr(SECRET_KEY[:30])}")

ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Create a new JWT access token.
    """
    print(f"DEBUG CREATE: Creating token with data: {data}")
    print(f"DEBUG CREATE: SECRET_KEY being used: {SECRET_KEY[:15] if SECRET_KEY else 'None'}...")
    print(f"DEBUG CREATE: ALGORITHM: {ALGORITHM}")
    
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    print(f"DEBUG CREATE: Token created (first 20 chars): {encoded_jwt[:20]}...")

    return encoded_jwt

def verify_token(token: str):
    try:
        print(f"DEBUG: Attempting to decode token")
        print(f"DEBUG: Token (first 20 chars): {token[:20]}...")
        print(f"DEBUG: SECRET_KEY being used: {SECRET_KEY[:15] if SECRET_KEY else 'None'}...")
        print(f"DEBUG: ALGORITHM: {ALGORITHM}")
        
        # Try to decode without verification first to see the payload
        unverified = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options={"verify_signature": False})
        print(f"DEBUG: Unverified payload: {unverified}")
        
        # Now try with verification
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"DEBUG: Successfully decoded payload: {payload}")
        return payload
    except JWTError as e:
        print(f"JWT Error: {e}")
        print(f"Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        return None