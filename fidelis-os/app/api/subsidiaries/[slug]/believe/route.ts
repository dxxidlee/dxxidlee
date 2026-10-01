import { NextResponse } from "next/server";
import { recordBelief } from "@/lib/subsidiaries";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const believers = recordBelief((await params).slug);
  if (believers === null) {
    return NextResponse.json({ error: "This belief is not available." }, { status: 404 });
  }
  return NextResponse.json({ believers });
}
