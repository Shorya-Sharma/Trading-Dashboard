import TickDisplay from '../components/TickDisplay';
import OrderForm from '../components/OrderForm';
import OrdersTable from '../components/OrdersTable';
import Header from '../components/Header';

import { Container, Typography, Box, Paper } from '@mui/material';

export default function DashboardPage() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header />
      <Container sx={{ mt: 4 }}>
        <TickDisplay />
        <OrderForm />
        <OrdersTable />
      </Container>
    </Box>
  );
}
