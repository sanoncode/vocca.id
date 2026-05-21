import Image from "next/image";
import React from "react";
import ChatRoomInviteButton from "./chat-room-invite-button";

type avatar = {
    id:string,
    name: string
    avatar_url?: string,
}


type props = {
    roomTitle: string,
    avatars?:avatar[],
}

const ChatRoomHeader = ({roomTitle, avatars}: props) => {
  return (
    <header className="p-4 flex items-center justify-between border-b">
      {/* Left Section */}
      <div>
        {/* Room Title */}
        <h1 className="font-semibold text-xl">{roomTitle}</h1>

        {/* avatar Avatars */}
        <div className="flex items-center mt-2">
          {avatars?.map((avatar, index) => (
            <div
              key={avatar.id}
              className={`w-8 h-8 rounded-full overflow-hidden border-2 border-background ${
                index !== 0 ? "-ml-2" : ""
              }`}
            >
              {avatar.avatar_url ? (
                <Image
                  src={avatar.avatar_url}
                  alt={avatar.name}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-zinc-700 flex items-center justify-center text-xs font-semibold text-white">
                  {avatar.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Section */}
      <ChatRoomInviteButton />
    <ChatRoomInviteButton />
    </header>
  );
};

export default ChatRoomHeader;
