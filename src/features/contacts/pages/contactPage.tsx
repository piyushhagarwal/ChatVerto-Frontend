import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trash2,
  Users,
  Loader2,
  AlertCircle,
  Plus,
  UploadCloud,
  Search,
} from 'lucide-react';

import { SiteHeader } from '@/components/site-header';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchAllContactsThunk,
  deleteContactThunk,
} from '@/store/slices/contactSlice';
import { fetchAllGroupsThunk } from '@/store/slices/groupSlice';

import type { Contact } from '@/types/contact';

export default function ContactPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const {
    contacts,
    loading: contactLoading,
    error: contactError,
  } = useAppSelector(state => state.contact);

  const { groups, error: groupError } = useAppSelector(state => state.group);

  useEffect(() => {
    dispatch(fetchAllContactsThunk());
    dispatch(fetchAllGroupsThunk());
  }, [dispatch]);

  useEffect(() => {
    const saved = localStorage.getItem('selectedContacts');
    if (saved) {
      try {
        setSelectedContacts(JSON.parse(saved));
      } catch (err) {
        console.error('Invalid JSON in selectedContacts', err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedContacts', JSON.stringify(selectedContacts));
  }, [selectedContacts]);

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedContacts(contacts.map(c => c.id));
    } else {
      setSelectedContacts([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedContacts(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const confirmDelete = () => {
    if (confirmDeleteId) {
      dispatch(deleteContactThunk(confirmDeleteId));
      setConfirmDeleteId(null);
    }
  };

  const confirmDeleteSelected = () => {
    selectedContacts.forEach(id => dispatch(deleteContactThunk(id)));
    setSelectedContacts([]);
    setConfirmBulkDelete(false);
  };

  const trimmedSearch = searchTerm.trim().toLowerCase();
  const filteredContacts = contacts.filter(
    contact =>
      contact.name.toLowerCase().includes(trimmedSearch) ||
      contact.phone.includes(trimmedSearch)
  );

  return (
    <div className="w-full h-full">
      <SiteHeader title="Contacts" />
      <div className="p-4 space-y-6">
        {contactLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading contacts...
          </div>
        )}

        {/* Group Cards */}
        <section>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Groups</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Add Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Group</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                  <Label htmlFor="groupName">Group Name</Label>
                  <Input id="groupName" placeholder="Enter group name" />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit">Save</Button>
                  <Button variant="outline">Cancel</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          {groups.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {groups.map(group => (
                <Card key={group.id} className="cursor-pointer hover:shadow">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{group.name}</CardTitle>
                    <Users className="w-4 h-4" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No groups available.</p>
          )}
        </section>

        {/* Contact Table Section */}
        <section className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">All Contacts</h2>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" /> Create Contact
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Contact</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Enter name" />
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Enter phone number" />
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="submit">Save</Button>
                    <Button variant="outline">Cancel</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <UploadCloud className="w-4 h-4 mr-1" /> Import from CSV
                  </Button>
                </DialogTrigger>
                <DialogContent className="!max-w-[60vw] w-[60vw] h-[50vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Import Contacts from CSV</DialogTitle>
                  </DialogHeader>
                  <div className="border-2 border-dashed rounded-md p-6 text-center text-muted-foreground">
                    Drag and drop your CSV file here or
                    <Input type="file" accept=".csv" className="mt-4" />
                  </div>
                  <DialogFooter className="pt-4">
                    <Button type="submit">Save</Button>
                    <Button variant="outline">Cancel</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          {/* Contact Search Bar */}
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-500" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          {(contactError || groupError) && (
            <p className="text-muted-foreground mt-6">No contacts found.</p>
          )}

          {selectedContacts.length > 0 && (
            <div className="flex gap-2 mb-2">
              <Dialog
                open={confirmBulkDelete}
                onOpenChange={setConfirmBulkDelete}
              >
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    Delete Selected
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Bulk Deletion</DialogTitle>
                  </DialogHeader>
                  <p>
                    Are you sure you want to delete these contacts? This action
                    cannot be undone.
                  </p>
                  <DialogFooter className="pt-4">
                    <Button onClick={confirmDeleteSelected}>Yes, Delete</Button>
                    <Button
                      variant="outline"
                      onClick={() => setConfirmBulkDelete(false)}
                    >
                      Cancel
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {contacts.length === 0 ? (
            <p className="text-muted-foreground"></p>
          ) : filteredContacts.length === 0 ? (
            <p className="text-muted-foreground mt-6">
              No contacts match your search.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <input
                      type="checkbox"
                      onChange={e => toggleSelectAll(e.target.checked)}
                      checked={selectedContacts.length === contacts.length}
                    />
                  </TableHead>
                  <TableHead className="text-left">Name</TableHead>
                  <TableHead className="text-left">Phone Number</TableHead>
                  <TableHead className="text-right">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact: Contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="w-10">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => toggleSelect(contact.id)}
                      />
                    </TableCell>
                    <TableCell className="text-left">{contact.name}</TableCell>
                    <TableCell className="text-left">{contact.phone}</TableCell>
                    <TableCell className="text-right">
                      <Dialog
                        open={confirmDeleteId === contact.id}
                        onOpenChange={open => !open && setConfirmDeleteId(null)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => setConfirmDeleteId(contact.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                          </DialogHeader>
                          <p>
                            Are you sure you want to delete{' '}
                            <strong>{contact.name}</strong>? This action is
                            irreversible.
                          </p>
                          <DialogFooter className="pt-4">
                            <Button onClick={confirmDelete}>Yes, Delete</Button>
                            <Button
                              variant="outline"
                              onClick={() => setConfirmDeleteId(null)}
                            >
                              Cancel
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </section>
      </div>
    </div>
  );
}
