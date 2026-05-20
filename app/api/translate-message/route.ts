import {
  getFilterLang,
  getMembers,
  getMessage,
  getTranslated,
  getUnTranslatedMessages,
} from "@/services/server/translate-services";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("=== API HIT ===");
    console.log("Payload yang masuk:", JSON.stringify(body, null, 2));
    const { messageId, roomId, catchUpLang } = body;

    console.log(catchUpLang, roomId, messageId);

    if (roomId && catchUpLang) {
      console.log(`[CATCH-UP] Memproses room: ${roomId} ke bahasa: ${catchUpLang}`);
      const { messages, messagesError } = await getUnTranslatedMessages(
        roomId,
        catchUpLang,
      );

      if (messagesError) throw messagesError;
      if (!messages || messages.length === 0) {
        return NextResponse.json({ success: true, translated: 0 });
      }


      const promises = messages.map((message) =>
        getTranslated({
          text: message.text,
          originalLang: message.original_lang,
          targetLang: catchUpLang,
          messageId: message.id,
        }),
      );

      await Promise.all(promises);

      return NextResponse.json({ success: true, mode: "catchup", translated: promises.length })
    }

    if (messageId) {
      console.log(`[NORMAL CHAT] Memproses pesan tunggal ID: ${messageId}`);
      const { message, messageError } = await getMessage(messageId);

      if (messageError || !message) {
        return NextResponse.json(
          { error: "Message not found" },
          { status: 404 },
        );
      }

      const { members, membersError } = await getMembers(message?.room_id);

            if (membersError) {
              throw membersError;
            }

            if (!members) {
              return NextResponse.json({
                success: true,
                translated: 0,
              });
            }

      const uniqueLangs = await getFilterLang(members, message);

      const promises = uniqueLangs.map((language) =>
        getTranslated({
          text: message.text,
          originalLang: message.original_lang,
          targetLang: language,
          messageId: message.id,
        }),
      );
      await Promise.all(promises);

      return NextResponse.json({ success: true, mode: "normal", translated: uniqueLangs.length })
    }

   return NextResponse.json({ error: "Invalid payload structure" }, { status: 400 });
  } catch (error) {
    console.error("Translation error:", error);

    return NextResponse.json(
      {
        error: "Failed to translate message",
      },
      {
        status: 500,
      },
    );
  }
}
