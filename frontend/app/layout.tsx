import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Outlet, useLocation, Link } from 'react-router';

const drawerWidth = 240;

const navigationItems = [
  { label: 'Home', link: '/'},
  { label: 'Accounts', link: '/accounts'},
  { label: 'Payments', link: '/payments'},
]

export default function LayoutDrawer() {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <List>
          {navigationItems.map(({ label, link }) => (
            <ListItem disablePadding key={label}>
              <ListItemButton 
                component={Link} 
                to={link} 
                selected={location.pathname === link}
              >
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3 }}
      >
        {/* {children} */}
        <Outlet />
      </Box>
    </Box>
  );
}
