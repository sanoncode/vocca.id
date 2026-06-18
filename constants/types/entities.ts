export type Avatar = {
  id: string | null;
  name: string | null;
  avatar_url: string ;
  lang_code: string;
};

export type CurrentUser = {
   id: string | null;
   name: string | null;
   email: string | null;
   lang: string | null;
}

export type Room = {
  id: string;
  name: string;
  created_at: string;
  created_by: string | null;
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
