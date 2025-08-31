import time
import logging
from fastapi import HTTPException
from app.models.order import OrderCreateRequest, OrderResponse
from app.models.symbol import Symbol
from app.repositories.order_repository import OrderRepository

logger = logging.getLogger(__name__)


class OrderService:
    """Business logic for validating and creating orders."""

    def __init__(self, repository: OrderRepository, symbols: list[Symbol]):
        self.repository = repository
        self.symbols = {s.symbol: s for s in symbols}

    def _validate_order(self, request: OrderCreateRequest) -> OrderResponse:
        if request.symbol not in self.symbols:
            logger.warning(f"Invalid symbol: {request.symbol}")
            raise HTTPException(status_code=400, detail="Invalid symbol")

        symbol_meta = self.symbols[request.symbol]
        min_price, max_price = (
            symbol_meta.close_price * 0.8,
            symbol_meta.close_price * 1.2,
        )

        if not (min_price <= request.price <= max_price):
            msg = (
                f"Price {request.price} out of range for {request.symbol} "
                f"(allowed: {min_price:.2f} - {max_price:.2f})"
            )
            logger.warning(msg)
            raise HTTPException(status_code=400, detail=msg)

        return OrderResponse(
            id=int(time.time() * 1000),
            symbol=request.symbol,
            side=request.side,
            quantity=request.quantity,
            price=request.price,
            timestamp=int(time.time()),
        )

    def create_order(self, request: OrderCreateRequest) -> OrderResponse:
        order = self._validate_order(request)
        try:
            self.repository.save_order(order)
            logger.info(f"Order created successfully: {order.dict()}")
            return order
        except Exception as e:
            logger.error(f"Error saving order: {e}", exc_info=True)
            raise

    def list_orders(self, symbol: str) -> list[OrderResponse]:
        if symbol not in self.symbols:
            logger.warning(f"Invalid symbol for listing orders: {symbol}")
            raise HTTPException(status_code=400, detail="Invalid symbol")
        try:
            orders = self.repository.load_orders(symbol)
            logger.info(f"Fetched {len(orders)} orders for symbol {symbol}")
            return orders
        except Exception as e:
            logger.error(f"Error loading orders for {symbol}: {e}", exc_info=True)
            raise
