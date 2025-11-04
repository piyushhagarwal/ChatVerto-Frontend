import type { ChartDataPoint } from '@/types/analytics';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface StatCardProps {
  title: string;
  value: ChartDataPoint[];
}

export function BarChartCard({ value }: StatCardProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={value}>
        <CartesianGrid vertical={false} />
        <XAxis interval={0} dataKey="label" className="font-semibold" />
        <YAxis className="font-semibold" />
        <Tooltip />
        <Bar dataKey="count" fill="var(--primary)" />
      </BarChart>
    </ResponsiveContainer>
  );
}
