import { NextResponse } from "next/server";
import { activeSurfaces } from "@/lib/sample-data";

export function GET() {
  return NextResponse.json({
    status: "ok",
    phase: "phase-1-foundation",
    surfaces: activeSurfaces,
    timestamp: new Date().toISOString(),
  });
}

