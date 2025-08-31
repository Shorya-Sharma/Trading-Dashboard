import { useState } from 'react';
import { submitOrder } from '../api/orders';
import useStore from '../store/useStore';
import {
  Card,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Typography,
} from '@mui/material';

export default function OrderForm() {
  const symbol = useStore(s => s.selectedSymbol);
  const [side, setSide] = useState('BUY');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!symbol) return alert('Select a symbol first');
    if (qty <= 0 || price <= 0) return alert('Invalid qty or price');

    const res = await submitOrder({
      symbol,
      side,
      qty: Number(qty),
      price: Number(price),
    });
    if (res.error) alert(res.error);
    else alert('✅ Order submitted!');
  };

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6">Order Entry</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            select
            label="Side"
            value={side}
            onChange={e => setSide(e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="BUY">BUY</MenuItem>
            <MenuItem value="SELL">SELL</MenuItem>
          </TextField>

          <TextField
            label="Quantity"
            type="number"
            value={qty}
            onChange={e => setQty(e.target.value)}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Price"
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            fullWidth
            margin="normal"
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Submit Order
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
