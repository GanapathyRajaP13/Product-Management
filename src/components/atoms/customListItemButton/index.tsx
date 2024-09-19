import React from "react";
import { ListItemButton, ListItemText, SxProps, Theme } from "@mui/material";
import { Link } from "react-router-dom";

interface CommonListItemButtonProps {
  to?: string;
  primaryText: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  sx?: SxProps<Theme>;
}

const CommonListItemButton: React.FC<CommonListItemButtonProps> = ({
  to,
  primaryText,
  onClick,
  sx,
  ...props
}) => {
  const commonSx: SxProps<Theme> = {
    "&:hover": {
      backgroundColor: "#9ba6a8",
      borderRadius: 1,
    },
    p: 1,
    pl: 0,
    ...sx,
  };

  if (to) {
    return (
      <ListItemButton component={Link} to={to} sx={commonSx} {...props}>
        <ListItemText primary={primaryText} />
      </ListItemButton>
    );
  }

  return (
    <ListItemButton
      disableGutters
      onClick={onClick as any}
      sx={commonSx}
      {...props}
    >
      <ListItemText primary={primaryText} />
    </ListItemButton>
  );
};

export default CommonListItemButton;
