export async function fetchChatData(receiverId: number, senderId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/getAllMessages`,
    {
      method: "POST",
      body: JSON.stringify({
        receiverId: receiverId,
      }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const chatData = await res.json();
  return chatData;
}
