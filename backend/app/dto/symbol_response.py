from pydantic import BaseModel


class SymbolResponse(BaseModel):
    symbol: str
    name: str
    market: str
    closePrice: float
