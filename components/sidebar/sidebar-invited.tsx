/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import SideBarSection from "./side-bar-section";

import SideBarItem from "./side-bar-item";
import {  inviteSideBarProps } from "@/constants/types/props";
import { useParams } from "next/navigation";
import { invitedRoom } from "@/constants/types/api";

const InvitedSidebar = ({ rooms, userId, icon }: inviteSideBarProps ) => {
  const { id } = useParams()

  if (!rooms) {
    return <div>loading....</div>;
  }

  return (
    <>
    <SideBarSection title="Invited" length={rooms.length} icon={icon}>
      {rooms.length > 0 ? (
        rooms.map((room: invitedRoom) => (
          <SideBarItem
            active={room.roomId === id}
            key={room.roomId}
            label={room.roomName}
            href={`/room/${room.roomId}`}
            userId={userId}
            createdBy={room.createdBy}
          />
        ))
      ) : (
        <div className="text-muted-foreground">there is no invitations</div>
      )}
    </SideBarSection>
    </>
  );
};

export default InvitedSidebar;
