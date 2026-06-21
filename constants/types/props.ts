import { invitedRoom } from "./api";
import { Avatar, CurrentUser, Message, Room } from "./entities";
import { SystemMessage } from "./system-messages";

export type ChatJoinRoomOverlayProps = {
  handleJoin: () => void;
};

type RoomData = {
    avatars: Avatar[]
    title: string | null,
    host: string | null,
    createdBy: string | null,
    invitationId: string | null,
    notFound: boolean,
}

export type ChatRoomHeaderProps = {
  roomId: string ;
  handleLeave: () => void;
};

export type ChatRoomContentProps = {
  messages: Message[];
  currentUser: CurrentUser | null;
  userTyping: string[] 
};

export type ChatSideBarProps = {
  rooms: Room[];
  userId?: string | null
  icon: string
};

export type inviteSideBarProps = {
  rooms: invitedRoom[];
  userId?: string | null
  icon: string
};

export type ChatBubbleProps ={
  messageId: string,
  messageAvatarUrl: string,
  messageSenderName: string | null,
  messageText: string,
  messageDisplayText: string,
  messageCreatedAt: string,
  isMe: boolean
}

export type ChatRoomInviteButtonProps ={
  userId: string | null | undefined
  roomId: string,
}

export type SideBarItemProps = {
  label: string,
  active: boolean,
  href: string,
  createdBy: string | null,
  userId?: string | null 
};

export type SideBarSectionProps = {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  length: number;
  icon: string;
};

export type DeleteButtonProps = {
    roomId: string;
}

export type LeaveButtonProps = {
    roomId: string;
    handleLeave: () => void
}

export type SelectLangButtonprops = {
    value?: string,
    onChange: (value: string) => void
}

export type SystemMessageProps = {
  systemMessages: SystemMessage[] | null
}


