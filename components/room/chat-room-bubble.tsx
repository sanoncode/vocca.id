import { ChatBubbleProps } from "@/constants/types/props";
import Image from "next/image";

const ChatRoomBubble = ({
  messageId,
  messageAvatarUrl,
  messageSenderName,
  messageText,
  messageDisplayText,
  messageCreatedAt,
  isMe,
}: ChatBubbleProps) => {
  return (
    <>
      <div
        key={messageId}
        className={`flex items-start gap-3 ${
          isMe ? "justify-end" : "justify-start"
        }`}
      >
        {/* Avatar - hanya tampil untuk pesan orang lain */}
        {!isMe && (
          <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-semibold text-white shrink-0 relative overflow-hidden">
            <Image
              src={messageAvatarUrl}
              fill
              sizes="40px"
              className="object-cover"
              alt="avtr-url"
            />
          </div>
        )}

        {/* Message Content */}
        <div
          className={`max-w-[70%] ${isMe ? "items-end" : "items-start"} flex flex-col`}
        >
          {/* Nama user (opsional, cocok untuk group chat) */}
          {!isMe && (
            <span className="text-xs font-medium text-zinc-400 mb-1">
              {messageSenderName}
            </span>
          )}

          {/* Bubble */}
          <div
            className={`px-4 py-3 rounded-2xl border text-sm leading-relaxed ${
              isMe
                ? " border-green-600 rounded-br-sm"
                : " border-zinc-800 rounded-bl-sm"
            }`}
          >
            {isMe ? messageText : messageDisplayText}
          </div>

          {/* Timestamp + Status */}
          <div
            className={`flex items-center gap-1 mt-1 text-[10px] text-zinc-500 ${
              isMe ? "justify-end" : "justify-start"
            }`}
          >
            <span>
              {new Date(messageCreatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>

            {isMe && <span className="text-green-500 text-[10px]">✓✓</span>}
          </div>
        </div>

        {/* Avatar user sendiri */}
        {isMe && (
          <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-semibold text-white shrink-0 relative overflow-hidden">
            <Image
              src={messageAvatarUrl}
              fill
              sizes="40px"
              className="object-cover"
              alt="avtr-url"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ChatRoomBubble;
