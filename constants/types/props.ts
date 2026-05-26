import { Avatar, Message, Room } from "./entities";

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
  userId: string | null;
};

export type ChatRoomContentProps = {
  messages: Message[];
  userId: string | null;
};

export type ChatSideBarProps = {
  rooms: Room[];
};

export type DeleteButtonProps = {
    roomId: string
}

export type SelectLangButtonprops = {
    value: string,
    onChange: (value: string) => void
}
