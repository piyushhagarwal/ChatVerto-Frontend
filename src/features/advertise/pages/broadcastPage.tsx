import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BroadcastDialog } from '../components/BroadcastDialog';
import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';
import {
  fetchAllCampaignsThunk,
  deleteCampaignThunk,
} from '@/store/slices/campiagnSlice';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BroadcastPage() {
  const dispatch = useAppDispatch();
  const { campaigns, loading, error } = useAppSelector(state => state.campaign);

  useEffect(() => {
    dispatch(fetchAllCampaignsThunk());
  }, [dispatch]);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (confirmDeleteId) {
      await dispatch(deleteCampaignThunk(confirmDeleteId));
      dispatch(fetchAllCampaignsThunk()); // refresh list
      setConfirmDeleteId(null); // close dialog
    }
  };
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6 bg-card/1  rounded-b-2xl shadow-[0_0_5px_rgba(0,0,0,0.2)] p-6 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="text-primary w-5 h-5" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Campaign Performance Overview
          </h2>
        </div>

        <Button
          onClick={() => navigate('/dashboard/advertise/create-campaign')}
        >
          Create New Campaign
        </Button>
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
              <thead className="bg-primary text-accent">
                <tr>
                  <th className="px-4 py-2 text-center">Campaign Name</th>
                  <th className="px-4 py-2 text-center">Group</th>
                  <th className="px-4 py-2 text-center">Template</th>
                  <th className="px-4 py-2 text-center">Status</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(campaign => (
                  <tr key={campaign.id} className="border-t">
                    <td className="px-4 py-2 text-center align-middle text-sm font-semibold text-gray-700 tracking-wide">
                      {campaign.name}
                    </td>
                    <td className="px-4 py-2 text-center align-middle text-sm font-semibold text-gray-700 tracking-wide">
                      {campaign.groupName}
                    </td>
                    <td className="px-4 py-2 text-center align-middle text-sm font-semibold text-gray-700 tracking-wide">
                      {campaign.templateName}
                    </td>
                    <td className="px-4 py-2 text-center align-middle">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold text-gray-700 tracking-wided 
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
                    <td className="px-4 py-2 space-x-2 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <Link to={`${campaign.id}/preview`}>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="hover:bg-muted hover:text-primary"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {/* <Button
                          size="icon"
                          variant="ghost"
                          className="hover:bg-muted hover:text-primary"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button> */}

                        <Button
                          size="icon"
                          variant="ghost"
                          className="hover:bg-red-100 hover:text-red-600"
                          onClick={() => setConfirmDeleteId(campaign.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
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
      <Dialog
        open={!!confirmDeleteId}
        onOpenChange={() => setConfirmDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>

          <p>
            Are you sure you want to permanently delete{' '}
            <strong>
              {campaigns.find(c => c.id === confirmDeleteId)?.name}
            </strong>
            ? This action cannot be undone.
          </p>

          <DialogFooter className="pt-4">
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
            <Button variant="outline" onClick={() => setConfirmDeleteId(null)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
