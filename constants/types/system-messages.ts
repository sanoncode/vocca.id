
export type UserEvent = "JOIN" | "LEAVE" | "TYPING" | "IDLE"

export type SystemMessage = {
    
    userEvent: UserEvent;
    userName: string
}
