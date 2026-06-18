/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
// import { Button } from "../../ui/button";
import ChatRoomHeader from "./chat-room-header";
import ChatRoomContent from "./chat-room-content";
import JoinRoomOverlay from "./chat-join-room-overlay";
import { Loader2 } from "lucide-react";
import RoomNotFound from "./chat-room-not-found";
import ChatRoomSystemMessages from "./chat-room-system-messages";
import useChatRoom from "@/hooks/useChatRoom";
import ChatRoomInput from "./chat-room-input";

type roomId = { 
  roomId: string;
};

const ChatRoom = ({ roomId }: roomId) => {

  const { 
        avatars,
        currentUser,
        joined,
        joinLoading,
        roomNotFound,
        roomHost,
        roomTitle,
        systemMessages,
        createdBy,
        lang,
        setLang,
        handleJoin,
  } = useChatRoom(roomId)
 
  if (roomNotFound) {
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
      <JoinRoomOverlay
        roomTitle={roomTitle}
        creatorName={createdBy}
        language={lang}
        setLanguage={setLang}
        handleJoin={handleJoin}
        loading={joinLoading}
      />
    );
  }
  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}

      <ChatRoomHeader
        roomHost={roomHost}
        roomId={roomId}
        roomTitle={roomTitle}
        avatars={avatars}
        currentUser={currentUser}
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
