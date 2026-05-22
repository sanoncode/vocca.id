type Avatar = {
  id: string;
  name: string;
  avatar_url: string;
  lang_code:string;
};

type Room = {
  created_at: string;
  created_by: string | null;
  id: string;
  member_count: number;
  name: string;
};
type RoomMembers = {
    id: string,
    room_id: string,
    user_id: string,
    language: string
}

type RoomData = {
  roomTitle: string;
  roomHost: string;
  roomNotFound: boolean;
  avatars: Avatar[];
  joined: boolean;
  created_by: string | null;
  userId: string | null;
  currentUserLang: string | null;
};

type Message = {
  id: string;
  room_id: string;
  sender_id: string;
  text: string;
  original_lang: string;
  created_at: string;
  sender: Avatar;
  display_text: string
};



type GetMessagesResponse = {
  messages: Message[];
};

type ChatRoomContentProps = {
  messages: Message[];
  userId: string | null;
};

type RoomList = {
  chats: Room[];
  groups: Room[];
  userId: string | null;
  userName: string | null;
};

type filterMember = Pick<RoomMembers, "user_id" | 'language'> 

type filterMessage = Pick<
  Message,
  "id" | "room_id" | "sender_id" | "text" | "original_lang"
>;

export type {
  Avatar,
  Room,
  RoomData,
  RoomList,
  Message,
  GetMessagesResponse,
  ChatRoomContentProps,
  filterMessage,
  filterMember
};
