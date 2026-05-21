export async function fetchTranslateAPI(messageId: string): Promise<void> {
  const response = await fetch("/api/translate-message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messageId
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);

    throw new Error(error?.error || "Failed to translate message");
  }
}

export async function fetchCatchUpTranslateAPI(roomId: string, catchUpLang: string): Promise<void> {
  
 const response = await fetch("/api/translate-message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roomId,
      catchUpLang
    }),
  });

    if (!response.ok) {
      const error = await response.json().catch(() => null);

      throw new Error(error?.error || "Failed to CatchUp message");
    }
}
