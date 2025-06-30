import { useEffect, useState } from 'react';
import { SiteHeader } from '@/components/site-header';
import Groups from '../components/groups';
import Contacts from '../components/contacts';
import { useAppDispatch } from '@/store/hooks';
import {
  fetchAllContactsThunk,
  fetchContactsByGroupIdThunk,
} from '@/store/slices/contactSlice';
import {
  fetchAllGroupsThunk,
  fetchGroupWithIdThunk,
} from '@/store/slices/groupSlice';

export default function ContactPage() {
  const dispatch = useAppDispatch();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAllGroupsThunk());
  }, [dispatch]);

  // Fetch group contacts when a group is selected
  useEffect(() => {
    if (selectedGroupId) {
      dispatch(fetchGroupWithIdThunk(selectedGroupId));
      dispatch(fetchContactsByGroupIdThunk(selectedGroupId));
    } else {
      dispatch(fetchAllContactsThunk());
    }
  }, [dispatch, selectedGroupId]);

  const handleGroupSelect = (groupId: string | null) => {
    setSelectedGroupId(groupId);
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

        {/* Contacts Section */}
        <Contacts selectedGroupId={selectedGroupId} />
      </div>
    </div>
  );
}
