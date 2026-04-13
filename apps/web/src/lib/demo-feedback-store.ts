import "server-only";

import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { FeedbackSnapshot, StudentWorkspaceSnapshot, TimelineEvent } from "@smart-train/domain";
import { workspaceSnapshots } from "@/lib/sample-data";

export const DEMO_STUDENT_ID = "student_lin";

type StoredFeedbackRecord = {
  id: string;
  studentId: string;
  sessionLabel: string;
  submittedAt: string;
  sleep: number;
  soreness: number;
  adherence: number;
  painText: string;
  note: string;
};

type StoredFeedbackMap = Record<string, StoredFeedbackRecord>;

type StudentFeedbackInput = {
  studentId: string;
  sleep: number;
  soreness: number;
  adherence: number;
  painText: string;
  note: string;
};

const STORE_PATH = path.join(process.cwd(), ".demo-data", "student-feedback.json");

function clampScore(value: number, min: number, max: number) {
  const safeValue = Number.isFinite(value) ? Math.round(value) : min;
  return Math.min(max, Math.max(min, safeValue));
}

async function ensureStoreDirectory() {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
}

async function readStore(): Promise<StoredFeedbackMap> {
  try {
    const content = await fs.readFile(STORE_PATH, "utf8");
    return JSON.parse(content) as StoredFeedbackMap;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return {};
    }

    throw error;
  }
}

async function writeStore(store: StoredFeedbackMap) {
  await ensureStoreDirectory();
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2));
}

function buildFeedbackNote(record: StoredFeedbackRecord) {
  const parts = [];

  if (record.painText.trim()) {
    parts.push(`疼痛：${record.painText.trim()}`);
  }

  if (record.note.trim()) {
    parts.push(record.note.trim());
  }

  return parts.join("；") || "无额外备注。";
}

export async function getLatestStudentFeedback(studentId: string) {
  const store = await readStore();
  return store[studentId] ?? null;
}

export async function saveStudentFeedback(input: StudentFeedbackInput) {
  const baseSnapshot = workspaceSnapshots[input.studentId];

  if (!baseSnapshot) {
    throw new Error(`Unknown student: ${input.studentId}`);
  }

  const record: StoredFeedbackRecord = {
    id: randomUUID(),
    studentId: input.studentId,
    sessionLabel: baseSnapshot.latestExecution.title,
    submittedAt: new Date().toISOString(),
    sleep: clampScore(input.sleep, 1, 10),
    soreness: clampScore(input.soreness, 1, 10),
    adherence: clampScore(input.adherence, 1, 5),
    painText: input.painText.trim(),
    note: input.note.trim(),
  };

  const store = await readStore();
  store[input.studentId] = record;
  await writeStore(store);
  return record;
}

export function toFeedbackSnapshot(record: StoredFeedbackRecord): FeedbackSnapshot {
  return {
    submittedAt: record.submittedAt,
    sleep: `${record.sleep}/10`,
    soreness: `${record.soreness}/10`,
    adherence: `${record.adherence}/5`,
    painFlag: record.soreness >= 6 || record.painText.length > 0,
    note: buildFeedbackNote(record),
  };
}

export function toFeedbackTimelineEvent(record: StoredFeedbackRecord): TimelineEvent {
  return {
    id: `evt_feedback_${record.id}`,
    family: "feedback_submitted",
    occurredAt: record.submittedAt,
    title: "学员刚刚提交恢复反馈",
    detail: `睡眠 ${record.sleep}/10，酸痛 ${record.soreness}/10，完成度 ${record.adherence}/5。${buildFeedbackNote(record)}`,
  };
}

export async function getConnectedWorkspaceSnapshot(studentId: string): Promise<StudentWorkspaceSnapshot | null> {
  const baseSnapshot = workspaceSnapshots[studentId];

  if (!baseSnapshot) {
    return null;
  }

  const latestRecord = await getLatestStudentFeedback(studentId);

  if (!latestRecord) {
    return baseSnapshot;
  }

  return {
    ...baseSnapshot,
    latestFeedback: toFeedbackSnapshot(latestRecord),
    primaryRisk: toFeedbackSnapshot(latestRecord).painFlag
      ? "最新恢复反馈仍提示需要复核疼痛信号"
      : baseSnapshot.primaryRisk,
    timeline: [toFeedbackTimelineEvent(latestRecord), ...baseSnapshot.timeline],
  };
}
