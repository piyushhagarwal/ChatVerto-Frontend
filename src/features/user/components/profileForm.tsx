import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  updateUserProfileThunk,
  getUserProfileThunk,
} from '@/store/slices/userSlice';
import WebsiteInputList from '@/features/profile/components/websiteInputList';
import BusinessIndustryDropdown from '@/features/profile/components/businessIndustryDropdown';
import { Button } from '@/components/ui/button';

export default function ProfileForm() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.profile.user);

  const [form, setForm] = useState({
    address: '',
    description: '',
    vertical: '',
    about: '',
    businessEmail: '',
    websites: [] as string[],
  });

  useEffect(() => {
    if (user?.whatsAppDetails) {
      setForm({
        address: user.whatsAppDetails.address || '',
        description: user.whatsAppDetails.description || '',
        vertical: user.whatsAppDetails.vertical || '',
        about: user.whatsAppDetails.about || '',
        businessEmail: user.whatsAppDetails.businessEmail || '',
        websites: user.whatsAppDetails.websites || [],
      });
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateUserProfileThunk(form)).then(() => {
      dispatch(getUserProfileThunk());
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={form.address}
        onChange={e => setForm({ ...form, address: e.target.value })}
        placeholder="Address"
        className="border px-2 py-1 rounded w-full"
      />
      <input
        type="text"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        placeholder="Description"
        className="border px-2 py-1 rounded w-full"
      />
      <BusinessIndustryDropdown
        value={form.vertical}
        onChange={val => setForm({ ...form, vertical: val })}
      />
      <input
        type="text"
        value={form.about}
        onChange={e => setForm({ ...form, about: e.target.value })}
        placeholder="About"
        className="border px-2 py-1 rounded w-full"
      />
      <input
        type="email"
        value={form.businessEmail}
        onChange={e => setForm({ ...form, businessEmail: e.target.value })}
        placeholder="Business Email"
        className="border px-2 py-1 rounded w-full"
      />
      <WebsiteInputList
        websites={form.websites}
        onChange={urls => setForm({ ...form, websites: urls })}
      />
      <Button type="submit">Update Profile</Button>
    </form>
  );
}
