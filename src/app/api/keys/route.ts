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
  if (!req.auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, isLive } = body;

  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  await dbConnect();
  const { rawKey, hash, prefix } = generateApiKey(isLive);

  const newKey = await ApiKey.create({
    userId: req.auth.user?.id,
    name,
    key: hash,
    prefix,
    isLive,
  });

  // Important: We return the rawKey ONLY during creation. It is never stored.
  return NextResponse.json({
    ...newKey.toObject(),
    rawKey,
  });
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
