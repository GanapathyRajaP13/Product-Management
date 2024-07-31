import React from 'react';
import { Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ open }) => {
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          mt:8
        },
      }}
    >
      <List>
        <ListItemButton component={Link} to="/products">
          <ListItemText primary="Products" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
