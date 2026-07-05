// Short, shareable, unambiguous room codes (no 0/O/1/I).
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const CODE_LEN = 4;

export function generateRoomCode(): string {
  const bytes = new Uint8Array(CODE_LEN);
  crypto.getRandomValues(bytes);
  let code = "";
  for (let i = 0; i < CODE_LEN; i++) {
    code += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return code;
}

export function normalizeRoomCode(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, CODE_LEN);
}

export function isValidRoomCode(code: string): boolean {
  return new RegExp(`^[${ALPHABET}]{${CODE_LEN}}$`).test(code);
}
