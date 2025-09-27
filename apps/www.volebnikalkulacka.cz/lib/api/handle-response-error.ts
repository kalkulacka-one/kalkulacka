export async function handleResponseError(response: Response, operation: string): Promise<never> {
  let message = `${operation}: HTTP ${response.status}`;

  const clone = response.clone();

  try {
    const errorData = await response.json();
    message = `${operation}: ${errorData.title || errorData.type || errorData.detail || errorData.message || JSON.stringify(errorData)}`;
  } catch {
    try {
      const text = await clone.text();
      if (text) message = `${operation}: ${text}`;
    } catch {}
  }

  throw new Error(message);
}
