import asyncio
import json
import logging
import random
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.tick_service import TickService

logger = logging.getLogger(__name__)
router = APIRouter()


@router.websocket("/ws/ticks")
async def stream_ticks(websocket: WebSocket):
    """
    WebSocket endpoint that streams live ticks for a subscribed symbol.
    """
    await websocket.accept()
    logger.info("WebSocket connection accepted")

    tick_service = TickService()
    subscribed_symbol = None

    try:
        while True:
            message = await websocket.receive_text()
            data = json.loads(message)

            if data.get("action") == "subscribe":
                subscribed_symbol = data.get("symbol")
                logger.info(f"Client subscribed to {subscribed_symbol}")

            while subscribed_symbol:
                tick = tick_service.get_tick_for_symbol(subscribed_symbol)

                if "error" in tick:
                    await websocket.send_json(tick)
                    logger.warning(tick)
                    break

                await websocket.send_json(tick)
                await asyncio.sleep(random.uniform(1, 2))

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
    except Exception as e:
        logger.error(f"Unexpected error in tick stream: {e}", exc_info=True)
        if websocket.application_state == websocket.application_state.CONNECTED:
            await websocket.close()
