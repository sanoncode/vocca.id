import { Avatar, Message, Room } from "./entities";

export type GetMessagesResponse = {
  messages: Message[];
};

export type RoomListResponse = {
  chats: Room[];
  groups: Room[];
  userId: string | null;
  userName: string | null;

};

export type RoomDataResponse = {
     roomTitle: string ,
      roomHost: string,
      roomNotFound: boolean,
      avatars: Avatar[],
      joined: boolean,
      created_by: string | null,
      userId: string | null,
      currentUserLang: string | null,
}