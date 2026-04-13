import type { SessionActor, StudentSummary, Surface } from "@smart-train/domain";

type AuditOutcome = "success" | "denied" | "failure";

type StorageArea = "session-media" | "assessment-files" | "exports";

const SURFACE_ACCESS: Record<SessionActor["role"], Surface[]> = {
  org_owner: ["coach", "admin"],
  coach: ["coach"],
  assistant_coach: ["coach"],
  student: ["student"],
};

export function createSessionActor(input: SessionActor): SessionActor {
  return {
    ...input,
    teamIds: [...input.teamIds],
  };
}

export function canAccessSurface(actor: SessionActor, surface: Surface): boolean {
  return SURFACE_ACCESS[actor.role].includes(surface);
}

export function canReadStudent(actor: SessionActor, student: StudentSummary): boolean {
  if (actor.orgId !== student.orgId) {
    return false;
  }

  if (actor.role === "org_owner") {
    return true;
  }

  if (actor.role === "coach" || actor.role === "assistant_coach") {
    return actor.id === student.coachId;
  }

  return actor.role === "student" && actor.id === student.id;
}

export interface AuditEvent {
  eventId: string;
  occurredAt: string;
  orgId: string;
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  outcome: AuditOutcome;
  metadata: Record<string, string | number | boolean | null>;
}

export function createAuditEvent({
  actor,
  action,
  targetType,
  targetId,
  outcome,
  metadata = {},
}: {
  actor: SessionActor;
  action: string;
  targetType: string;
  targetId: string;
  outcome: AuditOutcome;
  metadata?: Record<string, string | number | boolean | null>;
}): AuditEvent {
  return {
    eventId: `audit_${crypto.randomUUID()}`,
    occurredAt: new Date().toISOString(),
    orgId: actor.orgId,
    actorId: actor.id,
    action,
    targetType,
    targetId,
    outcome,
    metadata,
  };
}

function sanitizeSegment(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildObjectStorageKey({
  orgId,
  studentId,
  area,
  fileName,
  occurredAt,
}: {
  orgId: string;
  studentId: string;
  area: StorageArea;
  fileName: string;
  occurredAt: string;
}) {
  const datePrefix = occurredAt.slice(0, 10);
  const normalizedName = sanitizeSegment(fileName.replace(/\.[^/.]+$/, ""));
  const extension = fileName.includes(".") ? fileName.slice(fileName.lastIndexOf(".")) : "";

  return [
    sanitizeSegment(orgId),
    sanitizeSegment(studentId),
    area,
    datePrefix,
    `${normalizedName}${extension.toLowerCase()}`,
  ].join("/");
}

