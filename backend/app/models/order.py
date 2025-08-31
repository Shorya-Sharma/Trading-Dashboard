from typing import Literal
from pydantic import BaseModel, Field


class OrderCreateRequest(BaseModel):
    """Request payload schema for creating an order."""

    symbol: str
    side: Literal["BUY", "SELL"]
    quantity: int = Field(..., gt=0)
    price: float = Field(..., gt=0)


class OrderResponse(OrderCreateRequest):
    """Response schema for an order with id and timestamp."""

    id: int
    timestamp: int
