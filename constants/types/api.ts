import { Avatar, CurrentUser, Message, Room } from "./entities";

export type GetMessagesResponse = {
  messages: Message[];
};

export type RoomListResponse = {
  rooms: Room[];
  userId: string | null;
  userName: string | null;
};

export type invitedRoom = {
    id : string ,
    name: string,
    created_by:string,
    created_at:string
  }

export type InvitedRoomListResponse = {
  invitedRooms: invitedRoom [];
};

 
export type RoomDataResponse = {
     roomTitle: string;
      roomHost: string;
      roomNotFound: boolean;
      avatars: Avatar[];
      joined: boolean;
      created_by: string | null;
      currentUser: CurrentUser | null
      currentUserLang: string | null;
}