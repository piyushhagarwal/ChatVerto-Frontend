import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

import TriggerNode from '../nodes/triggerNode';

type TextUpdaterData = {
  value: string | number;
};

function TextUpdaterNode({ data, isConnectable }: NodeProps<TextUpdaterData>) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  return (
    <div className="relative">
      {' '}
      {/* Important for Handle positioning */}
      {/* <Handle
        type="source"
        position={Position.Top}
        id="c"
        isConnectable={isConnectable}
      /> */}
      <TriggerNode />
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        // style={{ left: 10 }}
        isConnectable={isConnectable}
      />
      {/* <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={{ left: 'auto', right: 10 }}
        isConnectable={isConnectable}
      /> */}
    </div>
  );
}

export default memo(TextUpdaterNode);
