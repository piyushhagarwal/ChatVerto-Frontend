import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchAllTemplatesThunk,
  deleteTemplateThunk,
} from '@/store/slices/templateSlice';
import { useState } from 'react';
import { FileText } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Eye, Trash2 } from 'lucide-react';

export default function TemplatesPage() {
  const dispatch = useAppDispatch();
  const { templates, loading, error } = useAppSelector(state => state.template);

  useEffect(() => {
    dispatch(fetchAllTemplatesThunk());
  }, [dispatch]);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const confirmDelete = async () => {
    if (confirmDeleteId) {
      await dispatch(deleteTemplateThunk(confirmDeleteId));
      dispatch(fetchAllTemplatesThunk()); // refresh list
      setConfirmDeleteId(null); // close dialog
    }
  };

  const navigate = useNavigate();

  return (
    <div className="space-y-1 rounded-b-2xl shadow-[0_0_5px_rgba(0,0,0,0.2)] bg-white p-6">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-2">
          <FileText className="text-primary w-5 h-5" />
          <h2 className="text-2xl font-semibold text-gray-800">My Templates</h2>
        </div>
        <Button
          onClick={() => navigate('/dashboard/advertise/create-template')}
        >
          Create New Template
        </Button>
      </div>

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

      {templates && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-primary text-accent">
              <tr>
                <th className="px-4 py-2 text-center ">Template Name</th>
                <th className="px-4 py-2 text-center">Category</th>
                <th className="px-4 py-2 text-center">Status</th>
                <th className="px-4 py-2 text-centert">Rejected Reason</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map(template => (
                <tr
                  key={template.id}
                  className="border-t text-center  bg-[#FAFFF4] align-middle"
                >
                  <td className="px-4 py-2  text-sm font-semibold text-gray-700 tracking-wide ">
                    {template.name}
                  </td>
                  <td className="px-4 py-2 text-sm font-semibold text-gray-700 tracking-wide ">
                    {template.category}
                  </td>

                  <td className="px-4 py-2 text-sm font-semibold  tracking-wide ">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold tracking-wide ${
                        template.status === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : template.status === 'REJECTED'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {template.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm font-semibold text-gray-700 tracking-wide ">
                    {template.rejected_reason}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <Link to={`${template.id}/preview`}>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-muted hover:text-primary"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="hover:bg-red-100 hover:text-red-600"
                      onClick={() => setConfirmDeleteId(template.name)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
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
            <p>Please wait for the templates ...</p>
          </div>
        )}
      </div>
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
              {templates.find(c => c.name === confirmDeleteId)?.name}
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
