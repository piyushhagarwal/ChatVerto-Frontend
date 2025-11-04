import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from 'recharts';

const heatmapData = [
  {
    hour: '10 AM',
    Mon: 20,
    Tue: 25,
    Wed: 15,
    Thu: 30,
    Fri: 50,
    Sat: 60,
    Sun: 40,
  },
  {
    hour: '11 AM',
    Mon: 30,
    Tue: 35,
    Wed: 20,
    Thu: 40,
    Fri: 60,
    Sat: 70,
    Sun: 50,
  },
  {
    hour: '12 PM',
    Mon: 50,
    Tue: 45,
    Wed: 35,
    Thu: 60,
    Fri: 80,
    Sat: 90,
    Sun: 70,
  },
];

export function HeatmapCard() {
  return (
    <BarChart width={500} height={250} data={heatmapData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="hour" />
      <YAxis />
      <Tooltip />
      {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const).map(day => (
        <Bar key={day} dataKey={day} fill="var(--primary)" stackId="a">
          {heatmapData.map((entry, i) => (
            <Cell key={i} fillOpacity={entry[day] / 100} />
          ))}
        </Bar>
      ))}
    </BarChart>
  );
}
