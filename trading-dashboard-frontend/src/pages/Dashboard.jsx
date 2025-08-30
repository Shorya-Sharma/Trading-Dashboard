import TickDisplay from '../components/TickDisplay';
import OrderForm from '../components/OrderForm';
import OrdersTable from '../components/OrdersTable';
import {
  Container,
  Typography,
  Box,
  Paper,
  AppBar,
  Toolbar,
} from '@mui/material';

export default function Dashboard() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(45deg, #fff, #f0f0f0)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Trading Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ mt: 4 }}>
        <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: '#2c3e50',
              textAlign: 'center',
              mb: 3,
            }}
          >
            📊 Live Market Overview
          </Typography>
        </Paper>

        <TickDisplay />
        <OrderForm />
        <OrdersTable />
      </Container>
    </Box>
  );
}
