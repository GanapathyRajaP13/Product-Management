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
          color: "#fafcfc",
          boxSizing: "border-box",
          mt: 8,
          backgroundColor: "#0f262f",
        },
      }}
    >
      <List onClick={toggleSidebar}>
        <CommonListItemButton
          sx={{ pl: 2 }}
          to="/dashboard"
          primaryText="Dashboard"
        />
        <CommonListItemButton
          sx={{ pl: 2 }}
          to="/products"
          primaryText="Products"
        />
      </List>
    </Drawer>
  );
};

export default Sidebar;
