import React, { useState, useEffect } from "react";
import ReviewsModal from "../reviewModal";
import { Button, CircularProgress, Typography, Box } from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import CustomHeader from "./customHeader";
import apiClient, { AxiosResponse } from "../../api/apiClient";
// import GoogleMarker from "../gmap";

interface Product {
  id: number;
  title: string;
  price: number;
  // Add other product fields as needed
}

const ProductsTable: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 8,
  });

  useEffect(() => {
    const fetchProducts = async (): Promise<void> => {
      try {
        const response: AxiosResponse<{ products: Product[] }> =
          await apiClient.get("users/products");
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const onClose = () => {
    setSelectedProductId(null); // modal review close logic
  };

  // column for MUI datagrid Table
  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      align: "center",
      renderHeader: CustomHeader,
    },
    {
      field: "title",
      headerName: "Title",
      width: 250,
      renderHeader: CustomHeader,
    },
    {
      field: "category",
      headerName: "Category",
      width: 100,
      renderHeader: CustomHeader,
    },
    {
      field: "brand",
      headerName: "Brand",
      width: 140,
      renderHeader: CustomHeader,
    },
    {
      field: "description",
      headerName: "Description",
      width: 600,
      renderHeader: CustomHeader,
      renderCell: (params) => (
        <Typography
          sx={{
            fontSize: "12px",
            overflowWrap: "break-word",
            wordWrap: "break-word",
            textOverflow: "ellipsis",
            whiteSpace: "normal",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "price",
      headerName: "Price",
      width: 100,
      headerAlign: "center",
      align: "right",
      renderHeader: CustomHeader,
    },
    {
      field: "discountPercentage",
      headerName: "Discount (%)",
      width: 110,
      align: "right",
      renderHeader: CustomHeader,
    },
    {
      field: "availabilityStatus",
      headerName: "Availability Status",
      width: 150,
      align: "center",
      renderHeader: CustomHeader,
      renderCell: (params) => {
        const color = params.value === "In Stock" ? "green" : "red";
        return <span style={{ color: color }}>{params.value}</span>;
      },
    },
    {
      field: "review",
      headerName: "Review",
      width: 120,
      headerAlign: "center",
      align: "center",
      renderHeader: CustomHeader,
      renderCell: (params) => (
        <Button
          onClick={() => setSelectedProductId(params.row.id)}
          variant="contained"
          color="primary"
        >
          View
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <DataGrid
        rows={products}
        columns={columns}
        pagination
        autoHeight
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sx={{
          "& .MuiDataGrid-columnSeparator": {
            display: "none", // Hide default column separators if needed
          },
          "& .MuiDataGrid-cell": {
            borderRight: "1px solid #ccc", // Add a right border to each cell
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#f5f5f5 !important",
            borderBottom: "1px solid #ddd",
            borderRight: "1px solid #ccc",
          },
        }}
      />
      {selectedProductId !== null && (
        <ReviewsModal
          productId={selectedProductId}
          open={true}
          onClose={onClose}
        />
      )}
      {/* <GoogleMarker /> */}
    </Box>
  );
};

export default ProductsTable;
