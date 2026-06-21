import { Message } from '@/constants/types/entities'
import { create } from 'zustand'

type MessagesStore = {
    messages: Message[]
    userTyping: string[]
    setMessages: (messages: Message[]) => void
    addUserTyping: (name: string) => void
    removeUserTyping: (name: string) => void
}

const MessagesStore = create<MessagesStore>((set) => ({
    messages: [],
    userTyping: [],
    setMessages: (messages) => set({messages}),
    addUserTyping: (name) => set((state)=>({
        userTyping: state.userTyping.includes(name) ? state.userTyping : [...state.userTyping, name]
    })),
    removeUserTyping: (name) => set((state)=>({
        userTyping: state.userTyping.filter((user)=>user !== name)
    }))
 
}))

export default MessagesStore