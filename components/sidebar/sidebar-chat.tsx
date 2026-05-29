/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import SideBarSection from "./side-bar-section";
import SideBarItem from "./side-bar-item";
import { Crown, MessageSquare } from "lucide-react";
import { ChatSideBarProps } from "@/constants/types/props";
import { Room } from "@/constants/types/entities";


const ChatSidebar = ({rooms, userId}: ChatSideBarProps) => {

  if(!rooms){
    return <div>loading....</div>
  } return (
    <SideBarSection title="Chats" length={rooms.length} icon={<MessageSquare className="w-4 h-4" />}>
      {
        rooms.length > 0 ? ( 
        rooms.map((room: Room) => (

          <SideBarItem
            key={room.id}
            label={room.name}
            href={`/room/${room.id}`}
            createdBy={room.created_by}
            userId={userId}
          />
      )))
    : <div className="text-muted-foreground">there is no chat</div>
  }
    </SideBarSection>
  );
};

export default ChatSidebar;
