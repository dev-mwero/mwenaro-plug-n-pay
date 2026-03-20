import { auth } from "@/auth";
import dbConnect from "@/lib/db/mongodb";
import ApiKey from "@/models/ApiKey";
import { generateApiKey } from "@/lib/utils/api-key";
import { NextResponse } from "next/server";

export const GET = auth(async (req) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const keys = await ApiKey.find({ userId: req.auth.user?.id }).sort({ createdAt: -1 });

  return NextResponse.json(keys);
});

export const POST = auth(async (req) => {
  console.log("[API/KEYS] Received key generation request");
  if (!req.auth) {
    console.log("[API/KEYS] Unauthorized: No session found");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userEmail = req.auth.user?.email;
  const userId = req.auth.user?.id;
  console.log(`[API/KEYS] Authenticated User: ${userEmail} (${userId})`);

  try {
    const body = await req.json();
    const { name, isLive } = body;
    console.log(`[API/KEYS] Request body: name=${name}, isLive=${isLive}`);

    if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

    console.log("[API/KEYS] Connecting to MongoDB...");
    await dbConnect();
    console.log("[API/KEYS] MongoDB connected");

    console.log("[API/KEYS] Generating key material...");
    const { rawKey, hash, prefix } = generateApiKey(isLive);
    console.log(`[API/KEYS] Generated key with prefix: ${prefix}`);

    console.log("[API/KEYS] Creating ApiKey record in DB...");
    const newKey = await ApiKey.create({
      userId: userId,
      name,
      key: hash,
      prefix,
      isLive,
    });
    console.log(`[API/KEYS] Successfully created key: ${newKey._id}`);

    // Important: We return the rawKey ONLY during creation. It is never stored.
    return NextResponse.json({
      ...newKey.toObject(),
      rawKey,
    });
  } catch (error: any) {
    console.error("[API/KEYS] CRITICAL ERROR:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
});

export const DELETE = auth(async (req) => {
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

  await dbConnect();
  await ApiKey.findOneAndDelete({ _id: id, userId: req.auth.user?.id });

  return NextResponse.json({ success: true });
});
