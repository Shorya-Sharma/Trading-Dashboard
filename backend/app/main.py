from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import routes_orders, routes_symbols
from app.config import settings


def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application.
    Includes middleware, routes, and dependencies.
    """
    app = FastAPI(
        title="Trading Dashboard Backend",
        version="1.0.0",
        description="Backend service for the live trading dashboard",
    )

    # Enable CORS for frontend clients
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

    return app


app = create_app()
