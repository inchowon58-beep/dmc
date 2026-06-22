import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOST = "openapi.animal.go.kr";

export async function GET(request: NextRequest) {
  const rawUrl = request.nextUrl.searchParams.get("url");

  if (!rawUrl) {
    return NextResponse.json({ error: "url parameter required" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  if (parsed.hostname !== ALLOWED_HOST || parsed.protocol !== "https:") {
    return NextResponse.json({ error: "forbidden host" }, { status: 403 });
  }

  const upstream = await fetch(parsed.toString(), {
    next: { revalidate: 86400 },
  });

  if (!upstream.ok) {
    return new NextResponse(null, { status: upstream.status });
  }

  const contentType =
    upstream.headers.get("content-type") ?? "image/jpeg";
  const buffer = await upstream.arrayBuffer();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
