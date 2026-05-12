'use client'
import React, { useEffect, useState } from 'react'
import LayoutSideBar from './layout-sidebar'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

type Room = {
  id: string,
  name: string
}

const ChatSidebar = () => {

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
    <LayoutSideBar
      title='Chats'
      buttonTitle='New'
    >
        {rooms.length > 0 && rooms.map((room) => (
          <div key={room.id} className="flex p-4">
            <Link href={`/chat/${room.id}`}>
              {room.name}
            </Link>
          </div>
        ))}
    </LayoutSideBar>
  )
}

export default ChatSidebar
