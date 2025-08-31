import { Container, Box } from '@mui/material';
import Header from '../components/Header';
import OrdersTable from '../components/OrdersTable';

/**
 * OrdersTablePage - dedicated page for viewing the OrdersTable
 */
export default function OrdersTablePage() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #0f2027, #203a43, #2c5364)',
        backgroundAttachment: 'fixed',
      }}
    >
      <Header />
      <Container sx={{ mt: 6, mb: 6 }}>
        <OrdersTable />
      </Container>
    </Box>
  );
}
