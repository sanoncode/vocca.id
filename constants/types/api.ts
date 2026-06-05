import { Avatar, Message, Room } from "./entities";

export type GetMessagesResponse = {
  messages: Message[];
};

export type RoomListResponse = {
  rooms: Room[];
  userId: string | null;
  userName: string | null;

};

export type RoomDataResponse = {
     roomTitle: string;
      roomHost: string;
      roomNotFound: boolean;
      avatars: Avatar[];
      joined: boolean;
      created_by: string | null;
      currentUser: Pick<Avatar,  'avatar_url' | 'id' | 'name'> | null
      currentUserLang: string | null;
}