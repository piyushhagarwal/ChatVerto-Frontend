import { useState, useEffect } from 'react';
import { Users, Activity, RefreshCw, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { StatCard } from './statCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchSummaryDataThunk } from '@/store/slices/analyticsSlice';

export function AnalysisCards() {
  const [period, setPeriod] = useState('today');

  const dispatch = useAppDispatch();

  const { summary, loading, error } = useAppSelector(state => state.analytics);

  // Fetch summary data when period changes
  useEffect(() => {
    dispatch(fetchSummaryDataThunk(period));
  }, [dispatch, period]);

  return (
    <div className="w-full rounded-xl bg-card text-card-foreground shadow-[0_0_5px_rgba(0,0,0,0.2)] p-6">
      {/* Header with Dropdown */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-black tracking-tight">
          Analytics Overview
        </h2>

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
              <DropdownMenuRadioItem value="today">Today</DropdownMenuRadioItem>
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

      {/* Stat Cards Grid */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total Check-ins"
            value={summary.totalCheckins.toString()}
            trend={summary.growth.checkins.toString() + '%'}
            trendType={summary.growth.checkins >= 0 ? 'up' : 'down'}
            period={`${
              {
                today: 'Yesterday',
                thisWeek: 'Last Week',
                thisMonth: 'Last Month',
                sixMonths: 'Last 6 Months',
              }[period]
            }`}
            icon={<Activity className="h-6 w-6 text-primary" />}
          />
          <StatCard
            title="New Customers"
            value={summary.uniqueCustomers.toString()}
            trend={summary.growth.uniqueCustomers.toString() + '%'}
            trendType={summary.growth.checkins >= 0 ? 'up' : 'down'}
            period={`${
              {
                today: 'Yesterday',
                thisWeek: 'Last Week',
                thisMonth: 'Last Month',
                sixMonths: 'Last 6 Months',
              }[period]
            }`}
            icon={<Users className="h-6 w-6 text-primary" />}
          />
          <StatCard
            title="Repeated Customers"
            value={summary.repeatedCustomers.toString()}
            trend={summary.growth.repeatedCustomers.toString() + '%'}
            trendType={summary.growth.repeatedCustomers >= 0 ? 'up' : 'down'}
            period={`${
              {
                today: 'Yesterday',
                thisWeek: 'Last Week',
                thisMonth: 'Last Month',
                sixMonths: 'Last 6 Months',
              }[period]
            }`}
            icon={<RefreshCw className="h-6 w-6 text-primary" />}
          />
        </div>
      )}
    </div>
  );
}
