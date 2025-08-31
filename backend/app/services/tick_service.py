import random
import time
import logging
from app.models.symbol import Symbol
from app.services.symbol_service import SymbolService

logger = logging.getLogger(__name__)


class TickService:
    """Service responsible for generating and serving live ticks."""

    def __init__(self):
        self.symbol_service = SymbolService()

    def get_tick_for_symbol(self, symbol_code: str) -> dict:
        """
        Get a simulated tick for the given symbol.
        Returns tick data if symbol exists, otherwise returns error dict.
        """
        symbol_meta = next(
            (
                s
                for s in self.symbol_service.get_all_symbols()
                if s.symbol == symbol_code
            ),
            None,
        )

        if not symbol_meta:
            return {"error": f"Invalid symbol: {symbol_code}"}

        return self._generate_tick(symbol_meta)

    def _generate_tick(self, symbol: Symbol) -> dict:
        """
        Generate a tick in ±5% range of symbol's close price.
        """
        base_price = symbol.close_price
        price = round(random.uniform(base_price * 0.95, base_price * 1.05), 2)
        volume = random.randint(1, 1000)
        tick = {
            "symbol": symbol.symbol,
            "price": price,
            "volume": volume,
            "timestamp": int(time.time()),
        }
        logger.debug(f"Generated tick: {tick}")
        return tick
