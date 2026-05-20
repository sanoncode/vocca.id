/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { filterMember, filterMessage } from "@/constants/types";
import { createClient } from "@/lib/supabase/server";
import { translateText } from "./openai-services";

export async function getMessage(messageId: string) {
  const supabase = await createClient();
  const { data: message, error: messageError } = await supabase
    .from("messages")
    .select("id,room_id,sender_id,text,original_lang")
    .eq("id", messageId)
    .single();

  return {
    message,
    messageError,
  };
}

export async function getUnTranslatedMessages(
  roomId: string,
  targetLang: string,
) {
  const supabase = await createClient();
  const { data: messages, error: messagesError } = await supabase
    .from("messages")
    .select("id,text,original_lang,message_translations!left(id)")
    .eq("id", roomId)
    .neq("original_lang", targetLang)
    .eq("message_translations.target_lang", targetLang);

    const filteredMessages = messages?.map((message) => { return message.message_translations.length === 0}).map((msg: any) =>({
      id: msg.id,
    text: msg.text,
    original_lang: msg.original_lang
    })) || []



  return {
    messages: filteredMessages,
    messagesError,
  };
}

export async function getMembers(roomId: string) {
  const supabase = await createClient();
  const { data: members, error: membersError } = await supabase
    .from("room_members")
    .select("user_id,language")
    .eq("room_id", roomId);

  return {
    members,
    membersError,
  };
}

export async function getFilterLang(
  members: filterMember[],
  message: filterMessage,
) {
  const filterLangs = members.filter(
    (member) =>
      member.user_id !== message.sender_id &&
      member.language &&
      member.language !== message.original_lang,
  );

  const uniqueLangs = [
    ...new Set(filterLangs.map((filterlang) => filterlang.language)),
  ];

  return uniqueLangs;
}

export async function getTranslated(params: {
  text: string;
  originalLang: string;
  targetLang: string;
  messageId: string;
}) {
  const supabase = await createClient();
  const { text, originalLang, targetLang, messageId } = params;

  const result = await translateText(text, originalLang, targetLang);

  const { error: translateError } = await supabase
    .from("message_translations")
    .upsert(
      {
        message_id: messageId,
        target_lang: targetLang,
        translated_text: result,
      },
      {
        onConflict: "message_id,target_lang",
      },
    );

  return {
    result,
    translateError,
  };
}
