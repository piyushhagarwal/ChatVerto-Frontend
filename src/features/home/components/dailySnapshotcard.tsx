'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

// Mock sparkline data
const checkinData = [
  { day: 'Mon', value: 320 },
  { day: 'Tue', value: 400 },
  { day: 'Wed', value: 380 },
  { day: 'Thu', value: 420 },
  { day: 'Fri', value: 450 },
  { day: 'Sat', value: 470 },
  { day: 'Sun', value: 432 },
];

const newCustomerData = [
  { day: 'Mon', value: 100 },
  { day: 'Tue', value: 120 },
  { day: 'Wed', value: 95 },
  { day: 'Thu', value: 130 },
  { day: 'Fri', value: 125 },
  { day: 'Sat', value: 140 },
  { day: 'Sun', value: 125 },
];

const repeatVisitorData = [
  { day: 'Mon', value: 200 },
  { day: 'Tue', value: 230 },
  { day: 'Wed', value: 220 },
  { day: 'Thu', value: 240 },
  { day: 'Fri', value: 260 },
  { day: 'Sat', value: 280 },
  { day: 'Sun', value: 270 },
];

function Sparkline({ data }: { data: { day: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data}>
        <Tooltip
          contentStyle={{
            background: 'white',
            border: '1px solid #e5e7eb',
            fontSize: '12px',
          }}
          labelStyle={{ display: 'none' }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#4f46e5"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default function DailySnapshotCard() {
  return (
    <Card className="w-full border-0 shadow-[0_0_5px_rgba(0,0,0,0.2)] ">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="block font-semibold text-md text-gray-900 tracking-wide">
            Daily Snapshot
          </CardTitle>
          <CardDescription className="block font-semibold text-sm text-gray-500 tracking-wide">
            Yesterday’s customer activity
          </CardDescription>
        </div>
        <TrendingUp className="h-5 w-5 text-muted-foreground" />
      </CardHeader>

      <CardContent className="grid gap-6 sm:grid-cols-3">
        {/* Total Check-ins */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="block font-semibold text-sm text-gray-500 tracking-wide text-muted-foreground">
              Total Check-ins
            </span>
            <span className="text-lg font-semibold">432</span>
          </div>
          <Sparkline data={checkinData} />
        </div>

        {/* New Customers */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="block font-semibold text-sm text-gray-500 tracking-wide text-muted-foreground">
              New Customers
            </span>
            <span className="text-lg font-semibold">125</span>
          </div>
          <Sparkline data={newCustomerData} />
        </div>

        {/* Repeat Visitors */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span className="block font-semibold text-sm text-gray-500 tracking-wide text-muted-foreground">
              Repeat Visitors
            </span>
            <span className="text-lg font-semibold">270</span>
          </div>
          <Sparkline data={repeatVisitorData} />
        </div>
      </CardContent>
    </Card>
  );
}
