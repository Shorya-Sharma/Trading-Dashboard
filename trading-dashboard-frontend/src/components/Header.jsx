import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { getRouteLabels } from '../config/routes';
import { APP_CONFIG } from '../config/config';

/**
 * Header component with navigation drawer.
 * - Displays an AppBar with a menu icon and title
 * - Opens a side drawer for navigating between routes
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const menuItems = getRouteLabels();

  return (
    <>
      <AppBar
        position="sticky"
        elevation={4}
        sx={{
          background:
            'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
          px: 3,
          py: 1,
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={toggleDrawer} sx={{ color: 'white', mr: 1 }}>
              <MenuIcon sx={{ fontSize: 28 }} />
            </IconButton>
            <Typography
              variant="h5"
              onClick={() => navigate(APP_CONFIG.DEFAULT_ROUTE)}
              sx={{
                fontWeight: 800,
                letterSpacing: 1,
                cursor: 'pointer',
                background: 'linear-gradient(90deg, #00f5a0, #00d9f5)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                '&:hover': { opacity: 0.8 },
              }}
            >
              {APP_CONFIG.TITLE}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        variant="persistent"
        open={open}
        sx={{
          '& .MuiDrawer-paper': {
            marginTop: `${APP_CONFIG.NAVIGATION.HEADER_HEIGHT}px`,
            width: APP_CONFIG.NAVIGATION.DRAWER_WIDTH,
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            color: 'white',
            border: 'none',
          },
        }}
      >
        <List>
          {menuItems.map(item => (
            <ListItem
              button
              key={item.label}
              onClick={() => {
                navigate(item.path);
                setOpen(false);
              }}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.15)',
                },
              }}
            >
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
