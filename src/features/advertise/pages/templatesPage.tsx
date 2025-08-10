import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { TemplateCard } from '../components/TemplateCard';
import { useState } from 'react';
import { FileText } from 'lucide-react';

const demoTemplates = [
  {
    id: '1',
    title: 'Festive Offer',
    message: 'Get 20% off this Diwali!',
    category: 'Marketing',
    language: 'English',
    status: 'Pending',
    actionRequired: false,
  },
  {
    id: '2',
    title: 'We Miss You',
    message: 'Come back and get free shipping!',
    category: 'Utility',
    language: 'English',
    status: 'Rejected',
    actionRequired: true,
  },
];

export default function TemplatesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = demoTemplates.filter(
    template =>
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Template Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Language</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action Required</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTemplates.map(template => (
              <tr key={template.id} className="border-t">
                <td className="px-4 py-2 font-medium">{template.title}</td>
                <td className="px-4 py-2">{template.category}</td>
                <td className="px-4 py-2">{template.language}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      template.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : template.status === 'Rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {template.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {template.actionRequired ? (
                    <span className="text-red-600 font-semibold text-xs">
                      Yes
                    </span>
                  ) : (
                    <span className="text-gray-500 text-xs">No</span>
                  )}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <Button size="sm" variant="outline">
                    Preview
                  </Button>
                  <Button size="sm" variant="secondary">
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
