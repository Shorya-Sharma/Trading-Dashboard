import asyncio
import json
import logging
import random
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.symbol_service import SymbolService
from app.services.tick_service import TickService
from app.config import settings

logger = logging.getLogger(__name__)
router = APIRouter()


@router.websocket("/ws/ticks")
async def websocket_ticks(websocket: WebSocket):
    # ✅ Origin validation for WebSocket (manual CORS handling)
    origin = websocket.headers.get("origin")
    if (
        origin not in settings.CORS_ALLOWED_ORIGINS
        and "*" not in settings.CORS_ALLOWED_ORIGINS
    ):
        logger.warning(f"WebSocket connection rejected from origin: {origin}")
        await websocket.close(code=1008)  # Policy Violation
        return

    await websocket.accept()
    logger.info("WebSocket connection accepted")

    symbol_service = SymbolService()
    subscribed_symbol = None

    try:
        while True:
            # ✅ Wait for subscribe message
            message = await websocket.receive_text()
            data = json.loads(message)

            if data.get("action") == "subscribe":
                subscribed_symbol = data.get("symbol")
                logger.info(f"Client subscribed to ticks for {subscribed_symbol}")

            # ✅ Stream ticks for the subscribed symbol
            while subscribed_symbol:
                symbol_meta = next(
                    (
                        s
                        for s in symbol_service.get_all_symbols()
                        if s.symbol == subscribed_symbol
                    ),
                    None,
                )

                if not symbol_meta:
                    error_msg = {"error": f"Invalid symbol: {subscribed_symbol}"}
                    await websocket.send_json(error_msg)
                    logger.warning(error_msg)
                    break

                tick = TickService.generate_tick(symbol_meta)
                await websocket.send_json(tick)
                await asyncio.sleep(random.uniform(1, 2))  # tick interval

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    except Exception as e:
        logger.error(f"Unexpected error in tick stream: {e}", exc_info=True)
        if websocket.application_state == websocket.application_state.CONNECTED:
            await websocket.close()
