import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCampaignByIdThunk } from '@/store/slices/campiagnSlice';
import { SiteHeader } from '@/components/site-header';
import { Separator } from '@/components/ui/separator';

export default function BroadcastPreviewPage() {
  const { id } = useParams<{ id: string }>();

  const dispatch = useAppDispatch();
  const { selectedCampaign, loading, error } = useAppSelector(
    state => state.campaign
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchCampaignByIdThunk(id));
    }
  }, [dispatch, id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!selectedCampaign) return <div>No campaign found</div>;

  const statusColor =
    selectedCampaign.status === 'Completed'
      ? 'bg-green-100 text-green-700'
      : selectedCampaign.status === 'Failed'
        ? 'bg-red-100 text-red-700'
        : 'bg-yellow-100 text-yellow-800';

  return (
    <div className=" shadow-[0_0_20px_rgba(0,0,0,0.15)] pb-6 space-y-6 rounded-b-xl">
      {/* Header row with Campaign name (left) and Back button (right) */}
      <div className="flex h-20 shrink-0 items-center bg-primary gap-2 border-t-5 border-l-5 border-r-5 border-[#fafff4ff] text-accent transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-20">
        <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
          <Separator
            orientation="vertical"
            className=" data-[orientation=vertical]:h-4"
          />
          <h1 className="text-base font-medium">{selectedCampaign.name}</h1>
          <div className="ml-auto flex items-center gap-2">
            {/* Right side empty for now */}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-2 ">
        <h1></h1>
        <Link to="/dashboard/advertise/broadcast">
          <Button>Back to Campaigns</Button>
        </Link>
      </div>

      {/* Campaign details card */}
      <div className="bg-card p-2 m-2 mb-10 shadow-[0_0_5px_rgba(0,0,0,0.2)] border-0 rounded-sm">
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

      {/* Campaign stats card */}
      <div className="bg-card p-2 m-2 mb-1 shadow-[0_0_5px_rgba(0,0,0,0.2)] border-0 rounded-sm ">
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
    </div>
  );
}
