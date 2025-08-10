export function ChatMessageBubble({
  message,
  incoming = false,
}: {
  message: string;
  incoming?: boolean;
}) {
  return (
    <div className={`flex ${incoming ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`px-4 py-2 rounded-lg max-w-xs ${
          incoming ? 'bg-gray-100 text-black' : 'bg-primary text-white'
        }`}
      >
        {message}
      </div>
    </div>
  );
}
