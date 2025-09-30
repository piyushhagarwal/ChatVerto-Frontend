'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

const data = [
  { month: 'Jan', checkins: 400, customers: 240 },
  { month: 'Feb', checkins: 500, customers: 300 },
  { month: 'Mar', checkins: 700, customers: 420 },
  { month: 'Apr', checkins: 600, customers: 390 },
  { month: 'May', checkins: 850, customers: 480 },
];

export function MonthlyGrowthChart() {
  return (
    <Card className="w-full border-0 shadow-[0_0_5px_rgba(0,0,0,0.2)] ">
      <CardHeader>
        <CardTitle className="block font-semibold text-md text-gray-900 tracking-wide">
          📈 Monthly Growth
        </CardTitle>
        <CardDescription className="block font-semibold text-sm text-gray-500 tracking-wide">
          Check-ins & Unique Customers over time
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="checkins"
              stroke="#064734"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="customers"
              stroke="#CDDF7D"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
