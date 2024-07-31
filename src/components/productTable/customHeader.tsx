import React from "react";
import { GridColumnHeaderParams } from "@mui/x-data-grid";
import { Typography } from "@mui/material";

const CustomHeader: React.FC<GridColumnHeaderParams> = (props) => {
  return (
    <Typography
      sx={{
        fontWeight: "bold",
      }}
    >
      {props.colDef.headerName}
    </Typography>
  );
};

export default CustomHeader;
