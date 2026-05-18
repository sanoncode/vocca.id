/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";

import { Search } from "lucide-react";

import ChatSidebar from "./sidebar-chat";
import GroupSidebar from "./sidebar-groups";
import SideLogout from "./side-logout-button";
import CreateButtonSideBar from "./sidebar-create-button";
import { useEffect, useState } from "react";
import { getRoomList, subscribeToRooms } from "@/services/side-bar-services";
import { Room } from "@/constants/types";

type user = {
  id: string | null;
  name: string | null;
};

export default function Sidebar() {
  const [user, setUser] = useState<user | null>(null);
  const [room, setRoom] = useState<Room[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  const fetchRoom = async () => {
    const { chats, groups, userId, userName } = await getRoomList();

    const currUser = {
      id: userId,
      name: userName,
    };
    setUser(currUser ?? null);
    setRoom(chats);
    setRooms(groups);
  };

  useEffect(() => {
    fetchRoom();
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    const unsubscribe = subscribeToRooms(user.id, async () => {
      await fetchRoom();
    });

    return unsubscribe
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

        <GroupSidebar rooms={rooms} />
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
