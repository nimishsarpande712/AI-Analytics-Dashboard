import React, { useContext } from 'react';
import { Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeContext } from '../../contexts/ThemeContext';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const { currentTheme } = useContext(ThemeContext);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerWidth = 240;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        {/* Header */}
        <Header 
          onMenuToggle={handleDrawerToggle} 
          drawerWidth={drawerWidth}
        />
        
        {/* Sidebar */}
        <Sidebar 
          open={mobileOpen}
          onClose={handleDrawerToggle}
        />
        
        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            mt: 8, // Account for header height
            p: 3,
            backgroundColor: currentTheme.palette.background.default,
            minHeight: 'calc(100vh - 64px)',
            transition: 'all 0.3s ease',
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
