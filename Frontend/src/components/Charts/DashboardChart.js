import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const DashboardChart = ({
  data,
  type = 'line',
  title,
  height = 300,
  color = '#3b82f6',
  dataKey = 'value',
  xAxisKey = 'name',
  yAxisLabel,
  isAnimated = true,
  refreshInterval = 5000 // 5 seconds default refresh
}) => {
  const [chartData, setChartData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const prevDataRef = React.useRef();

  // Color palette for pie/donut charts
  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'];

  // Process and update data with smooth transitions
  React.useEffect(() => {
    if (!data) return;
    
    setIsLoading(false);
    const newData = Array.isArray(data) ? data : [];

    // If first load, just set the data
    if (!prevDataRef.current) {
      setChartData(newData);
    } else {
      // Smoothly transition from old to new data
      const oldData = [...prevDataRef.current];
      
      // Update values progressively for smooth animation
      const updateValues = () => {
        const updatedData = oldData.map((item, index) => {
          const newValue = newData[index]?.[dataKey] || 0;
          const oldValue = item[dataKey] || 0;
          const diff = newValue - oldValue;
          
          return {
            ...item,
            [dataKey]: oldValue + (diff * 0.1) // Update 10% of the difference
          };
        });

        setChartData(updatedData);

        // Check if we need to continue updating
        const needsUpdate = updatedData.some((item, index) => 
          Math.abs((item[dataKey] || 0) - (newData[index]?.[dataKey] || 0)) > 0.1
        );

        if (needsUpdate) {
          requestAnimationFrame(updateValues);
        } else {
          setChartData(newData); // Final update to exact values
        }
      };

      requestAnimationFrame(updateValues);
    }

    prevDataRef.current = newData;
  }, [data, dataKey]);

  const renderChart = () => {
    if (isLoading || !chartData.length) {
      return (
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%'
        }}>
          <p>Loading chart data...</p>
        </div>
      );
    }
    
    switch (type) {
      case 'bar':
        return (
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFF',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                padding: '8px'
              }}
            />
            <Legend />
            <Bar
              dataKey={dataKey}
              fill={color}
              animationDuration={isAnimated ? 300 : 0}
              animationBegin={0}
              isAnimationActive={isAnimated}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );
      
      case 'donut':
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={type === 'donut' ? 100 : 120}
              innerRadius={type === 'donut' ? 60 : 0}
              fill="#8884d8"
              dataKey={dataKey}
              animationDuration={isAnimated ? 300 : 0}
              isAnimationActive={isAnimated}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFF',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                padding: '8px'
              }}
            />
            <Legend />
          </PieChart>
        );
      
      case 'area':
        return (
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFF',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                padding: '8px'
              }}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fill={color}
              fillOpacity={0.3}
              strokeWidth={2}
              animationDuration={isAnimated ? 300 : 0}
              animationBegin={0}
              isAnimationActive={isAnimated}
            />
          </AreaChart>
        );
      
      case 'line':
      default:
        return (
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <YAxis
              label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
              tick={{ fill: '#6B7280', fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#FFF',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                padding: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={dataKey}
              stroke={color} 
              strokeWidth={2}
              dot={{ r: 3, fill: color }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={isAnimated ? 300 : 0}
              animationBegin={0}
              isAnimationActive={isAnimated}
            />
          </LineChart>
        );
    }
  };

  return (
    <div style={{ width: '100%', height: height + 40 }}>
      {title && (
        <h3 style={{
          margin: '0 0 16px 0',
          fontSize: '16px',
          fontWeight: 500,
          color: '#374151'
        }}>
          {title}
        </h3>
      )}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardChart;
