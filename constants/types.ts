
type Avatar = {
    id: string;
    name: string;
    avatar_url: string;
};

type RoomData = {
  roomTitle: string;
  avatars: Avatar[];
  joined: boolean;
  created_by: string | null;
  userId: string | null;
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


export type {
    Avatar,
    RoomData,
    Message,
    GetMessagesResponse,
    ChatRoomContentProps
}