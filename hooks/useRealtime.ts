import { SystemMessage } from '@/constants/types/system-messages';
import { subscribeToBroadcastUser } from '@/services/supabase/client/chat-room-realtime';
import MessagesStore from '@/store/messageStore';
import RoomStore from '@/store/roomStore';
import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow';

type UseRealtimeProps = {
    roomId: string,
}


const useRealtime = ({ roomId }: UseRealtimeProps) => {

    const [systemMessages, setSystemMessages] = useState<SystemMessage[]>([]);
    const joined = RoomStore((state)=>state.joined)

    const { addUserTyping, removeUserTyping } = MessagesStore(
        useShallow((state) => ({
            addUserTyping: state.addUserTyping,
            removeUserTyping: state.removeUserTyping
        }))
    );

    const handleBroadcast = (payload: SystemMessage) => {

        if (
            payload.userEvent === "JOIN" ||
            payload.userEvent === "LEAVE" ||
            payload.userEvent === "INVITE"
        ) {
            setSystemMessages(prev => [...prev, payload]);

            setTimeout(() => {
                setSystemMessages([]);
            }, 2000);
        }


        if (payload.userEvent === "TYPING") {
            addUserTyping(payload.userName);
        }


        if (payload.userEvent === "IDLE") {
            removeUserTyping(payload.userName);
        }
    };

    useEffect(() => {
        if (!roomId || !joined) return;


        const unsubscribe = subscribeToBroadcastUser(
            roomId,
            handleBroadcast
        );


        return () => {
            unsubscribe();
        };

    }, [roomId, joined]);

    return {
        systemMessages
    }
}

export default useRealtime
