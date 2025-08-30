import os

class Settings:
    ORDERS_DIR: str = os.getenv("ORDERS_DIR", "orders")
    SYMBOLS_FILE: str = os.getenv("SYMBOLS_FILE", "symbols.json")

settings = Settings()
