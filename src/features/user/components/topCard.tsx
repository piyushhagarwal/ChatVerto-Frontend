// components/profile/TopCard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { type UserProfile } from '@/types/user'; // adjust based on your actual type path
import { ProfilePhotoUploader } from './profilePhotoUploader';
import { Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type Props = {
  user: UserProfile;
};

export default function TopCard({ user }: Props) {
  return (
    <div className="p-[5px]">
      <div className="w-full shadow-[0_0_10px_rgba(0,0,0,0.2)] bg-card">
        <div className="p-6 space-y-6">
          {/* Row 1 */}
          <div className="grid md:grid-cols-4 gap-4 border-b pb-4 ml-2 mr-2">
            <div className="flex items-center gap-3 border-r pr-4 relative">
              {/* Profile Picture */}
              {user.whatsAppDetails?.profilePictureUrl ? (
                <div className="relative">
                  <img
                    src={user.whatsAppDetails.profilePictureUrl}
                    alt="Profile"
                    className="h-16 w-16 rounded-full object-cover border"
                  />

                  {/* Pencil icon button */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        className="absolute bottom-0 right-0 p-1 bg-white rounded-full shadow 
             transition-all duration-200 
             hover:bg-gray-100 hover:scale-110 hover:shadow-md"
                        title="Edit profile picture"
                      >
                        <Pencil className="h-4 w-4 text-primary" />
                      </button>
                    </DialogTrigger>

                    {/* Dialog Content */}
                    <DialogContent className="sm:max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-center">
                          Edit Profile Picture
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex justify-center">
                        <img
                          src={user.whatsAppDetails.profilePictureUrl}
                          alt="Preview"
                          className="w-40 h-40 rounded-full object-cover border"
                        />
                      </div>
                      <ProfilePhotoUploader />
                    </DialogContent>
                  </Dialog>
                </div>
              ) : (
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
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
              <p className="font-medium">
                {user.whatsAppDetails?.about || '-'}
              </p>
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
                      title={url}
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
        </div>
      </div>
    </div>
  );
}
