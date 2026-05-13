/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
// import { Button } from "../../ui/button";
import ChatRoomHeader from "./chat-room-header";
import ChatRoomContent from "./chat-room-content";

type roomId = {
  roomId: string;
};

type members = {
    id:string,
    name: string
    avatar_url?: string,
}

const ChatRoom = ({ roomId }: roomId) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [joined, setJoined] = useState(false);
  const [members, setMembers] = useState<members[]>([])
  const [roomTitle, setRoomTitle] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const supabase = createClient();

  const initializeRoom = async () => {
    const { data } = await supabase.auth.getUser();
    const currentUserId = data.user?.id;
  

    if (!currentUserId) return;

    setUserId(currentUserId);
    
    const { data: roomTitle } = await supabase
      .from("rooms")
      .select("name")
      .eq("id", roomId)
      .single();

    if (roomTitle) {
      setRoomTitle(roomTitle.name);
    }

    const { data: members } = await supabase
      .from("room_members")
      .select(`user:profiles!room_members_user_id_fkey (id,name,avatar_url)`)
      .eq("room_id", roomId)
      .order("joined_at", {ascending: true})

      if(members){
        const normalizeMembers = members?.map((member) => Object.assign(member.user))
        setMembers(normalizeMembers ?? [])
      }

    

  };

  const fetchMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select(
        `*,sender:profiles!messages_sender_id_fkey (id,name,avatar_url)`,
      )
      .eq("room_id", roomId)
      .order("created_at", { ascending: true });

    setMessages(data || []);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    await supabase.from("messages").insert({
      room_id: roomId,
      sender_id: userId,
      text: input,
      original_lang: "id",
    });

    setInput("");
  };

  // const handleJoin = async () => {
  //   if (!language || !userId) return;

  //   const { error } = await supabase.from("room_members").insert({
  //     room_id: roomId,
  //     user_id: userId,
  //     language: language,
  //   });

  //   if (!error) {
  //     setJoined(true);
  //   }
  // };

  useEffect(() => {
  
    fetchMessages();

    const channel = supabase
      .channel("room-" + roomId)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "PUBLIC",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel); 
    };
  }, [messages]);

  useEffect(() => {
    initializeRoom();
  }, []);

 

  // if (!joined) {
  //   return (
  //     <div className="h-screen flex items-center justify-center">
  //       <div className="p-6 rounded-xl shadow flex flex-col gap-3">
  //         <h2 className="font-semibold">Select your language</h2>

  //         <select
  //           className="border p-2"
  //           value={language}
  //           onChange={(e) => setLanguage(e.target.value)}
  //         >
  //           <option value="">Choose language</option>
  //           <option value="id">Indonesia</option>
  //           <option value="en">English</option>
  //           <option value="ko">Korean</option>
  //         </select>

  //         <Button onClick={() => handleJoin()} className="px-4 py-2 rounded">
  //           Join Room
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}

      <ChatRoomHeader roomTitle={roomTitle} members={members}/>

      {/* CHAT CONTENT */}
      <ChatRoomContent userId={userId} messages={messages} />

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
};
export default ChatRoom;
