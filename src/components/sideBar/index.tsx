import React from "react";
import { Drawer, List } from "@mui/material";
import CommonListItemButton from "../atoms/customListItemButton";

interface SidebarProps {
  open: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, toggleSidebar }) => {
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          mt: 8,
          backgroundColor: "#eeeeee",
        },
      }}
    >
      <List onClick={toggleSidebar}>
        <CommonListItemButton to="/products" primaryText="Products" />
        <CommonListItemButton to="/dashboard" primaryText="Dashboard" />
      </List>
    </Drawer>
  );
};

export default Sidebar;
