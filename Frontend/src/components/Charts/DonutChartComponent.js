import { Chart, useChart } from "@chakra-ui/charts";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const DonutChartComponent = ({ data, title }) => {
  const chart = useChart({
    data: data,
    series: [
      { name: "value", color: "teal.solid" },
    ],
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Chart.Root maxH="md" chart={chart}>
      <PieChart>
        <Pie
          data={data}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<Chart.Tooltip />} />
        <Legend content={<Chart.Legend />} />
      </PieChart>
    </Chart.Root>
  );
};

export default DonutChartComponent;
