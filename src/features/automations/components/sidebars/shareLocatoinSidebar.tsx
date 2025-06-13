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

interface ShareLocationSidebarProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; address: string; mapUrl: string }) => void;
  initialData?: { name: string; address: string; mapUrl: string };
}

export default function ShareLocationSidebar({
  open,
  onClose,
  onSubmit,
  initialData,
}: ShareLocationSidebarProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [mapUrl, setMapUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setAddress(initialData.address);
      setMapUrl(initialData.mapUrl);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!name.trim() || !address.trim() || !mapUrl.trim()) {
      setError('All fields are required.');
      return;
    }

    setError('');
    onSubmit({ name, address, mapUrl });
    setName('');
    setAddress('');
    setMapUrl('');
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
          <h2 className="text-xl font-semibold">Share Location</h2>

          <div className="grid gap-2">
            <Label>Location Name</Label>
            <Input
              placeholder="e.g. Central Park"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Address</Label>
            <Input
              placeholder="e.g. 5th Ave, New York, NY"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Google Maps URL</Label>
            <Input
              placeholder="https://maps.google.com/..."
              value={mapUrl}
              onChange={e => setMapUrl(e.target.value)}
            />
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
