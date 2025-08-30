import { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import { fetchSymbols } from '../api/symbols';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function SymbolSelector() {
  const [symbols, setSymbols] = useState([]);
  const setSymbol = useStore(s => s.setSymbol);
  const selectedSymbol = useStore(s => s.selectedSymbol);

  useEffect(() => {
    fetchSymbols().then(setSymbols);
  }, []);

  return (
    <FormControl fullWidth margin="normal">
      <InputLabel>Symbol</InputLabel>
      <Select
        value={selectedSymbol || ''}
        onChange={e => setSymbol(e.target.value)}
        label="Symbol"
      >
        {symbols.map(s => (
          <MenuItem key={s.symbol} value={s.symbol}>
            {s.symbol} - {s.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
