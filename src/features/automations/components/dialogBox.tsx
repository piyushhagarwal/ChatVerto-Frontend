'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function DialogBox() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Add your validation or saving logic here

    // Redirect to "/flow" page
    window.location.href = 'http://localhost:5173/flow';
  };

  return (
    <Dialog>
      <form onSubmit={handleSubmit}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="rounded-full bg-primary text-white px-6 py-3 text-lg mt-6 hover:bg-primary/90"
          >
            Create Flows <span className="ml-2 text-xl font-bold">+</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Flow Name</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Input id="name-1" name="name" placeholder="Enter Flow Name" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="flow-id">Flow ID</Label>
              <Input id="flow-id" name="flowId" placeholder="Enter Flow ID" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
