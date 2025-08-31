import { Container, Box, Grid } from '@mui/material';
import Header from '../components/Header';
import SymbolsPanel from '../components/SymbolsPanel';
import OrderPanel from '../components/OrderPanel';
import LivePriceTicker from '../components/LivePriceTicker';
import OrdersTable from '../components/OrdersTable';

/**
 * DashboardPage - Main trading dashboard layout
 */
export default function DashboardPage() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #0f2027, #203a43, #2c5364)',
      }}
    >
      <Header />

      <Container sx={{ mt: 6, mb: 6 }}>
        <Grid container spacing={5}>
          <Grid item xs={12} md={6}>
            <SymbolsPanel />
          </Grid>
          <Grid item xs={12} md={6}>
            <OrderPanel />
          </Grid>
          <Grid item xs={12}>
            <LivePriceTicker />
          </Grid>
          <Grid item xs={12} sx={{ mb: 6 }}>
            <OrdersTable />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
