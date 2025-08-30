from pydantic import BaseModel, Field
from typing import Literal

class OrderRequest(BaseModel):
    symbol: str
    side: Literal["BUY", "SELL"]
    qty: int = Field(..., gt=0)
    price: float = Field(..., gt=0)

class Order(OrderRequest):
    id: int
    timestamp: int
