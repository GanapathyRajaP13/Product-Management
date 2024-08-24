import React from "react";
import { Box, Typography } from "@mui/material";
import CustomButton from "../../components/atoms/customButton";

const NotFoundPage: React.FC = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="h6" gutterBottom>
        Page Not Found
      </Typography>
      <CustomButton to="/Dashboard">Go to Home</CustomButton>
    </Box>
  );
};

export default NotFoundPage;
