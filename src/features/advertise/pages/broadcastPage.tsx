import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BroadcastDialog } from '../components/BroadcastDialog';
import { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import {
  TrendingUp,
  MailCheck,
  Eye,
  MessageSquareReply,
  AlertTriangle,
  CreditCard,
} from 'lucide-react';

const demoCampaigns = [
  {
    id: '1',
    name: 'Promo Blast',
    group: 'All Customers',
    template: 'Festive Offer',
    status: 'Sent',
    sent: 5000,
    delivered: 4600,
    seen: 4200,
    responded: 900,
    clicks: 700,
  },
  {
    id: '2',
    name: 'Re-engage',
    group: 'Inactive Users',
    template: 'We Miss You',
    status: 'Pending',
    sent: 3200,
    delivered: 3100,
    seen: 2900,
    responded: 600,
    clicks: 350,
  },
];

export default function BroadcastPage() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCampaigns = demoCampaigns.filter(
    campaign =>
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.group.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.template.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const analyticsData = [
    {
      icon: <CreditCard className="text-green-600" size={20} />,
      label: 'Balance Left',
      value: '₹1,350.00',
    },
    {
      icon: <MailCheck className="text-blue-600" size={20} />,
      label: 'Messages Left',
      value: '1,200',
    },
    {
      icon: <TrendingUp className="text-indigo-600" size={20} />,
      label: 'Total Sent',
      value: '8,320',
    },
    {
      icon: <MailCheck className="text-teal-600" size={20} />,
      label: 'Delivered',
      value: '7,890',
    },
    {
      icon: <Eye className="text-yellow-600" size={20} />,
      label: 'Seen',
      value: '6,430',
    },
    {
      icon: <MessageSquareReply className="text-purple-600" size={20} />,
      label: 'Responded',
      value: '1,223',
    },
    {
      icon: <AlertTriangle className="text-red-600" size={20} />,
      label: 'Failed',
      value: '430',
    },
  ];

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
      {/* Redesigned Professional Analytics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 rounded-2xl bg-white shadow-md border hover:shadow-lg transition duration-200"
          >
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100">
              {item.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium tracking-wide">
                {item.label}
              </p>
              <p className="text-lg font-semibold text-gray-800">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Campaign Table */}
      <div className="space-y-4 pt-6">
        <Input
          placeholder="Search campaigns..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />

        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Campaign Name</th>
                <th className="px-4 py-2 text-left">Group</th>
                <th className="px-4 py-2 text-left">Template</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Sent</th>
                <th className="px-4 py-2 text-left">Delivered</th>
                <th className="px-4 py-2 text-left">Seen</th>
                <th className="px-4 py-2 text-left">Responded</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map(campaign => (
                <tr key={campaign.id} className="border-t">
                  <td className="px-4 py-2 font-medium">{campaign.name}</td>
                  <td className="px-4 py-2">{campaign.group}</td>
                  <td className="px-4 py-2">{campaign.template}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold 
                      ${
                        campaign.status === 'Sent'
                          ? 'bg-green-100 text-green-700'
                          : campaign.status === 'Failed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{campaign.sent}</td>
                  <td className="px-4 py-2">{campaign.delivered}</td>
                  <td className="px-4 py-2">{campaign.seen}</td>
                  <td className="px-4 py-2">{campaign.responded}</td>
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
      </div>

      <BroadcastDialog open={open} setOpen={setOpen} />
    </div>
  );
}
