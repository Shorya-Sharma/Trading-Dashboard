import json
from typing import List

from fastapi import APIRouter

from app.config import settings
from app.models.symbol import Symbol

router = APIRouter()

# Load symbols once
with open(settings.SYMBOLS_FILE, "r") as f:
    SYMBOLS = [Symbol(**s) for s in json.load(f)]


@router.get("/symbols", response_model=List[Symbol])
async def get_symbols():
    return SYMBOLS
