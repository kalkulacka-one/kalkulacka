export async function verifySession(): Promise<boolean> {
  const response = await fetch("/api/sessions", {
    credentials: "include",
  });

  return response.ok;
}
