import { SystemMessage, UserEvent } from "@/constants/types/system-messages";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export function subscribeToMessages(roomId: string, onNewMessage: () => void) {
    const channel = supabase
        .channel(`room-${roomId}`)
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "messages",
                filter: `room_id=eq.${roomId}`,
            },
            () => {
                onNewMessage();
            },
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}

export function subscribeToRoomMember(roomId: string, onNewMessage: () => void) {
    const channel = supabase
        .channel(`room-members-${roomId}`)
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "room_members",
                filter: `room_id=eq.${roomId}`,
            },
            () => {
                onNewMessage();
            },

        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
}

export function subscribeToMessageTranslations(
    roomId: string,
    onNewMessage: () => void,
) {
    const channel = supabase
        .channel(`room-translation-${roomId}`)
        .on(
            "postgres_changes",
            {
                event: "*",
                schema: "public",
                table: "message_translations",
            },
            () => {
                onNewMessage();
            },
        )
        .subscribe();
    return () => {
        supabase.removeChannel(channel);
    };
}


export async function broadcastUser(
    roomId: string,
    userName: string | null | undefined,
    userEvent: UserEvent
) {
    const channel = supabase.channel(`user-event-${roomId}`)

    await channel.send({
        type: 'broadcast',
        event: 'USER_EVENT',
        payload: {
            userEvent,
            userName
        }

    })

}

export function subscribeToBroadcastUser(
    roomId: string,
    callback: (payload: SystemMessage ) => void,
) {
    const channel = supabase
        .channel(`user-event-${roomId}`)
        .on(
            'broadcast',
            {
                event: 'USER_EVENT',
            },
            ({ payload }) => {
                callback(payload);
            },
        )
        .subscribe();
    return () => {
        supabase.removeChannel(channel);
    };
}

