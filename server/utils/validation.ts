export const extractMongooseValidationErrors = (
  error: any
): Record<string, string> => {
  const errors: Record<string, string> = {};
  for (const key in error.errors) {
    const originalMessage = error.errors[key].message;
    let vietnameseMessage = originalMessage;
    if (originalMessage && originalMessage.includes("is required")) {
      vietnameseMessage = `Trường [${key}] là bắt buộc và không được để trống.`;
    }
    errors[key] = vietnameseMessage;
  }
  return errors;
};
