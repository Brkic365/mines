/**
 * Hashes a string using SHA-256 and returns a hexadecimal string.
 * 
 * @param input The input string to hash.
 * @returns A promise that resolves to a hex-encoded SHA-256 hash.
 */
export async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}
