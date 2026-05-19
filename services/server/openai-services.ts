import "server-only";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function translateText(
  text: string,
  sourceLang: string,
  targetLang: string,
): Promise<string> {
  const prompt = `Your tasks:
    1. Understand informal language, slang, abbreviations, and typos.
    2. Correct obvious spelling mistakes before translating.
    3. Preserve the original tone and intent.
    4. Translate naturally, as if written by a native speaker.
    5. Return only the translated text.
    Do not add explanations, notes, or quotation marks.

    Source language: ${sourceLang}
    Target language: ${targetLang}

    Text: ${text}`;
  const response = await client.responses.create({
    model: "gpt-4o-mini",
    input: prompt,
  });
  return response.output_text.trim();
}
