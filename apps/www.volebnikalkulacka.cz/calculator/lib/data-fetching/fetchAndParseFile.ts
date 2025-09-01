export async function fetchAndParseFile(endpoint: string, fileName: string, schema: Zod.Schema) {
  try {
    const res = await fetch(`${endpoint}/${fileName}.json`);
    if (res.status === 404) {
      throw new Error(`Error: ${fileName}.json file missing`);
    }
    if (res.status === 500) {
      throw new Error("Error on the server");
    }
    if (!res.ok) {
      throw new Error("Other error");
    }
    const data = await res.json();
    const parsedData = schema.safeParse(data);
    if (parsedData.success) {
      console.log(`Successfully parsed ${fileName}`);
      return parsedData.data;
    }
    if (!parsedData.success) {
      console.error(`Validation failed for ${fileName}:`, parsedData.error);
      console.log(parsedData.error);
      throw Error("Error", parsedData.error);
    }
  } catch (error) {
    console.error(`Error fetching or parsing ${fileName}:`, error);
    console.error("Error", error);
    throw error;
  }
}
