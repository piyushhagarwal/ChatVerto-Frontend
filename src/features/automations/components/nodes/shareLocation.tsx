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
import { Pencil, Plus } from 'lucide-react';
import ShareLocationSidebar from '../sidebars/shareLocatoinSidebar';

export default function ShareLocation() {
  const [locationData, setLocationData] = useState<{
    name: string;
    address: string;
    mapUrl: string;
  } | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const handleSubmit = (data: {
    name: string;
    address: string;
    mapUrl: string;
  }) => {
    setLocationData(data);
    setShowSidebar(false);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Share Location</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        {locationData ? (
          <>
            <p>
              <strong>Name:</strong> {locationData.name}
            </p>
            <p>
              <strong>Address:</strong> {locationData.address}
            </p>
            <p>
              <strong>Map URL:</strong>{' '}
              <a
                href={locationData.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View on Google Maps
              </a>
            </p>
          </>
        ) : (
          <p>No location set.</p>
        )}
      </CardContent>
      <CardFooter>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => setShowSidebar(true)}
        >
          {locationData ? (
            <>
              <Pencil className="w-4 h-4" />
              Edit Location
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Location
            </>
          )}
        </Button>
      </CardFooter>

      {showSidebar && (
        <ShareLocationSidebar
          open={showSidebar}
          onClose={() => setShowSidebar(false)}
          onSubmit={handleSubmit}
          initialData={locationData ?? undefined}
        />
      )}
    </Card>
  );
}
