from sqlmodel import Session, select
from typing import Optional
from ..models.user import User, UserCreate
from ..utils.security import verify_password, get_password_hash
from ..utils.jwt import create_access_token
from datetime import timedelta


class AuthService:
    """Service class for handling authentication-related operations."""

    def create_user(self, db: Session, user_create: UserCreate) -> User:
        """
        Create a new user with hashed password.

        Args:
            db (Session): Database session
            user_create (UserCreate): User creation data

        Returns:
            User: Created user object
        """
        # Check if user with email already exists
        existing_user = db.exec(select(User).where(User.email == user_create.email)).first()
        if existing_user:
            raise ValueError("Email already registered")

        # Hash the password
        hashed_password = get_password_hash(user_create.password)

        # Create the user object
        db_user = User(
            name=user_create.name,
            email=user_create.email,
            password_hash=hashed_password
        )

        # Add to database
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        return db_user

    def authenticate_user(self, db: Session, email: str, password: str) -> Optional[User]:
        """
        Authenticate a user with email and password.

        Args:
            db (Session): Database session
            email (str): User's email
            password (str): User's password

        Returns:
            Optional[User]: User object if authentication successful, None otherwise
        """
        # Find user by email
        statement = select(User).where(User.email == email)
        user = db.exec(statement).first()

        if not user:
            # Return None if user doesn't exist
            return None

        if not verify_password(password, user.password_hash):
            # Return None if password is incorrect
            return None

        return user

    def create_access_token_for_user(self, user: User) -> str:
        """
        Create an access token for a user.

        Args:
            user (User): User object

        Returns:
            str: JWT access token
        """
        # Prepare data to encode in the token
        data = {
            "sub": str(user.id),
            "email": user.email,
            "user_id": str(user.id)
        }

        # Create and return the token
        access_token = create_access_token(data=data)
        return access_token

    def get_user_by_email(self, db: Session, email: str) -> Optional[User]:
        """
        Get a user by email.

        Args:
            db (Session): Database session
            email (str): User's email

        Returns:
            Optional[User]: User object if found, None otherwise
        """
        statement = select(User).where(User.email == email)
        user = db.exec(statement).first()
        return user

    def get_user_by_id(self, db: Session, user_id: str) -> Optional[User]:
        """
        Get a user by ID.

        Args:
            db (Session): Database session
            user_id (str): User's ID

        Returns:
            Optional[User]: User object if found, None otherwise
        """
        statement = select(User).where(User.id == user_id)
        user = db.exec(statement).first()
        return user