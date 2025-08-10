import { useEffect, useState } from 'react';
import { Users, Plus, MoreVertical, Trash2, AlertCircle } from 'lucide-react';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  createGroupThunk,
  deleteGroupThunk,
  clearError,
} from '@/store/slices/groupSlice';

import type { GroupContact } from '@/types/contact';
import { Alert, AlertTitle } from '@/components/ui/alert';

interface GroupsProps {
  selectedGroupId: string | null;
  onGroupSelect: (groupId: string | null) => void;
}

export default function Groups({
  selectedGroupId,
  onGroupSelect,
}: GroupsProps) {
  const dispatch = useAppDispatch();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleDeleteGroup = (id: string, name: string) => {
    setGroupToDelete({ id, name });
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteGroup = () => {
    if (groupToDelete) {
      dispatch(deleteGroupThunk(groupToDelete.id));
      setGroupToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const { groups, error } = useAppSelector(state => state.group);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleCreateGroup = () => {
    if (groupName.trim()) {
      dispatch(createGroupThunk({ name: groupName.trim() }));
      setGroupName('');
      setIsCreateDialogOpen(false);
    }
  };

  const handleCancel = () => {
    setGroupName('');
    setIsCreateDialogOpen(false);
  };

  return (
    <section>
      {error && (
        <Alert
          variant="destructive"
          className="justify-items-start border-destructive my-3"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Groups</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-primary">
              <Plus className="w-4 h-4 mr-1" /> Create Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="groupName">Group Name</Label>
              <Input
                id="groupName"
                placeholder="Enter group name"
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCreateGroup()}
              />
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" onClick={handleCreateGroup}>
                Save
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {groups.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {/* All Contacts Card */}
          <Card
            className={`cursor-pointer hover:shadow ${
              selectedGroupId === null ? 'ring-2' : ''
            }`}
            onClick={() => onGroupSelect(null)}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>All Contacts</CardTitle>
              <Users className="w-4 h-4" />
            </CardHeader>
          </Card>

          {/* Group Cards */}
          {groups.map((group: GroupContact) => (
            <Card
              key={group.id}
              className={`cursor-pointer hover:shadow relative ${
                selectedGroupId === group.id ? 'ring-2' : ''
              }`}
              onClick={() => onGroupSelect(group.id)}
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{group.name}</CardTitle>
                <div onClick={e => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-5 w-5">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleDeleteGroup(group.id, group.name)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No groups available.</p>
      )}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Group</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete the group{' '}
            <strong>{groupToDelete?.name}</strong>? This action cannot be
            undone.
          </p>
          <DialogFooter className="pt-4">
            <Button variant="destructive" onClick={confirmDeleteGroup}>
              Delete
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
