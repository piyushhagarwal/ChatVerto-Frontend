import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAllTemplatesThunk } from '@/store/slices/templateSlice';
import { TemplateCard } from '../components/TemplateCard';
import { useState } from 'react';
import { FileText } from 'lucide-react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { type Template } from '@/types/template';

export default function TemplatesPage() {
  const dispatch = useAppDispatch();
  const { templates, loading, error } = useAppSelector(state => state.template);

  useEffect(() => {
    dispatch(fetchAllTemplatesThunk());
  }, [dispatch]);

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // const filteredTemplates = demoTemplates.filter(
  //   template =>
  //     template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     template.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     template.status.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
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

      {/* Search input and Create button */}
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search templates..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
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
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Template Name</th>
                <th className="px-4 py-2 text-left">Category</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Rejected Reason</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {templates.map(template => (
                <tr key={template.id} className="border-t">
                  <td className="px-4 py-2 font-medium">{template.name}</td>
                  <td className="px-4 py-2">{template.category}</td>

                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
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
                  <td className="px-4 py-2">{template.rejected_reason}</td>
                  <td className="px-4 py-2 space-x-2">
                    <Link to={`${template.id}/preview`}>
                      <Button size="sm" variant="outline">
                        Preview
                      </Button>
                    </Link>
                    <Button size="sm" variant="secondary">
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
            <p>Please wait for the templates ...</p>
          </div>
        )}
      </div>
    </div>
  );
}
