/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import SideBarSection from "./side-bar-section";

import SideBarItem from "./side-bar-item";
import {  inviteSideBarProps } from "@/constants/types/props";
import { useParams } from "next/navigation";
import { invitedRoom } from "@/constants/types/api";

const InvitedSidebar = ({ rooms, userId }: inviteSideBarProps ) => {
  const { id } = useParams()

  if (!rooms) {
    return <div>loading....</div>;
  }

  return (
    <>
    <SideBarSection title="Invited" length={rooms.length}>
      {rooms.length > 0 ? (
        rooms.map((room: invitedRoom) => (
          <SideBarItem
            active={room.id === id}
            key={room.id}
            label={room.name}
            href={`/room/${room.id}`}
            userId={userId}
            createdBy={room.created_by}
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
