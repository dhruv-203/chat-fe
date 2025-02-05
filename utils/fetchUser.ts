export default async function fetchUser() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/checkUser`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const resData = await res.json();
  return resData;
}
