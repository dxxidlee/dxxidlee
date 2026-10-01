import { NextResponse } from "next/server";
import { listInStore } from "@/lib/subsidiaries";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const listed_at = listInStore((await params).slug);
  if (!listed_at) {
    return NextResponse.json({ error: "Fidelis holds no record of this." }, { status: 404 });
  }
  return NextResponse.json({ listed_at });
}
