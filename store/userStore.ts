import { create } from 'zustand'
import { CurrentUser } from '@/constants/types/entities'

type UserStore = {
    currentUser: CurrentUser | null
    setCurrentUser: (currentUser: CurrentUser) => void
}

const UserStore = create<UserStore>((set)=>({
    currentUser:{
        id: null,
        name: null,
        email: null,
        lang: null
    },
    setCurrentUser: (currentUser) => set({currentUser})

}))

export default UserStore