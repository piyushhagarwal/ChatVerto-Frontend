import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Pencil, Plus } from 'lucide-react';
import ContactSidebar from '../sidebars/contactMessageSidebar';

export default function ContactCard() {
  const [contact, setContact] = useState<{
    name: string;
    numbers: string[];
  } | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSubmit = (data: { name: string; numbers: string[] }) => {
    setContact(data);
    setShowSidebar(false);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Contact</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        {contact ? (
          <>
            <p>
              <strong>Name:</strong> {contact.name}
            </p>
            <p>
              <strong>Phone Number(s):</strong>
            </p>
            <ul className="list-disc pl-5">
              {contact.numbers.map((num, i) => (
                <li key={i}>{num}</li>
              ))}
            </ul>
          </>
        ) : (
          <p>No contact information set.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => setShowSidebar(true)}
        >
          {contact ? (
            <>
              <Pencil className="w-4 h-4" />
              Edit Contact
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Contact
            </>
          )}
        </Button>
      </CardFooter>

      {showSidebar && (
        <ContactSidebar
          open={showSidebar}
          onClose={() => setShowSidebar(false)}
          onSubmit={handleSubmit}
          initialData={contact ?? undefined}
        />
      )}
    </Card>
  );
}
