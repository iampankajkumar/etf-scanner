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

export const handleError = (error: unknown): AppError => {
  if (AppError.isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR');
  }

  return new AppError(
    'An unexpected error occurred',
    'UNKNOWN_ERROR',
    'error',
    { originalError: error }
  );
};

export const isNetworkError = (error: unknown): boolean => {
  return error instanceof Error && 
    (error.name === 'TypeError' && error.message === 'Failed to fetch' ||
     error.name === 'AbortError');
};
