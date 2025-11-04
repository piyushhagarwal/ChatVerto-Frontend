import { useState } from 'react';

function ToggleButton() {
  const [enabled, setEnabled] = useState(false);
  return (
    <div
      onClick={e => {
        e.stopPropagation();
        setEnabled(!enabled);
      }}
      className={`
        relative inline-flex h-5 w-10 cursor-pointer rounded-full transition-colors duration-200
        ${enabled ? 'bg-accent' : 'bg-gray-100'}
      `}
    >
      <span
        className={`
          inline-block h-5 w-5 transform rounded-full bg-[#FAFFF4] shadow-[0_0_10px_rgba(0,0,0,0.2)] transition-transform duration-200
          ${enabled ? 'translate-x-7' : '-translate-x-1'}
        `}
      />
      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium pb-1 text-primary">
        {enabled ? 'On' : 'Off'}
      </span>
    </div>
  );
}

export default ToggleButton;
