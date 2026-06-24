import {
  getFilterLang,
  getMembers,
  getMessage,
  getTranslated,
  getUnTranslatedMessages,
} from "@/services/supabase/server/translate-services";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("=== API HIT ===");
    console.log("Payload :", JSON.stringify(body, null, 2));
    const { messageId, roomId, catchUpLang } = body;

    if (roomId && catchUpLang) {
      console.log(
        `[CATCH-UP] Processing room: ${roomId} To Lang: ${catchUpLang}`,
      );
      const { messages, messagesError } = await getUnTranslatedMessages(
        roomId,
        catchUpLang,
      );

      if (messagesError) throw messagesError;
      if (!messages || messages.length === 0) {
        return NextResponse.json({ success: true, translated: 0 });
      }

      const BATCH_SIZE = 5;

      for (let i = 0; i < messages.length; i += BATCH_SIZE) {
        const batch = messages.slice(i, i + BATCH_SIZE);
        const results = await Promise.allSettled(
          batch.map((message) =>
            getTranslated({
              text: message.text,
              originalLang: message.original_lang,
              targetLang: catchUpLang,
              messageId: message.id,
            }),
          ),
        );

        results.forEach((r, idx) => {
          if (r.status === "rejected") {
            console.error(
              `Failed to translate message ${batch[idx].id}:`,
              r.reason,
            );
            // optional: push ke retry queue / log ke monitoring
          }
        });
      }

      return NextResponse.json({
        success: true,
        mode: "catchup",
      });
    }

    if (messageId) {
      console.log(`[NORMAL CHAT] Processing room: ${messageId}`);
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

      return NextResponse.json({
        success: true,
        mode: "normal",
        translated: uniqueLangs.length,
      });
    }

    return NextResponse.json(
      { error: "Invalid payload structure" },
      { status: 400 },
    );
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
