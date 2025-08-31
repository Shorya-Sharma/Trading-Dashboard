import { useState, useEffect } from 'react';
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
import { fetchSymbols } from '../api/symbols';

export default function OrderPage() {
  const [symbols, setSymbols] = useState([]);
  const [symbol, setSymbol] = useState('');
  const [side, setSide] = useState('BUY');
  const [qty, setQty] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');

  // Fetch symbols list on mount
  useEffect(() => {
    fetchSymbols()
      .then(data => setSymbols(data))
      .catch(() => setSymbols([]));
  }, []);

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
            backdropFilter: 'blur(12px)',
            background: 'rgba(255, 255, 255, 0.7)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              fontWeight: 700,
              background: 'linear-gradient(45deg, #1e3c72, #2a5298)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Place Order
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <Box component="form" noValidate autoComplete="off">
            {/* Symbol Autocomplete */}
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

            {/* BUY/SELL toggle */}
            <ToggleButtonGroup
              value={side}
              exclusive
              onChange={(e, newSide) => newSide && setSide(newSide)}
              sx={{ mb: 3, width: '100%' }}
            >
              <ToggleButton
                value="BUY"
                sx={{
                  flex: 1,
                  fontWeight: 700,
                  color: '#2e7d32',
                  '&.Mui-selected': {
                    backgroundColor: '#2e7d32',
                    color: 'white',
                  },
                }}
              >
                BUY
              </ToggleButton>
              <ToggleButton
                value="SELL"
                sx={{
                  flex: 1,
                  fontWeight: 700,
                  color: '#c62828',
                  '&.Mui-selected': {
                    backgroundColor: '#c62828',
                    color: 'white',
                  },
                }}
              >
                SELL
              </ToggleButton>
            </ToggleButtonGroup>

            <TextField
              label="Quantity"
              type="number"
              placeholder="Enter quantity"
              fullWidth
              value={qty}
              onChange={e => setQty(e.target.value)}
              sx={{ mb: 3 }}
            />

            <TextField
              label="Price"
              type="number"
              placeholder="Enter price"
              fullWidth
              value={price}
              onChange={e => setPrice(e.target.value)}
              sx={{ mb: 4 }}
            />

            <Button
              variant="contained"
              fullWidth
              sx={{
                py: 1.5,
                fontWeight: 700,
                fontSize: '1rem',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
                boxShadow: '0 6px 16px rgba(0,114,255,0.4)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #0072ff 0%, #00c6ff 100%)',
                  boxShadow: '0 8px 20px rgba(0,114,255,0.6)',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
              onClick={handleSubmit}
            >
              Submit Order
            </Button>
          </Box>

          {message && (
            <Typography
              variant="body1"
              sx={{
                mt: 4,
                p: 2,
                borderRadius: 2,
                backgroundColor: message.startsWith('Order')
                  ? 'rgba(76, 175, 80, 0.15)'
                  : 'rgba(244, 67, 54, 0.15)',
                color: message.startsWith('Order') ? '#1b5e20' : '#b71c1c',
                fontWeight: 600,
              }}
            >
              {message}
            </Typography>
          )}
        </Paper>
      </Container>
    </>
  );
}
