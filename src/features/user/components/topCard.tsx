// components/profile/TopCard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { type UserProfile } from '@/types/user'; // adjust based on your actual type path

type Props = {
  user: UserProfile;
};

export default function TopCard({ user }: Props) {
  return (
    <Card className="w-full max-w-6xl shadow-sm border-0 bg-white">
      <CardContent className="p-6 space-y-6">
        {/* Row 1 */}
        <div className="grid md:grid-cols-4 gap-4 border-b pb-4 ml-2 mr-2">
          <div className="flex items-center gap-3 border-r pr-4">
            {/* Profile Picture */}
            {user.whatsAppDetails?.profilePictureUrl ? (
              <img
                src={user.whatsAppDetails.profilePictureUrl}
                alt="Profile"
                className="h-15 w-15 rounded-full object-cover border"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                ?
              </div>
            )}
            {/* Name Info */}
            <div>
              <p className="text-muted-foreground text-sm">Display Name</p>
              <p className="font-medium">
                {user.whatsAppDetails?.verifiedName || '-'}
              </p>
            </div>
          </div>

          <div className="border-r pr-4">
            <p className="text-muted-foreground text-sm">Connected Number</p>
            <p className="font-medium">
              {user.whatsAppDetails?.displayPhoneNumber || '-'}
            </p>
          </div>

          <div className="border-r pr-4">
            <p className="text-muted-foreground text-sm">Business Email</p>
            <p className="font-medium">
              {user.whatsAppDetails?.businessEmail || '-'}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground text-sm">Vertical</p>
            <p className="font-medium">
              {user.whatsAppDetails?.vertical?.replace(/_/g, ' ') || '-'}
            </p>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid md:grid-cols-4 gap-4 ml-2 mr-2">
          <div className="border-r pr-4">
            <p className="text-muted-foreground text-sm">About</p>
            <p className="font-medium">{user.whatsAppDetails?.about || '-'}</p>
          </div>

          <div className="border-r pr-4">
            <p className="text-muted-foreground text-sm">Description</p>
            <p className="font-medium">
              {user.whatsAppDetails?.description || '-'}
            </p>
          </div>

          <div className="border-r pr-4">
            <p className="text-muted-foreground text-sm">Address</p>
            <p className="font-medium">
              {user.whatsAppDetails?.address || '-'}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground text-sm">Websites</p>

            {user.whatsAppDetails?.websites?.length ? (
              <div className="space-y-1">
                {user.whatsAppDetails.websites.map((url, index) => (
                  <a
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-blue-600 hover:underline font-medium truncate max-w-full"
                    title={url} // Shows full URL on hover
                  >
                    {url}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No websites added.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
