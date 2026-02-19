import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Typography,
  useTheme as useMuiTheme,
  Collapse,
  Chip
} from '@mui/material';
import {
  Dashboard,
  Analytics,
  BarChart,
  Assessment,
  Storage,
  Settings,
  Help,
  TrendingUp,
  PieChart,
  ShowChart,
  TableChart,
  CloudDownload,
  Schedule,
  DataUsage,
  ExpandLess,
  ExpandMore,
  FiberManualRecord
} from '@mui/icons-material';

const drawerWidth = 240;

const menuItems = [
  {
    text: 'Dashboard',
    icon: <Dashboard />,
    path: '/',
    color: '#1976d2'
  },
  {
    text: 'Analytics',
    icon: <Analytics />,
    path: '/analytics',
    color: '#2e7d32',
    badge: 'Live'
  },
  {
    text: 'Reports',
    icon: <Assessment />,
    path: '/reports',
    color: '#ed6c02',
    submenu: [
      { text: 'View Reports', icon: <TableChart />, path: '/reports' },
      { text: 'Generate Report', icon: <Assessment />, path: '/reports/generate' },
      { text: 'Scheduled Reports', icon: <Schedule />, path: '/reports/schedule' },
    ]
  },
  {
    text: 'Data Visualization',
    icon: <BarChart />,
    path: '/data-visualization',
    color: '#9c27b0',
    submenu: [
      { text: 'Charts', icon: <ShowChart />, path: '/data-visualization/charts' },
      { text: 'Pie Charts', icon: <PieChart />, path: '/data-visualization/pie' },
      { text: 'Trends', icon: <TrendingUp />, path: '/data-visualization/trends' },
    ]
  },
  {
    text: 'Data Management',
    icon: <Storage />,
    path: '/data-management',
    color: '#d32f2f',
    submenu: [
      { text: 'Data Sources', icon: <DataUsage />, path: '/data-management/sources' },
      { text: 'Import Data', icon: <CloudDownload />, path: '/data-management/import' },
      { text: 'Export Data', icon: <CloudDownload />, path: '/data-management/export' },
    ]
  }
];

const bottomMenuItems = [
  { text: 'Settings', icon: <Settings />, path: '/settings' },
  { text: 'Help & Support', icon: <Help />, path: '/help' }
];

const Sidebar = ({ open, onClose, variant = 'permanent' }) => {
  const theme = useMuiTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = React.useState({});

  const handleItemClick = (item) => {
    if (item.submenu) {
      setExpandedItems(prev => ({
        ...prev,
        [item.text]: !prev[item.text]
      }));
    } else {
      navigate(item.path);
      if (variant === 'temporary') {
        onClose();
      }
    }
  };

  const handleSubItemClick = (subItem) => {
    navigate(subItem.path);
    if (variant === 'temporary') {
      onClose();
    }
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar />
      
      {/* Main navigation */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <List sx={{ px: 1 }}>
          {menuItems.map((item) => (
            <React.Fragment key={item.text}>
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => handleItemClick(item)}
                  selected={isActive(item.path)}
                  sx={{
                    borderRadius: 2,
                    minHeight: 48,
                    px: 2,
                    '&.Mui-selected': {
                      backgroundColor: `${item.color}15`,
                      borderLeft: `4px solid ${item.color}`,
                      '&:hover': {
                        backgroundColor: `${item.color}20`,
                      },
                    },
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: isActive(item.path) ? item.color : theme.palette.text.secondary,
                      transition: 'color 0.2s ease-in-out',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '0.875rem',
                        fontWeight: isActive(item.path) ? 600 : 400,
                        color: isActive(item.path) ? item.color : theme.palette.text.primary,
                      },
                    }}
                  />
                  {item.badge && (
                    <Chip
                      label={item.badge}
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.75rem',
                        backgroundColor: theme.palette.success.main,
                        color: 'white',
                        animation: 'pulse 2s infinite',
                      }}
                    />
                  )}
                  {item.submenu && (
                    expandedItems[item.text] ? <ExpandLess /> : <ExpandMore />
                  )}
                </ListItemButton>
              </ListItem>

              {/* Submenu items */}
              {item.submenu && (
                <Collapse in={expandedItems[item.text]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ ml: 2 }}>
                    {item.submenu.map((subItem) => (
                      <ListItem key={subItem.text} disablePadding sx={{ mb: 0.5 }}>
                        <ListItemButton
                          onClick={() => handleSubItemClick(subItem)}
                          selected={isActive(subItem.path)}
                          sx={{
                            borderRadius: 2,
                            minHeight: 40,
                            pl: 4,
                            '&.Mui-selected': {
                              backgroundColor: `${item.color}10`,
                              '&:hover': {
                                backgroundColor: `${item.color}15`,
                              },
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <FiberManualRecord 
                              sx={{ 
                                fontSize: 8,
                                color: isActive(subItem.path) ? item.color : theme.palette.text.disabled,
                              }} 
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={subItem.text}
                            sx={{
                              '& .MuiListItemText-primary': {
                                fontSize: '0.8125rem',
                                fontWeight: isActive(subItem.path) ? 500 : 400,
                              },
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>

        <Divider sx={{ mx: 2, my: 2 }} />

        {/* Bottom navigation */}
        <List sx={{ px: 1 }}>
          {bottomMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleItemClick(item)}
                selected={isActive(item.path)}
                sx={{
                  borderRadius: 2,
                  minHeight: 48,
                  px: 2,
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.action.selected,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive(item.path) ? theme.palette.primary.main : theme.palette.text.secondary,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontSize: '0.875rem',
                      fontWeight: isActive(item.path) ? 600 : 400,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          AI Analytics v2.0
        </Typography>
        <Typography variant="caption" color="text.secondary" align="center" display="block">
          Real-time Dashboard
        </Typography>
      </Box>

      {/* Add pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
