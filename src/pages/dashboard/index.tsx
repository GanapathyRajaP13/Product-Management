import { Box } from "@mui/material";
import React from "react";
import DashboardComponent from "../../components/dashboard";
import Header from "../../components/header";

const Dashboard: React.FC = () => {
  return (
    <>
      <Header />
      <Box sx={{ margin: 1 }}>
        <DashboardComponent />
      </Box>
    </>
  );
};

export default Dashboard;
