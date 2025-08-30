from fastapi import APIRouter
from typing import List
from app.models.symbol import Symbol
import json
from app.config import settings

router = APIRouter()

# Load symbols once
with open(settings.SYMBOLS_FILE, "r") as f:
    SYMBOLS = [Symbol(**s) for s in json.load(f)]

@router.get("/symbols", response_model=List[Symbol])
async def get_symbols():
    return SYMBOLS
