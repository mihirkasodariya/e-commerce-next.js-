import crypto from "crypto";

class HmacHasher {
  /**
   * Generates an HMAC hash for the given input using the provided key or APP_SECRET.
   * @param {string} input - The input string to hash.
   * @param {string} [key] - The secret key used for hashing (optional).
   * @returns {string} - The generated HMAC hash.
   */
  public static createHmacHash(input: string, key?: string): string {
    const secretKey = key || process.env.APP_SECRET || "";
    if (!secretKey) {
      throw new Error(
        "A valid key must be provided or APP_SECRET environment variable must be set."
      );
    }
    return crypto.createHmac("sha256", secretKey).update(input).digest("hex");
  }

  /**
   * Verifies if the provided input matches the given HMAC hash using the provided key or APP_SECRET.
   * @param {string} input - The input string to verify.
   * @param {string} hash - The HMAC hash to compare against.
   * @param {string} [key] - The secret key used for hashing (optional).
   * @returns {boolean} - True if the hash is valid, false otherwise.
   */
  public static verifyHmacHash(
    input: string,
    hash: string,
    key?: string
  ): boolean {
    const inputHash = HmacHasher.createHmacHash(input, key);
    return inputHash === hash; // Return true or false based on verification
  }
}

// Example usage:
// const myInput: string = "Hello, World!";
// const myHash: string = HmacHasher.createHmacHash(myInput); // Using APP_SECRET
// console.log(`HMAC Hash: ${myHash}`);

// const isVerified = HmacHasher.verifyHmacHash(myInput, myHash); // Using APP_SECRET
// console.log(`Verification: ${isVerified}`); // Should return true

export { HmacHasher };
