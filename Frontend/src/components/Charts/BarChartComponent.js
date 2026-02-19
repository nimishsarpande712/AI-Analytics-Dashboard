import { Chart, useChart } from "@chakra-ui/charts";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BarChartComponent = ({ data, title }) => {
  const chart = useChart({
    data: data,
    series: [
      { name: "impressions", color: "teal.solid" },
      { name: "clicks", color: "purple.solid" },
      { name: "conversions", color: "blue.solid" },
    ],
  });

  return (
    <Chart.Root maxH="md" chart={chart}>
      <BarChart data={chart.data}>
        <CartesianGrid stroke={chart.color("border.muted")} vertical={false} />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey={chart.key("campaignName")}
          tickFormatter={(value) => value.slice(0, 10) + "..."}
        />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: chart.color("bg.muted") }}
          animationDuration={100}
          content={<Chart.Tooltip />}
        />
        <Legend content={<Chart.Legend />} />
        {chart.series.map((item) => (
          <Bar
            isAnimationActive={false}
            key={item.name}
            dataKey={chart.key(item.name)}
            fill={chart.color(item.color)}
            stroke={chart.color(item.color)}
            stackId={item.stackId}
          >
            <LabelList
              dataKey={chart.key(item.name)}
              position="top"
              style={{ fontWeight: "600", fill: chart.color("fg") }}
            />
          </Bar>
        ))}
      </BarChart>
    </Chart.Root>
  );
};

export default BarChartComponent;
