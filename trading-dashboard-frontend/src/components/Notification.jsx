import { Snackbar, Alert, Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { hideNotification } from '../store/notificationSlice';

export default function Notification() {
  const dispatch = useDispatch();
  const { open, message, type } = useSelector(state => state.notification);

  const handleClose = () => {
    dispatch(hideNotification());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={handleClose}
        severity={type}
        icon={false}
        sx={{
          width: '100%',
          borderRadius: '12px',
          px: 3,
          py: 1.5,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          border: '2px solid white',
          background:
            type === 'success'
              ? 'linear-gradient(90deg, #00f5a0, #00d9f5)'
              : 'linear-gradient(90deg, #ff4b5c, #d7263d)',
          color: '#fff',
          boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            sx={{ fontWeight: 700, fontSize: '1.1rem', color: 'white' }}
          >
            {type === 'success' ? '✓' : '!'}
          </Typography>
          <Typography sx={{ fontWeight: 600 }}>{message}</Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
}
