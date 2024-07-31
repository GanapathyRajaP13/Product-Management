import React from "react";
import Header from "../../components/header";
import ProductsTable from "../../components/productTable";
import { Box } from "@mui/material";

const ProductsPage: React.FC = () => {
  return (
    <>
      <Header />
      <Box sx={{margin: 1}}>
        <ProductsTable />
      </Box>
    </>
  );
};

export default ProductsPage;
