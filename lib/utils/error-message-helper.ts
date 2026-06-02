export function extractErrorMessage(error: unknown): string {
  if (!error) return 'An unknown error occurred';
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'An unknown error occurred';
}

export function extractErrorResponse(error: unknown): { code?: string; message?: string } | null {
  if (!error || typeof error !== 'object') return null;
  const e = error as Record<string, unknown>;
  if (e.response && typeof e.response === 'object') {
    const resp = e.response as Record<string, unknown>;
    return {
      code: resp.status ? String(resp.status) : undefined,
      message: typeof resp.data === 'object' && resp.data !== null
        ? String((resp.data as Record<string, unknown>).message ?? '')
        : undefined,
    };
  }
  return null;
}
