import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Popover,
  List,
  ListItem,
  ListItemText,
  ButtonBase,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlices";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Sidebar from "../sideBar";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    dispatch(logout());
  };

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

  return (
    <Box sx={{ flexGrow: 1, position: "sticky", top: 0, zIndex: 999 }}>
      <AppBar
        position="static"
        sx={{
          height: "64px",
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
            <AccountCircleIcon sx={{ fontSize: "40px"   }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Sidebar open={isVisible} toggleSidebar={toggleSidebar} />

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
      >
        <List component="nav">
          <ListItem
            component={ButtonBase}
            onClick={() => {
              /* Handle profile navigation */
            }}
          >
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem component={ButtonBase} onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Popover>
    </Box>
  );
};

export default Header;
