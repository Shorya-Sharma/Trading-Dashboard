from typing import Literal

from pydantic import BaseModel, Field


class OrderRequest(BaseModel):
    symbol: str
    side: Literal["BUY", "SELL"]
    qty: int = Field(..., gt=0)
    price: float = Field(..., gt=0)


class Order(OrderRequest):
    id: int
    timestamp: int
