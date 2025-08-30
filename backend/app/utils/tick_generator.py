import random, time
from app.models.symbol import Symbol

def generate_tick(symbol: Symbol):
    base = symbol.closePrice
    price = round(random.uniform(base * 0.95, base * 1.05), 2)
    return {
        "symbol": symbol.symbol,
        "price": price,
        "volume": random.randint(1, 100),
        "timestamp": int(time.time())
    }
