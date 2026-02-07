from passlib.context import CryptContext
from typing import Union

# Create password context for hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plaintext password against a hashed password.
    bcrypt only uses first 72 bytes, so truncate.
    """
    return pwd_context.verify(plain_password[:72], hashed_password)


def get_password_hash(password: str) -> str:
    """
    Generate a hash for a plaintext password.
    bcrypt max = 72 bytes → MUST truncate.
    """
    safe_password = password[:72]
    return pwd_context.hash(safe_password)


def validate_password_strength(password: str) -> Union[bool, str]:
    """
    Validate password strength requirements.
    """
    if len(password) < 8:
        return "Password must be at least 8 characters long"
    if not any(c.isupper() for c in password):
        return "Password must contain at least one uppercase letter"
    if not any(c.islower() for c in password):
        return "Password must contain at least one lowercase letter"
    if not any(c.isdigit() for c in password):
        return "Password must contain at least one digit"

    return True