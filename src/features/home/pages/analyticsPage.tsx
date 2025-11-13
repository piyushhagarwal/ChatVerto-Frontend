import { SiteHeader } from '@/components/site-header';
import { useAppSelector } from '@/store/hooks';
import { AnalysisCards } from '../components/analysisCards';
import { CustomerInsightsCard } from '../components/dashboardGraph';

export default function AnalyticsPage() {
  const loading = useAppSelector(state => state.user.loading);

  return (
    <>
      <SiteHeader title="Analytics" />
      <div className="p-3">
        {loading && <p className="text-muted-foreground">Loading...</p>}

        <div>
          <>
            <div className="mb-6">
              <AnalysisCards />
            </div>
            <div className="mb-6">
              <CustomerInsightsCard />
            </div>

            {/* <div className="mb-6">
                  <TrendsSection />
                </div> */}
          </>
        </div>
      </div>
    </>
  );
}
