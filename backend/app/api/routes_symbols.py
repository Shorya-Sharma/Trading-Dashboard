from typing import List
from fastapi import APIRouter, Depends, HTTPException

from app.services.symbol_service import SymbolService
from app.dto.symbol_response import SymbolResponse

router = APIRouter()


def get_symbol_service() -> SymbolService:
    return SymbolService()


@router.get("/symbols", response_model=List[SymbolResponse], summary="Get all symbols")
async def get_symbols(service: SymbolService = Depends(get_symbol_service)):
    try:
        return service.get_all_symbols()
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Symbols file not found")
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to load symbols")
