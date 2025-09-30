'use client';

import {
  BarChart,
  Bar,
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
  { metric: 'Check-ins', current: 850, previous: 700 },
  { metric: 'Customers', current: 480, previous: 390 },
];

export function ComparativeInsightsChart() {
  return (
    <Card className="w-full border-0 shadow-[0_0_5px_rgba(0,0,0,0.2)] ">
      <CardHeader>
        <CardTitle className="block font-semibold text-md text-gray-900 tracking-wide">
          📊 Comparative Insights
        </CardTitle>
        <CardDescription className="block font-semibold text-sm text-gray-500 tracking-wide">
          This period vs last period
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="metric" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="current" fill="#064734" radius={[6, 6, 0, 0]} />
            <Bar dataKey="previous" fill="#CDDF7D" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
