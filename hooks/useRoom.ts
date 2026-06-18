import { RoomData } from '@/constants/types/entities'
import { broadcastUser } from '@/services/supabase/client/chat-room-realtime'
import { acceptInvitations, getRoomData } from '@/services/supabase/client/chat-room-services'
import UserStore from '@/store/userStore'
import React, { useEffect, useState } from 'react'

const useRoom = (roomId: string) => {

    const currentUser = UserStore((state) => state.currentUser)

    const [lang, setLang] = useState("");
    const [joinLoading, setJoinLoading] = useState(false);
    const [joined, setJoined] = useState<boolean | null>(null);

    const [roomData, setRoomData] = useState<RoomData>({
        title: "",
        host: "",
        createdBy: "",
        invitationId: "",
        avatars: [],
        notFound: false,
    })
     const initializeRoom = async () => {
        const {
            roomTitle,
            roomHost,
            roomNotFound,
            avatars,
            joined,
            created_by,
            invitationId
        } = await getRoomData(roomId);

        setRoomData({
            title: roomTitle,
            host: roomHost,
            createdBy: created_by!,
            invitationId: invitationId!,
            avatars: avatars,
            notFound: roomNotFound,
        });

        setJoined(!!joined);
    };

    const handleJoin = async () => {
        if (!lang || !currentUser.id) return;

        setJoinLoading(true);

        try {
            await acceptInvitations({
                invitationId: roomData.invitationId,
                lang,
            });

            await broadcastUser(
                roomId,
                currentUser.name,
                "JOIN"
            );

            setJoined(true);

            await initializeRoom();
        } finally {
            setJoinLoading(false);
        }
    };

    useEffect(() => {
        initializeRoom();
    }, [roomId]);

    return {
        currentUser,
        joined,
        joinLoading,
        lang,
        setLang,

        roomTitle: roomData.title,
        roomHost: roomData.host,
        avatars: roomData.avatars,
        roomNotFound: roomData.notFound,
        createdBy: roomData.createdBy,

        handleJoin,
    };
}

export default useRoom
