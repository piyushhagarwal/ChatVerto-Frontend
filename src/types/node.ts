import TriggerNode from '@/features/automations/components/nodes/triggerNode';
import TextMessageNode from '@/features/automations/components/nodes/textMessageNode';
import TextMessageWithButton from '@/features/automations/components/nodes/textMessageWithButton';
import TextMessageWithList from '@/features/automations/components/nodes/textMessageWithList';
import ContactCard from '@/features/automations/components/nodes/contactMessage';
import ShareLocation from '@/features/automations/components/nodes/shareLocation';

export const nodeTypes = {
  trigger: TriggerNode,
  textMessage: TextMessageNode,
  textMessageWithButton: TextMessageWithButton,
  textMessageWithList: TextMessageWithList,
  contactCard: ContactCard,
  shareLocation: ShareLocation,
};
