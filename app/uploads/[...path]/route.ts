import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

// Same directory the upload route writes to (Dokploy volume mount).
const STORAGE_DIR = process.env.STORAGE_DIR || "/data/uploads";

const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
};

// Public, read-only endpoint that streams files from the storage volume.
// This is what Astria hits to download the training images, and what the
// browser uses to preview them. Files live under a random UUID name inside a
// per-user directory, so the paths are effectively unguessable.
export async function GET(
  _request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const segments = params.path || [];

  // Reject anything that could escape the storage directory.
  if (
    segments.length === 0 ||
    segments.some(
      (s) => s.includes("..") || s.includes("/") || s.includes("\\") || s === ""
    )
  ) {
    return new NextResponse("Bad request", { status: 400 });
  }

  const resolvedRoot = path.resolve(STORAGE_DIR);
  const filePath = path.resolve(resolvedRoot, ...segments);

  // Defense in depth: make sure the resolved path is still inside the root.
  if (filePath !== resolvedRoot && !filePath.startsWith(resolvedRoot + path.sep)) {
    return new NextResponse("Bad request", { status: 400 });
  }

  try {
    const info = await stat(filePath);
    if (!info.isFile()) {
      return new NextResponse("Not found", { status: 404 });
    }
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = CONTENT_TYPE_BY_EXT[ext] || "application/octet-stream";
  const data = await readFile(filePath);

  return new NextResponse(data, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
