import { useState, useEffect } from 'react';
import { Trash2, Plus, UploadCloud } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
  fetchContactsByGroupIdThunk,
  createContactThunk,
  removeContactFromGroupThunk,
  deleteContactThunk,
  importContactsThunk,
} from '@/store/slices/contactSlice';

import type { Contact } from '@/types/contact';

interface ContactsProps {
  selectedGroupId: string | null;
}

export default function Contacts({ selectedGroupId }: ContactsProps) {
  const dispatch = useAppDispatch();

  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const { contacts } = useAppSelector(state => state.contact);
  const { selectedGroup } = useAppSelector(state => state.group);

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
    if (!confirmDeleteId) return;

    if (selectedGroupId) {
      dispatch(
        removeContactFromGroupThunk({
          contactId: confirmDeleteId,
          groupId: selectedGroupId,
        })
      ).then(() => {
        dispatch(fetchContactsByGroupIdThunk(selectedGroupId));
      });
    } else {
      dispatch(deleteContactThunk(confirmDeleteId)).then(() => {
        dispatch(fetchAllContactsThunk());
      });
    }

    setConfirmDeleteId(null);
  };

  const confirmDeleteSelected = () => {
    if (selectedGroupId) {
      selectedContacts.forEach(id => {
        dispatch(
          removeContactFromGroupThunk({
            contactId: id,
            groupId: selectedGroupId,
          })
        );
      });
      dispatch(fetchContactsByGroupIdThunk(selectedGroupId));
    } else {
      selectedContacts.forEach(id => {
        dispatch(deleteContactThunk(id));
      });
      dispatch(fetchAllContactsThunk());
    }

    setSelectedContacts([]);
    setConfirmBulkDelete(false);
  };

  const handleCreateContact = () => {
    if (contactName.trim() && contactPhone.trim()) {
      dispatch(
        createContactThunk({
          name: contactName.trim(),
          phone: contactPhone.trim(),
          groupsArray: selectedGroupId ? [selectedGroupId] : [],
        })
      ).then(() => {
        if (selectedGroupId) {
          dispatch(fetchContactsByGroupIdThunk(selectedGroupId));
        } else {
          dispatch(fetchAllContactsThunk());
        }
      });
      setContactName('');
      setContactPhone('');
      setIsCreateDialogOpen(false);
    }
  };

  const handleCancelCreate = () => {
    setContactName('');
    setContactPhone('');
    setIsCreateDialogOpen(false);
  };

  const handleImportCSV = async () => {
    if (!csvFile) return;

    const formData = new FormData();
    formData.append('file', csvFile);
    formData.append(
      'groupsArray',
      JSON.stringify(selectedGroupId ? [selectedGroupId] : [])
    );

    try {
      await dispatch(importContactsThunk(formData)).unwrap();
      setIsImportDialogOpen(false);
      setCsvFile(null); // reset after import

      if (selectedGroupId) {
        dispatch(fetchContactsByGroupIdThunk(selectedGroupId));
      } else {
        dispatch(fetchAllContactsThunk());
      }
    } catch (err) {
      console.error('Import failed:', err);
    }
  };

  return (
    <section className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {selectedGroupId === null ? 'All Contacts' : selectedGroup?.name}
        </h2>
        <div className="flex gap-2">
          <Dialog
            open={isCreateDialogOpen}
            onOpenChange={setIsCreateDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary">
                <Plus className="w-4 h-4 mr-1" /> Create Contact
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
              </DialogHeader>
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter name"
                  value={contactName}
                  onChange={e => setContactName(e.target.value)}
                />
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreateContact()}
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" onClick={handleCreateContact}>
                  Save
                </Button>
                <Button variant="outline" onClick={handleCancelCreate}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog
            open={isImportDialogOpen}
            onOpenChange={setIsImportDialogOpen}
          >
            <DialogTrigger asChild>
              <Button size="sm" className="bg-primary">
                <UploadCloud className="w-4 h-4 mr-1" /> Import from CSV
              </Button>
            </DialogTrigger>
            <DialogContent className="!max-w-[60vw] w-[60vw] h-[50vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Import Contacts from CSV</DialogTitle>
              </DialogHeader>
              <div className="border-2 border-dashed rounded-md p-6 text-center text-muted-foreground">
                Drag and drop your CSV file here or
                <Input
                  type="file"
                  accept=".csv"
                  className="mt-4"
                  onChange={e => setCsvFile(e.target.files?.[0] || null)}
                />
              </div>
              <DialogFooter className="pt-4">
                <Button
                  type="submit"
                  onClick={handleImportCSV}
                  disabled={!csvFile}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsImportDialogOpen(false)}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {contacts.length === 0 ? (
        <p className="text-muted-foreground mt-6">No contacts available.</p>
      ) : (
        <>
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

                  {selectedGroupId ? (
                    <p>
                      Are you sure you want to remove{' '}
                      <strong>{selectedContacts.length}</strong> contact(s) from
                      the group <strong>{selectedGroup?.name}</strong>? They
                      will still remain in your contact list.
                    </p>
                  ) : (
                    <p>
                      Are you sure you want to permanently delete{' '}
                      <strong>{selectedContacts.length}</strong> contact(s)?
                      This action cannot be undone.
                    </p>
                  )}

                  <DialogFooter className="pt-4">
                    <Button
                      variant="destructive"
                      onClick={confirmDeleteSelected}
                    >
                      Delete
                    </Button>
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

          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-primary text-accent">
                <tr>
                  <th className="px-4 py-2 text-center w-10">
                    <input
                      type="checkbox"
                      onChange={e => toggleSelectAll(e.target.checked)}
                      checked={
                        selectedContacts.length === contacts.length &&
                        contacts.length > 0
                      }
                    />
                  </th>
                  <th className="px-4 py-2 text-center">Name</th>
                  <th className="px-4 py-2 text-center">Phone Number</th>
                  <th className="px-4 py-2 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact: Contact) => (
                  <tr
                    key={contact.id}
                    className="border-t  text-primary text-center align-middle"
                  >
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => toggleSelect(contact.id)}
                      />
                    </td>
                    <td className="px-4 py-2 font-medium">{contact.name}</td>
                    <td className="px-4 py-2">{contact.phone}</td>
                    <td className="px-4 py-2">
                      <Dialog
                        open={confirmDeleteId === contact.id}
                        onOpenChange={open => !open && setConfirmDeleteId(null)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-red-100 hover:text-red-600"
                            onClick={() => setConfirmDeleteId(contact.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                          </DialogHeader>

                          {selectedGroupId ? (
                            <p>
                              Are you sure you want to remove{' '}
                              <strong>{contact.name}</strong> from the group{' '}
                              <strong>{selectedGroup?.name}</strong>? The
                              contact will still remain in your contact list.
                            </p>
                          ) : (
                            <p>
                              Are you sure you want to permanently delete{' '}
                              <strong>{contact.name}</strong>? This action
                              cannot be undone.
                            </p>
                          )}

                          <DialogFooter className="pt-4">
                            <Button
                              variant="destructive"
                              onClick={confirmDelete}
                            >
                              Delete
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setConfirmDeleteId(null)}
                            >
                              Cancel
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
