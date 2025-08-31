import json
from pathlib import Path
from typing import Dict
from app.config import settings
from app.models.symbol import Symbol


class SymbolRepository:
    """Handles reading symbols from the symbols.json file."""

    def __init__(self, symbols_file: str = settings.SYMBOLS_FILE):
        self.symbols_file = Path(symbols_file)

    def load_symbols(self) -> Dict[str, Symbol]:
        """Load symbols from JSON file into a dict {symbol: Symbol}."""
        if not self.symbols_file.exists():
            raise FileNotFoundError(f"Symbols file not found: {self.symbols_file}")

        with open(self.symbols_file, "r") as f:
            symbols_data = json.load(f)

        return {s["symbol"]: Symbol(**s) for s in symbols_data}
