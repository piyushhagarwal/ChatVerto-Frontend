import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function ProfilePanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="w-[300px]  h-full flex flex-col">
      <div className="flex items-center justify-between border-b border-t px-4 py-2">
        <div className="font-medium text-sm ">Profile Details</div>
        <Button size="sm" variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
      <ScrollArea className="p-4 space-y-4">
        <div>
          <h4 className="text-sm font-semibold">Name</h4>
          <p className="text-sm text-muted-foreground">Amit Verma</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Phone</h4>
          <p className="text-sm text-muted-foreground">+91 9876543210</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Recent Media</h4>
          <div className="flex gap-2 mt-2">
            <img src="/demo1.jpg" className="w-10 h-10 rounded" />
            <img src="/demo2.jpg" className="w-10 h-10 rounded" />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Documents</h4>
          <ul className="text-sm text-muted-foreground list-disc ml-5 mt-1">
            <li>Invoice.pdf</li>
            <li>OrderDetails.docx</li>
          </ul>
        </div>
      </ScrollArea>
    </div>
  );
}
