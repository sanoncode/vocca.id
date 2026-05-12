'use client'
import { usePathname } from 'next/navigation'
import React from 'react'
import PeopleSidebar from './people-sidebar'
import GroupsSidebar from './groups-sidebar'
import ChatSidebar from './chat-sidebar'

const SideBar = () => {
    const pathname = usePathname()

    if (pathname === '/people') {
        return <PeopleSidebar />
    }
    if (pathname === '/groups') {
        return <GroupsSidebar />
    }
    return <ChatSidebar />
}

export default SideBar
