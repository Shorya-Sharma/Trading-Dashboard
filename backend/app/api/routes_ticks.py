from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio, json
from app.api.routes_symbols import SYMBOLS
from app.utils.tick_generator import generate_tick

router = APIRouter()

@router.websocket("/ws/ticks")
async def websocket_ticks(ws: WebSocket):
    await ws.accept()
    subscribed = None
    try:
        while True:
            msg = await ws.receive_text()
            data = json.loads(msg)

            if data.get("action") == "subscribe":
                subscribed = data["symbol"]

            while subscribed:
                sym = next((s for s in SYMBOLS if s.symbol == subscribed), None)
                if not sym:
                    await ws.send_json({"error": "Invalid symbol"})
                    break
                await ws.send_json(generate_tick(sym))
                await asyncio.sleep(1.5)
    except WebSocketDisconnect:
        print("WebSocket disconnected")
