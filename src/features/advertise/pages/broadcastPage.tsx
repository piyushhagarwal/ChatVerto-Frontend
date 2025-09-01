import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BroadcastDialog } from '../components/BroadcastDialog';
import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  TrendingUp,
  MailCheck,
  Eye,
  MessageSquareReply,
  AlertTriangle,
  CreditCard,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';
import { fetchAllCampaignsThunk } from '@/store/slices/campiagnSlice';
import { type Campaign } from '@/types/campaign';

export default function BroadcastPage() {
  const dispatch = useAppDispatch();
  const { campaigns, loading, error } = useAppSelector(state => state.campaign);

  useEffect(() => {
    dispatch(fetchAllCampaignsThunk());
  }, [dispatch]);

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-primary w-5 h-5" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Campaign Performance Overview
          </h2>
        </div>

        <Button onClick={() => setOpen(true)}>Create New Campaign</Button>
      </div>

      {/* Search and Campaign Table */}
      <div className="space-y-4 pt-6">
        <Input
          placeholder="Search campaigns..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex flex-col gap-6 mt-2">
          {error && (
            <Alert
              variant="destructive"
              className="justify-items-start border-destructive"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Template loading failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        {campaigns && (
          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Campaign Name</th>
                  <th className="px-4 py-2 text-left">Group</th>
                  <th className="px-4 py-2 text-left">Template</th>
                  <th className="px-4 py-2 text-left">Created At</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(campaign => (
                  <tr key={campaign.id} className="border-t">
                    <td className="px-4 py-2 font-medium">{campaign.name}</td>
                    <td className="px-4 py-2">{campaign.groupName}</td>
                    <td className="px-4 py-2">{campaign.templateName}</td>
                    <td className="px-4 py-2">
                      {campaign.createdAt instanceof Date
                        ? campaign.createdAt.toLocaleString()
                        : campaign.createdAt}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold 
                      ${
                        campaign.status === 'Completed'
                          ? 'bg-green-100 text-green-700'
                          : campaign.status === 'Failed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 space-x-2">
                      <Button size="sm" variant="outline">
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="mt-2 hover:bg-muted hover:text-primary transition-colors duration-200"
                      >
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div>
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-700 px-4 py-2">
              <p>Please wait for the Campiagns ...</p>
            </div>
          )}
        </div>
      </div>

      <BroadcastDialog open={open} setOpen={setOpen} />
    </div>
  );
}
