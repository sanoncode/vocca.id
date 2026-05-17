import { Avatar, GetMessagesResponse, Message, RoomData } from "@/constants/types";
import { createClient } from "@/lib/supabase/client";


const supabase = createClient()

export async function getCurrentUser() {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error) throw error;

    return user;
}

export async function getRoomData(roomId: string): Promise<RoomData> {
    const user = await getCurrentUser();
    const currentUserId = user?.id ?? null;

    if (!currentUserId) {
        return {
            roomTitle: "",
            avatars: [],
            joined: false,
            created_by: null,
            userId: null
        };
    }

    const { data: preview, error: roomError } = await supabase.rpc("get_room_preview", {
        room_id: roomId,
    });
    if (roomError) throw roomError;

    // 2. Ambil avatar member
    const { data: members, error: membersError } = await supabase
        .from("room_members")
        .select("user_id,profiles(id,name,avatar_url)")
        .eq("room_id", roomId)
        .order("joined_at", { ascending: true });

    if (membersError) throw membersError;

    const avatars: Avatar[] =
        members?.map((member: any) => Object.assign(member.profiles)) ?? [];


    const { data: membership, error: membershipError } = await supabase
        .from("room_members")
        .select("user_id")
        .eq("room_id", roomId)
        .eq("user_id", currentUserId)
        .maybeSingle();

    if (membershipError) throw membershipError;

    return {
        roomTitle: preview[0].room_title,
        avatars,
        joined: !!membership,
        created_by: preview[0].room_created_by,
        userId: currentUserId
    };
}

export async function getMessages(roomId: string): Promise<GetMessagesResponse> {
    const { data, error } = await supabase
        .from("messages")
        .select(`*,sender:profiles (id,name,avatar_url)`)
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

    if (error) throw error;

    return {
        messages: (data ?? []) as Message[]
    }
}

export async function sendMessage(params: {
    roomId: string;
    senderId: string | null;
    text: string;
    originalLang?: string;
}) {
    const { roomId, senderId, text, originalLang } = params;

    const { error } = await supabase.from("messages").insert({
        room_id: roomId,
        sender_id: senderId,
        text,
        original_lang: originalLang,
    });

    if (error) throw error;
}

export async function addMember(params: {
    roomId: string,
    userId: string,
    language: string,
}) {
    const { roomId, userId, language } = params
    const { error } = await supabase.from("room_members").insert({
        room_id: roomId,
        user_id: userId,
        language: language,
    });
    if (error) throw error;
}

export function subscribeToMessages(
    roomId: string,
    onNewMessage: () => void
) {
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
            }
        )
           .subscribe((status) => {
      console.log("Realtime status:", status);
    });

    return () => {
        supabase.removeChannel(channel);
    };
}