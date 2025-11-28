import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchAllTemplatesThunk,
  deleteTemplateThunk,
} from '@/store/slices/templateSlice';
import { FileText, AlertCircle, Eye, Trash2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export default function TemplatesPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { templates, loading, error } = useAppSelector(state => state.template);

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllTemplatesThunk());
  }, [dispatch]);

  const confirmDelete = async () => {
    if (confirmDeleteId) {
      await dispatch(deleteTemplateThunk(confirmDeleteId));
      dispatch(fetchAllTemplatesThunk());
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="space-y-1 rounded-b-2xl shadow-[0_0_5px_rgba(0,0,0,0.2)] bg-white p-6">
      {/* --------------------------- STATIC HEADER --------------------------- */}
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

      {/* --------------------------- ERROR DISPLAY --------------------------- */}
      {error && (
        <div className="h-30 w-full p-3 my-2 mb-4">
          <Alert
            variant="destructive"
            className="justify-items-start border-destructive"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* --------------------------- CONDITIONAL AREA --------------------------- */}
      {error ? (
        // ❌ Hide table on error
        <></>
      ) : loading ? (
        // ⏳ Loading state
        <div className="text-center py-20 flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-lg  text-primary font-medium">
            Please wait...
          </span>
        </div>
      ) : !templates || templates.length === 0 ? (
        // 🟦 Empty state
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">No templates found.</p>
          <p className="text-gray-400 text-sm mt-1">
            Create your first template to get started.
          </p>
        </div>
      ) : (
        // ✅ Table when templates exist
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-primary text-accent">
              <tr>
                <th className="px-4 py-2 text-center">Template Name</th>
                <th className="px-4 py-2 text-center">Category</th>
                <th className="px-4 py-2 text-center">Status</th>
                <th className="px-4 py-2 text-center">Rejected Reason</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {templates.map(template => (
                <tr
                  key={template.id}
                  className="border-t text-center bg-[#FAFFF4] align-middle"
                >
                  <td className="px-4 py-2 font-semibold text-gray-700">
                    {template.name}
                  </td>

                  <td className="px-4 py-2 font-semibold text-gray-700">
                    {template.category}
                  </td>

                  <td className="px-4 py-2 font-semibold">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
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

                  <td className="px-4 py-2 font-semibold text-gray-700">
                    {template.rejected_reason}
                  </td>

                  <td className="px-4 py-2">
                    <div className="flex justify-center items-center space-x-2">
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --------------------------- DELETE CONFIRMATION --------------------------- */}
      <Dialog
        open={!!confirmDeleteId}
        onOpenChange={() => setConfirmDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>

          <p>
            Are you sure you want to delete{' '}
            <strong>
              {templates?.find(c => c.name === confirmDeleteId)?.name}
            </strong>
            ? This cannot be undone.
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
