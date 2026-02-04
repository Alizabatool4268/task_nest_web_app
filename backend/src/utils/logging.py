import logging
import sys
from datetime import datetime
from typing import Optional

# Create logger for authentication
auth_logger = logging.getLogger("auth")
auth_logger.setLevel(logging.INFO)

# Create console handler
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.INFO)

# Create file handler
file_handler = logging.FileHandler("auth.log")
file_handler.setLevel(logging.INFO)

# Create formatter
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
console_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)

# Add handlers to logger
auth_logger.addHandler(console_handler)
auth_logger.addHandler(file_handler)


def log_auth_success(user_id: str, action: str, ip_address: Optional[str] = None):
    """
    Log successful authentication events.

    Args:
        user_id (str): ID of the authenticated user
        action (str): Action performed (login, register, etc.)
        ip_address (Optional[str]): IP address of the request
    """
    message = f"SUCCESS - User: {user_id}, Action: {action}"
    if ip_address:
        message += f", IP: {ip_address}"

    auth_logger.info(message)


def log_auth_failure(user_id: Optional[str], action: str, reason: str, ip_address: Optional[str] = None):
    """
    Log authentication failure events.

    Args:
        user_id (Optional[str]): ID of the user (if available)
        action (str): Action attempted (login, register, etc.)
        reason (str): Reason for failure
        ip_address (Optional[str]): IP address of the request
    """
    message = f"FAILURE - "
    if user_id:
        message += f"User: {user_id}, "
    else:
        message += "User: UNKNOWN, "

    message += f"Action: {action}, Reason: {reason}"
    if ip_address:
        message += f", IP: {ip_address}"

    auth_logger.warning(message)


def log_jwt_validation(event: str, user_id: Optional[str] = None, reason: Optional[str] = None):
    """
    Log JWT validation events.

    Args:
        event (str): Type of event (validation, expiration, etc.)
        user_id (Optional[str]): ID of the user (if available)
        reason (Optional[str]): Reason for the event
    """
    message = f"JWT - Event: {event}"
    if user_id:
        message += f", User: {user_id}"
    if reason:
        message += f", Reason: {reason}"

    auth_logger.info(message)