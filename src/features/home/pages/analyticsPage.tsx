import { SiteHeader } from '@/components/site-header';
import { useAppSelector } from '@/store/hooks';
import { AnalysisCards } from '../components/analysisCards';
import { CustomerInsightsCard } from '../components/dashboardGraph';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

export default function AnalyticsPage() {
  const { error, loading } = useAppSelector(state => state.user);

  return (
    <>
      <SiteHeader title="Analytics" />

      <div className="p-3">
        {/* 🔴 Error State */}
        {error && (
          <Alert
            variant="destructive"
            className="justify-items-start border-destructive mb-4"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* ⏳ Loading State */}
        {loading && !error && (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin" />
            <span className="text-lg  text-primary font-medium">
              Please wait...
            </span>
          </div>
        )}

        {/* ✅ Main Content */}
        {!loading && !error && (
          <>
            <div className="mb-6">
              <AnalysisCards />
            </div>
            <div className="mb-6">
              <CustomerInsightsCard />
            </div>
            {/* Future analytics sections can be added here */}
          </>
        )}
      </div>
    </>
  );
}
