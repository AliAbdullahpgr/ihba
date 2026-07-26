import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth-guard";

export async function POST() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "ihba";
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  if (!apiSecret || !apiKey || !cloudName) {
    return NextResponse.json(
      { error: "Cloudinary is not configured" },
      { status: 500 }
    );
  }

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    apiSecret
  );

  return NextResponse.json({
    timestamp,
    folder,
    signature,
    apiKey,
    cloudName,
  });
}
