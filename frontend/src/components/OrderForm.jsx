import { useState } from "react";
import useStore from "../store/useStore";
import { submitOrder } from "../api/orders";

export default function OrderForm() {
  const symbol = useStore((s) => s.selectedSymbol);
  const [side, setSide] = useState("BUY");
  const [qty, setQty] = useState(0);
  const [price, setPrice] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symbol) return alert("Please select a symbol");
    const res = await submitOrder({ symbol, side, qty: Number(qty), price: Number(price) });
    if (res.error) alert(res.error);
    else alert("Order submitted!");
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Order Entry</h3>
      <label>Side:</label>
      <select value={side} onChange={(e) => setSide(e.target.value)}>
        <option value="BUY">BUY</option>
        <option value="SELL">SELL</option>
      </select>
      <br/>
      <label>Qty:</label>
      <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} />
      <br/>
      <label>Price:</label>
      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      <br/>
      <button type="submit">Submit</button>
    </form>
  );
}