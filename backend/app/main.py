from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import routes_symbols  # You can re-enable orders & ticks later


def create_app() -> FastAPI:
    app = FastAPI(title="Trading Dashboard Backend", version="1.0.0")

    # ✅ Enable CORS (important for frontend at :3000)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],  # frontend dev server
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Register routes
    app.include_router(routes_symbols.router, prefix="/api")
    # app.include_router(routes_orders.router, prefix="/api")
    # app.include_router(routes_ticks.router)

    return app


app = create_app()
