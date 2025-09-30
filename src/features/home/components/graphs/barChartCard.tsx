'use client';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const barData = [
  { visits: '1', count: 50 },
  { visits: '2-3', count: 30 },
  { visits: '4+', count: 20 },
];

export function BarChartCard() {
  return (
    <BarChart width={400} height={250} data={barData}>
      <CartesianGrid vertical={false} />
      <XAxis dataKey="visits" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" fill="var(--primary)" />
    </BarChart>
  );
}
