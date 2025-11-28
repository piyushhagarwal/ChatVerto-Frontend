import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCampaignByIdThunk } from '@/store/slices/campiagnSlice';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function BroadcastPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { selectedCampaign, loading, error } = useAppSelector(
    state => state.campaign
  );

  useEffect(() => {
    if (id) dispatch(fetchCampaignByIdThunk(id));
  }, [dispatch, id]);

  // Determine status color
  const statusColor =
    selectedCampaign?.status === 'Completed'
      ? 'bg-green-100 text-green-700'
      : selectedCampaign?.status === 'Failed'
        ? 'bg-red-100 text-red-700'
        : 'bg-yellow-100 text-yellow-800';

  return (
    <div className="shadow-[0_0_20px_rgba(0,0,0,0.15)] pb-6 p-[5px] space-y-6 rounded-b-xl">
      {/* -------------------------- ALWAYS VISIBLE HEADER -------------------------- */}
      <div className="flex h-20 items-center bg-primary gap-2 border-[#fafff4ff] px-4 lg:px-6 text-accent">
        <Separator orientation="vertical" className="h-4" />
        <h1 className="text-base font-medium">
          {selectedCampaign?.name || 'Campaign Preview'}
        </h1>
      </div>

      {/* Back button ALWAYS visible */}
      <div className="flex items-center justify-end px-4">
        <Link to="/dashboard/advertise/broadcast">
          <Button>Back to Campaigns</Button>
        </Link>
      </div>

      {/* ----------------------- CONDITIONAL RENDER AREA ----------------------- */}
      {error ? (
        // ❌ ERROR
        <div className="px-4">
          <Alert variant="destructive" className="border-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Failed to load campaign</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      ) : loading ? (
        // ⏳ LOADING
        <div className="text-center py-20 flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin" />
          <span className="text-lg  text-primary font-medium">
            Please wait...
          </span>
        </div>
      ) : !selectedCampaign ? (
        // 🟦 NOT FOUND
        <div className="text-center px-4 py-10">
          <h2 className="text-gray-600 text-lg">Campaign not found</h2>
          <p className="text-sm text-gray-400 mt-2">
            It may have been removed or no longer exists.
          </p>
        </div>
      ) : (
        // ✅ SUCCESS CONTENT
        <>
          {/* Campaign Details */}
          <div className="bg-card p-2 m-2 mb-10 shadow-[0_0_5px_rgba(0,0,0,0.2)] rounded-sm">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Campaign Details</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 p-4">
              <div>
                <p className="text-sm text-muted-foreground">Group</p>
                <p className="font-medium">{selectedCampaign.groupName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge className={`${statusColor} px-3 py-1 rounded-md`}>
                  {selectedCampaign.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Template Used</p>
                <p className="font-medium">{selectedCampaign.templateName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created At</p>
                <p className="font-medium">
                  {new Date(selectedCampaign.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Performance Card */}
          <div className="bg-card p-2 m-2 shadow-[0_0_5px_rgba(0,0,0,0.2)] rounded-sm">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Campaign Performance</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 p-4">
              <div className="border-r pr-4">
                <p className="text-sm text-muted-foreground">Total Contacts</p>
                <p className="text-lg font-semibold">
                  {selectedCampaign.totalContacts}
                </p>
              </div>

              <div className="border-r pr-4">
                <p className="text-sm text-muted-foreground">Sent</p>
                <p className="text-lg font-semibold">
                  {selectedCampaign.sentMessages}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-lg font-semibold">
                  {selectedCampaign.deliveredMessages}
                </p>
              </div>

              <div className="border-r pr-4">
                <p className="text-sm text-muted-foreground">Read</p>
                <p className="text-lg font-semibold">
                  {selectedCampaign.readMessages}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-lg font-semibold text-red-500">
                  {selectedCampaign.failedMessages}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
