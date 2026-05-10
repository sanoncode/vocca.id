'use client'

import { useState } from "react";

type roomId = {
    roomId: string   
}

type message = {
    sender: 'me' | 'him',
    message: string
}

const ChatRoom = ({roomId}: roomId) => {
    const [message, setMessage] = useState<message | null>(null);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        setMessage((prev)=>({
            ...prev,
            sender: 'me',
            message: input
        }));
    };
    return (
       <div className="flex flex-col h-full">
  {/* HEADER */}
  <header className="p-4 flex items-center justify-between border-b">
    <div className="flex items-center gap-3">
      {/* Avatar placeholder */}
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <img src="/avatar-placeholder.png" alt="Profile" className="w-full h-full object-cover" />
      </div>
      <div>
        <h2 className="font-semibold text-sm ">Jacquenetta Slowgrave</h2>
        <p className="text-xs text-green-500 flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
        </p>
      </div>
    </div>
    <div className="flex gap-4 text-zinc-400">
        {/* Mockup icons (Video, Call, More) */}
        <button className="hover:text-white">📹</button>
        <button className="hover:text-white">📞</button>
        <button className="hover:text-white">⋮</button>
    </div>
  </header>

  {/* CHAT AREA */}
  <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">

      <div className="flex justify-end">
        <div className="relative px-4 py-3 rounded-xl border border-green-600 max-w-[70%] text-sm">
          Hello
          {/* Timestamp & Status (Sesuai mockup) */}
          <div className="flex justify-end items-center gap-1 mt-1">
             <span className="text-[10px] text-slate-400">05:23 PM</span>
            <span className="text-green-500 text-[10px]">✓✓</span>
          </div>
        </div>
      </div>

       <div className="flex justify-start">
        <div className="relative px-4 py-3 rounded-xl border border-yellow-600 max-w-[70%] text-sm">
          world
          {/* Timestamp & Status (Sesuai mockup) */}
          <div className="flex justify-end items-center gap-1 mt-1">
             <span className="text-[10px] text-zinc-500">05:23 PM</span>
            <span className="text-green-500 text-[10px]">✓✓</span>
          </div>
        </div>
      </div>
  </div>

  {/* INPUT AREA */}
  <div className="p-4">
    <div className="flex items-center gap-3 rounded-2xl border px-4 py-2 focus-within:ring-1 focus-within:ring-zinc-700 transition">
      <input
        className="flex-1 bg-transparent text-sm outline-none py-2"
        placeholder="Enter message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
      />
      
      {/* Action Icons */}
      <div className="flex items-center gap-3 text-zinc-500 border-l border-zinc-700 pl-3">
        {/* <button className="hover:text-zinc-300">😊</button>
        <button className="hover:text-zinc-300">📎</button>
        <button className="hover:text-zinc-300">🎙️</button> */}
        <button
          onClick={handleSend}
          className="bg-zinc-100 text-black px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-white transition"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</div>
    );
}
export default ChatRoom



