import { Container, Box, Grid } from '@mui/material';
import Header from '../components/Header';
import SymbolsPanel from '../components/SymbolsPanel';
import CreateOrderPanel from '../components/CreateOrderPanel';
import LivePriceTicker from '../components/LivePriceTicker';
import OrdersPanel from '../components/OrdersPanel';

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
            <CreateOrderPanel />
          </Grid>
          <Grid item xs={12} display="flex" justifyContent="center">
            <Box sx={{ width: { xs: '100%', sm: '60%', md: '40%' } }}>
              <OrdersPanel />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <LivePriceTicker />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
