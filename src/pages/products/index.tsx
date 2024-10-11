import React from "react";
import ConnectedHeader from "../../components/header";
import ProductsTable from "../../components/productTable";
import { Box } from "@mui/material";

const ProductsPage: React.FC = () => {
  return (
    <>
      <ConnectedHeader />
      <Box sx={{ margin: 1 }}>
        <ProductsTable />
      </Box>
    </>
  );
};

export default ProductsPage;
