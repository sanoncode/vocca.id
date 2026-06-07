
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();


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


export function subscribeToRoomInvitations(userId: string, onNewInvitations: () => void) {
    const channel = supabase
        .channel(`room-invitation-${userId}`)
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "room_invitations",
                filter: `invited_user_id=eq.${userId}`,
            },
            () => {
                onNewInvitations();
            },

        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}