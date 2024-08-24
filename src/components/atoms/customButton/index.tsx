import React from "react";
import { Button, ButtonProps } from "@mui/material";
import { Link } from "react-router-dom";

interface CustomButtonProps extends ButtonProps {
  to?: string;
  component?: React.ElementType;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  to,
  component = to ? Link : "button",
  variant = "contained",
  sx,
  children,
  ...props
}) => {
  return (
    <Button
      {...props}
      component={component}
      to={to}
      variant={variant}
      sx={{
        backgroundColor: variant === "contained" ? "#64757c" : undefined,
        color: variant === "contained" ? "#fff" : undefined,
        "&:hover": {
          backgroundColor: variant === "contained" ? "#95a2a4" : undefined,
          color: variant === "contained" ? "black" : undefined,
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
