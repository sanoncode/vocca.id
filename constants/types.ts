
type Avatar = {
    id: string;
    name: string;
    avatar_url: string;
};

type Room = {
  created_at: string;
  created_by: string | null;
  id: string;
  member_count: number;
  name: string;
};

type RoomData = {
  roomTitle: string;
  avatars: Avatar[];
  joined: boolean;
  created_by: string | null;
  userId: string | null;
  currentUserLang: string | null
};

type Message = {
  id: string;
  room_id: string;
  sender_id: string;
  text: string;
  original_lang: string;
  created_at: string;
  sender: Avatar;
};

type GetMessagesResponse = {
  messages: Message[];
};

type ChatRoomContentProps = {
  messages: Message[]
  userId: string | null
}


type RoomList = {
  chats: Room[];
  groups: Room[];
  userId: string | null,
  userName: string | null
};


export type {
    Avatar,
    Room,
    RoomData,
    RoomList,
    Message,
    GetMessagesResponse,
    ChatRoomContentProps
}