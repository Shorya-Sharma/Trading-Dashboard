from fastapi import FastAPI

from app.api import routes_orders, routes_symbols, routes_ticks


def create_app() -> FastAPI:
    app = FastAPI(title="Trading Dashboard Backend", version="1.0.0")
    app.include_router(routes_symbols.router, prefix="/api")
    app.include_router(routes_orders.router, prefix="/api")
    app.include_router(routes_ticks.router)
    return app


app = create_app()
