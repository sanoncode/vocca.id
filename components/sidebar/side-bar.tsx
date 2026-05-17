/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";

import { Search } from "lucide-react";

import ChatSidebar from "./sidebar-chat"
import GroupSidebar from "./sidebar-groups"
import SideLogout from './side-logout-button'
import CreateButtonSideBar from "./sidebar-create-button";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useMemo, useState } from "react";


type Room = {
  created_at: string;
  created_by: string | null;
  id: string;
  member_count: number;
  name: string;
};

type user = {
  id?: string,
  name: string,
}

export default function Sidebar() {

    const [user, setUser] = useState<user | null>(null)
    const [room, setRoom] = useState<Room[]>([])
    const [rooms, setRooms] = useState<Room[]>([])
    const supabase = useMemo(() => createClient(), []);

  const fetchRoom = async () => {

    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    const userId = user?.id;
    const userName = user?.user_metadata.full_name

   const currUser = {
      id: userId,
      name: userName
   }

  setUser(currUser ?? null)

    const { data } = await supabase
      .from("room_members")
      .select(
        `
            room_id,
            rooms (
            id,
            name,
            created_by,
            created_at
            )
        `,
      )
      .eq("user_id", userId);


    const roomIds = data?.map((item) => item.room_id) ?? [];

    const { data: members } = await supabase
      .from("room_members")
      .select("room_id")
      .in("room_id", roomIds);

    const counts = members?.reduce(
        (acc, row) => {
          acc[row.room_id] = (acc[row.room_id] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ) ?? {};

    
    const rooms: Room[] = data?.map((item) => {
        const room = Array.isArray(item.rooms)
        ? item.rooms[0]
        : item.rooms;

        return {
        id: room?.id ?? "",
        name: room?.name ?? "Untitled Room",
        created_at: room?.created_at ?? "",
        created_by: room?.created_by ?? null,
        member_count: counts[item.room_id] || 0,
        };
    }) ?? [];

    const chats = rooms.filter((room) => room.member_count <= 2);
    const groups = rooms.filter((room) => room.member_count > 2);
      
    setRoom(chats)
    setRooms(groups)
  };

  useEffect(() => {
    fetchRoom();
  }, []);

  useEffect(() => {
  if (!user?.id) return;

  const channel = supabase
    .channel(`sidebar-${user.id}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "room_members",
        filter: `user_id=eq.${user.id}`,
      },
      async () => {
        await fetchRoom();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [user?.id]);

  return (
    <aside className="w-[360px] border-r flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Hi, {user?.name}</h1>
          <div className="flex items-end gap-1 align-baseline">
            <ThemeSwitcher />
            <CreateButtonSideBar />
          </div>
        </div>

        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 " />
          <input
            placeholder="Search..."
            className="w-full rounded-xl border border-zinc-800 pl-11 pr-4 py-3 outline-none placeholder:"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <ChatSidebar rooms={room} />

        <GroupSidebar rooms={rooms}/>
      </div>

      {/* Footer */}
      <div className="border-t p-4 space-y-2">
        {/* Theme Toggle */}
        {/* <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/5 transition">
          <div className="flex items-center gap-3">
            <Moon className="w-4 h-4 " />
            <span className="text-sm ">Dark Mode</span>
          </div>

          <div className="w-10 h-6 bg-zinc-700 rounded-full relative">
            <div className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full" />
          </div>
        </button> */}

        {/* Logout */}
        <SideLogout />
      </div>
    </aside>
  );
}
