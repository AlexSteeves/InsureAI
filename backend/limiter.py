"""
Global daily claim limit — shared across all users regardless of IP.
Resets automatically at midnight UTC.
"""

from datetime import date, datetime, timezone
from threading import Lock

DAILY_LIMIT = 200

_lock = Lock()
_count = 0
_reset_date = date.today()


def check_and_increment() -> tuple[bool, int]:
    """
    Returns (allowed, remaining).
    Increments the counter if allowed.
    Resets automatically at midnight UTC.
    """
    global _count, _reset_date

    today = datetime.now(timezone.utc).date()

    with _lock:
        if today != _reset_date:
            _count = 0
            _reset_date = today

        if _count >= DAILY_LIMIT:
            return False, 0

        _count += 1
        return True, DAILY_LIMIT - _count


def remaining() -> int:
    today = datetime.now(timezone.utc).date()
    with _lock:
        if today != _reset_date:
            return DAILY_LIMIT
        return max(0, DAILY_LIMIT - _count)
