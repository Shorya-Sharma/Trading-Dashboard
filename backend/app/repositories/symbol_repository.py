import json
import logging
from pathlib import Path
from typing import Dict
from app.config import settings
from app.models.symbol import Symbol

logger = logging.getLogger(__name__)


class SymbolRepository:
    """Handles reading symbols from the symbols.json file."""

    def __init__(self, symbols_file: str = settings.SYMBOLS_FILE):
        self.symbols_file = Path(symbols_file)

    def load_symbols(self) -> Dict[str, Symbol]:
        """
        Load symbols from JSON file into a dict {symbol: Symbol}.
        Maps external JSON keys (camelCase) to internal model keys (snake_case).
        """
        if not self.symbols_file.exists():
            logger.error(f"Symbols file not found at {self.symbols_file}")
            raise FileNotFoundError(f"Symbols file not found: {self.symbols_file}")

        try:
            with open(self.symbols_file, "r") as f:
                symbols_data = json.load(f)

            mapped_symbols = []
            for s in symbols_data:
                mapped_symbols.append(
                    Symbol(
                        symbol=s["symbol"],
                        name=s["name"],
                        market=s["market"],
                        close_price=s["closePrice"],
                    )
                )

            logger.info(f"Successfully loaded {len(mapped_symbols)} symbols")
            return {s.symbol: s for s in mapped_symbols}

        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in {self.symbols_file}: {e}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error loading symbols: {e}", exc_info=True)
            raise
