import { useState } from 'react';

interface WebsiteInputListProps {
  websites: string[];
  onChange: (urls: string[]) => void;
}

export default function WebsiteInputList({
  websites,
  onChange,
}: WebsiteInputListProps) {
  const [urls, setUrls] = useState<string[]>(websites);

  const updateUrls = (val: string, index: number) => {
    const newUrls = [...urls];
    newUrls[index] = val;
    setUrls(newUrls);
    onChange(newUrls);
  };

  const addUrl = () => {
    const newUrls = [...urls, ''];
    setUrls(newUrls);
    onChange(newUrls);
  };

  return (
    <div className="flex flex-col gap-2">
      {urls.map((url, i) => (
        <input
          key={i}
          value={url}
          onChange={e => updateUrls(e.target.value, i)}
          placeholder={`Website ${i + 1}`}
          className="border px-2 py-1 rounded"
        />
      ))}
      <button type="button" onClick={addUrl} className="text-blue-500 text-sm">
        + Add Website
      </button>
    </div>
  );
}
