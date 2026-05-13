import { Button } from "@/components/ui/button";
import { UserRoundPlus } from "lucide-react";
import Image from "next/image";
import React from "react";

type member = {
    id:string,
    name: string
    avatar_url?: string,
}


type props = {
    roomTitle: string,
    members?:member[],
}

const ChatRoomHeader = ({roomTitle, members}: props) => {
  return (
    <header className="p-4 flex items-center justify-between border-b">
      {/* Left Section */}
      <div>
        {/* Room Title */}
        <h1 className="font-semibold text-xl">{roomTitle}</h1>

        {/* member Avatars */}
        <div className="flex items-center mt-2">
          {members?.map((member, index) => (
            <div
              key={member.id}
              className={`w-8 h-8 rounded-full overflow-hidden border-2 border-background ${
                index !== 0 ? "-ml-2" : ""
              }`}
            >
              {member.avatar_url ? (
                <Image
                  src={member.avatar_url}
                  alt={member.name}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-zinc-700 flex items-center justify-center text-xs font-semibold text-white">
                  {member.name?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Right Section */}
      <Button variant="outline">
        <UserRoundPlus className="w-4 h-4 mr-2" />
        Invite
      </Button>
    </header>
  );
};

export default ChatRoomHeader;
