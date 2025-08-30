import json
import os
from typing import List

from app.config import settings
from app.models.order import Order


class OrderRepository:
    def __init__(self, orders_dir: str = settings.ORDERS_DIR):
        self.orders_dir = orders_dir
        os.makedirs(orders_dir, exist_ok=True)

    def _filepath(self, symbol: str) -> str:
        return os.path.join(self.orders_dir, f"{symbol}.json")

    def load_orders(self, symbol: str) -> List[Order]:
        filepath = self._filepath(symbol)
        if not os.path.exists(filepath):
            return []
        with open(filepath, "r") as f:
            return [Order(**o) for o in json.load(f)]

    def save_order(self, order: Order):
        filepath = self._filepath(order.symbol)
        orders = []
        if os.path.exists(filepath):
            with open(filepath, "r") as f:
                orders = json.load(f)
        orders.append(order.dict())
        with open(filepath, "w") as f:
            json.dump(orders, f, indent=2)
