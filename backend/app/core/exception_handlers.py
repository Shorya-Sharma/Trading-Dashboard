import logging
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi import FastAPI

logger = logging.getLogger(__name__)


def add_exception_handlers(app: FastAPI):
    """
    Register global exception handlers for the FastAPI app.
    """

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException):
        """
        Handle FastAPI HTTPException errors in a consistent JSON format.
        """
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "error": exc.detail,
                "status_code": exc.status_code,
                "path": str(request.url),
            },
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        """
        Handle all uncaught exceptions in a consistent JSON format.
        """
        logger.error(f"Unhandled error on {request.url.path}: {exc}")
        return JSONResponse(
            status_code=500,
            content={
                "error": "Internal Server Error",
                "detail": str(exc),
                "path": str(request.url),
            },
        )
