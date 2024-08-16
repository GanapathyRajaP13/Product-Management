import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlices";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "../sideBar";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const handleLogout = () => {
    dispatch(logout());
  };

  const toggleSidebar = () => {
    setIsVisible(!isVisible);
  };

  return (
    <Box sx={{ flexGrow: 1, position: "sticky", top: 0, zIndex: 999 }}>
      <AppBar
        position="static"
        sx={{
          height: "64px",
          // background: "white",
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
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Sidebar open={isVisible} toggleSidebar={toggleSidebar} />
    </Box>
  );
};

export default Header;
