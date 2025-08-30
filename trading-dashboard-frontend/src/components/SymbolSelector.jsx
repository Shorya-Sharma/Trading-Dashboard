import { useEffect, useState } from "react";
import useStore from "../store/useStore";
import { fetchSymbols } from "../api/symbols";

export default function SymbolSelector() {
  const [symbols, setSymbols] = useState([]);
  const setSymbol = useStore((s) => s.setSymbol);

  useEffect(() => {
    fetchSymbols().then(setSymbols);
  }, []);

  return (
    <select onChange={(e) => setSymbol(e.target.value)}>
      <option value="">Select Symbol</option>
      {symbols.map((s) => (
        <option key={s.symbol} value={s.symbol}>{s.name}</option>
      ))}
    </select>
  );
}