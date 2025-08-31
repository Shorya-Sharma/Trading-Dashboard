import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import Header from '../components/Header';
import { fetchSymbols } from '../api/symbols';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CurrencyBitcoinIcon from '@mui/icons-material/CurrencyBitcoin';
import BusinessIcon from '@mui/icons-material/Business';

export default function SymbolsPage() {
  const [symbols, setSymbols] = useState([]);

  useEffect(() => {
    fetchSymbols()
      .then(data => setSymbols(data))
      .catch(() => setSymbols([]));
  }, []);

  // Helper to choose icon based on market
  const getMarketIcon = market => {
    if (market === 'Crypto')
      return <CurrencyBitcoinIcon sx={{ fontSize: 36, color: '#f7931a' }} />;
    if (market === 'NASDAQ' || market === 'NYSE')
      return <BusinessIcon sx={{ fontSize: 36, color: '#1976d2' }} />;
    return <ShowChartIcon sx={{ fontSize: 36, color: '#43a047' }} />;
  };

  return (
    <>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              fontWeight: 700,
              textAlign: 'center',
              color: '#2c3e50',
            }}
          >
            Available Symbols
          </Typography>

          <Grid container spacing={3}>
            {symbols.map(s => (
              <Grid item xs={12} sm={6} md={4} key={s.symbol}>
                <Card
                  elevation={3}
                  sx={{
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px) scale(1.03)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}
                    >
                      {getMarketIcon(s.market)}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {s.symbol}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {s.name}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Market: {s.market}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: '#388e3c', fontWeight: 600 }}
                    >
                      Close Price: ${s.closePrice}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </>
  );
}
