import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

export function BroadcastDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const [form, setForm] = useState({ name: '', group: '', template: '' });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    console.log('Campaign Created:', form);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="pb-2">Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} />
          </div>
          <div>
            <Label className="pb-2">Group</Label>
            <Input name="group" value={form.group} onChange={handleChange} />
          </div>
          <div>
            <Label className="pb-2">Template</Label>
            <Input
              name="template"
              value={form.template}
              onChange={handleChange}
            />
          </div>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
