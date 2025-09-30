import { MonthlyGrowthChart } from './graphs/monthlyGrowthChart';
import { ComparativeInsightsChart } from './graphs/comparativeInsightsChart';
import { GrowthForecastChart } from './graphs/growthForecast';

export function TrendsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
      {/* Full-width Line chart */}
      <div className="lg:col-span-2">
        <MonthlyGrowthChart />
      </div>

      {/* Side-by-side smaller charts */}
      <ComparativeInsightsChart />
      <GrowthForecastChart />
    </div>
  );
}
