/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import apiClient, { AxiosResponse } from "../../../api/apiClient";

interface RevenueData {
  date: string;
  revenue: number;
}

const CustomYAxisTick: React.FC<any> = ({ x, y, payload }) => {
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={4}
        textAnchor="end"
        fill="#666"
        transform="rotate(-45)"
      >
        {payload.value}
      </text>
    </g>
  );
};

const RevenueLineChart: React.FC = () => {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);

  useEffect(() => {
    const fetchRevenueData = async (): Promise<void> => {
      try {
        const response: AxiosResponse<RevenueData[]> = await apiClient.get(
          "dash/getProductRevenue"
        );
        const formattedData = response.data.map((item) => ({
          ...item,
          date: formatDate(item.date),
        }));

        setRevenueData(formattedData);
      } catch (error) {
        console.error("Error fetching product revenue:", error);
      }
    };

    fetchRevenueData();
  }, []);

  const formatDate = (dateString: string): string => {
    const [month] = dateString.split("/");
    return `${month}`;
  };

  const maxRevenue = Math.max(...revenueData.map((item) => item.revenue), 0);
  const yAxisDomain = [0, Math.round(maxRevenue * 1.1)];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={revenueData}>
        <XAxis dataKey="date" angle={0} textAnchor="end" interval={0} />
        <YAxis domain={yAxisDomain} tick={<CustomYAxisTick />}>
          <Label
            value="Revenue (₹)"
            angle={-90}
            position="insideLeft"
            style={{ textAnchor: "middle" }}
          />
        </YAxis>
        <Tooltip formatter={(value: number) => value} />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#8884d8"
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueLineChart;
