import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  CircularProgress,
  IconButton,
} from "@mui/material";
import apiClient from "../../api/apiClient";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import moment from "moment";

const ReviewsModal: React.FC<{
  productId: number;
  open: boolean;
  onClose: () => void;
}> = ({ productId, open, onClose }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  useEffect(() => {
    if (open) {
      apiClient
        .post(`users/review`, { id: productId })
        .then((response) => {
          setReviews(response.data.review);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching reviews:", error);
          setLoading(false);
        });
    }
  }, [productId, open]);

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 90,
      headerAlign: "center",
      align: "center",
    },
    { field: "reviewerName", headerName: "Reviewer", width: 150 },
    {
      field: "rating",
      headerName: "Rating",
      width: 80,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const color = params.value >= 3 ? "green" : "red";
        return <span style={{ color: color }}>{params.value}</span>;
      },
    },
    { field: "comment", headerName: "Comment", width: 400 },
    { field: "reviewerEmail", headerName: "Email", width: 280 },
    {
      field: "date",
      headerName: "Date",
      width: 200,
      renderCell: (params) => {
        return moment(params.value).format("DD/MM/YYYY");
      },
    },
  ];

  return (
    <Box>
      <Modal
        open={open}
        onClose={onClose}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            bgcolor: "background.paper",
            borderRadius: "12px",
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <Box sx={{ width: "100%", height: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Reviews
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={onClose}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </Box>
              <DataGrid
                rows={reviews.map((review, index) => ({
                  id: index,
                  ...review,
                }))}
                columns={columns}
                pagination
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                autoHeight
              />
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default ReviewsModal;
