from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_invalid_symbol():
    response = client.post("/api/orders", json={"symbol": "XYZ", "side": "BUY", "qty": 10, "price": 100})
    assert response.status_code == 400
    assert "Invalid symbol" in response.json()["detail"]

def test_order_creation_and_fetch():
    payload = {"symbol": "AAPL", "side": "SELL", "qty": 5, "price": 185}
    response = client.post("/api/orders", json=payload)
    assert response.status_code == 200
    order_id = response.json()["id"]

    res = client.get("/api/orders", params={"symbol": "AAPL"})
    assert res.status_code == 200
    assert any(o["id"] == order_id for o in res.json())
