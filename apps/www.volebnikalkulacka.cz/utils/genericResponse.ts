export type BasicError = {
  type: string;
  code: string;
  message: string;
  payload?: unknown;
};

export type GenericResponse<T> = ResultSuccess<T> | ResultError;
export type GenericResult<T> = ResultSuccess<T> | ResultError;

export type ResultSuccess<T> = { success: true; data: T };
export type ResultError = { success: false; error: BasicError };

export function resultSuccess<T>(data: T): ResultSuccess<T> {
  return { success: true, data };
}

export function resultBasicError(error: BasicError): ResultError {
  return { success: false, error };
}

export type EmptyObject = { [k: string]: never };
