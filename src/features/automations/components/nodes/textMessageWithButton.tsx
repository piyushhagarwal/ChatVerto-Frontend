// components/TextMessageWithButton.tsx
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
import { Plus, Trash2 } from 'lucide-react';
import TextMessageWithButtonSidebar from '../sidebars/textMessageWithButtonSidebar';

export default function TextMessageWithButton() {
  const [buttons, setButtons] = useState<{ label: string; url: string }[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);

  const addButton = (label: string, url: string) => {
    setButtons([...buttons, { label, url }]);
    setShowSidebar(false);
  };

  const deleteButton = (index: number) => {
    const updated = [...buttons];
    updated.splice(index, 1);
    setButtons(updated);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Text Message Button</CardTitle>
      </CardHeader>
      <CardContent>
        {buttons.length === 0 && (
          <p className="text-muted-foreground">No buttons added yet.</p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {buttons.map((btn, index) => (
          <div key={index} className="w-full">
            <div className="flex items-center justify-between border rounded-md px-4 py-2">
              <span>{btn.label}</span>
              <Trash2
                className="w-4 h-4 text-red-500 hover:text-red-700 cursor-pointer"
                onClick={() => deleteButton(index)}
              />
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          className="w-full flex items-center justify-between"
          onClick={() => setShowSidebar(true)}
        >
          <span>Add Button</span>
          <Plus className="w-4 h-4 text-primary hover:text-primary/80" />
        </Button>
      </CardFooter>

      {showSidebar && (
        <TextMessageWithButtonSidebar
          open={showSidebar}
          onClose={() => setShowSidebar(false)}
          onSubmit={({ buttonText, buttonUrl }) =>
            addButton(buttonText, buttonUrl)
          }
        />
      )}
    </Card>
  );
}
