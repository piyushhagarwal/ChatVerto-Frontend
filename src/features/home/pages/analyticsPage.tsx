import { SiteHeader } from '@/components/site-header';
import WhatsAppSignupButton from '@/components/WhatsAppSignup';
import { useAppSelector } from '@/store/hooks';
import { AnalysisCards } from '../components/analysisCards';
import { CustomerInsightsCard } from '../components/dashboardGraph';

export default function AnalyticsPage() {
  const isWhatsAppConnected = useAppSelector(
    state => state.user.user?.isWhatsappConnected || true
  );
  const loading = useAppSelector(state => state.user.loading);

  return (
    <>
      <SiteHeader title="Analytics" />
      <div className="p-3">
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : (
          <div>
            {!isWhatsAppConnected ? (
              <div className="text-center py-8">
                <h2 className="text-xl mb-4">
                  Connect Your WhatsApp Business Account
                </h2>
                <p className="text-gray-600 mb-6">
                  To start using ChatVerto features, please connect your
                  WhatsApp Business account
                </p>
                <WhatsAppSignupButton />
              </div>
            ) : (
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
            )}
          </div>
        )}
      </div>
    </>
  );
}
