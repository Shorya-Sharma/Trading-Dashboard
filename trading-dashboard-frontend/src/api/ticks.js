const WS_BASE_URL = 'ws://localhost:8000/ws/ticks';

/**
 * Opens a WebSocket connection to the tick server
 * @param {string} symbol - symbol to subscribe (e.g., AAPL)
 * @param {function} onTick - callback when a tick message arrives
 * @param {function} onError - callback on error (optional)
 * @returns {WebSocket} the WebSocket instance
 */
export function subscribeToTicks(symbol, onTick, onError) {
  const ws = new WebSocket(WS_BASE_URL);

  ws.onopen = () => {
    ws.send(JSON.stringify({ action: 'subscribe', symbol }));
  };

  ws.onmessage = event => {
    try {
      const data = JSON.parse(event.data);
      if (data.error) {
        onError?.(data.error);
      } else {
        onTick(data);
      }
    } catch (err) {
      console.error('Tick parse error:', err);
      onError?.(err);
    }
  };

  ws.onerror = err => {
    console.error('WebSocket error:', err);
    onError?.(err);
  };

  ws.onclose = () => {
    console.log('WebSocket closed');
  };

  return ws;
}
