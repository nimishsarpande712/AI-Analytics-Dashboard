import { Chart, useChart } from "@chakra-ui/charts";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const LineChartComponent = ({ data, title }) => {
  const chart = useChart({
    data: data,
    series: [
      { name: "ctr", color: "teal.solid" },
      { name: "conversionRate", color: "purple.solid" },
      { name: "roi", color: "blue.solid" },
    ],
  });

  return (
    <Chart.Root maxH="md" chart={chart}>
      <LineChart data={chart.data}>
        <CartesianGrid stroke={chart.color("border.muted")} vertical={false} />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey={chart.key("date")}
          tickFormatter={(value) => new Date(value).toLocaleDateString()}
        />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ stroke: chart.color("border.muted") }}
          animationDuration={100}
          content={<Chart.Tooltip />}
        />
        <Legend content={<Chart.Legend />} />
        {chart.series.map((item) => (
          <Line
            key={item.name}
            type="monotone"
            dataKey={chart.key(item.name)}
            stroke={chart.color(item.color)}
            dot={false}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </Chart.Root>
  );
};

export default LineChartComponent;
