import React from "react";
import { Drawer, List } from "@mui/material";
import CommonListItemButton from "../atoms/customListItemButton";
import { UserURL } from "../../redux/authSlices";

interface SidebarProps {
  open: boolean;
  toggleSidebar: () => void;
  userURL: UserURL[];
}

const Sidebar: React.FC<SidebarProps> = ({ open, toggleSidebar, userURL }) => {
  const url = userURL;
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
        {url.map((url: UserURL) => {
          return (
            <CommonListItemButton
              sx={{ pl: 2 }}
              to={url.ScreenUrl}
              primaryText={url.screenName}
            />
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
