import crypto from "crypto";

/**
 * Generates a new API key with a prefix
 * format: mpl_live_xxxx... or mpl_test_xxxx...
 */
export function generateApiKey(isLive: boolean = false) {
  const prefix = isLive ? "mpl_live_" : "mpl_test_";
  const bytes = crypto.randomBytes(32).toString("hex");
  const key = `${prefix}${bytes}`;
  
  // Return the raw key to show once, and the hash to store
  const hash = crypto.createHash("sha256").update(key).digest("hex");
  
  return {
    rawKey: key,
    hash: hash,
    prefix: key.slice(0, 12), // mpl_live_abcd
  };
}

/**
 * Validates a raw API key against a stored hash
 */
export function validateApiKey(rawKey: string, storedHash: string) {
  const incomingHash = crypto.createHash("sha256").update(rawKey).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(incomingHash), Buffer.from(storedHash));
}
