import random
import time
import logging
from app.models.symbol import Symbol

logger = logging.getLogger(__name__)


class TickService:
    """Service to generate simulated ticks for a symbol."""

    @staticmethod
    def generate_tick(symbol: Symbol) -> dict:
        """Generate a tick in ±5% range of close_price."""
        base = symbol.close_price
        price = round(random.uniform(base * 0.95, base * 1.05), 2)
        volume = random.randint(1, 1000)
        tick = {
            "symbol": symbol.symbol,
            "price": price,
            "volume": volume,
            "timestamp": int(time.time()),
        }
        logger.debug(f"Generated tick: {tick}")
        return tick
