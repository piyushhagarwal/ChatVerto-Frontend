import TriggerNode from '@/features/automations/components/nodes/trigger';
import TextMessageNode from '@/features/automations/components/nodes/textMessage';
import TextMessageWithButton from '@/features/automations/components/nodes/textMessageWithButton';
import TextMessageWithList from '@/features/automations/components/nodes/textMessageWithList';
import MediaMessageNode from '@/features/automations/components/nodes/mediaMessage';
import DelayNode from '@/features/automations/components/nodes/delay';

export const nodeTypes = {
  trigger: TriggerNode,
  textMessage: TextMessageNode,
  textMessageWithButton: TextMessageWithButton,
  textMessageWithList: TextMessageWithList,
  mediaMessage: MediaMessageNode,
  delay: DelayNode,
};
