from typing import List

from fastapi import APIRouter, Depends, Query

from app.api.routes_symbols import SYMBOLS
from app.models.order import Order, OrderRequest
from app.repositories.order_repository import OrderRepository
from app.services.order_service import OrderService

router = APIRouter()


def get_order_service():
    return OrderService(OrderRepository(), SYMBOLS)


@router.post("/orders", response_model=Order)
async def create_order(
    req: OrderRequest, service: OrderService = Depends(get_order_service)
):
    return service.create_order(req)


@router.get("/orders", response_model=List[Order])
async def list_orders(
    symbol: str = Query(...), service: OrderService = Depends(get_order_service)
):
    return service.list_orders(symbol)
