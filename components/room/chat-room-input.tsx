import { broadcastUser } from '@/services/supabase/client/chat-room-realtime';
import { sendMessage } from '@/services/supabase/client/chat-room-services';
import UserStore from '@/store/userStore';
import  { useRef, useState } from 'react'

type roomId = {
    roomId: string
}

const ChatRoomInput = ({roomId }: roomId) => {

    const typingTimeout = useRef<NodeJS.Timeout | null>(null)
    const currentUser = UserStore((state)=>state.currentUser)
    const [input, setInput] = useState<string>('')

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        setInput(value);

        broadcastUser(roomId, currentUser.name, "TYPING");

        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }

        typingTimeout.current = setTimeout(() => {
            broadcastUser(roomId, currentUser.name, "IDLE");
        }, 2000);
    };

    const handleSend = async () => {
        const inputTrimmed = input.trim();

        if (!inputTrimmed) return;
        setInput("");

        const newMessage = {
            roomId: roomId,
            senderId: currentUser.id,
            text: inputTrimmed,
            originalLang: currentUser.lang,
        };

        await sendMessage(newMessage);
    };

    return (
        <div className="p-4">
            <div className="flex items-center gap-3 rounded-2xl border px-4 py-2 focus-within:ring-1 focus-within:ring-zinc-700 transition">
                <input
                    className="flex-1 bg-transparent text-sm outline-none py-2"
                    placeholder="Enter message..."
                    value={input}
                    onChange={(e) => handleTyping(e)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend();
                    }}
                />

                {/* Action Icons */}
                <div className="flex items-center gap-3 text-zinc-500 border-l border-zinc-700 pl-3">
                    {/* <button className="hover:text-zinc-300">😊</button>
              <button className="hover:text-zinc-300">📎</button>
              <button className="hover:text-zinc-300">🎙️</button> */}
                    <button
                        onClick={() => handleSend()}
                        className="bg-zinc-100 text-black px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-white transition"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChatRoomInput
