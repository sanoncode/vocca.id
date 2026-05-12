'use client'
import React, { useEffect, useState } from 'react'
import SideBarSection from './side-bar-section'
import { createClient } from '@/lib/supabase/client'
import SideBarItem from './side-bar-item'
import { MessageSquare } from 'lucide-react'

type Room = {
  id: string,
  name: string
}

const GroupSidebar = () => {

  const [rooms, setRooms] = useState<Room[]>([])

  const fetchRoom = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('rooms')
      .select("id, name")

    if (error) return;

    setRooms(data ?? null)
  }

  useEffect(() => {
    fetchRoom()
  }, [])


  return (
      <SideBarSection
          title="Groups"
          icon={<MessageSquare className="w-4 h-4" />}
        >{rooms.map((room)=> <SideBarItem key={room.id} label={room.name} href={`/chat/${room.id}`} />)}
        </SideBarSection>
  )
}

export default GroupSidebar


  
