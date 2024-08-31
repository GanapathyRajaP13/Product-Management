import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import apiClient, { AxiosResponse } from "../../api/apiClient";
import KpiCard from "./kpiCard";
import RevenueLineChart from "./revenueLineChart";
import UnitsSoldChart from "./unitsSoldChart";

interface ProductCount {
  activeCount: number;
  totalCount: number;
}

interface SalesData {
  units: number;
  revenue: number;
}

const DashboardComponent: React.FC = () => {
  const [count, setCount] = useState<ProductCount>({
    activeCount: 0,
    totalCount: 0,
  });
  const [sales, setSales] = useState<SalesData>({
    units: 0,
    revenue: 0,
  });

  useEffect(() => {
    const fetchProductData = async (): Promise<void> => {
      try {
        const responseCount: AxiosResponse<ProductCount> = await apiClient.get(
          "dash/getProductCount"
        );
        setCount(responseCount.data);

        const responseSales: AxiosResponse<SalesData> = await apiClient.get(
          "dash/getProductSalesUnit"
        );
        setSales(responseSales.data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, []);

  const formatNumber = (number: number): string => {
    if (number >= 1_000_000) {
      return `${(number / 1_000_000).toFixed(2)}M`;
    } else if (number >= 1_000) {
      return `${(number / 1_000).toFixed(2)}K`;
    } else {
      return `${number.toFixed(2)}`;
    }
  };

  return (
    <Box>
      <Card>
        <CardHeader
          title="Product Management Dashboard"
          titleTypographyProps={{
            variant: "h6",
          }}
          sx={{
            backgroundColor: "#e2e6e7",
            borderBottom: "1px solid #ddd",
            textAlign: "center",
            height: "5px",
          }}
        />
        <CardContent>
          <Box>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6} md={3}>
                <KpiCard
                  title="Revenue this year"
                  value={`₹${formatNumber(sales.revenue)}`}
                  bg="#659bf3"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <KpiCard
                  title="Units sold this year"
                  value={formatNumber(sales.units)}
                  bg="#dff03d"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <KpiCard
                  title="Active Products"
                  value={count.activeCount.toLocaleString()}
                  bg="#3df049"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <KpiCard
                  title="Total Products"
                  value={count.totalCount.toLocaleString()}
                  bg="#f0903d"
                />
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ marginTop: "10px" }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper elevation={20} sx={{ p: 1 }}>
                  <Typography
                    variant="h6"
                    textAlign="center"
                    sx={{ backgroundColor: "#e2e6e7" }}
                  >
                    Monthly Revenue
                  </Typography>
                  <RevenueLineChart />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper elevation={20} sx={{ p: 1 }}>
                  <Typography
                    variant="h6"
                    textAlign="center"
                    sx={{ backgroundColor: "#e2e6e7" }}
                  >
                    Units Sold by Product
                  </Typography>
                  <UnitsSoldChart />
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DashboardComponent;
