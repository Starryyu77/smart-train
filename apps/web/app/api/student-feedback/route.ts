import { NextResponse } from "next/server";
import { DEMO_STUDENT_ID, getLatestStudentFeedback, saveStudentFeedback } from "@/lib/demo-feedback-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get("studentId") ?? DEMO_STUDENT_ID;
  const latest = await getLatestStudentFeedback(studentId);

  return NextResponse.json({
    status: "ok",
    latest,
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const record = await saveStudentFeedback({
      studentId: typeof body.studentId === "string" ? body.studentId : DEMO_STUDENT_ID,
      sleep: Number(body.sleep),
      soreness: Number(body.soreness),
      adherence: Number(body.adherence),
      painText: typeof body.painText === "string" ? body.painText : "",
      note: typeof body.note === "string" ? body.note : "",
    });

    return NextResponse.json({
      status: "ok",
      record,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Failed to save feedback",
      },
      { status: 400 },
    );
  }
}
