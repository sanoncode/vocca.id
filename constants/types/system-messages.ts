
export type UserEvent = "JOIN" | "LEAVE" | "INVITE" | "TYPING" | "IDLE"

export type SystemMessage = {
    
    userEvent: UserEvent;
    userName: string
}
