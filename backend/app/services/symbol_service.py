from typing import List
from app.repositories.symbol_repository import SymbolRepository
from app.models.symbol import Symbol


class SymbolService:
    """Business logic for managing symbols."""

    def __init__(self, repository: SymbolRepository = None):
        self.repository = repository or SymbolRepository()

    def get_all_symbols(self) -> List[Symbol]:
        """Return all symbols as a list."""
        return list(self.repository.load_symbols().values())
