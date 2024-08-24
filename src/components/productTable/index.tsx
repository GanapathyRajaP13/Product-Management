import React, { useState, useEffect } from "react";
import ReviewsModal from "../reviewModal";
import {
  CircularProgress,
  Typography,
  Box,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import CustomHeader from "./customHeader";
import apiClient, { AxiosResponse } from "../../api/apiClient";
import CustomButton from "../atoms/customButton";
// import GoogleMarker from "../gmap";

const ProductsTable: React.FC = () => {
  const [products, setProducts] = useState([]);
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
        const response: AxiosResponse<{ products: any }> = await apiClient.get(
          "users/products"
        );
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
    setSelectedProductId(null);
  };

  const handleAddProduct = () => {
    console.log("Add Product");
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      align: "center",
      headerAlign: "center",
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
      width: 130,
      renderHeader: CustomHeader,
    },
    {
      field: "description",
      headerName: "Description",
      width: 340,
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
      width: 83,
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
      headerName: "Status",
      width: 100,
      align: "center",
      headerAlign: "center",
      renderHeader: CustomHeader,
      renderCell: (params) => {
        const color = params.value === "In Stock" ? "green" : "red";
        return <span style={{ color: color }}>{params.value}</span>;
      },
    },
    {
      field: "review",
      headerName: "Review",
      width: 100,
      headerAlign: "center",
      align: "center",
      renderHeader: CustomHeader,
      renderCell: (params) => (
        <CustomButton onClick={() => setSelectedProductId(params.row.id)}>
          View
        </CustomButton>
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
    <Card sx={{ marginTop: 2 }}>
      <CardHeader
        title="PRODUCTS LIST"
        action={
          <CustomButton onClick={handleAddProduct}>Add Product</CustomButton>
        }
        titleTypographyProps={{
          variant: "h6",
        }}
        sx={{
          backgroundColor: "#e2e6e7",
          borderBottom: "1px solid #ddd",
        }}
      />
      <CardContent>
        <DataGrid
          rows={products}
          columns={columns}
          pagination
          autoHeight
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sx={{
            "& .MuiDataGrid-columnSeparator": {
              display: "none",
            },
            "& .MuiDataGrid-cell": {
              borderRight: "1px solid #ccc",
            },
            "& .MuiDataGrid-columnHeader": {
              backgroundColor: "#f5f5f5 !important",
              borderBottom: "1px solid #ddd",
              borderRight: "1px solid #ccc",
            },
          }}
        />
      </CardContent>

      {selectedProductId !== null && (
        <ReviewsModal
          productId={selectedProductId}
          open={true}
          onClose={onClose}
        />
      )}
      {/* <GoogleMarker /> */}
    </Card>
  );
};

export default ProductsTable;
