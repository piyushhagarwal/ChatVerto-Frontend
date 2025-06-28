'use client';

import { useEffect, useState } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
} from '@/components/ui/sidebar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';

interface ContactSidebarProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; numbers: string[] }) => void;
  initialData?: { name: string; numbers: string[] };
}

export default function ContactSidebar({
  open,
  onClose,
  onSubmit,
  initialData,
}: ContactSidebarProps) {
  const [name, setName] = useState('');
  const [numbers, setNumbers] = useState<string[]>(['']);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setNumbers(initialData.numbers);
    }
  }, [initialData]);

  const handleNumberChange = (index: number, value: string) => {
    const updated = [...numbers];
    updated[index] = value;
    setNumbers(updated);
  };

  const addNumberField = () => {
    setNumbers([...numbers, '']);
  };

  const removeNumberField = (index: number) => {
    const updated = [...numbers];
    updated.splice(index, 1);
    setNumbers(updated.length === 0 ? [''] : updated);
  };

  const handleSubmit = () => {
    const validNumbers = numbers.filter(num => num.trim() !== '');

    if (!name.trim() || validNumbers.length === 0) {
      setError('Name and at least one phone number are required.');
      return;
    }

    setError('');
    onSubmit({ name, numbers: validNumbers });
    setName('');
    setNumbers(['']);
    onClose();
  };

  return (
    <SidebarProvider>
      <Sidebar
        open={open}
        onClose={onClose}
        collapsible="offcanvas"
        className="w-[400px] border-l bg-white shadow-xl transition-all duration-500 ease-in-out"
      >
        <SidebarContent className="p-4 flex flex-col h-full gap-4">
          <h2 className="text-xl font-semibold">Add Contact</h2>

          <div className="grid gap-2">
            <Label>Name</Label>
            <Input
              placeholder="e.g. John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Contact Numbers</Label>
            {numbers.map((num, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={num}
                  onChange={e => handleNumberChange(index, e.target.value)}
                />
                {numbers.length > 1 && (
                  <Trash2
                    className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={() => removeNumberField(index)}
                  />
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="w-fit flex items-center gap-1"
              onClick={addNumberField}
            >
              <Plus className="w-3 h-3" />
              Add More
            </Button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <Button className="w-full mt-auto" onClick={handleSubmit}>
            Submit
          </Button>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
