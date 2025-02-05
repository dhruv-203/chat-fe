export async function sendMessage(message: string, receiverId: number) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/chat/sendMessage`,
    {
      method: "POST",
      body: JSON.stringify({
        message: message,
        receiverId: receiverId,
      }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const resData = await res.json();
  return resData;
}