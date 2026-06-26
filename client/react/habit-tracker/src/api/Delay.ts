import { ApiError } from "./Errors";

const DEFAULT_DELAY_MS = 350;

/** Resolves with a value after a delay, mimicking a real network round trip. */
export function ok<T>(value: T, ms: number = DEFAULT_DELAY_MS): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

/** Rejects with an ApiError after a delay, mimicking a failed fetch response. */
export function fail(
  message: string,
  status = 400,
  ms: number = DEFAULT_DELAY_MS,
): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new ApiError(message, status)), ms);
  });
}
