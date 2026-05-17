/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import SideBarSection from "./side-bar-section";
import SideBarItem from "./side-bar-item";
import { MessageSquare } from "lucide-react";

type props = {
    created_at: string,
    created_by: string | null,
    id: string,
    member_count: number,
    name: string
};

type ChatSideBarProps = {
  rooms: props[]
}

const ChatSidebar = ({rooms}: ChatSideBarProps) => {

  if(!rooms){
    return <div>loading....</div>
  } return (
    <SideBarSection title="Chats" length={rooms.length} icon={<MessageSquare className="w-4 h-4" />}>
      {
        rooms.length > 0 ? ( 
        rooms.map((room: props) => (
        <SideBarItem
          key={room.id}
          label={room.name}
          href={`/room/${room.id}`}
        />
      )))
    : <div className="text-muted-foreground">there is no chat</div>
  }
    </SideBarSection>
  );
};

export default ChatSidebar;
