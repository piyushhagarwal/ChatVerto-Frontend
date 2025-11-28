import { useState, useEffect } from 'react';
import {
  Trash2,
  Plus,
  UploadCloud,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from 'lucide-react';
import { Info } from 'lucide-react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchAllContactsThunk,
  fetchContactsByGroupIdThunk,
  createContactThunk,
  removeContactFromGroupThunk,
  deleteContactThunk,
  importContactsThunk,
} from '@/store/slices/contactSlice';

import type { Contact, ContactQueryParams } from '@/types/contact';

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

  // Pagination, Search, and Sort State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<string>('lastVisit-desc');

  const { contacts, pagination, loading, error } = useAppSelector(
    state => state.contact
  );
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

  // Fetch contacts with current filters
  useEffect(() => {
    fetchContacts();
  }, [currentPage, pageSize, searchQuery, sortOption, selectedGroupId]);

  const fetchContacts = () => {
    // Parse sort option (format: "field-order")
    const [sortBy, sortOrder] = sortOption.split('-') as [
      ContactQueryParams['sortBy'],
      'asc' | 'desc',
    ];

    const params: ContactQueryParams = {
      page: currentPage,
      limit: pageSize,
      sortBy,
      sortOrder,
      search: searchQuery || undefined,
    };

    if (selectedGroupId) {
      dispatch(
        fetchContactsByGroupIdThunk({ groupId: selectedGroupId, params })
      );
    } else {
      dispatch(fetchAllContactsThunk(params));
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortOption(value);
    setCurrentPage(1);
  };

  const formatLastVisit = (lastVisit?: Date | string) => {
    if (!lastVisit) return 'Never';

    // Remove 'Z' if present since dates are already in IST
    const dateString =
      typeof lastVisit === 'string' ? lastVisit.replace('Z', '') : lastVisit;

    const date = new Date(dateString);
    const now = new Date();

    // Get dates normalized to midnight
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffTime = nowOnly.getTime() - dateOnly.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  };

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
      ).then(() => fetchContacts());
    } else {
      dispatch(deleteContactThunk(confirmDeleteId)).then(() => fetchContacts());
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
    } else {
      selectedContacts.forEach(id => {
        dispatch(deleteContactThunk(id));
      });
    }

    setTimeout(() => fetchContacts(), 500);
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
      ).then(() => fetchContacts());
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
      setCsvFile(null);
      fetchContacts();
    } catch (err) {
      console.error('Import failed:', err);
    }
  };

  const isOptInGroup =
    selectedGroupId && selectedGroup?.name === 'Opt-in Contacts';

  return (
    <section className="space-y-3">
      {/* --------------------------- CONSTANT HEADER --------------------------- */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {selectedGroupId === null ? 'All Contacts' : selectedGroup?.name}
        </h2>

        {isOptInGroup ? (
          <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-md">
            <Info className="w-4 h-4 inline mr-1" />
            You cannot add contacts in the "Opt-in Contacts" group.
          </div>
        ) : (
          <div className="flex gap-2">
            {/* Create Contact */}
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
                  <Button onClick={handleCreateContact}>Save</Button>
                  <Button variant="outline" onClick={handleCancelCreate}>
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Import CSV */}
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
                  <Button disabled={!csvFile} onClick={handleImportCSV}>
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
        )}
      </div>

      {/* ------------------------- CONSTANT SEARCH & FILTER ------------------------- */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1 max-w-md flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search by name or phone..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="pr-10"
            />
            {searchInput && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          <Button
            size="sm"
            onClick={handleSearch}
            disabled={!searchInput.trim()}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <div className="ml-auto flex gap-3">
          {/* Sort */}
          <Select value={sortOption} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lastVisit-desc">
                Last Visit (Newest)
              </SelectItem>
              <SelectItem value="lastVisit-asc">Last Visit (Oldest)</SelectItem>
              <SelectItem value="visitCount-desc">Most Visits</SelectItem>
              <SelectItem value="visitCount-asc">Least Visits</SelectItem>
            </SelectContent>
          </Select>

          {/* Page Size */}
          <Select
            value={pageSize.toString()}
            onValueChange={value => {
              setPageSize(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10 per page</SelectItem>
              <SelectItem value="25">25 per page</SelectItem>
              <SelectItem value="50">50 per page</SelectItem>
              <SelectItem value="100">100 per page</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ----------------------- CONDITIONAL RENDERING SECTION ---------------------- */}
      {error ? (
        <div className="h-30 w-full p-3 my-2 mb-4">
          <Alert
            variant="destructive"
            className="justify-items-start border-destructive"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      ) : loading ? (
        <div className="text-center py-2 flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-lg  text-primary font-medium">
            Please wait...
          </span>
        </div>
      ) : contacts.length === 0 ? (
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
                    Click To Delete Selected ({selectedContacts.length})
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
                  <th className="px-4 py-2 text-center">Number of Visits</th>
                  <th className="px-4 py-2 text-center">Last Visit</th>
                  <th className="px-4 py-2 text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact: Contact) => (
                  <tr
                    key={contact.id}
                    className="border-t text-primary text-center align-middle hover:bg-gray-50"
                  >
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={selectedContacts.includes(contact.id)}
                        onChange={() => toggleSelect(contact.id)}
                      />
                    </td>
                    <td className="px-4 py-2 font-semibold text-gray-700 tracking-wide">
                      {contact.name}
                    </td>
                    <td className="px-4 py-2 font-semibold text-gray-700 tracking-wide">
                      {contact.phone}
                    </td>
                    <td className="px-4 py-2 font-semibold text-gray-700 tracking-wide">
                      {contact.visitCount}
                    </td>
                    <td className="px-4 py-2 font-semibold text-gray-600 tracking-wide">
                      {formatLastVisit(contact.lastVisit)}
                    </td>
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

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {contacts.length} of {pagination.totalContacts} contacts
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={!pagination.hasPrevPage || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="text-sm">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={!pagination.hasNextPage || loading}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
