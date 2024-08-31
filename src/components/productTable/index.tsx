import React, { useState, useEffect } from "react";
import ReviewsModal from "../reviewModal";
import {
  CircularProgress,
  Typography,
  Box,
  Card,
  CardHeader,
  CardContent,
  TextField,
} from "@mui/material";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import CustomHeader from "./customHeader";
import apiClient, { AxiosResponse } from "../../api/apiClient";
import CustomButton from "../atoms/customButton";

const ProductsTable: React.FC = () => {
  const [products, setProducts] = useState<any>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
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
        setFilteredProducts(response.data.products)
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
      flex: 0.5,
      align: "center",
      headerAlign: "center",
      renderHeader: CustomHeader,
      sortable: false,
    },
    {
      field: "name",
      headerName: "Title",
      flex: 2,
      renderHeader: CustomHeader,
      sortable: false,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      renderHeader: CustomHeader,
      sortable: false,
    },
    {
      field: "brand",
      headerName: "Brand",
      flex: 1.2,
      renderHeader: CustomHeader,
      sortable: false,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 3,
      renderHeader: CustomHeader,
      sortable: false,
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
      flex: 0.7,
      headerAlign: "center",
      align: "right",
      renderHeader: CustomHeader,
      sortable: false,
    },
    {
      field: "discountPercentage",
      headerName: "Discount (%)",
      flex: 1,
      align: "right",
      renderHeader: CustomHeader,
      sortable: false,
    },
    {
      field: "availabilityStatus",
      headerName: "Status",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderHeader: CustomHeader,
      sortable: false,
      renderCell: (params) => {
        const color = params.value === "In Stock" ? "green" : "red";
        return <span style={{ color: color }}>{params.value}</span>;
      },
    },
    {
      field: "review",
      headerName: "Review",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderHeader: CustomHeader,
      sortable: false,
      renderCell: (params) => (
        <CustomButton onClick={() => setSelectedProductId(params.row.id)}>
          View
        </CustomButton>
      ),
    },
  ];

  const handleSearch = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const searchValue = event.target.value.toLowerCase();

    if (searchValue === "") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter((item: any) =>
          item.name.toLowerCase().includes(searchValue)
        )
      );
    }
  };

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
    <>
      <Box sx={{ marginTop: 2 }}>
        <TextField placeholder="Search..." onChange={handleSearch} sx={{'&.MuiInputBase-input-MuiOutlinedInput-input':{
          height:'20px'
        }}} />
      </Box>
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
        <CardContent
          sx={{
            padding: "0px",
            "&.MuiCardContent-root:last-child": {
              paddingBottom: "0px !important",
            },
          }}
        >
          <DataGrid
            rows={filteredProducts}
            columns={columns}
            pagination
            autoHeight
            pageSizeOptions={[8]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            disableColumnMenu
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
              overflowX: "hidden",
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
      </Card>
    </>
  );
};

export default ProductsTable;
