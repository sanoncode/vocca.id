/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { createClient } from "@/lib/supabase/client";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";


type roomId = {
  roomId: string
}


const ChatRoom = ({ roomId }: roomId) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [joined, setJoined] = useState(false);
  const [language, setLanguage] = useState("");
  const [userId, setUserId] = useState<string | null>(null)
  const [input, setInput] = useState('');
  const supabase = createClient()
  const chatContainerRef = useRef<HTMLDivElement>(null);


  const initializeRoom = async () => {
    const { data } = await supabase.auth.getUser();
    const currentUserId = data.user?.id;

    if (!currentUserId) return;

    setUserId(currentUserId);

    const { data: member } = await supabase
      .from("room_members")
      .select("*")
      .eq("room_id", roomId)
      .eq("user_id", currentUserId)
      .maybeSingle();

    if (member) {
      setJoined(true);
      setLanguage(member.language);
      await fetchMessages();
    }
  };

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });

    setMessages(data || []);
  }

  const handleSend = async () => {
    if (!input.trim()) return;

    await supabase.from('messages').insert({
      room_id: roomId,
      sender_id: userId,
      text: input,
      original_lang: "id"
    })

    setInput("");
  };

  const handleJoin = async () => {
    if (!language || !userId) return;

    const { error } = await supabase.from("room_members").insert({
      room_id: roomId,
      user_id: userId,
      language: language,
    });

    if (!error) {
      setJoined(true);
    }
  };

  useEffect(() => {
    if (!joined) return;

    fetchMessages();

    const channel = supabase
      .channel("room-" + roomId)
      .on("postgres_changes",
        {
          event: 'INSERT',
          schema: 'PUBLIC',
          table: 'messages',
          filter: `room_id=eq.${roomId}`
        }, (payload) => {
          setMessages((prev) => [
            ...prev,
            payload.new
          ]);
        })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }

  }, [messages])

  useEffect(() => {
    initializeRoom();
  }, []);

  useEffect(() => {
     const container = chatContainerRef.current;
    if (!container) return;

  container.scrollTo({
    top: container.scrollHeight,
    behavior: "smooth",
  });
  }, [messages.length]);

  if (!joined) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="p-6 rounded-xl shadow flex flex-col gap-3">
          <h2 className="font-semibold">Select your language</h2>

          <select
            className="border p-2"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">Choose language</option>
            <option value="id">Indonesia</option>
            <option value="en">English</option>
            <option value="ko">Korean</option>
          </select>

          <Button
            onClick={() => handleJoin()}
            className="px-4 py-2 rounded"
          >
            Join Room
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}
      <header className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-3">
          {/* Avatar placeholder */}
          {/* <div className="w-10 h-10 rounded-full overflow-hidden">
            <img src="/avatar-placeholder.png" alt="Profile" className="w-full h-full object-cover" />
          </div> */}
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
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.map((msg) => (

            <div key={msg.id} className={`flex ${msg.sender_id === userId ? "justify-end" : "justify-start"}`}>
              <div className={`relative px-4 py-3 rounded-xl border ${msg.sender_id === userId ? "border-green-600" : "border-yellow-600"} border-green-600 max-w-[70%] text-sm`}>
                {msg.text}
                {/* Timestamp & Status (Sesuai mockup) */}
                <div className="flex justify-end items-center gap-1 mt-1">
                  <span className="text-[10px] text-slate-400">05:23 PM</span>
                  <span className="text-green-500 text-[10px]">✓✓</span>
                </div>
              </div>
            </div>
          ))}   
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
              onClick={() => handleSend()}
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



