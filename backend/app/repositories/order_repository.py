import json
import os
from typing import List
from app.config import settings
from app.models.order import OrderResponse


class OrderRepository:
    """Handles persistence of orders to JSON files."""

    def __init__(self, orders_dir: str = settings.ORDERS_DIR):
        self.orders_dir = orders_dir
        os.makedirs(orders_dir, exist_ok=True)

    def _file_path(self, symbol: str) -> str:
        return os.path.join(self.orders_dir, f"{symbol}.json")

    def load_orders(self, symbol: str) -> List[OrderResponse]:
        """Load all orders for a given symbol."""
        file_path = self._file_path(symbol)
        if not os.path.exists(file_path):
            return []
        with open(file_path, "r") as f:
            return [OrderResponse(**o) for o in json.load(f)]

    def save_order(self, order: OrderResponse):
        """Append a new order to the file for its symbol."""
        file_path = self._file_path(order.symbol)
        orders = []
        if os.path.exists(file_path):
            with open(file_path, "r") as f:
                orders = json.load(f)
        orders.append(order.dict())
        with open(file_path, "w") as f:
            json.dump(orders, f, indent=2)
