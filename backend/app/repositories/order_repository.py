import json
import os
import logging
from typing import List
from app.config import settings
from app.models.order import OrderResponse

logger = logging.getLogger(__name__)


class OrderRepository:
    """Handles persistence of orders to JSON files."""

    def __init__(self, orders_dir: str = settings.ORDERS_DIR):
        self.orders_dir = orders_dir
        os.makedirs(orders_dir, exist_ok=True)

    def _file_path(self, symbol: str) -> str:
        return os.path.join(self.orders_dir, f"{symbol}.json")

    def load_orders(self, symbol: str) -> List[OrderResponse]:
        file_path = self._file_path(symbol)
        if not os.path.exists(file_path):
            logger.info(f"No orders file found for {symbol}, returning empty list")
            return []
        try:
            with open(file_path, "r") as f:
                data = json.load(f)
                logger.debug(f"Loaded {len(data)} orders from {file_path}")
                return [OrderResponse(**o) for o in data]
        except Exception as e:
            logger.error(f"Failed to load orders from {file_path}: {e}", exc_info=True)
            raise

    def save_order(self, order: OrderResponse):
        file_path = self._file_path(order.symbol)
        try:
            orders = []
            if os.path.exists(file_path):
                with open(file_path, "r") as f:
                    orders = json.load(f)
            orders.append(order.dict())
            with open(file_path, "w") as f:
                json.dump(orders, f, indent=2)
            logger.debug(f"Saved order {order.id} to {file_path}")
        except Exception as e:
            logger.error(
                f"Failed to save order {order.id} to {file_path}: {e}", exc_info=True
            )
            raise
