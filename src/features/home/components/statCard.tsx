// components/dashboard/StatCard.tsx
import type { ReactNode } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  trendType: 'up' | 'down';
  period: string;
  icon: ReactNode;
}

export function StatCard({
  title,
  value,
  trend,
  trendType,
  period,
  icon,
}: StatCardProps) {
  return (
    <>
      <Card className="rounded-2xl border-0 shadow-[0_0_5px_rgba(0,0,0,0.2)] hover:shadow-md transition-all bg-white/99">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardDescription className=" block text-sm font-semibold text-gray-700 tracking-wide">
              {title}
            </CardDescription>
            <CardTitle className="text-2xl font-semibold">{value}</CardTitle>
          </div>
          <div className="text-muted-foreground">{icon}</div>
        </CardHeader>

        <CardContent>
          <Badge
            variant="outline"
            className={`flex items-center gap-1 px-2 py-0.5 text-sm ${
              trendType === 'up'
                ? 'text-green-600 border-green-300'
                : 'text-red-600 border-red-300'
            }`}
          >
            {trendType === 'up' ? '▲' : '▼'} {trend}
          </Badge>
        </CardContent>

        <CardFooter className="block font-semibold text-sm text-muted-foreground tracking-wide">
          Compared to <b>{period}</b>
        </CardFooter>
      </Card>
    </>
  );
}
