'use client';

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";

import {
  Plus,
  Search,
} from "lucide-react";

import ChatSidebar from "./chat-sidebar";
import GroupSidebar from "./groups-sidebar";
import SideLogout from "./side-logout";


export default function Sidebar() {
  return (
    <aside className="w-[360px] border-r flex flex-col">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Vocca</h1>
          <div className="flex items-end gap-1 align-baseline">
             <ThemeSwitcher />
                <Button variant={'outline'} size={"sm"} className=" flex items-center justify-center">
                    <Plus className="w-5 h-5" />
                </Button>
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
       <ChatSidebar />

        <GroupSidebar />
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