import { NotFoundError } from "./not-found-error";

export async function ifFound<T>(loading: Promise<T>): Promise<T | undefined> {
  try {
    return await loading;
  } catch (error) {
    if (error instanceof NotFoundError) return undefined;
    throw error;
  }
}
