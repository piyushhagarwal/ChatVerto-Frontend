import TriggerNode from '@/features/automations/components/nodes/trigger';
import TextMessageNode from '@/features/automations/components/nodes/textMessage';
import TextMessageWithButton from '@/features/automations/components/nodes/textMessageWithButton';
import TextMessageWithList from '@/features/automations/components/nodes/textMessageWithList';
import ContactCard from '@/features/automations/components/nodes/contactMessage';
import ShareLocation from '@/features/automations/components/nodes/shareLocation';
import MediaMessageNode from '@/features/automations/components/nodes/mediaMessage';
import DelayNode from '@/features/automations/components/nodes/delay';

export const nodeTypes = {
  trigger: TriggerNode,
  textMessage: TextMessageNode,
  textMessageWithButton: TextMessageWithButton,
  textMessageWithList: TextMessageWithList,
  contactCard: ContactCard,
  shareLocation: ShareLocation,
  mediaMessage: MediaMessageNode,
  delay: DelayNode,
};
