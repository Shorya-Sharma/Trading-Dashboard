export function subscribeToTicks(symbol, onTick) {
  const ws = new WebSocket('ws://localhost:8000/ws/ticks');
  ws.onopen = () => ws.send(JSON.stringify({ action: 'subscribe', symbol }));
  ws.onmessage = msg => {
    const data = JSON.parse(msg.data);
    if (data.symbol === symbol) onTick(data);
  };
  return () => ws.close();
}
