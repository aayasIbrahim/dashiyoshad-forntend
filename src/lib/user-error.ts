const technicalValidationMessage =
  /Invalid input:?|Too small:|Too big:|Invalid email address|Invalid UUID|Invalid option|Unrecognized key|expected .+ received .+/i;

export function getUserFriendlyErrorMessage(
  message: string | undefined,
  fallback = "Please try again.",
) {
  if (!message) return fallback;
  if (/expected number, received (?:string|NaN)/i.test(message)) {
    return "Enter a valid number for the price, stock, or quantity.";
  }
  if (technicalValidationMessage.test(message)) {
    return "Some information is invalid. Please review your entries and try again.";
  }
  return message;
}
