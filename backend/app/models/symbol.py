from pydantic import BaseModel


class Symbol(BaseModel):
    """Domain model representing a tradeable symbol (internal use)."""

    symbol: str
    name: str
    market: str
    close_price: float


class SymbolResponse(BaseModel):
    """API response schema for returning symbols."""

    symbol: str
    name: str
    market: str
    close_price: float
