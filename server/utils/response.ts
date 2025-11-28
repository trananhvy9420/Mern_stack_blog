export function grpcSuccessResponse<T>(data: T, message = "Success"): any {
  return {
    success: true,
    message,
    data,
  };
}
