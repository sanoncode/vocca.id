import { SystemMessageProps } from "@/constants/types/props";


const ChatRoomSystemMessages = ({ systemMessages }: SystemMessageProps) => {
  return (
    <>
      {systemMessages?.map((message, index) => {
        switch (message.userEvent) {
          case "JOIN":
            return (
              <div key={index} className="flex justify-center py-3 bg">
                <div className="flex items-center gap-2 rounded-full border border-zinc-800 px-4 py-2">
                  <span>👋</span>
                  <span className="text-xs text-muted-foreground">
                    {message.userName} joined the room
                  </span>
                </div>
              </div>
            );

          case "LEAVE":
            return (
              <div key={index} className="flex justify-center py-3">
                <div className="flex items-center gap-2 rounded-full border border-zinc-800 px-4 py-2">
                  <span>🚪</span>
                  <span className="text-xs text-muted-foreground">
                    {message.userName} left the room
                  </span>
                </div>
              </div>
            );

          default:
            return null;
        }
      })}
    </>
  );
};
export default ChatRoomSystemMessages;
