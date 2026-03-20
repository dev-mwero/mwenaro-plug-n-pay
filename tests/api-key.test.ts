import { describe, it, expect } from "vitest";
import { generateApiKey, validateApiKey } from "../src/lib/utils/api-key";

describe("API Key Logic", () => {
  it("should generate a key with the correct prefix", () => {
    const { rawKey, prefix } = generateApiKey(false);
    expect(rawKey.startsWith("mpl_test_")).toBe(true);
    expect(prefix).toBe(rawKey.slice(0, 12));
  });

  it("should validate a correct key", () => {
    const { rawKey, hash } = generateApiKey(true);
    const isValid = validateApiKey(rawKey, hash);
    expect(isValid).toBe(true);
  });

  it("should fail for an incorrect key", () => {
    const { hash } = generateApiKey(true);
    const isValid = validateApiKey("invalid_key", hash);
    expect(isValid).toBe(false);
  });
});
