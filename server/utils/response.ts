export function grpcSuccessResponse<T>(data: T, message = "Success"): any {
  return {
    success: true,
    message,
    data,
  };
}
export function grpcErrorResponse(message: string): any {
  return {
    success: false,
    message,
  };
}
