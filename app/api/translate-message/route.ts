import {
  getFilterLang,
  getMembers,
  getMessage,
  getTranslated,
} from "@/services/server/translate-services";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { messageId } = await request.json();

    if (!messageId) {
      return NextResponse.json({
        error: "messageId is required !",
        status: 400,
      });
    }

    const { message, messageError } = await getMessage(messageId);

    if (messageError || !message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
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

    const uniqueLangs = getFilterLang(members, message);

    for (const language of uniqueLangs) {
      const { result, translateError } = await getTranslated({
        text: message.text,
        originalLang: message.original_lang,
        targetLang: language,
        messageId: message.id,
      });

      if (translateError) {
        throw translateError;
      }
      console.log(result, 'result')
    
    }
        return NextResponse.json({
        success: true,
        translated: uniqueLangs.length,
        });
   
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
