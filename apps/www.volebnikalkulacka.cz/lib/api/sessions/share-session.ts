export async function shareSession(calculatorId: string): Promise<{ publicId: string }> {
  const response = await fetch(`/api/calculators/${calculatorId}/sessions:share`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw response;
  }

  const data = await response.json();
  return data;
}
