import { useEffect } from "react";
import useStore from "../store/useStore";
import { fetchOrders } from "../api/orders";

export default function OrdersTable() {
  const symbol = useStore((s) => s.selectedSymbol);
  const orders = useStore((s) => s.orders);
  const setOrders = useStore((s) => s.setOrders);

  const loadOrders = () => {
    if (symbol) fetchOrders(symbol).then(setOrders);
  };

  useEffect(() => {
    loadOrders();
  }, [symbol]);

  if (!symbol) return <p>Select a symbol to view orders</p>;

  return (
    <div>
      <h3>Orders for {symbol}</h3>
      <button onClick={loadOrders}>Refresh</button>
      <table border="1">
        <thead>
          <tr>
            <th>ID</th><th>Side</th><th>Qty</th><th>Price</th><th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.side}</td>
              <td>{o.qty}</td>
              <td>{o.price}</td>
              <td>{new Date(o.timestamp * 1000).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}