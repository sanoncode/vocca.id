import { Avatar, CurrentUser, Message } from "@/constants/types/entities";
import { SystemMessage } from "@/constants/types/system-messages";
import {
    acceptInvitations,
    getMessages,
    getRoomData,
    sendMessage,
} from "@/services/supabase/client/chat-room-services";

import { useShallow } from 'zustand/react/shallow';
import { fetchCatchUpTranslateAPI } from "@/services/api/translate";
import {
    broadcastUser,
    subscribeToBroadcastUser,
    subscribeToMessages,
    subscribeToMessageTranslations,
    subscribeToRoomMember,
} from "@/services/supabase/client/chat-room-realtime";

import { useEffect, useRef, useState } from "react";
import ChatStore from "@/store/messageStore";
import UserStore from "@/store/userStore";


const useChatRoom = (roomId: string) => {


    const { messages, setMessages, addUserTyping, removeUserTyping } = ChatStore(useShallow((state) => ({
        messages: state.messages,
        userTyping: state.userTyping,
        addUserTyping: state.addUserTyping,
        removeUserTyping: state.removeUserTyping,
        setMessages: state.setMessages

    }))) 
      const { currentUser, setCurrentUser } = UserStore(useShallow((state) => ({
        currentUser: state.currentUser,
        setCurrentUser: state.setCurrentUser
    }))) 

    const [lang, setLang] = useState("");
    const [systemMessages, setSystemMessages] = useState<SystemMessage[]>([]);
    const [joinLoading, setJoinLoading] = useState(false);
    const [joined, setJoined] = useState<boolean | null>(null);
    const [avatars, setAvatars] = useState<Avatar[]>([]);
    const [createdBy, setCreatedBy] = useState<string | null>("");
    const [roomTitle, setRoomTitle] = useState("");
    const [roomHost, setRoomHost] = useState<string | null>("");
    const [roomNotFound, setRoomNotFound] = useState<boolean>(false);
    const [invitationId, setInvitationId] = useState<string | null | undefined>(null)
 

    const initializeRoom = async () => {
        const {
            roomTitle,
            roomHost,
            roomNotFound,
            avatars,
            joined,
            created_by,
            currentUser,
            invitationId
        } = await getRoomData(roomId);

        setCurrentUser(currentUser!);
        setAvatars(avatars ?? []);
        setRoomTitle(roomTitle);
        setRoomHost(roomHost);
        setRoomNotFound(roomNotFound);
        setCreatedBy(created_by);
        setInvitationId(invitationId)

        setJoined(!!joined);
        if (joined) {
            await fetchMessages(currentUser?.lang!);
        }
    };

    const fetchMessages = async (currentLang: string | null) => {
        if (!roomId) return;

        const { messages } = await getMessages(roomId, currentLang);

        setMessages(messages || []);
    };

  
    const handleJoin = async () => {
        if (joinLoading) return;
        if (!lang || !currentUser?.id) return;

        setJoinLoading(true)
        const accept = {
            invitationId: invitationId,
            lang: lang
        }
        try {
            await acceptInvitations(accept);

            await broadcastUser(roomId, currentUser?.name, "JOIN");

            setJoined(true);

            await fetchCatchUpTranslateAPI(roomId, lang);

            await initializeRoom();
        } catch (err) {
            console.error("JOIN ERROR", err);
        } finally {
            setJoinLoading(false);
        }
    };

    const handleBroadcast = (payload: SystemMessage) => {
        console.log(payload)
        if (payload.userEvent === "INVITE") {
            setSystemMessages((prev) => [...prev, payload]);
        }

        if (payload.userEvent === "JOIN" || payload.userEvent === "LEAVE") {
            setSystemMessages((prev) => [...prev, payload]);
        }
        if (payload.userEvent === "TYPING") {
            addUserTyping(payload.userName)
        }
        if (payload.userEvent === "IDLE") {
           removeUserTyping(payload.userName)
        }

        setTimeout(() => {
            setSystemMessages([]);
        }, 2000);
    };


    useEffect(() => {
        initializeRoom();
    }, [roomId]);

    useEffect(() => {
        if (!roomId || !joined) return;

        const unsubscribeTranslation = subscribeToMessageTranslations(
            roomId,
            () => {
                fetchMessages(currentUser.lang);
            },
        );

        const unsubcribemessage = subscribeToMessages(roomId, () => {
            fetchMessages(currentUser.lang);
        });

        const unsubscribeRoomMember = subscribeToRoomMember(roomId, async () => {
            const { avatars } = await getRoomData(roomId);
            setAvatars(avatars ?? []);
        });

        const unsubscribeToBroadcastUser = subscribeToBroadcastUser(
            roomId,
            (payload) => {
                handleBroadcast(payload);
            },
        );

        return () => {
            unsubscribeTranslation();
            unsubcribemessage();
            unsubscribeRoomMember();
            unsubscribeToBroadcastUser();
        };
    }, [roomId, joined, currentUser.lang]);

    return {
        avatars,
        messages,
        currentUser,
        joined,
        joinLoading,
        roomNotFound,
        roomHost,
        roomTitle,
        systemMessages,
        createdBy,
        lang,
        setLang,
        handleJoin,
    }
}

export default useChatRoom
