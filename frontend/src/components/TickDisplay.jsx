import { useEffect } from "react";
import useStore from "../store/useStore";
import { subscribeToTicks } from "../api/ticks";

export default function TickDisplay() {
  const symbol = useStore((s) => s.selectedSymbol);
  const tick = useStore((s) => (symbol ? s.ticks[symbol] : null));
  const setTick = useStore((s) => s.setTick);

  useEffect(() => {
    if (!symbol) return;
    const unsubscribe = subscribeToTicks(symbol, (data) => {
      setTick(data.symbol, data.price);
    });
    return unsubscribe;
  }, [symbol]);

  if (!symbol) return <p>Select a symbol to view ticks</p>;
  return <h2>{symbol} Price: {tick || "Loading..."}</h2>;
}