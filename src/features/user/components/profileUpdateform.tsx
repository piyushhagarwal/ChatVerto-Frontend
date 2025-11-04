import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import { type RootState } from '@/store';
import type { AppDispatch } from '@/store';
import { useEffect, useState } from 'react';
import {
  updateUserProfileThunk,
  getUserProfileThunk,
} from '@/store/slices/userSlice';

import { PlusIcon, XIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const industryOptions = [
  'UNDEFINED',
  'OTHER',
  'AUTO',
  'BEAUTY',
  'APPAREL',
  'EDU',
  'ENTERTAIN',
  'EVENT_PLAN',
  'FINANCE',
  'GROCERY',
  'GOVT',
  'HOTEL',
  'HEALTH',
  'NONPROFIT',
  'PROF_SERVICES',
  'RETAIL',
  'TRAVEL',
  'RESTAURANT',
  'NOT_A_BIZ',
];

export default function ProfileUpdateForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);

  const [form, setForm] = useState<{
    description: string;
    address: string;
    businessEmail: string;
    websites: string[];
    websiteInput: string;
    vertical: string;
  }>({
    description: user?.description || '',
    address: user?.address || '',
    businessEmail: '',
    websites: user?.websites || [],
    websiteInput: '',
    vertical: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        description: user.description || '',
        address: user.address || '',
        businessEmail: user.businessEmail || '',
        websites: user.websites || [],
        websiteInput: '',
        vertical: user.vertical || '',
      });
    }
  }, [user]);

  const handleAddWebsite = () => {
    if (form.websiteInput && form.websites.length < 2) {
      setForm(prev => ({
        ...prev,
        websites: [...prev.websites, prev.websiteInput],
        websiteInput: '',
      }));
    }
  };
  const handleRemoveWebsite = (index: number) => {
    const updated = [...form.websites];
    updated.splice(index, 1);
    setForm({ ...form, websites: updated });
  };

  const handleSubmit = async () => {
    const payload = {
      description: form.description,
      address: form.address,
      businessEmail: form.businessEmail,
      websites: form.websites,
      vertical: form.vertical,
    };
    dispatch(updateUserProfileThunk(payload)).then(() => {
      dispatch(getUserProfileThunk());
    });
  };

  return (
    <div className="p-[5px] pb-2">
      <div className="p-2 shadow-[0_0_5px_rgba(0,0,0,0.2)] border-0 bg-card overflow-hidden rounded-xl m-2">
        <div className="flex justify-end px-1 py-1">
          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
        <Separator />
        <div className="p-0">
          {/* Row: Description */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-10 gap-6">
            <Label className="md:w-1/5">Business Description</Label>
            <Input
              className="md:w-2/5"
              placeholder="Enter your business description"
              value={user?.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <p className="text-muted-foreground text-sm md:w-2/5">
              Edit your WhatsApp Business account description.
            </p>
          </div>
          <Separator />

          {/* Row: Address */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-10 gap-6">
            <Label className="md:w-1/5">Business Address</Label>
            <Input
              className="md:w-2/5"
              placeholder="Enter your business address"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
            />
            <p className="text-muted-foreground text-sm md:w-2/5">
              Specify your business's physical address.
            </p>
          </div>
          <Separator />

          {/* Row: Email */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-10 gap-6">
            <Label className="md:w-1/5">Business Email</Label>
            <Input
              className="md:w-2/5"
              placeholder="Enter your business email"
              value={form.businessEmail}
              onChange={e =>
                setForm({ ...form, businessEmail: e.target.value })
              }
            />
            <p className="text-muted-foreground text-sm md:w-2/5">
              Add your business email as an additional point of contact.
            </p>
          </div>
          <Separator />

          {/* Row: Website */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-10 gap-6">
            <Label className="md:w-1/5">Business Website</Label>
            <div className="md:w-2/5 space-y-2">
              <div className="flex flex-wrap gap-2">
                {form.websites.map((site, idx) => (
                  <div
                    key={idx}
                    className="flex items-center bg-muted px-3 py-2 rounded-full text-sm gap-2"
                  >
                    <span className="leading-none">{site}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveWebsite(idx)}
                      className="text-muted-foreground hover:text-destructive focus:outline-none"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter your website"
                  value={form.websiteInput}
                  onChange={e =>
                    setForm({ ...form, websiteInput: e.target.value })
                  }
                />
                <Button type="button" onClick={handleAddWebsite}>
                  <PlusIcon className="w-4 h-4 mr-1" /> Add
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground text-sm md:w-2/5">
              Add your business website (2 websites max). Max length: 256
              characters.
            </p>
          </div>
          <Separator />

          {/* Row: Industry Dropdown */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-10 gap-6">
            <Label className="md:w-1/5">Business Industry</Label>
            <div className="md:w-2/5">
              <Select
                value={form.vertical}
                onValueChange={value => setForm({ ...form, vertical: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent side="bottom" sideOffset={4} className="h-60">
                  {industryOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {option.replace(/_/g, ' ').toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-muted-foreground text-sm md:w-2/5">
              Choose your business vertical.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
