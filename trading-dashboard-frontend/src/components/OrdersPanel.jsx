import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/routes';

/**
 * OrdersPanel - Dashboard card that links to the OrdersTablePage
 */
export default function OrdersPanel() {
  const navigate = useNavigate();

  return (
    <Card
      elevation={4}
      sx={{
        borderRadius: 3,
        textAlign: 'center',
        background: 'linear-gradient(135deg, #2c5364 0%, #203a43 100%)',
        color: 'white',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-6px) scale(1.03)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
        },
      }}
    >
      <CardActionArea
        onClick={() => navigate(ROUTES.ORDERS_TABLE.path)}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <CardContent>
          {/* Centered Icon */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
            <AssignmentTurnedInIcon sx={{ fontSize: 48, color: 'white' }} />
          </Box>

          {/* Title */}
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {ROUTES.ORDERS_TABLE.label}
          </Typography>

          {/* Description */}
          <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
            {ROUTES.ORDERS_TABLE.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
