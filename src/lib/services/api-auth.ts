import dbConnect from "@/lib/db/mongodb";
import ApiKey from "@/models/ApiKey";
import { validateApiKey } from "@/lib/utils/api-key";
import { auth } from "@/auth";

/**
 * Middleware-like helper to verify API keys for public endpoints
 */
export async function verifyPublicApiKey(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const rawKey = authHeader.split(" ")[1];

  // Bypass for the internal authenticated dashboard simulator
  if (rawKey === "mpl_test_simulator_key") {
    const session = await auth();
    if (session?.user?.id) {
      return {
        _id: "simulator-key",
        userId: session.user.id,
        isLive: false,
      };
    }
    return null;
  }

  const prefix = rawKey.slice(0, 12);

  await dbConnect();
  const apiKeyDoc = await ApiKey.findOne({ prefix, isActive: true });

  if (!apiKeyDoc) return null;

  const isValid = validateApiKey(rawKey, apiKeyDoc.key);
  if (!isValid) return null;

  // Update last used
  apiKeyDoc.lastUsedAt = new Date();
  await apiKeyDoc.save();

  return apiKeyDoc;
}
