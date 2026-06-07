
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser } from "./user-services";
import { InvitedRoomListResponse, RoomListResponse } from "@/constants/types/api";
import { Room } from "@/constants/types/entities";

const supabase = createClient();

export async function getRoomList(): Promise<RoomListResponse> {
  const user = await getCurrentUser();
  const currentUserId = user?.id ?? null;
  const currentUserName = user?.user_metadata.full_name ?? null;

  if(!currentUserId){
    return {
      rooms: [],
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
      rooms: [],
      userId: currentUserId,
      userName: currentUserName,
    };
  }
 
  const rooms: Room[] = data.map((item) => {
    const room = Array.isArray(item.rooms) ? item.rooms[0] : item.rooms;

    return {
      id: room?.id ?? "",
      name: room?.name ?? "Untitled Room",
      created_at: room?.created_at ?? "",
      created_by: room?.created_by ?? null,
    };
  });

  return {
    rooms: rooms,
    userId: currentUserId,
    userName: currentUserName,
   
  };
}

export async function getInvitedRoomList(): Promise<InvitedRoomListResponse> {
  const user = await getCurrentUser();
  const currentUserId = user?.id ?? null;
  const currentUserEmail = user?.email ?? null;

  const { data: claimInvited, error: claimInvitedError } = await supabase.rpc(
    "claim_room_invitations",
    {
      user_email: currentUserEmail
    }
  )

  const { data: invitedRooms, error: invitedRoomError } = await supabase
    .from("room_invitations")
    .select(
      `
      room_id,
      rooms(
        id,
        name,
        created_by,
        created_at
      )
    `,
    )
    .eq("invited_user_id", currentUserId);

  if (invitedRoomError) throw invitedRoomError;

  if (!invitedRooms || invitedRooms.length === 0) {
    return {
      invitedRooms: [],
    };
  }
  
  console.log(claimInvited, 'claim invitations')

   console.log(invitedRooms, 'Room invitations ')

  const rooms: Room[] = invitedRooms.map((item) => {
    console.log(item)
    const room = Array.isArray(item.rooms) ? item.rooms[0] : item.rooms;

    return {
      id: room?.id ?? "",
      name: room?.name ?? "Untitled Room",
      created_at: room?.created_at ?? "",
      created_by: room?.created_by ?? null,
    };
  });

  return {
    invitedRooms: rooms,
  };
}


