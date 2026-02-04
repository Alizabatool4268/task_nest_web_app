from passlib.context import CryptContext
from typing import Union

# Create password context for hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plaintext password against a hashed password.

    Args:
        plain_password (str): Plaintext password to verify
        hashed_password (str): Hashed password to compare against

    Returns:
        bool: True if passwords match, False otherwise
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Generate a hash for a plaintext password.

    Args:
        password (str): Plaintext password to hash

    Returns:
        str: Hashed password
    """
    return pwd_context.hash(password)


def validate_password_strength(password: str) -> Union[bool, str]:
    """
    Validate password strength requirements.

    Args:
        password (str): Password to validate

    Returns:
        Union[bool, str]: True if valid, error message string if invalid
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