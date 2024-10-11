import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Popover,
  List,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../sideBar";
import CommonListItemButton from "../atoms/customListItemButton";
import Divider from "@mui/material/Divider";
import profileImage from "../../assets/profile.png";
import { UserData, UserURL } from "../../redux/authSlices";

export interface HeaderProps {
  userData: UserData;
  userURL: UserURL[];
  handleLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ userData, userURL, handleLogout }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const getUserRole = (userType: number): string => {
    switch (userType) {
      case 1:
        return "Admin";
      case 2:
        return "User";
      default:
        return "Guest";
    }
  };

  return (
    <Box sx={{ flexGrow: 1, position: "sticky", top: 0, zIndex: 999 }}>
      <AppBar
        position="static"
        sx={{
          height: "64px",
          backgroundColor: "#0f262f",
          borderBottom: "1px solid white",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.04)",
          width: "100%",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Product Management
          </Typography>
          <IconButton color="inherit" onClick={handleClick}>
            <Avatar
              alt={userData.username}
              src={profileImage}
              sx={{ fontSize: "40px", backgroundColor: "#32464e", p: "4px" }}
            />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Sidebar
        open={isVisible}
        toggleSidebar={toggleSidebar}
        userURL={userURL}
      />

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          width: 400,
        }}
      >
        <Box
          sx={{
            m: 2,
            p: 2,
            minWidth: 300,
            backgroundColor: "#f0f0f0",
            borderRadius: "8px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              alt={userData.username}
              src={profileImage}
              sx={{ fontSize: "40px", mr: 1 }}
            />
            <Box sx={{ ml: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {userData.username}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "gray", fontSize: "small" }}
              >
                {getUserRole(userData.UserType)}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ mt: 2 }} />
          <List component="nav">
            <CommonListItemButton to="/profile" primaryText="Profile" />
            <CommonListItemButton onClick={handleLogout} primaryText="Logout" />
          </List>
        </Box>
      </Popover>
    </Box>
  );
};

export default Header;
