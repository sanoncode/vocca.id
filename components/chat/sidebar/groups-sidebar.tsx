/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React from 'react'
import SideBarSection from './side-bar-section'

import SideBarItem from './side-bar-item'
import { MessageSquare } from 'lucide-react'

type props = {
    created_at: string,
    created_by: string | null,
    id: string,
    member_count: number,
    name: string
};

type GroupSideBarProps = {
  rooms: props[]
}

const GroupSidebar = ({rooms}: GroupSideBarProps) => {
 if(!rooms){
    return <div>loading....</div>
  } 
  return (
      <SideBarSection
          title="Groups"
          icon={<MessageSquare className="w-4 h-4" />}
        >{rooms.map((room: props)=> <SideBarItem key={room.id} label={room.name} href={`/chat/${room.id}`} />)}
        </SideBarSection>
  )
}

export default GroupSidebar


  
