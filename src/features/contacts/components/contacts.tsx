import { useState, useEffect } from 'react';
import { Trash2, Plus, UploadCloud, Search } from 'lucide-react';

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
  createContactThunk,
  deleteContactThunk,
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
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const { contacts, error: contactError } = useAppSelector(
    state => state.contact
  );
  const { selectedGroup } = useAppSelector(state => state.group);

  // Filter contacts based on selected group
  const getFilteredContactsByGroup = () => {
    return contacts;
  };

  const groupFilteredContacts = getFilteredContactsByGroup();

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
      setSelectedContacts(groupFilteredContacts.map(c => c.id));
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

  const handleCreateContact = () => {
    if (contactName.trim() && contactPhone.trim()) {
      dispatch(
        createContactThunk({
          name: contactName.trim(),
          phone: contactPhone.trim(),
          groupsArray: selectedGroupId ? [selectedGroupId] : [],
        })
      );
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

  const handleImportCSV = () => {
    // TODO: Implement CSV import logic
    setIsImportDialogOpen(false);
  };

  const trimmedSearch = searchTerm.trim().toLowerCase();
  const filteredContacts: Contact[] = groupFilteredContacts
    .map(contact => ({
      ...contact,
      groups: (contact as Contact).groups ?? [],
    }))
    .filter(
      contact =>
        contact.name.toLowerCase().includes(trimmedSearch) ||
        contact.phone.includes(trimmedSearch)
    );

  return (
    <section className="space-y-2">
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
                <Button type="submit" onClick={handleImportCSV}>
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

      {contactError && (
        <p className="text-muted-foreground mt-6 text-center">
          No contacts found.
        </p>
      )}

      {selectedContacts.length > 0 && (
        <div className="flex gap-2 mb-2">
          <Dialog open={confirmBulkDelete} onOpenChange={setConfirmBulkDelete}>
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
        <></>
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
                  checked={
                    selectedContacts.length === groupFilteredContacts.length &&
                    groupFilteredContacts.length > 0
                  }
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
  );
}
