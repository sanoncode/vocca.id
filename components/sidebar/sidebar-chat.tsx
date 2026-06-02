/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import SideBarSection from "./side-bar-section";
import SideBarItem from "./side-bar-item";
import { ChatSideBarProps } from "@/constants/types/props";
import { Room } from "@/constants/types/entities";
import { useParams } from "next/navigation";


const ChatSidebar = ({rooms, userId}: ChatSideBarProps) => {

  const {id} = useParams()

  if(!rooms){
    return <div>loading....</div>
  } return (
    <SideBarSection title="Rooms" length={rooms.length}>
      {
        rooms.length > 0 ? ( 
        rooms.map((room: Room) => (
          <SideBarItem
            key={room.id}
            active={room.id === id}
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
