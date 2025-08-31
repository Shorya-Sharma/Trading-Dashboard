import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadSymbols } from '../store/symbolsSlice';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import Header from '../components/Header';

export default function SymbolsPage() {
  const dispatch = useDispatch();
  const { list: symbols, status } = useSelector(state => state.symbols);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(loadSymbols());
    }
  }, [status, dispatch]);

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
