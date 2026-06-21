import { ChatRoomContentProps } from "@/constants/types/props";
import React, { useEffect, useRef } from "react";
import ChatRoomBubble from "./chat-room-bubble";
import ChatStore from "@/store/messageStore";
import UserStore from "@/store/userStore";
import { useShallow } from "zustand/react/shallow";

const ChatRoomContent = () => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const {messages, userTyping} = ChatStore(useShallow((state)=>({
      messages: state.messages,
      userTyping: state.userTyping
  })))
  const currentUser = UserStore((state)=>state.currentUser)

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length, userTyping.length]);

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
    >
      {messages.map((msg) => {
        const isMe = msg.sender_id === currentUser?.id;
        return (
          <ChatRoomBubble
            key={msg.id}
            messageId={msg.id}
            messageAvatarUrl={msg.sender.avatar_url}
            messageSenderName={msg.sender.name}
            messageText={msg.text}
            messageDisplayText={msg.display_text}
            messageCreatedAt={msg.created_at}
            isMe={isMe}
          />
        );
      })}
      {userTyping?.length > 0 && (
        <div className="px-6 pb-2 text-md text-muted-foreground">
          {userTyping?.join(", ")} typing...
        </div>
      )}
    </div>
  );
};

export default ChatRoomContent;
