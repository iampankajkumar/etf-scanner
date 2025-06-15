export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public severity: 'error' | 'warning' | 'info' = 'error',
    public metadata?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
  }

  public static isAppError(error: unknown): error is AppError {
    return error instanceof AppError;
  }
}
