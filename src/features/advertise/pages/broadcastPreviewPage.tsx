import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCampaignByIdThunk } from '@/store/slices/campiagnSlice';

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
    <div className="p-6 space-y-6">
      {/* Header row with Campaign name (left) and Back button (right) */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{selectedCampaign.name}</h1>
        <Link to="/dashboard/advertise/broadcast">
          <Button variant="outline">Back to Campaigns</Button>
        </Link>
      </div>

      {/* Campaign details card */}
      <Card className="bg-white bg-white shadow-md border-0 rounded-2xl">
        <CardHeader>
          <CardTitle>Campaign Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
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
        </CardContent>
      </Card>

      {/* Campaign stats card */}
      <Card className="bg-white shadow-md border-0 rounded-2xl">
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        </CardContent>
      </Card>
    </div>
  );
}
