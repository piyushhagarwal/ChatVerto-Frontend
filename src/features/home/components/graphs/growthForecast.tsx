'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

const data = [
  { month: 'Jan', forecast: 400 },
  { month: 'Feb', forecast: 500 },
  { month: 'Mar', forecast: 700 },
  { month: 'Apr', forecast: 800 },
  { month: 'May', forecast: 950 },
  { month: 'Jun', forecast: 1100 },
];

export function GrowthForecastChart() {
  return (
    <Card className="w-full border-0 shadow-[0_0_5px_rgba(0,0,0,0.2)] ">
      <CardHeader>
        <CardTitle className="block font-semibold text-md text-gray-900 tracking-wide">
          🌊 Growth Forecast
        </CardTitle>
        <CardDescription className="block font-semibold text-sm text-gray-500 tracking-wide">
          Projected visits based on historical trends
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="forecast"
              stroke="#064734"
              fill="#CDDF7D"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
