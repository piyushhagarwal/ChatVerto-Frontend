'use client';

import { useState, useEffect } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
} from '@/components/ui/sidebar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { message: string; listItems: string[] }) => void;
  initialData?: { message: string; listItems: string[] };
}

export default function TextMessageWithListSidebar({
  open,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const [message, setMessage] = useState('');
  const [listItems, setListItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    if (initialData) {
      setMessage(initialData.message || '');
      setListItems(initialData.listItems || []);
    }
  }, [initialData]);

  const handleAddItem = () => {
    if (newItem.trim() !== '') {
      setListItems(prev => [...prev, newItem.trim()]);
      setNewItem('');
    }
  };

  const handleDeleteItem = (index: number) => {
    const updated = [...listItems];
    updated.splice(index, 1);
    setListItems(updated);
  };

  const handleSubmit = () => {
    if (!message.trim() || listItems.length === 0) return;
    onSubmit({ message, listItems });
  };

  return (
    <SidebarProvider>
      <Sidebar
        collapsible="offcanvas"
        open={open}
        onClose={onClose}
        className="w-[400px] border-l bg-white shadow-xl transition-all duration-500 ease-in-out"
      >
        <SidebarContent className="p-4 flex flex-col h-full gap-4">
          <h2 className="text-xl font-semibold">Edit Text with List</h2>

          <div className="grid gap-2">
            <Label>Message</Label>
            <Textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Enter your message"
              className="resize-none"
            />
          </div>

          <div className="grid gap-2">
            <Label>List Items</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add item"
                value={newItem}
                onChange={e => setNewItem(e.target.value)}
              />
              <Button type="button" onClick={handleAddItem}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <ul className="space-y-1 text-sm">
              {listItems.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between bg-muted px-2 py-1 rounded"
                >
                  <span>{item}</span>
                  <Trash2
                    className="w-4 h-4 text-red-500 cursor-pointer"
                    onClick={() => handleDeleteItem(idx)}
                  />
                </li>
              ))}
            </ul>
          </div>

          <Button className="w-full mt-auto" onClick={handleSubmit}>
            Submit
          </Button>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
