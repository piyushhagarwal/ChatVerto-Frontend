import { useEffect, useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import Groups from '../components/groups';
import Contacts from '../components/contacts';
import { useAppDispatch } from '@/store/hooks';
import {
  fetchAllGroupsThunk,
  fetchGroupWithIdThunk,
} from '@/store/slices/groupSlice';

export default function ContactPage() {
  const dispatch = useAppDispatch();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // Fetch all groups on component mount
  useEffect(() => {
    dispatch(fetchAllGroupsThunk());
  }, [dispatch]);

  // Handle group selection
  const handleGroupSelect = (groupId: string | null) => {
    setSelectedGroupId(groupId);

    // Fetch group details if a specific group is selected
    if (groupId) {
      dispatch(fetchGroupWithIdThunk(groupId));
    }
  };

  return (
    <div className="w-full h-full">
      <SiteHeader title="Contacts" />
      <div className="p-4 space-y-6">
        {/* Groups Section */}
        <Groups
          selectedGroupId={selectedGroupId}
          onGroupSelect={handleGroupSelect}
        />

        {/* Contacts Section - handles its own data fetching with pagination/search/sort */}
        <Contacts selectedGroupId={selectedGroupId} />
      </div>
    </div>
  );
}
