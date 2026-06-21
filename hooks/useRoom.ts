import { RoomData } from '@/constants/types/entities'
import { fetchCatchUpTranslateAPI } from '@/services/api/translate'
import { broadcastUser, subscribeToRoomMember } from '@/services/supabase/client/chat-room-realtime'
import { acceptInvitations, getRoomData, leaveRoom } from '@/services/supabase/client/chat-room-services'
import RoomStore from '@/store/roomStore'
import UserStore from '@/store/userStore'
import React, { useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'

const useRoom = (roomId: string) => {

    const { currentUser, setCurrentUser } = UserStore(useShallow((state) => ({
        currentUser: state.currentUser,
        setCurrentUser: state.setCurrentUser
    })))

      const { roomData, lang, joined, setJoined,setJoinedLoading , setRoomData, setAvatars } = RoomStore(useShallow((state) => ({
        roomData: state.roomData,
        lang: state.lang,
        joined: state.joined,
        setJoinedLoading: state.setJoinedLoading,
        setRoomData: state.setRoomData,
        setAvatars: state.setAvatars,
        setJoined: state.setJoined
    })))

    const initializeRoom = async () => {
        const {
            roomTitle,
            roomHost,
            roomNotFound,
            avatars,
            joined,
            created_by,
            invitationId,
            currentUser
        } = await getRoomData(roomId);

        setRoomData({
            title: roomTitle,
            host: roomHost,
            createdBy: created_by,
            invitationId: invitationId!,
            avatars: avatars,
            notFound: roomNotFound,
        });
        setCurrentUser(currentUser!)

        setJoined(joined);
    };

    const handleJoin = async () => {
        if (!lang || !currentUser?.id) return;

        setJoinedLoading(true);

        await acceptInvitations({
            invitationId: roomData.invitationId,
            lang,
        });

        await broadcastUser(
            roomId,
            currentUser?.name,
            "JOIN"
        );
        await fetchCatchUpTranslateAPI(roomId, lang)
        await initializeRoom();
        setJoined(true);
        setJoinedLoading(false);

    };

    const handleLeave = async () => {
        
        const result = await leaveRoom(roomId, currentUser?.id)
        if (result) {
            broadcastUser(roomId, currentUser?.name,'LEAVE');
            await initializeRoom();
            return
        }
    }

    useEffect(()=>{

         if (!roomId) return;
            const unsubscribeRoomMember = subscribeToRoomMember(roomId, async () => {
            const { avatars } = await getRoomData(roomId);
            setAvatars(avatars);
        });

        return () => unsubscribeRoomMember()
    },[roomId, joined, currentUser?.lang])

    useEffect(() => {
        initializeRoom();
    }, [roomId]);

    return {
        currentUser,
        joined,
        roomData,
        handleJoin,
        handleLeave,
    };
}

export default useRoom
