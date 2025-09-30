import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MediaMessageSidebar from '../sidebars/mediaMessageSidebar';
import { Handle, Position } from '@xyflow/react';
import { Image, Video, FileText } from 'lucide-react';

interface MediaMessageProps {
  id: string;
  data: {
    mediaType?: 'image' | 'video' | 'document';
    mediaId?: string;
    caption?: string;
    fileName?: string;
  };
}

export default function MediaMessageNode({ id, data }: MediaMessageProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const getMediaIcon = () => {
    switch (data.mediaType) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'document':
        return <FileText className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getMediaTypeColor = () => {
    switch (data.mediaType) {
      case 'image':
        return 'bg-green-100 text-green-800';
      case 'video':
        return 'bg-blue-100 text-blue-800';
      case 'document':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const hasMediaContent = data.mediaType && data.mediaId;

  return (
    <div>
      <Handle
        type="target"
        position={Position.Left}
        id="mediaMessageTarget"
        style={{
          width: 10,
          height: 10,
          background: '#2563eb',
          borderRadius: '50%',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="mediaMessageSource"
        style={{
          width: 10,
          height: 10,
          background: '#2563eb',
          borderRadius: '50%',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            Media Message
            {data.mediaType && (
              <Badge className={`text-xs ${getMediaTypeColor()}`}>
                <span className="flex items-center gap-1">
                  {getMediaIcon()}
                  {data.mediaType}
                </span>
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative max-h-[80px] overflow-hidden text-sm text-muted-foreground group">
            {hasMediaContent ? (
              <div className="space-y-2">
                {data.fileName && (
                  <p className="font-medium text-foreground truncate">
                    {data.fileName}
                  </p>
                )}
                {data.caption && (
                  <p className="line-clamp-3 group-hover:overflow-auto group-hover:max-h-[200px] transition-all">
                    {data.caption}
                  </p>
                )}
                {!data.caption && !data.fileName && (
                  <p className="text-muted-foreground">
                    {data.mediaType} uploaded
                  </p>
                )}
              </div>
            ) : (
              <p>No media selected yet.</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            className="w-full"
            onClick={() => setIsSidebarOpen(true)}
          >
            {hasMediaContent ? 'Edit Media' : 'Select Media'}
          </Button>
        </CardFooter>
      </Card>
      {isSidebarOpen && (
        <MediaMessageSidebar
          nodeId={id}
          initialData={data}
          onClose={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
