'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Pencil, Trash2, Plus } from 'lucide-react';
import TextMessageWithListSidebar from '../sidebars/textMessageWithListSidebar';

export default function TextMessageWithList() {
  const [items, setItems] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleSubmit = (data: { message: string; listItems: string[] }) => {
    setMessage(data.message);
    setItems(data.listItems);
    setShowSidebar(false);
    setEditingIndex(null);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Text Message with List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
        {items.length > 0 ? (
          <ul className="list-disc pl-5 text-sm">
            {items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">
            No list items added yet.
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button
          className="w-full"
          variant="outline"
          onClick={() => setShowSidebar(true)}
        >
          {items.length > 0 || message ? (
            <span className="flex items-center gap-1">
              <Pencil className="w-4 h-4" /> Edit
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Plus className="w-4 h-4" /> Add
            </span>
          )}
        </Button>
      </CardFooter>

      {showSidebar && (
        <TextMessageWithListSidebar
          open={showSidebar}
          onClose={() => setShowSidebar(false)}
          onSubmit={handleSubmit}
          initialData={{ message, listItems: items }}
        />
      )}
    </Card>
  );
}
