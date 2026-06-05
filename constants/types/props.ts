import { Avatar, Message, Room } from "./entities";
import { SystemMessage } from "./system-messages";

export type JoinRoomOverlayProps = {
  roomTitle: string;
  creatorName: string | null;
  language: string;
  setLanguage: (value: string) => void;
  handleJoin: () => void;
  loading?: boolean;
};

export type ChatRoomHeaderProps = {
  roomHost: string | null;
  roomId: string;
  roomTitle: string;
  avatars?: Avatar[];
  currentUser: Pick<Avatar, 'id' | 'name' | 'avatar_url'> | null
};

export type ChatRoomContentProps = {
  messages: Message[];
  currentUser: Pick<Avatar, 'id' | 'name' | 'avatar_url'> | null
  userTyping: string[] 
};

export type ChatSideBarProps = {
  rooms: Room[];
  userId?: string | null
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
};

export type DeleteButtonProps = {
    roomId: string;
}

export type LeaveButtonProps = {
    roomId: string;
    currentUser: Pick<Avatar, 'id' | 'name' | 'avatar_url'> | null
}

export type SelectLangButtonprops = {
    value: string,
    onChange: (value: string) => void
}

export type SystemMessageProps = {
  systemMessages: SystemMessage[] | null
}


