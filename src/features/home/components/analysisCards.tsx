import { StatCard } from './statCard';
import { Users, Activity, RefreshCw, AlertCircle } from 'lucide-react';

export function AnalysisCards() {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Check-ins"
        value="12,540"
        trend="+8.4%"
        trendType="up"
        description="Compared to last month"
        icon={<Activity className="h-6 w-6 text-primary" />}
      />
      <StatCard
        title="Unique Customers"
        value="4,320"
        trend="+3.2%"
        trendType="up"
        description="New vs returning balance"
        icon={<Users className="h-6 w-6 text-primary" />}
      />
      <StatCard
        title="Retention Rate"
        value="76%"
        trend="-2.1%"
        trendType="down"
        description="Returning within 30 days"
        icon={<RefreshCw className="h-6 w-6 text-primary" />}
      />
      <StatCard
        title="Churn Indicator"
        value="14%"
        trend="+1.5%"
        trendType="up"
        description="Inactive > 60 days"
        icon={<AlertCircle className="h-6 w-6 text-primary" />}
      />
    </div>
  );
}
