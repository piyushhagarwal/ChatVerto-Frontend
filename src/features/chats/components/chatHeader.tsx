export function ChatHeader({
  contactName,
  isBot,
}: {
  contactName: string;
  isBot?: boolean;
}) {
  return (
    <div className="border-b px-4 py-3 bg-muted font-semibold text-sm flex items-center gap-2">
      {contactName}
      {isBot && (
        <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full text-gray-600">
          Bot
        </span>
      )}
    </div>
  );
}
