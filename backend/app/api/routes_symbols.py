from typing import List
import logging
from fastapi import APIRouter, Depends, HTTPException
from app.models.symbol import SymbolResponse
from app.services.symbol_service import SymbolService

logger = logging.getLogger(__name__)

router = APIRouter()


def get_symbol_service() -> SymbolService:
    return SymbolService()


@router.get("/symbols", response_model=List[SymbolResponse], summary="Get all symbols")
async def get_symbols(service: SymbolService = Depends(get_symbol_service)):
    """Retrieve all available tradeable symbols."""
    try:
        symbols = service.get_all_symbols()
        logger.info(f"Fetched {len(symbols)} symbols")
        return symbols
    except FileNotFoundError as e:
        logger.error(f"Symbols file not found: {e}")
        raise HTTPException(status_code=500, detail="Symbols file not found")
    except Exception as e:
        logger.error(f"Failed to load symbols: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to load symbols: {str(e)}")
