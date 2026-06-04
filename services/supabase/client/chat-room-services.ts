/* eslint-disable @typescript-eslint/no-explicit-any */

import { createClient } from "@/lib/supabase/client";
import { getCurrentUser } from "./user-services";
import { fetchTranslateAPI } from "@/services/api/translate";
import { GetMessagesResponse, RoomDataResponse } from "@/constants/types/api";
import { Avatar } from "@/constants/types/entities";

const supabase = createClient();

export async function getRoomData(roomId: string): Promise<RoomDataResponse> {
  const user = await getCurrentUser();
  const currentUserId = user?.id ?? null;
  const currentUserName = user?.user_metadata.full_name ?? null;

  if (!currentUserId && !currentUserName) {
    return {
      roomTitle: "",
      roomHost: "",
      roomNotFound: false,
      avatars: [],
      joined: false,
      created_by: null,
      userId: null,
      userName: null,
      currentUserLang: null,
    };
  }

  const { data: preview, error: roomError } = await supabase.rpc(
    "get_room_preview",
    {
      room_id: roomId,
    },
  );
  if (roomError) {
    return {
      roomTitle: "",
      roomHost: "",
      roomNotFound: roomError.message.includes('invalid'),
      avatars: [],
      joined: false,
      created_by: null,
      userId: null,
      userName: null,
      currentUserLang: null,

    }
  }


  // 2. Ambil avatar member
  const { data: members, error: membersError } = await supabase
    .from("room_members")
    .select("user_id,language,profiles(id,name,avatar_url)")
    .eq("room_id", roomId)
    .order("joined_at", { ascending: true });

  if (membersError) throw membersError;

  const avatars: Avatar[] =
    members?.map((member) => Object.assign({ ...member.profiles, lang_code: member.language })) ?? [];

  const { data: membership, error: membershipError } = await supabase
    .from("room_members")
    .select("user_id,language")
    .eq("room_id", roomId)
    .eq("user_id", currentUserId)
    .maybeSingle();

  if (membershipError) throw membershipError;

  return {
    roomTitle: preview[0].room_title,
    roomHost: preview[0].room_created_by_id,
    roomNotFound: false,
    avatars,
    joined: !!membership,
    created_by: preview[0].room_created_by_name,
    userId: currentUserId, 
    userName:currentUserName,
    currentUserLang: membership?.language,
  };
}

export async function getMessages(
  roomId: string,
  language: string | null,
): Promise<GetMessagesResponse> {
  const { data, error } = await supabase
    .from("messages")
    .select(
      `*,sender:profiles (id,name,avatar_url),translations:message_translations(
        translated_text,
        target_lang
      )`,
    )
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  const messages =
    data?.map((message) => ({
      ...message,
      display_text: message.translations.find(
        (t: any) => t.target_lang === language,
      )?.translated_text,
    })) ?? [];

  return {
    messages,
  };
}

export async function createRoom(params: { roomName: string; lang: string }) {
  const { roomName, lang } = params;
  const { data: room } = await supabase.rpc("create_room_with_member", {
    room_name: roomName.trim(),
    room_lang: lang,
  });

  return room;
}

export async function deleteRoom(roomId: string) {

  const { data: room, error } = await supabase
    .from('rooms')
    .delete()
    .eq("id", roomId)
    .select()

  if (error) {
    console.error("❌ SUPABASE DELETE ERROR DETECTED:", error);
    throw error;
  }
  console.log("✅ Sukses terhapus dari DB:", room);

  return room;
}

export async function leaveRoom(roomId: string, userId: string | null) {

  const { data: room, error } = await supabase
    .from('room_members')
    .delete()
    .eq("room_id", roomId)
    .eq("user_id", userId)
    .select()


  if (error) {
    console.error("❌ SUPABASE DELETE ERROR DETECTED:", error);
    return room;
  }
  console.log("✅ Sukses terhapus dari DB:", room);

  return room;
}

export async function sendMessage(params: {
  roomId: string;
  senderId: string | null;
  text: string;
  originalLang: string | null;
}) {
  const { roomId, senderId, text, originalLang } = params;

  const { data, error } = await supabase
    .from("messages")
    .insert({
      room_id: roomId,
      sender_id: senderId,
      text,
      original_lang: originalLang,
    })
    .select("id")
    .single();

  if (error) throw error;
  if (!data) return;

  await fetchTranslateAPI(data.id);
}

export async function addMember(params: {
  roomId: string;
  userId: string;
  language: string;
}) {
  const { roomId, userId, language } = params;
  const { error } = await supabase.from("room_members").insert({
    room_id: roomId,
    user_id: userId,
    language: language,
  });
  if (error) throw error;
}

