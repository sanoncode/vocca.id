import { subscribeToMessages, subscribeToMessageTranslations } from '@/services/supabase/client/chat-room-realtime'
import { getMessages } from '@/services/supabase/client/chat-room-services'
import MessagesStore from '@/store/messageStore'
import RoomStore from '@/store/roomStore'
import { useEffect } from 'react'

type UseMessageProps = {
    roomId: string,
    currentLang: string | null
}


const useMessages = ({ roomId, currentLang }: UseMessageProps) => {

    const setMessages = MessagesStore((state) => state.setMessages)
    const joined = RoomStore((state)=> state.joined)

    const fetchMessages = async (currentLang: string | null) => {
        if (!roomId) return;

        console.log("FETCH MESSAGE LANG:", currentLang);


        const { messages } = await getMessages(roomId, currentLang);

        setMessages(messages || []);
    };

    useEffect(() => {
        fetchMessages(currentLang)
    }, [roomId, joined, currentLang])

    useEffect(() => {
        if (!roomId || !joined) return;

        const unsubscribeTranslation = subscribeToMessageTranslations(
            roomId,
            () => {
                fetchMessages(currentLang);
            },
        );

        const unsubcribemessage = subscribeToMessages(roomId, () => {
            fetchMessages(currentLang);
        });


        return () => {
            unsubscribeTranslation();
            unsubcribemessage();
        };
    }, [roomId, joined, currentLang]);

    return
}

export default useMessages