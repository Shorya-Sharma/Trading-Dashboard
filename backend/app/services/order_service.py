import time
from fastapi import HTTPException
from app.models.order import OrderCreateRequest, OrderResponse
from app.models.symbol import Symbol
from app.repositories.order_repository import OrderRepository


class OrderService:
    """Business logic for validating and creating orders."""

    def __init__(self, repository: OrderRepository, symbols: list[Symbol]):
        self.repository = repository
        self.symbols = {s.symbol: s for s in symbols}

    def _validate_order(self, request: OrderCreateRequest) -> OrderResponse:
        """Ensure the order is valid before creation."""
        if request.symbol not in self.symbols:
            raise HTTPException(status_code=400, detail="Invalid symbol")

        symbol_meta = self.symbols[request.symbol]
        min_price, max_price = (
            symbol_meta.close_price * 0.8,
            symbol_meta.close_price * 1.2,
        )

        if not (min_price <= request.price <= max_price):
            raise HTTPException(
                status_code=400,
                detail=(
                    f"Price must be within ±20% of {symbol_meta.symbol} closePrice "
                    f"(allowed: {min_price:.2f} to {max_price:.2f})"
                ),
            )

        return OrderResponse(
            id=int(time.time() * 1000),
            symbol=request.symbol,
            side=request.side,
            quantity=request.quantity,
            price=request.price,
            timestamp=int(time.time()),
        )

    def create_order(self, request: OrderCreateRequest) -> OrderResponse:
        """Validate and persist a new order."""
        order = self._validate_order(request)
        self.repository.save_order(order)
        return order

    def list_orders(self, symbol: str) -> list[OrderResponse]:
        """Retrieve all orders for a given symbol."""
        if symbol not in self.symbols:
            raise HTTPException(status_code=400, detail="Invalid symbol")
        return self.repository.load_orders(symbol)
