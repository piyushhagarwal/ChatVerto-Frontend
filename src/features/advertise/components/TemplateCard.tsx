import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function TemplateCard({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {message}
      </CardContent>
    </Card>
  );
}
