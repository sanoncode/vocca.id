import { Message, RoomMember } from "./entities";

export type FilterMember = Pick<
  RoomMember,
  "user_id" | "language"
>;

export type FilterMessage = Pick<
  Message,
  "id" |
  "room_id" |
  "sender_id" |
  "text" |
  "original_lang"
>;