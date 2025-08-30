import time
from fastapi import HTTPException
from app.models.order import Order, OrderRequest
from app.models.symbol import Symbol
from app.repositories.order_repository import OrderRepository

class OrderService:
    def __init__(self, repository: OrderRepository, symbols: list[Symbol]):
        self.repository = repository
        self.symbols = {s.symbol: s for s in symbols}

    def validate_order(self, req: OrderRequest) -> Order:
        if req.symbol not in self.symbols:
            raise HTTPException(status_code=400, detail="Invalid symbol")

        sym = self.symbols[req.symbol]
        min_price, max_price = sym.closePrice * 0.8, sym.closePrice * 1.2

        if not (min_price <= req.price <= max_price):
            raise HTTPException(
                status_code=400,
                detail=f"Price must be within ±20% of {sym.symbol} closePrice "
                       f"(allowed: {min_price:.2f} to {max_price:.2f})"
            )

        return Order(
            id=int(time.time() * 1000),
            symbol=req.symbol,
            side=req.side,
            qty=req.qty,
            price=req.price,
            timestamp=int(time.time())
        )

    def create_order(self, req: OrderRequest) -> Order:
        order = self.validate_order(req)
        self.repository.save_order(order)
        return order

    def list_orders(self, symbol: str) -> list[Order]:
        if symbol not in self.symbols:
            raise HTTPException(status_code=400, detail="Invalid symbol")
        return self.repository.load_orders(symbol)
