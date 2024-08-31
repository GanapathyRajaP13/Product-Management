import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Label,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import apiClient, { AxiosResponse } from "../../../api/apiClient";

interface RevenueData {
  name: string;
  units: number;
}

const UnitsSoldChart: React.FC = () => {
  const [unitData, setUnitData] = useState<RevenueData[]>([]);

  useEffect(() => {
    const fetchRevenueData = async (): Promise<void> => {
      try {
        const response: AxiosResponse<RevenueData[]> = await apiClient.get(
          "dash/getUnitSold"
        );
        setUnitData(response.data);
      } catch (error) {
        console.error("Error fetching product revenue:", error);
      }
    };

    fetchRevenueData();
  }, []);

  const maxUnits = Math.max(...unitData.map((item) => item.units), 0);
  const yAxisDomain = [0, Math.round(maxUnits * 1.1)];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={unitData}>
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          interval={0}
          tickMargin={10}
        />
        <YAxis domain={yAxisDomain}>
          <Label
            value="Units (Nos.)"
            angle={-90}
            position="insideLeft"
            style={{ textAnchor: "middle" }}
          />
        </YAxis>
        <Tooltip formatter={(value: number) => value} />
        <Bar dataKey="units" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default UnitsSoldChart;
