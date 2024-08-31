import React from "react";
import { Paper, Typography } from "@mui/material";

interface KpiCardProps {
  title: string;
  value: string;
  bg: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, bg }) => {
  return (
    <Paper
      elevation={2}
      sx={{ p: '4px', textAlign: "center", backgroundColor: bg }}
    >
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h4">{value}</Typography>
    </Paper>
  );
};

export default KpiCard;
