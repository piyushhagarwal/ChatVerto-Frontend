import { SiteHeader } from '@/components/site-header';
import WhatsAppSignupButton from '@/components/WhatsAppSignup';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { AnalysisCards } from '../components/analysisCards';
import { CustomerInsightsCard } from '../components/dashboardGraph';
import { TrendsSection } from '../components/trendsSection';
import DailySnapshotCard from '../components/dailySnapshotcard';
import { useEffect } from 'react';
import { getUserProfileThunk } from '@/store/slices/userSlice';

export default function AnalyticsPage() {
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   dispatch(getUserProfileThunk());
  // }, [dispatch]);

  const isWhatsAppConnected = useAppSelector(
    state => state.user.user?.isWhatsappConnected || true
  );
  const loading = useAppSelector(state => state.user.loading);

  return (
    <>
      <SiteHeader title="Analytics" />
      <div className="container mx-auto p-3">
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
