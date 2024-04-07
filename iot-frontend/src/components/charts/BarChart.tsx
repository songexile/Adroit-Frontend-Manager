import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface DataItem {
  name: string;
  value: number;
}

interface VerticalBarChartProps {
  data: DataItem[];
}

const VerticalBarChart: React.FC<VerticalBarChartProps> = ({ data }) => (
  <BarChart width={500} height={300} data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="value" fill="#8884d8" />
  </BarChart>
);

export default VerticalBarChart;
