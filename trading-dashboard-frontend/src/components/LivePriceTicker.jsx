import { useEffect, useState, useRef } from 'react';
import { Box, Typography, Paper, Autocomplete, TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { subscribeToTicks } from '../api/ticks';
import { loadSymbols } from '../store/symbolsSlice';
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

/**
 * LivePriceTicker displays real-time tick data for a selected symbol
 * with a sparkline chart and user-friendly time axis.
 */
export default function LivePriceTicker() {
  const dispatch = useDispatch();
  const { list: symbols, status } = useSelector(state => state.symbols);

  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [tick, setTick] = useState(null);
  const [prevPrice, setPrevPrice] = useState(null);
  const [tickHistory, setTickHistory] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    if (status === 'idle' || symbols.length === 0) {
      dispatch(loadSymbols());
    }
  }, [status, symbols.length, dispatch]);

  useEffect(() => {
    return () => {
      wsRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (selectedSymbol?.symbol) {
      wsRef.current?.close();
      wsRef.current = subscribeToTicks(
        selectedSymbol.symbol,
        data => {
          setPrevPrice(tick?.price || null);
          setTick(data);
          setTickHistory(prev => {
            const updated = [...prev, data];
            return updated.slice(-100);
          });
        },
        err => console.error('Tick error:', err)
      );
    } else {
      setTick(null);
      setTickHistory([]);
    }
  }, [selectedSymbol]);

  const priceColor =
    prevPrice && tick
      ? tick.price > prevPrice
        ? '#00e676'
        : tick.price < prevPrice
          ? '#ff1744'
          : 'white'
      : 'white';

  return (
    <Paper
      elevation={6}
      sx={{
        p: 3,
        borderRadius: 4,
        textAlign: 'center',
        background: 'linear-gradient(145deg, #0f2027, #203a43, #2c5364)',
        color: 'white',
        minHeight: 380,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
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

      <Autocomplete
        options={symbols}
        getOptionLabel={option => `${option.symbol} — ${option.name}`}
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
        <>
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

          <Box sx={{ mt: 3, height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tickHistory}>
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={ts => new Date(ts * 1000).toLocaleTimeString()}
                  tick={{ fill: 'white', fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <Tooltip
                  labelFormatter={ts =>
                    new Date(ts * 1000).toLocaleTimeString()
                  }
                  formatter={val => [`$${val}`, 'Price']}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#00f5a0"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </>
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
