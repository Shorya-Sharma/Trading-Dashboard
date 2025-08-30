from pydantic import BaseModel


class Symbol(BaseModel):
    symbol: str
    name: str
    market: str
    closePrice: float
