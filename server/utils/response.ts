export function successResponse<T>(data: T, message = "Success"): any {
  return {
    success: true,
    message,
    data,
  };
}
export function errorResponse(message: string): any {
  return {
    success: false,
    message,
  };
}
export function validationErrorResponse(
  message: string,
  errors: Record<string, string>
): any {
  return {
    success: false,
    message,
    errors,
  };
}

