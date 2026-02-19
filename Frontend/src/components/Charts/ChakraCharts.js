import React, { useEffect, useRef } from 'react';
import { Box, Text, VStack, HStack, Icon } from '@chakra-ui/react';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, AreaChart,
  Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';


// Modern color palette
const COLORS = ['#4F46E5', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316', '#EC4899'];

const ChartContainer = ({ children, title, height }) => {
  // For now, we'll use light mode as default since useColorMode is not available in v3
  const colorMode = 'light';
  const bg = colorMode === 'light' ? 'white' : 'gray.800';
  const textColor = colorMode === 'light' ? 'gray.600' : 'gray.300';
  const borderColor = colorMode === 'light' ? 'gray.100' : 'gray.700';

  return (
    <Box
      bg={bg}
      p={6}
      borderRadius="xl"
      boxShadow="xl"
      border="1px solid"
      borderColor={borderColor}
      position="relative"
      overflow="hidden"
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: '2xl',
      }}
      transition="all 0.3s ease"
    >
      {title && (
        <Text fontSize="lg" fontWeight="600" mb={4} color={textColor}>
          {title}
        </Text>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </Box>
  );
};

// Enhanced Chakra UI Bar Chart Component
export const ChakraBarChart = ({ data, title, height = 300 }) => (
  <ChartContainer title={title} height={height}>
    <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="value" fill={COLORS[0]} />
    </BarChart>
  </ChartContainer>
);

// Enhanced Chakra UI Line Chart Component
export const ChakraLineChart = ({ data, title, height = 300 }) => (
  <ChartContainer title={title} height={height}>
    <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="value" stroke={COLORS[0]} dot={false} strokeWidth={2} />
    </LineChart>
  </ChartContainer>
);

// Enhanced Chakra UI Area Chart Component
export const ChakraAreaChart = ({ data, title, height = 300 }) => (
  <ChartContainer title={title} height={height}>
    <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Area type="monotone" dataKey="value" fill={COLORS[0]} stroke={COLORS[0]} fillOpacity={0.3} />
    </AreaChart>
  </ChartContainer>
);

// Enhanced Chakra UI Pie Chart Component
export const ChakraPieChart = ({ data, title, height = 300, innerRadius = 0 }) => (
  <ChartContainer title={title} height={height}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={innerRadius}
        outerRadius={100}
        fill="#8884d8"
        paddingAngle={2}
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </ChartContainer>
);

// Simple Donut Chart implementation (wrapper around PieChart)
export const ChakraDonutChart = ({ data, title, height = 300 }) => (
  <ChakraPieChart data={data} title={title} height={height} innerRadius={60} />
);
  

// Enhanced Chart Component
export const EnhancedChart = ({ data, title, height = 300 }) => (
  <ChartContainer title={title} height={height}>
    <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Area type="monotone" dataKey="value" fill={COLORS[0]} stroke={COLORS[0]} fillOpacity={0.3} />
    </AreaChart>
  </ChartContainer>
);

// Metric Card Component with Animation
export const AnimatedMetricCard = ({ title, value, change, icon: IconComponent, color = '#4F46E5' }) => {
  const cardRef = useRef(null);
  // For now, we'll use light mode as default since useColorMode is not available in v3
  const colorMode = 'light';
  const bg = colorMode === 'light' ? 'white' : 'gray.800';
  const textColor = colorMode === 'light' ? 'gray.600' : 'gray.300';

  useEffect(() => {
    if (cardRef.current) {
      // Simple CSS-based animation instead of animejs to avoid runtime errors
      const element = cardRef.current;
      element.style.opacity = '0';
      element.style.transform = 'scale(0.9)';
      
      // Animate in
      setTimeout(() => {
        element.style.transition = 'all 0.8s ease-out';
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
      }, 100);

      // Animate the value number with a simple counter
      const valueElement = cardRef.current.querySelector('.metric-value');
      if (valueElement) {
        const targetValue = parseFloat(value.replace(/[^0-9.-]+/g, '')) || 0;
        let currentValue = 0;
        const increment = targetValue / 50; // 50 steps
        
        const counter = setInterval(() => {
          currentValue += increment;
          if (currentValue >= targetValue) {
            currentValue = targetValue;
            clearInterval(counter);
          }
          
          const displayValue = Math.round(currentValue);
          valueElement.textContent = value.includes('$') ? `$${displayValue.toLocaleString()}` : 
                                     value.includes('%') ? `${displayValue}%` : 
                                     displayValue.toLocaleString();
        }, 30);
        
        return () => clearInterval(counter);
      }
    }
  }, [value]);

  return (
    <Box
      ref={cardRef}
      bg={bg}
      p={6}
      borderRadius="xl"
      boxShadow="xl"
      border="1px solid"
      borderColor={colorMode === 'light' ? 'gray.100' : 'gray.700'}
      _hover={{
        transform: 'translateY(-2px)',
        boxShadow: '2xl',
      }}
      transition="all 0.3s ease"
      cursor="pointer"
    >
      <VStack align="start" spacing={3}>
        <HStack justify="space-between" w="full">
          <Text fontSize="sm" color={textColor} fontWeight="500">
            {title}
          </Text>
          {IconComponent && (
            <Box
              p={2}
              borderRadius="lg"
              bg={`${color}15`}
              color={color}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={IconComponent} boxSize={5} />
            </Box>
          )}
        </HStack>
        <Text className="metric-value" fontSize="2xl" fontWeight="700" color={colorMode === 'light' ? 'gray.900' : 'white'}>
          {value}
        </Text>
        <Text 
          fontSize="sm" 
          color={change && change.startsWith('+') ? 'green.500' : 'red.500'}
          fontWeight="500"
        >
          {change || '+0%'} from last month
        </Text>
      </VStack>
    </Box>
  );
};
