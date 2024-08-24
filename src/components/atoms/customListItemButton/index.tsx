import React from "react";
import {
  ListItemButton,
  ListItemText,
  ListItem,
  ButtonBase,
} from "@mui/material";
import { Link } from "react-router-dom";

interface CommonListItemButtonProps {
  to?: string;
  primaryText: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  sx?: object;
}

const CommonListItemButton: React.FC<CommonListItemButtonProps> = ({
  to,
  primaryText,
  onClick,
  sx,
  ...props
}) => {
  if (to) {
    return (
      <ListItemButton
        component={Link}
        to={to}
        sx={{
          "&:hover": {
            backgroundColor: "#9ba6a8",
            borderRadius: 1,
          },
          ...sx,
        }}
        {...props}
      >
        <ListItemText primary={primaryText} />
      </ListItemButton>
    );
  }

  return (
    <ListItem
      disableGutters
      sx={{
        "&:hover": {
          backgroundColor: "#9ba6a8",
          borderRadius: 1,
        },
        ...sx,
      }}
    >
      <ButtonBase onClick={onClick} sx={{ width: "100%" }}>
        <ListItemText primary={primaryText} />
      </ButtonBase>
    </ListItem>
  );
};

export default CommonListItemButton;
