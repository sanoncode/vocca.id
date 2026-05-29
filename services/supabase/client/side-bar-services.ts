
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser } from "./user-services";
import { RoomListResponse } from "@/constants/types/api";
import { Room } from "@/constants/types/entities";

const supabase = createClient();

export async function getRoomList(): Promise<RoomListResponse> {
  const user = await getCurrentUser();
  const currentUserId = user?.id ?? null;
  const currentUserName = user?.user_metadata.full_name ?? null;

  if(!currentUserId){
    return {
      chats: [],
      groups: [],
      userId: null,
      userName: null, 
    };
  }

  const { data, error } = await supabase
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
    .eq("user_id", currentUserId);

  if (error) throw error;

  if (!data || data.length === 0) {
    return {
      chats: [],
      groups: [],
      userId: currentUserId,
      userName: currentUserName,
    };
  }
  const roomIds = data.map((item) => item.room_id);

  const { data: roomCounts, error: countError } = await supabase
    .from("room_members")
    .select("room_id")
    .in("room_id", roomIds);

  if (countError) throw countError;

  const memberCounts =
    roomCounts?.reduce<Record<string, number>>((acc, row) => {
      acc[row.room_id] = (acc[row.room_id] || 0) + 1;
      return acc;
    }, {}) ?? {};

  const rooms: Room[] = data.map((item) => {
    const room = Array.isArray(item.rooms) ? item.rooms[0] : item.rooms;

    return {
      id: room?.id ?? "",
      name: room?.name ?? "Untitled Room",
      created_at: room?.created_at ?? "",
      created_by: room?.created_by ?? null,
      member_count: memberCounts[item.room_id] ?? 0,
    };
  });

  const roomHost = data.map((item) => {
    const room = Array.isArray(item.rooms) ? item.rooms[0] : item.rooms
    return room.created_by === currentUserId
  })

  return {
    chats: rooms.filter((room) => room.member_count <= 2),
    groups: rooms.filter((room) => room.member_count > 2),
    userId: currentUserId,
    userName: currentUserName,
   
  };
}

export function subscribeToRooms(userId: string, onNewRoom: () => void) {
  const channel = supabase
    .channel(`sidebar-${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "room_members",

      },
      () => {
       
        onNewRoom();
      },
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel);
  };
}
