import Image from "next/image";
import React, { useEffect, useRef } from "react";

type sender = {
  avatar_url: string;
  id: string;
  name: string;
};

type message = {
  id: string;
  sender_id: string;
  sender: sender;
  text: string;
  created_at: string;
};

type props = {
  userId: string | null;
  messages: message[];
};

const ChatRoomContent = ({ messages, userId }: props) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
    >
      {messages.map((msg) => {
        const isMe = msg.sender_id === userId;

        return (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              isMe ? "justify-end" : "justify-start"
            }`}
          >
            {/* Avatar - hanya tampil untuk pesan orang lain */}
            {!isMe && (
              <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-sm font-semibold text-white shrink-0 relative overflow-hidden">
                <Image
                  src={msg.sender.avatar_url}
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
                  {msg.sender.name}
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
                {msg.text}
              </div>

              {/* Timestamp + Status */}
              <div
                className={`flex items-center gap-1 mt-1 text-[10px] text-zinc-500 ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                <span>
                  {new Date(msg.created_at).toLocaleTimeString([], {
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
                  src={msg.sender.avatar_url}
                  fill
                  sizes="40px"
                  className="object-cover"
                  alt="avtr-url"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatRoomContent;
