from typing import List
import logging
from fastapi import APIRouter, Depends, Query, HTTPException

from app.models.order import OrderResponse, OrderCreateRequest
from app.repositories.order_repository import OrderRepository
from app.services.order_service import OrderService
from app.services.symbol_service import SymbolService

logger = logging.getLogger(__name__)

router = APIRouter()


def get_order_service() -> OrderService:
    symbol_service = SymbolService()
    symbols = symbol_service.get_all_symbols()
    return OrderService(OrderRepository(), symbols)


@router.post("/orders", response_model=OrderResponse, summary="Create a new order")
async def create_order(
    request: OrderCreateRequest, service: OrderService = Depends(get_order_service)
):
    """Create a new order with validation and persistence."""
    try:
        return service.create_order(request)
    except HTTPException as e:
        logger.warning(f"Order validation failed: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error while creating order: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")


@router.get(
    "/orders", response_model=List[OrderResponse], summary="List orders for a symbol"
)
async def list_orders(
    symbol: str = Query(..., description="Symbol to fetch orders for"),
    service: OrderService = Depends(get_order_service),
):
    """List all stored orders for a given symbol."""
    try:
        return service.list_orders(symbol)
    except HTTPException as e:
        logger.warning(f"Invalid request for orders: {e.detail}")
        raise e
    except Exception as e:
        logger.error(f"Unexpected error while fetching orders: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to fetch orders: {str(e)}")
