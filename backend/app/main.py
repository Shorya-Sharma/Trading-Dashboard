from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import routes_orders, routes_symbols
from app.config import settings
from app.core.exception_handlers import add_exception_handlers


def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application.
    """
    app = FastAPI(
        title="Trading Dashboard Backend",
        version="1.0.0",
        description="Backend service for the live trading dashboard",
    )

    # Enable CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register API routes
    app.include_router(routes_symbols.router, prefix="/api")
    app.include_router(routes_orders.router, prefix="/api")

    # Health check
    @app.get("/health", tags=["Health"])
    async def health_check():
        return {"status": "ok"}

    # Register global exception handlers
    add_exception_handlers(app)

    return app


app = create_app()
