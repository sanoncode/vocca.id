'use client'

import { useState } from "react";

type message = {
    sender: 'me' | 'him',
    message: string
}

const ChatRoom = () => {
    const [message, setMessage] = useState<message | null>(null);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;
        setMessage((prev)=>({
            ...prev,
            sender: 'me',
            message: input
        }));
    };
    return (
        <div>
            {/* HEADER */}
            <div className="p-4 border-b font-semibold">
                Room
            </div>

            {/* CHAT AREA */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                <div className="justify-end">
                    <div className="px-4 py-2 rounded-2xl max-w-xs text-sm bg-black text-white ">
                       {message?.message}
                    </div>
                </div>
            </div>

            {/* INPUT */}
            <div className="p-3 border-t flex gap-2">
                <input
                    className="flex-1 border rounded-xl px-3 py-2 outline-none"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend();
                    }}
                />

                <button
                    onClick={handleSend}
                    className="px-4 rounded-xl"
                >
                    Send
                </button>
            </div>
           
        </div>
    );
}
export default ChatRoom