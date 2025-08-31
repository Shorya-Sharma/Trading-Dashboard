import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadSymbols } from '../store/symbolsSlice';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Autocomplete,
} from '@mui/material';
import Header from '../components/Header';
import { submitOrder } from '../api/orders';

export default function OrderPage() {
  const dispatch = useDispatch();
  const { list: symbols, status } = useSelector(state => state.symbols);

  const [symbol, setSymbol] = useState('');
  const [side, setSide] = useState('BUY');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadSymbols());
    }
  }, [status, dispatch]);

  const handleSubmit = async () => {
    try {
      const order = { symbol, side, qty: Number(qty), price: Number(price) };
      const res = await submitOrder(order);
      setMessage(`Order placed successfully! ID: ${res.id}`);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error placing order');
    }
  };

  return (
    <>
      <Header />
      <Container sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
        <Paper
          elevation={6}
          sx={{
            p: 5,
            borderRadius: 4,
            width: '100%',
            maxWidth: 480,
            textAlign: 'center',
          }}
        >
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
            Place Order
          </Typography>
          <Divider sx={{ mb: 4 }} />

          <Box component="form" noValidate autoComplete="off">
            <Autocomplete
              options={symbols.map(s => s.symbol)}
              value={symbol}
              onChange={(e, newValue) => setSymbol(newValue)}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Symbol"
                  placeholder="Select a symbol"
                />
              )}
              sx={{ mb: 3 }}
            />

            <ToggleButtonGroup
              value={side}
              exclusive
              onChange={(e, newSide) => newSide && setSide(newSide)}
              sx={{ mb: 3, width: '100%' }}
            >
              <ToggleButton
                value="BUY"
                sx={{ flex: 1, fontWeight: 700, color: '#2e7d32' }}
              >
                BUY
              </ToggleButton>
              <ToggleButton
                value="SELL"
                sx={{ flex: 1, fontWeight: 700, color: '#c62828' }}
              >
                SELL
              </ToggleButton>
            </ToggleButtonGroup>

            <TextField
              label="Quantity"
              type="number"
              fullWidth
              value={qty}
              onChange={e => setQty(e.target.value)}
              sx={{ mb: 3 }}
            />

            <TextField
              label="Price"
              type="number"
              fullWidth
              value={price}
              onChange={e => setPrice(e.target.value)}
              sx={{ mb: 4 }}
            />

            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              sx={{ py: 1.5, fontWeight: 700 }}
            >
              Submit Order
            </Button>
          </Box>

          {message && (
            <Typography variant="body1" sx={{ mt: 4, fontWeight: 600 }}>
              {message}
            </Typography>
          )}
        </Paper>
      </Container>
    </>
  );
}
