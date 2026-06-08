
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser } from "./user-services";
import { invitedRoom, InvitedRoomListResponse, RoomListResponse } from "@/constants/types/api";
import { Room } from "@/constants/types/entities";
import { invitedRoomSupabase } from "@/constants/types/supabase";

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

 const { data, error } = await supabase.rpc(
    "get_invited_rooms"
  );

  if (error) throw error;

  const rooms: invitedRoom[] = data?.map((room: invitedRoomSupabase) => ({
        invitedRoomid: room.invitation_id,
        roomId: room.room_id,
        roomName: room.room_name,
        createdBy: room.created_by,
        createdAt: room.created_at,
      })) ?? []
      
  return {
    invitedRooms: rooms,
  };

}

export async function getClaimRoomInvitations(): Promise<InvitedRoomListResponse> {
  const user = await getCurrentUser();
  const currentUserEmail = user?.email ?? null;

  const { data: claimInvited, error: claimInvitedError } = await supabase.rpc(
    "claim_room_invitations",
    {
      user_email: currentUserEmail
    }
  )
  if(claimInvitedError) throw claimInvitedError;

   
  return claimInvited

}


