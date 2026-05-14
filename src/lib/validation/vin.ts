export const VIN_CODE_LENGTH = 17;
export const VIN_ALLOWED_CHARACTERS = "A-HJ-NPR-Z0-9";
export const VIN_CODE_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;
export const VIN_INPUT_PATTERN = "[A-HJ-NPR-Z0-9]{17}";

export function canonicalizeVin(value: string) {
  return value.trim().toUpperCase();
}

export function sanitizeVinInput(value: string) {
  return value
    .toUpperCase()
    .replace(/[^A-HJ-NPR-Z0-9]/g, "")
    .slice(0, VIN_CODE_LENGTH);
}

export function isValidVin(value: string) {
  return VIN_CODE_REGEX.test(canonicalizeVin(value));
}
