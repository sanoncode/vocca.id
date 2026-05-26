export type Avatar = {
  id: string;
  name: string;
  avatar_url: string;
  lang_code: string;
};

export type Room = {
  id: string;
  name: string;
  created_at: string;
  created_by: string | null;
  member_count: number;
};

export type RoomMember = {
  id: string;
  room_id: string;
  user_id: string;
  language: string;
};

export type Message = {
  id: string;
  room_id: string;
  sender_id: string;
  text: string;
  original_lang: string;
  created_at: string;
  sender: Avatar;
  display_text: string;
};
