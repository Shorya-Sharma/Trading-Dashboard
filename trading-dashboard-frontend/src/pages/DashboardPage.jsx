import { Container, Box, Grid } from '@mui/material';
import Header from '../components/Header';
import SymbolsPanel from '../components/SymbolsPanel';
import OrderPanel from '../components/OrderPanel';
import LivePriceTicker from '../components/LivePriceTicker';

export default function DashboardPage() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header />

      <Container sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* First row: Symbols + Orders */}
          <Grid item xs={12} md={6}>
            <SymbolsPanel />
          </Grid>
          <Grid item xs={12} md={6}>
            <OrderPanel />
          </Grid>

          {/* Second row: Live Price Ticker */}
          <Grid item xs={12}>
            <LivePriceTicker />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
