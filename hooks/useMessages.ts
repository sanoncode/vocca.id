import MessagesStore from '@/store/messageStore'
import React from 'react'
import { useShallow } from 'zustand/react/shallow'

const useMessages = ({roomId,joined,currentLang}) => {
      const { messages, setMessages, addUserTyping, removeUserTyping } = MessagesStore(useShallow((state) => ({
        messages: state.messages,
        userTyping: state.userTyping,
        addUserTyping: state.addUserTyping,
        removeUserTyping: state.removeUserTyping,
        setMessages: state.setMessages

    }))) 
    
    return (

  )
}

export default useMessages