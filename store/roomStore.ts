import { Avatar } from "@/constants/types/entities"
import { create } from "zustand"

type RoomData = {
    avatars: Avatar[]
    title: string | null,
    host: string | null,
    createdBy: string | null,
    invitationId: string | null,
    notFound: boolean,
}

type RoomStore = {
    roomData: RoomData
    joined: boolean | null
    joinedLoading?: boolean,
    lang?: string,
    setRoomData: (roomData: RoomData) => void
    setAvatars: (avatar: Avatar[]) => void
    setJoined: (joined: boolean | null) => void
    setJoinedLoading: (joinedLoading: boolean) => void
    setLang: (lang: string) => void
}

const RoomStore = create<RoomStore>((set) => ({
    roomData: {
        avatars: [],
        title: null,
        host: null,
        createdBy: null,
        invitationId: null,
        notFound: false,
    },
    joined: null,
    joinedLoading: undefined,
    lang: undefined,
    setRoomData: (roomData) => set({ roomData }),
    setAvatars: (avatars) => set((state) => ({
        roomData: { ...state.roomData, avatars }
    })),
    setJoined: (joined) => set({ joined }),
    setJoinedLoading: (joinedLoading) => set({ joinedLoading }),
    setLang: (lang) => set({ lang })
}))

export default RoomStore