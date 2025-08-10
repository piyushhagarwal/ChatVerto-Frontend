import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function BroadcastCard({
  name,
  group,
  template,
}: {
  name: string;
  group: string;
  template: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        <p>
          <strong>Group:</strong> {group}
        </p>
        <p>
          <strong>Template:</strong> {template}
        </p>
      </CardContent>
    </Card>
  );
}
