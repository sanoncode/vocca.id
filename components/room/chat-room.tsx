/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef, useState } from "react";
// import { Button } from "../../ui/button";
import ChatRoomHeader from "./chat-room-header";
import ChatRoomContent from "./chat-room-content";
import JoinRoomOverlay from "./chat-join-room-overlay";
import { Loader2 } from "lucide-react";
import {
  addMember,
  getMessages,
  getRoomData,
  sendMessage,
} from "@/services/supabase/client/chat-room-services";

import { fetchCatchUpTranslateAPI } from "@/services/api/translate";
import RoomNotFound from "./chat-room-not-found";
import { Avatar, CurrentUser, Message } from "@/constants/types/entities";

import {
  broadcastUser,
  subscribeToBroadcastUser,
  subscribeToMessages,
  subscribeToMessageTranslations,
  subscribeToRoomMember,
} from "@/services/supabase/client/chat-room-realtime";
import { SystemMessage } from "@/constants/types/system-messages";
import ChatRoomSystemMessages from "./chat-room-system-messages";

type roomId = {
  roomId: string;
};

const ChatRoom = ({ roomId }: roomId) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const [lang, setLang] = useState("");
  const [currentUserLang, setCurrentUserLang] = useState<string | null>(null);
  const [systemMessages, setSystemMessages] = useState<SystemMessage[]>([]);
  const [userTyping, setUserTyping] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUser>(null);
  const [joinLoading, setJoinLoading] = useState(false);
  const [joined, setJoined] = useState<boolean | null>(null);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [createdBy, setCreatedBy] = useState<string | null>("");
  const [roomTitle, setRoomTitle] = useState("");
  const [roomHost, setRoomHost] = useState<string | null>("");
  const [roomNotFound, setRoomNotFound] = useState<boolean>(false);
  const [input, setInput] = useState("");
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchMessages = async (currentLang: string | null) => {
    if (!roomId) return;

    const { messages } = await getMessages(roomId, currentLang);

    setMessages(messages || []);
  };

  const initializeRoom = async () => {
    const {
      roomTitle,
      roomHost,
      roomNotFound,
      avatars,
      joined,
      created_by,
      currentUser,
      currentUserLang,
    } = await getRoomData(roomId);

    setCurrentUser(currentUser);
    setCurrentUserLang(currentUserLang);
    setAvatars(avatars ?? []);
    setRoomTitle(roomTitle);
    setRoomHost(roomHost);
    setRoomNotFound(roomNotFound);
    setCreatedBy(created_by);

    setJoined(!!joined);
    if (joined) {
      await fetchMessages(currentUserLang);
    }
  };

  useEffect(() => {
    initializeRoom();
  }, [roomId]);

  useEffect(() => {
    if (!roomId || !joined) return;

    const unsubscribeTranslation = subscribeToMessageTranslations(
      roomId,
      () => {
        fetchMessages(currentUserLang);
      },
    );

    const unsubcribemessage = subscribeToMessages(roomId, () => {
      fetchMessages(currentUserLang);
    });

    const unsubscribeRoomMember = subscribeToRoomMember(roomId, async () => {
      const { avatars } = await getRoomData(roomId);
      setAvatars(avatars ?? []);
    });

    const unsubscribeToBroadcastUser = subscribeToBroadcastUser(
      roomId,
      (payload) => {
        handleBroadcast(payload);
      },
    );

    return () => {
      unsubscribeTranslation();
      unsubcribemessage();
      unsubscribeRoomMember();
      unsubscribeToBroadcastUser();
    };
  }, [roomId, joined, currentUserLang]);

  const handleSend = async () => {
    const inputTrimmed = input.trim();

    if (!inputTrimmed) return;
    setInput("");

    const newMessage = {
      roomId: roomId,
      senderId: currentUser?.id,
      text: inputTrimmed,
      originalLang: currentUserLang,
    };

    await sendMessage(newMessage);
  };

  const handleTyping =  (e: any) => {
    const value = e.target.value;

    setInput(value);

    broadcastUser(roomId, currentUser?.name, "TYPING");

    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    typingTimeout.current = setTimeout(() => {
      broadcastUser(roomId, currentUser?.name, "IDLE");
    }, 2000);
  };

  const handleJoin = async () => {
    if (joinLoading) return;
    if (!lang || !currentUser?.id) return;
    const member = {
      roomId,
      userId: currentUser.id,
      language: lang,
    };

    await addMember(member);
    await broadcastUser(roomId, currentUser?.name, "JOIN");
    setJoined(true);

    try {
      await fetchCatchUpTranslateAPI(roomId, lang);
    } catch (e) {
      console.error("Gagal memproses translasi riwayat lama", e);
    }

    await initializeRoom();
    setJoinLoading(false);
  };

  const handleBroadcast = (payload: SystemMessage) => {
    if (payload.userEvent === "JOIN" || payload.userEvent === "LEAVE") {
      setSystemMessages((prev) => [...prev, payload]);
    }
    if (payload.userEvent === "TYPING") {
      setUserTyping((prev) => {
        if (prev.includes(payload.userName)) {
          return prev;
        }

        return [...prev, payload.userName];
      });
    }
    if (payload.userEvent === "IDLE") {
      setUserTyping((prev) => prev.filter((name) => name !== payload.userName));
    }

    setTimeout(() => {
      setSystemMessages([]);
    }, 2000);
  };

  if (roomNotFound) {
    return <RoomNotFound />;
  }

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
        creatorName={createdBy}
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

      <ChatRoomHeader
        roomHost={roomHost}
        roomId={roomId}
        roomTitle={roomTitle}
        avatars={avatars}
        currentUser={currentUser}
      />

      <ChatRoomSystemMessages systemMessages={systemMessages} />

      {/* CHAT CONTENT */}
      <ChatRoomContent
        currentUser={currentUser}
        messages={messages}
        userTyping={userTyping}
      />

      {/* INPUT AREA */}
      <div className="p-4">
        <div className="flex items-center gap-3 rounded-2xl border px-4 py-2 focus-within:ring-1 focus-within:ring-zinc-700 transition">
          <input
            className="flex-1 bg-transparent text-sm outline-none py-2"
            placeholder="Enter message..."
            value={input}
            onChange={(e) => handleTyping(e)}
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
