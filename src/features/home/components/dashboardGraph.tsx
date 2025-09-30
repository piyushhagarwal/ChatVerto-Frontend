'use client';
import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { PieChartCard } from './graphs/pieChartCard';
import { BarChartCard } from './graphs/barChartCard';
import { HeatmapCard } from './graphs/heatMapCard';

export function CustomerInsightsCard() {
  const [metric, setMetric] = React.useState<'pie' | 'bar' | 'heatmap'>('pie');
  const [timeRange, setTimeRange] = React.useState('90d');

  return (
    <Card className="w-full  mx-auto shadow-[0_0_4px_rgba(0,0,0,0.2)] border border-gray-200 rounded-2xl">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-gray-100">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900 tracking-wide">
            Customer Insights
          </CardTitle>
          <CardDescription className="text-sm block font-semibold text-gray-500">
            Select a metric to view
          </CardDescription>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-2">
          {/* Metric Toggle */}
          <ToggleGroup
            type="single"
            value={metric}
            onValueChange={val => val && setMetric(val as any)}
            variant="outline"
            className="bg-[#fafff4] rounded-lg border-[1px] shadow-[0_0_10px_rgba(0,0,0,0.2)]  p-1"
          >
            <ToggleGroupItem
              value="pie"
              className="px-5 py-2 text-sm  font-medium  rounded-lg  border-0 hover:bg-accent/65 data-[state=on]:bg-primary data-[state=on]:text-accent  transition-colors mr-2"
            >
              New vs Returning
            </ToggleGroupItem>
            <ToggleGroupItem
              value="bar"
              className="px-5 py-2 text-sm font-medium   rounded-lg border-0 hover:bg-accent/65 data-[state=on]:bg-primary data-[state=on]:text-accent transition-colors mr-2"
            >
              Visit Frequency
            </ToggleGroupItem>
            <ToggleGroupItem
              value="heatmap"
              className="px-5 py-2 text-sm font-medium  rounded-lg border-0 hover:bg-accent/65 data-[state=on]:bg-primary data-[state=on]:text-accent transition-colors"
            >
              Peak Hours
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Time Range Select */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40 sm:w-36 h-9 rounded-lg border border-gray-300 bg-white text-gray-700 shadow-sm">
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-md">
              <SelectItem value="90d" className="rounded-lg hover:bg-gray-100">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg hover:bg-gray-100">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg hover:bg-gray-100">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="pt-6 flex justify-center items-center h-[300px]">
        {metric === 'pie' && <PieChartCard />}
        {metric === 'bar' && <BarChartCard />}
        {metric === 'heatmap' && <HeatmapCard />}
      </CardContent>
    </Card>
  );
}
