/**
 * Reason phrases for the statuses this API returns. They are part of the wire
 * contract: the `error` field reads "404 NOT_FOUND", matching what the previous
 * JVM implementation produced.
 */
const REASON_PHRASES: Record<number, string> = {
  400: 'BAD_REQUEST',
  404: 'NOT_FOUND',
  500: 'INTERNAL_SERVER_ERROR',
}

export function statusLabel(status: number): string {
  return `${status} ${REASON_PHRASES[status] ?? 'ERROR'}`
}

/** An error carrying the HTTP status the client should see. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'HttpError'
  }

  static notFound(message: string): HttpError {
    return new HttpError(404, message)
  }

  static badRequest(message: string): HttpError {
    return new HttpError(400, message)
  }
}