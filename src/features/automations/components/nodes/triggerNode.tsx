// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Button } from '@/components/ui/button';

// export default function TriggerNode() {
//   return (
//     <Card className="w-full max-w-sm">
//       <CardHeader>
//         <CardTitle>Trigger</CardTitle>
//         <CardDescription>
//           Please enter the keywords for your Trigger
//         </CardDescription>
//         {/* <CardAction>
//             <Button variant="link">Sign Up</Button>
//           </CardAction> */}
//       </CardHeader>
//       <CardContent>
//         <form>
//           <div className="flex flex-col gap-6">
//             <div className="grid gap-2">
//               <Label htmlFor="email" className="mb-2">
//                 Keywords
//               </Label>
//               <Input
//                 id="email"
//                 type="email"
//                 placeholder="eg: Hey, Hello, Hi"
//                 required
//               />
//             </div>
//             {/* <div className="grid gap-2">
//                 <div className="flex items-center">
//                   <Label htmlFor="password">Password</Label>
//                   <a
//                     href="#"
//                     className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
//                   >
//                     Forgot your password?
//                   </a>
//                 </div>
//                 <Input id="password" type="password" required />
//               </div> */}
//           </div>
//         </form>
//       </CardContent>
//       <CardFooter className="flex-col gap-2">
//         <Button type="submit" className="w-full">
//           Add Trigger
//         </Button>
//         {/* <Button variant="outline" className="w-full">
//             Login with Google
//           </Button> */}
//       </CardFooter>
//     </Card>
//   );
// }

import { useState } from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import TriggerSidebar from '../sidebars/triggerSidebar'; // Adjust the path if needed

export default function TriggerNode() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Trigger</CardTitle>
          <CardDescription>
            Please enter the keywords for your Trigger
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="mb-2">
                  Keywords
                </Label>
                <div className="px-3 py-2 border border-input rounded-md text-sm text-muted-foreground bg-muted">
                  eg: Hey, Hello, Hi
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="button"
            className="w-full"
            onClick={() => setIsSidebarOpen(true)}
          >
            Add Trigger
          </Button>
        </CardFooter>
      </Card>

      {isSidebarOpen && (
        <TriggerSidebar onClose={() => setIsSidebarOpen(false)} />
      )}
    </>
  );
}
