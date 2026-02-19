import React, { useContext } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Badge,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  Divider,
  useTheme as useMuiTheme
} from '@mui/material';
import {
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
  Notifications,
  AccountCircle,
  Settings,
  ExitToApp,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { ThemeContext } from '../../contexts/ThemeContext';

const Header = ({ onMenuToggle, drawerWidth = 240 }) => {
  const muiTheme = useMuiTheme();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationCount] = React.useState(3); // Mock notification count

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Add logout logic here
    localStorage.removeItem('token');
    handleUserMenuClose();
    // Navigate to login page
  };

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        backgroundColor: muiTheme.palette.background.paper,
        color: muiTheme.palette.text.primary,
        borderBottom: `1px solid ${muiTheme.palette.divider}`,
      }}
    >
      <Toolbar>
        {/* Mobile menu button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Header title with icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <DashboardIcon sx={{ mr: 1, color: muiTheme.palette.primary.main }} />
          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{ 
              fontWeight: 600,
              background: `linear-gradient(45deg, ${muiTheme.palette.primary.main}, ${muiTheme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AI Analytics Dashboard
          </Typography>
        </Box>

        {/* Right side actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Theme toggle */}
          <Tooltip title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton
              color="inherit"
              onClick={toggleTheme}
              sx={{
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'rotate(180deg)',
                },
              }}
            >
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton color="inherit">
              <Badge 
                badgeContent={notificationCount} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    animation: notificationCount > 0 ? 'pulse 2s infinite' : 'none',
                  },
                }}
              >
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Settings */}
          <Tooltip title="Settings">
            <IconButton color="inherit">
              <Settings />
            </IconButton>
          </Tooltip>

          {/* User menu */}
          <Tooltip title="Account">
            <IconButton
              color="inherit"
              onClick={handleUserMenuOpen}
              sx={{ p: 0.5 }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: muiTheme.palette.primary.main,
                  fontSize: '0.875rem',
                }}
              >
                AD
              </Avatar>
            </IconButton>
          </Tooltip>

          {/* User dropdown menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleUserMenuClose}
            onClick={handleUserMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 200,
                '& .MuiMenuItem-root': {
                  borderRadius: 1,
                  mx: 1,
                  mb: 0.5,
                },
              },
            }}
            transformOrigin={{
              horizontal: 'right',
              vertical: 'top',
            }}
            anchorOrigin={{
              horizontal: 'right',
              vertical: 'bottom',
            }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" color="text.primary">
                Admin User
              </Typography>
              <Typography variant="body2" color="text.secondary">
                admin@dashboard.com
              </Typography>
            </Box>
            <Divider />
            <MenuItem onClick={handleUserMenuClose}>
              <AccountCircle sx={{ mr: 2 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleUserMenuClose}>
              <Settings sx={{ mr: 2 }} />
              Account Settings
            </MenuItem>
            <Divider />
            <MenuItem 
              onClick={handleLogout}
              sx={{ 
                color: muiTheme.palette.error.main,
                '&:hover': {
                  backgroundColor: muiTheme.palette.error.main + '10',
                },
              }}
            >
              <ExitToApp sx={{ mr: 2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>

      {/* Add pulse animation for notifications */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </AppBar>
  );
};

export default Header;
