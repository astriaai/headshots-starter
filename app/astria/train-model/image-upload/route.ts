import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { mkdir, writeFile } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";

export const dynamic = "force-dynamic";
// Uploaded selfies can be a few MB each; allow larger request bodies.
export const maxDuration = 60;

// Directory backed by the Dokploy volume mount. Overridable via env.
const STORAGE_DIR = process.env.STORAGE_DIR || "/data/uploads";
const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/gif"];
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
};

// Build the public base URL Astria will use to fetch the training images.
// This MUST be a publicly reachable domain (your Dokploy app URL).
function getBaseUrl(): string {
  const deploymentUrl = process.env.DEPLOYMENT_URL || "";
  if (!deploymentUrl) return "";
  return deploymentUrl.startsWith("http://") ||
    deploymentUrl.startsWith("https://")
    ? deploymentUrl
    : `https://${deploymentUrl}`;
}

export async function POST(request: Request): Promise<NextResponse> {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Authenticate and authorize before writing anything to disk.
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    return NextResponse.json(
      { error: "Server misconfigured: DEPLOYMENT_URL is not set" },
      { status: 500 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart/form-data" },
      { status: 400 }
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_CONTENT_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `Unsupported file type: ${file.type}` },
      { status: 400 }
    );
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  // Store under a per-user subdirectory with a random, non-guessable filename.
  // The user id comes from the authenticated session (not the request body),
  // so path traversal via the filename is not possible.
  const ext = EXTENSION_BY_TYPE[file.type] || "";
  const filename = `${randomUUID()}${ext}`;
  const userDir = path.join(STORAGE_DIR, user.id);

  try {
    await mkdir(userDir, { recursive: true });
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(userDir, filename), bytes);
  } catch (error) {
    console.error("Failed to store upload", error);
    return NextResponse.json(
      { error: "Could not store file" },
      { status: 500 }
    );
  }

  const url = `${baseUrl}/uploads/${user.id}/${filename}`;
  return NextResponse.json({ url });
}
