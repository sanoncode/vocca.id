
type systemMessageEvent = "INSERT" | "DELETE"

export type SystemMessage = {
    id: string;
    event: systemMessageEvent;
}