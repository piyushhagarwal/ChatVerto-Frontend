'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import TextMessageSidebar from '../sidebars/textMessageSidebar';

export function TextMessageNode() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Text Message</CardTitle>
      </CardHeader>

      <CardContent>
        {message ? (
          <p className="text-sm text-muted-foreground whitespace-pre-line">
            {message}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">No message yet.</p>
        )}
      </CardContent>

      <CardFooter>
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          onClick={() => setShowSidebar(true)}
        >
          {message ? 'Edit Message' : 'Click To Write Message'}
        </Button>
      </CardFooter>

      {showSidebar && (
        <TextMessageSidebar
          onClose={() => setShowSidebar(false)}
          onSubmit={(msg: string) => {
            setMessage(msg);
            setShowSidebar(false);
          }}
          initialMessage={message ?? ''}
        />
      )}
    </Card>
  );
}
