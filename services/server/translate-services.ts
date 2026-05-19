import "server-only";
import { filterMember, filterMessage } from "@/constants/types";
import { createClient } from "@/lib/supabase/server";
import { translateText } from "./openai-services";


export async function translateMessage(messageId: string): Promise<void> {
  const response = await fetch("/api/translate-message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messageId,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.error || "Failed to translate message");
  }
}

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

export function getFilterLang(members: filterMember[], message: filterMessage) {
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

  const result = await translateText(
        text,
        originalLang,
        targetLang
      )

      const { error: translateError } = await supabase
      .from('message_translation')
      .upsert({
        message_id: messageId,
        target_lang: targetLang,
        translated_text: result
      },{
        onConflict: 'message_id,target_lang'
      }
    )

    return {
        result,
        translateError
        
    }


}
