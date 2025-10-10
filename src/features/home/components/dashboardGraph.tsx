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
import { Button } from '@/components/ui/button';
import { Users, Activity, RefreshCw, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { BarChartCard } from './graphs/barChartCard';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchChartDataThunk } from '@/store/slices/analyticsSlice';

export function CustomerInsightsCard() {
  const [period, setPeriod] = useState('today');
  const [type, setType] = useState('totalCheckins');

  const dispatch = useAppDispatch();

  const { chart, loading, error } = useAppSelector(state => state.analytics);

  useEffect(() => {
    dispatch(fetchChartDataThunk({ period, type }));
  }, [dispatch, period, type]);

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
            value={type}
            onValueChange={val => val && setType(val)}
            variant="outline"
            className="bg-[#fafff4] rounded-lg border-[1px] shadow-[0_0_10px_rgba(0,0,0,0.2)] p-1"
          >
            <ToggleGroupItem
              value="totalCheckins"
              className="px-5 py-2 text-sm font-medium rounded-lg border-0 hover:bg-accent/65 data-[state=on]:bg-primary data-[state=on]:text-accent transition-colors mr-2"
            >
              Total Check-ins
            </ToggleGroupItem>
            <ToggleGroupItem
              value="uniqueCustomers"
              className="px-5 py-2 text-sm font-medium rounded-lg border-0 hover:bg-accent/65 data-[state=on]:bg-primary data-[state=on]:text-accent transition-colors mr-2"
            >
              Unique Customers
            </ToggleGroupItem>
            <ToggleGroupItem
              value="repeatedCustomers"
              className="px-5 py-2 text-sm font-medium rounded-lg border-0 hover:bg-accent/65 data-[state=on]:bg-primary data-[state=on]:text-accent transition-colors"
            >
              Repeated Customers
            </ToggleGroupItem>
          </ToggleGroup>

          {/* Time Range Select */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 text-sm font-medium"
              >
                {
                  {
                    today: 'Today',
                    thisWeek: 'This Week',
                    thisMonth: 'This Month',
                    sixMonths: 'Last 6 Months',
                  }[period]
                }
                <ChevronDown className="h-4 w-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuRadioGroup value={period} onValueChange={setPeriod}>
                <DropdownMenuRadioItem value="today">
                  Today
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="thisWeek">
                  This Week
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="thisMonth">
                  This Month
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="sixMonths">
                  Last 6 Months
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      {chart && (
        <CardContent className="pt-6 flex justify-center items-center h-[300px]">
          {type === 'totalCheckins' && (
            <BarChartCard title="Total Check-ins" value={chart.chartData} />
          )}
          {type === 'uniqueCustomers' && (
            <BarChartCard title="Total Check-ins" value={chart.chartData} />
          )}
          {type === 'repeatedCustomers' && (
            <BarChartCard title="Total Check-ins" value={chart.chartData} />
          )}
        </CardContent>
      )}
    </Card>
  );
}
