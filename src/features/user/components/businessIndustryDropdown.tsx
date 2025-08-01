interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function BusinessIndustryDropdown({ value, onChange }: Props) {
  const industries = [
    'Technology',
    'Retail',
    'Healthcare',
    'Education',
    'Finance',
  ];

  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="">Select Industry</option>
      {industries.map(ind => (
        <option key={ind} value={ind}>
          {ind}
        </option>
      ))}
    </select>
  );
}
