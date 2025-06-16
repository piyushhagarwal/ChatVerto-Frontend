import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { DialogBox } from '../components/dialogBox';

export default function AutomationPage() {
  return (
    <div className="w-full h-full">
      <SiteHeader title="Automations" />
      <div className="w-full flex justify-end px-4">
        <DialogBox />
      </div>
    </div>
  );
}
