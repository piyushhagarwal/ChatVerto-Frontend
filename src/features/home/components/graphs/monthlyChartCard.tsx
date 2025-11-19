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
function parseDayFromLabel(label: string | number | Date | undefined): number {
  if (label === undefined || label === null) return NaN;

  // If it's already a number
  if (typeof label === 'number') return label;

  // If it's a Date object
  if (label instanceof Date) return label.getDate();

  // it's a string - try several strategies
  const str = String(label).trim();

  // 1) If string is just a number like "1" or "30"
  const asInt = parseInt(str, 10);
  if (!Number.isNaN(asInt) && /^\d+$/.test(str)) return asInt;

  // 2) If it's an ISO date or contains dashes/slashes like "2025-11-01" or "11/01/2025"
  //    try Date parsing and getDate()
  const maybeDate = new Date(str);
  if (!Number.isNaN(maybeDate.getTime())) return maybeDate.getDate();

  // 3) If it contains a day at the end, e.g. "Day 1" or "2025-11-01T00:00:00"
  const found = str.match(/(\d{1,2})(?!.*\d)/); // last 1-2 digit group
  if (found) return parseInt(found[1], 10);

  return NaN;
}

export function MonthlyBarChartCard({ value }: StatCardProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={value}>
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey="label"
          interval={0}
          className="font-semibold"
          tick={({ x, y, payload }) => {
            const label = payload.value;

            // Use your existing parser
            const day = parseDayFromLabel(label);

            // Convert to Date
            const date = new Date(label);
            const isValidDate = !isNaN(date.getTime());

            // Hide even days: return an empty SVG group instead of null so the renderer's return type is always a React element
            if (Number.isNaN(day) || day % 2 === 0 || !isValidDate) {
              return <g />;
            }

            const month = date.toLocaleString('en-US', { month: 'short' }); // "Nov"

            return (
              <g transform={`translate(${x},${y})`}>
                {/* Month name (first line) */}
                <text
                  x={0}
                  y={0}
                  dy={9}
                  textAnchor="middle"
                  fill="#555"
                  style={{ fontSize: '15px', fontWeight: 600 }}
                >
                  {month}
                </text>

                {/* Day (second line) */}
                <text
                  x={0}
                  y={0}
                  dy={26}
                  textAnchor="middle"
                  fill="#000000d5"
                  style={{ fontSize: '15px', fontWeight: 700 }}
                >
                  {day}
                </text>
              </g>
            );
          }}
        />

        <YAxis className="font-semibold" />
        <Tooltip />
        <Bar dataKey="count" fill="var(--primary)" />
      </BarChart>
    </ResponsiveContainer>
  );
}
