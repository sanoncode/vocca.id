import Image from "next/image";
import ChatRoomInviteButton from "./chat-room-invite-button";
import DeleteButton from "../delete-chat-button";
import { getFlagEmoji } from "@/lib/utils";
import { ChatRoomHeaderProps } from "@/constants/types/props";
import ChatLeaveRoomButton from "./chat-leave-room";



const ChatRoomHeader = ({roomHost, roomId, roomTitle, avatars, userId, userName}: ChatRoomHeaderProps) => {

  
    const isRoomHost = (id: string | null) => id === roomHost

  return (
    <header className="p-4 flex items-center justify-between border-b bg-background text-foreground">
  {/* Left Section: Info Room & Members */}
  <div className="flex flex-col space-y-3">
    {/* Room Title */}
    <h1 className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
      {roomTitle}
    </h1>

    {/* Metadata: Host & Members Container */}
    <div className="flex flex-wrap items-center gap-6">
      {/* Host Section */}
      <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-200 dark:border-zinc-800">
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Host</span>
        <div className="flex -space-x-1.5">
          {avatars?.map((avatar) => (
            isRoomHost(avatar.id) && (
              <div
                key={avatar.id}
                className="relative w-7 h-7 rounded-full border-2 border-background shadow-sm group"
              >
                {/* Avatar Image / Placeholder */}
                {avatar.avatar_url ? (
                  <Image
                    src={avatar.avatar_url}
                    alt={avatar.name}
                    width={28}
                    height={28}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-zinc-700 flex items-center justify-center text-[10px] font-bold text-white">
                    {avatar.name?.charAt(0).toUpperCase()}
                  </div>
                )
                }

                {/* Bendera Negara (Language Badge) di Pojok Kanan Atas */}
                {avatar.lang_code && (
                  <span className="absolute -top-1 -right-1 text-xs bg-background rounded-full shadow-sm px-0.5 border border-zinc-200 dark:border-zinc-800 pointer-events-none select-none">
                    {getFlagEmoji(avatar.lang_code)}
                  </span>
                )}
              </div>
            )
          ))}
        </div>
      </div>

      {/* Members Section */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Members</span>
        <div className="flex -space-x-2 hover:space-x-1 transition-all duration-300 ease-in-out">
          {avatars?.map((avatar, index) => (
            <div
              key={avatar.id}
              className="relative w-8 h-8 rounded-full border-2 border-background shadow-md group transition-transform duration-200 hover:-translate-y-1 hover:z-10"
              style={{ zIndex: avatars.length - index }}
            >
              {avatar.avatar_url ? (
                <Image
                  src={avatar.avatar_url}
                  alt={avatar.name}
                  width={32}
                  height={32}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-zinc-800 flex items-center justify-center text-xs font-semibold text-zinc-300">
                  {avatar.name?.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Bendera Negara (Language Badge) di Pojok Kanan Bawah */}
              {avatar.lang_code && (
                <span className="absolute -bottom-1 -right-1 text-[11px] bg-background rounded-full shadow-sm px-0.5 border border-zinc-100 dark:border-zinc-800 pointer-events-none select-none">
                  {getFlagEmoji(avatar.lang_code)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>

  {/* Right Section: Action Buttons */}
  {isRoomHost(userId) ? ( <div className="flex items-center gap-2">
    <ChatRoomInviteButton />
    <DeleteButton roomId={roomId} />
  </div>) : <ChatLeaveRoomButton roomId={roomId} userId={userId} userName={userName} />}

</header>
  );
};

export default ChatRoomHeader;

