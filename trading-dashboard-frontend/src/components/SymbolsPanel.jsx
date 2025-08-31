import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
} from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/routes';

/**
 * SymbolsPanel component.
 * - Displays a styled card with a chart icon
 * - Navigates to the Symbols route when clicked (from ROUTES config)
 */
export default function SymbolsPanel() {
  const navigate = useNavigate();

  return (
    <Card
      elevation={4}
      sx={{
        borderRadius: 3,
        textAlign: 'center',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: 'white',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-6px) scale(1.03)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
        },
      }}
    >
      <CardActionArea
        onClick={() => navigate(ROUTES.SYMBOLS.path)}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
            <ShowChartIcon sx={{ fontSize: 48, color: 'white' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {ROUTES.SYMBOLS.label}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
            {ROUTES.SYMBOLS.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
