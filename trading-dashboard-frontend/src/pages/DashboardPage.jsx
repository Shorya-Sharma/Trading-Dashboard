import { Container, Box, Grid } from '@mui/material';
import Header from '../components/Header';
import SymbolsPanel from '../components/SymbolsPanel';
import OrderPanel from '../components/OrderPanel';

export default function DashboardPage() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header />

      <Container sx={{ mt: 4 }}>
        {/* Grid Layout for Panels */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <SymbolsPanel />
          </Grid>
          <Grid item xs={12} md={6}>
            <OrderPanel />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
