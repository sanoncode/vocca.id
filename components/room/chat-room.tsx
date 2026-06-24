/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ChatRoomHeader from "./chat-room-header";
import ChatRoomContent from "./chat-room-content";
import ChatJoinRoomOverlay from "./chat-join-room-overlay";
import { Loader2 } from "lucide-react";
import RoomNotFound from "./chat-room-not-found";
import ChatRoomSystemMessages from "./chat-room-system-messages";
import ChatRoomInput from "./chat-room-input";
import useRoom from "@/hooks/useRoom";
import useMessages from "@/hooks/useMessages";
import useRealtime from "@/hooks/useRealtime";

type roomId = { 
  roomId: string;
};

const ChatRoom = ({ roomId }: roomId) => {

    const {
        currentUser,
        joined,
        roomData,
        handleJoin,
        handleLeave
    } = useRoom(roomId);

    useMessages({
      roomId, 
      currentLang: currentUser.lang
    })

    const {
      systemMessages
    } = useRealtime({
      roomId
    })
  
 
  if (roomData.notFound) {
    return <RoomNotFound />;
  }

  if (joined === null) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!joined) {
    return (
      <ChatJoinRoomOverlay
        handleJoin={handleJoin}
      />
    );
  }
  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}

      <ChatRoomHeader
        roomId={roomId}
        handleLeave={handleLeave}
      />

      <ChatRoomSystemMessages systemMessages={systemMessages} />

      {/* CHAT CONTENT */}
      <ChatRoomContent/>

      {/* INPUT AREA */}
      <ChatRoomInput roomId={roomId} />
    </div>
  );
};
export default ChatRoom;
