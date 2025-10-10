'use client';
import type { ChartDataPoint } from '@/types/analytics';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface StatCardProps {
  title: string;
  value: ChartDataPoint[];
}

export function BarChartCard({ title, value }: StatCardProps) {
  return (
    <BarChart width={800} height={250} data={value}>
      <CartesianGrid vertical={false} />
      <XAxis interval={0} dataKey="label" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" fill="var(--primary)" />
    </BarChart>
  );
}
