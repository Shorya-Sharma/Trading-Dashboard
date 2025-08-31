from typing import List
import logging
from app.repositories.symbol_repository import SymbolRepository
from app.models.symbol import Symbol

logger = logging.getLogger(__name__)


class SymbolService:
    """Business logic for managing symbols."""

    def __init__(self, repository: SymbolRepository = None):
        self.repository = repository or SymbolRepository()

    def get_all_symbols(self) -> List[Symbol]:
        """Return all symbols as a list."""
        try:
            symbols = list(self.repository.load_symbols().values())
            logger.debug(f"Loaded {len(symbols)} symbols from repository")
            return symbols
        except Exception as e:
            logger.error(f"Error in SymbolService.get_all_symbols: {e}", exc_info=True)
            raise
