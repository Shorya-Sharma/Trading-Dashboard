import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';

/**
 * CreateOrderPanel component.
 * - Displays a styled card with an order icon
 * - Navigates to the "/order" page when clicked
 */
export default function CreateOrderPanel() {
  const navigate = useNavigate();

  return (
    <Card
      elevation={4}
      sx={{
        borderRadius: 3,
        textAlign: 'center',
        background:
          'linear-gradient(135deg, #2c5364 0%, #203a43 50%, #0f2027 100%)',
        color: 'white',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-6px) scale(1.03)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
        },
      }}
    >
      <CardActionArea onClick={() => navigate('/order')}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
            <ShoppingCartIcon sx={{ fontSize: 48, color: 'white' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Place Order
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
            Create a new trade order
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
