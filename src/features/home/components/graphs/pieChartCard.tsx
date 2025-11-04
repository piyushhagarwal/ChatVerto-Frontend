import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const pieData = [
  { name: 'New', value: 120 },
  { name: 'Returning', value: 80 },
];
const pieColors = ['var(--primary)', 'var(--secondary)'];

export function PieChartCard() {
  return (
    <PieChart width={300} height={250}>
      <Pie
        data={pieData}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        label
      >
        {pieData.map((_, index) => (
          <Cell
            key={`cell-${index}`}
            fill={pieColors[index % pieColors.length]}
          />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}
