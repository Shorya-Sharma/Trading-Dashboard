import { useEffect, useState, useRef } from 'react';
import { Box, Typography, Paper, Autocomplete, TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { subscribeToTicks } from '../api/ticks';
import { loadSymbols } from '../store/symbolsSlice';

export default function LivePriceTicker() {
  const dispatch = useDispatch();
  const { list: symbols, status } = useSelector(state => state.symbols);

  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [tick, setTick] = useState(null);
  const [prevPrice, setPrevPrice] = useState(null);
  const wsRef = useRef(null);

  // ✅ Ensure symbols are fetched if not already
  useEffect(() => {
    if (status === 'idle' || symbols.length === 0) {
      dispatch(loadSymbols());
    }
  }, [status, symbols.length, dispatch]);

  // ✅ Clean up WebSocket on unmount
  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  // ✅ Subscribe to ticks when symbol changes
  useEffect(() => {
    if (selectedSymbol) {
      wsRef.current?.close();
      wsRef.current = subscribeToTicks(
        selectedSymbol,
        data => {
          setPrevPrice(tick?.price || null);
          setTick(data);
        },
        err => console.error('Tick error:', err)
      );
    }
  }, [selectedSymbol]);

  const priceColor =
    prevPrice && tick
      ? tick.price > prevPrice
        ? '#00e676' // green if price went up
        : tick.price < prevPrice
          ? '#ff1744' // red if price went down
          : 'white'
      : 'white';

  return (
    <Paper
      elevation={6}
      sx={{
        p: 3,
        borderRadius: 4,
        textAlign: 'center',
        background: 'linear-gradient(145deg, #1e3c72, #2a5298)',
        color: 'white',
        minHeight: 260,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        Live Market Ticker
      </Typography>

      {/* Autocomplete Symbol Dropdown */}
      <Autocomplete
        options={symbols.map(s => s.symbol)}
        value={selectedSymbol}
        onChange={(e, newValue) => setSelectedSymbol(newValue)}
        renderInput={params => (
          <TextField
            {...params}
            label="Select Symbol"
            placeholder="Type to search..."
            InputLabelProps={{ style: { color: 'white' } }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: 'white',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                '&:hover fieldset': { borderColor: '#00f5a0' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
              '& .MuiSvgIcon-root': { color: 'white' },
            }}
          />
        )}
      />

      {tick ? (
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: priceColor,
              transition: 'color 0.3s ease',
            }}
          >
            ${tick.price}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.85 }}>
            {tick.symbol} | Volume: {tick.volume}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.6 }}>
            {new Date(tick.timestamp * 1000).toLocaleTimeString()}
          </Typography>
        </Box>
      ) : (
        <Typography
          variant="body2"
          sx={{ opacity: 0.8, mt: 4, fontStyle: 'italic' }}
        >
          Select a symbol to see live prices
        </Typography>
      )}
    </Paper>
  );
}
