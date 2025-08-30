export async function fetchOrders(symbol) {
  const res = await fetch(`/api/orders?symbol=${symbol}`);
  return res.json();
}

export async function submitOrder(order) {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });
  return res.json();
}