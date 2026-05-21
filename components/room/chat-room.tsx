/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
// import { Button } from "../../ui/button";
import ChatRoomHeader from "./chat-room-header";
import ChatRoomContent from "./chat-room-content";
import JoinRoomOverlay from "./chat-join-room-overlay";
import { Loader2 } from "lucide-react";
import {
  addMember,
  fetchCatchUpTranslateAPI,
  getMessages,
  getRoomData,
  sendMessage,
  subscribeToMessages,
  subscribeToMessageTranslations,
  subscribeToRoomMember,
} from "@/services/client/chat-room-services";
import { Avatar, Message } from "@/constants/types";

type roomId = {
  roomId: string;
};

const ChatRoom = ({ roomId }: roomId) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [lang, setLang] = useState("");
  const [currentUserLang, setCurrentUserLang] = useState<string | null>(null);
  const [joinLoading, setJoinLoading] = useState(false);
  const [joined, setJoined] = useState<boolean | null>(null);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [roomTitle, setRoomTitle] = useState("");
  const [roomHost, setRoomHost] = useState<string | null>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [input, setInput] = useState("");

   const fetchMessages = async (currentLang: string | null) => {
    if(!roomId) return
    const { messages } = await getMessages(roomId, currentLang);

    setMessages(messages || []);
  };


  const initializeRoom = async () => {
    const { roomTitle, avatars, joined, created_by, userId, currentUserLang } =
      await getRoomData(roomId);

    setUserId(userId);
    setCurrentUserLang(currentUserLang);
    setAvatars(avatars ?? []);
    setRoomTitle(roomTitle);
    setRoomHost(created_by);
    setJoined(!!joined);
    if (joined) {
      await fetchMessages(currentUserLang);
  };
}


  useEffect(() => {
    initializeRoom();
  }, [roomId]);

  useEffect(()=>{
    if(!roomId || !joined) return
    
    const unsubscribeTranslation = subscribeToMessageTranslations(roomId,() => {
      fetchMessages(currentUserLang)
    })

    const unsubcribemessage = subscribeToMessages(roomId, () => {
      fetchMessages(currentUserLang)
    })

    const unsubscribeRoomMember = subscribeToRoomMember(roomId, async () =>{
          const { avatars } = await getRoomData(roomId)
          setAvatars(avatars ?? []);
    })

    return () => {
      unsubscribeTranslation()
      unsubcribemessage()
      unsubscribeRoomMember()
    }

  },[roomId, joined, currentUserLang])


  const handleSend = async () => {
    
    const inputTrimmed = input.trim()
    
    if (!inputTrimmed) return;
    setInput("");

    const newMessage = {
      roomId: roomId,
      senderId: userId,
      text: inputTrimmed,
      originalLang: currentUserLang,
    };

    await sendMessage(newMessage);
    
  };

  const handleJoin = async () => {
    if (!lang || !userId) return;
    const member = {
      roomId,
      userId,
      language: lang,
    };

    await addMember(member);
    setJoined(true);

    try {
      await fetchCatchUpTranslateAPI(roomId,lang)
    } catch (e) {
     console.error("Gagal memproses translasi riwayat lama", e); 
    }

    await initializeRoom();
    setJoinLoading(false);
  };

  if (joined === null) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!joined) {
    return (
      <JoinRoomOverlay
        roomTitle={roomTitle}
        creatorName={roomHost}
        language={lang}
        setLanguage={setLang}
        handleJoin={handleJoin}
        loading={joinLoading}
      />
    );
  }
  return (
    <div className="flex flex-col h-full">
      {/* HEADER */}

      <ChatRoomHeader roomTitle={roomTitle} avatars={avatars} />

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
