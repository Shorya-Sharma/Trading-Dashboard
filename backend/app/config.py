import os
from typing import List


class Settings:
    """Application configuration loaded from environment variables."""

    ORDERS_DIR: str = os.getenv("ORDERS_DIR", "orders")
    SYMBOLS_FILE: str = os.getenv("SYMBOLS_FILE", "symbols.json")

    origins = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000")
    CORS_ALLOWED_ORIGINS: List[str] = origins.split(",")


settings = Settings()
