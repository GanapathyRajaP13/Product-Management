import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlices";
import ReviewsModal from "../reviewModal";
import { RootState } from "../../redux/store";
import { Button, CircularProgress, Typography, Box } from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import CustomHeader from "./customHeader";

const ProductsTable: React.FC = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 7,
  });
  console.log(products, "kkkk");
  useEffect(() => {
    dispatch(fetchProducts() as any);  // fetch product details from produc store
  }, [dispatch]);

  const onClose = () => {
    setSelectedProductId(null);  // modal review close logic
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
      renderCell: (params) => {
        return (
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
        );
      },
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
      field: "action",
      headerName: "Action",
      width: 140,
      headerAlign: "center",
      align: "center",
      renderHeader: CustomHeader,
      renderCell: (params) => {
        return (
          <Button
            onClick={() => setSelectedProductId(params.row.id)}
            variant="contained"
            color="primary"
          >
            View Reviews
          </Button>
        );
      },
    },
  ];

  // redux store state loading while thunk API is in pending
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

  // redux store state error from thunk API is rejected
  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <DataGrid               // Mui Data table
        rows={products.map((review) => ({
          ...review,
        }))}
        columns={columns}
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        sx={{
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#f5f5f5 !important",
          },
        }}
      />
      <Box>
        {selectedProductId !== null && (
          <ReviewsModal  // modal for view review clicked in data table
            productId={selectedProductId}
            open={true}
            onClose={onClose}
          />
        )}
      </Box>
    </Box>
  );
};

export default ProductsTable;
