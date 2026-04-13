export type Surface = "coach" | "student" | "admin";

export type Role = "org_owner" | "coach" | "assistant_coach" | "student";

export type FeedbackStatus = "on-track" | "late-signal" | "needs-review";

export type AlertSeverity = "medium" | "high";

export type AlertStatus = "open" | "acknowledged" | "resolved";

export type TimelineEventFamily =
  | "assessment_recorded"
  | "program_published"
  | "session_logged"
  | "feedback_submitted"
  | "review_generated";

export interface SessionActor {
  id: string;
  orgId: string;
  role: Role;
  surface: Surface;
  teamIds: string[];
}

export interface StudentSummary {
  id: string;
  orgId: string;
  coachId: string;
  name: string;
  currentGoal: string;
  activeProgramVersion: string;
  lastSessionAt: string | null;
  latestFeedbackStatus: FeedbackStatus;
  openAlerts: number;
}

export interface ExecutionSnapshot {
  title: string;
  completedAt: string;
  adherence: string;
  note: string;
}

export interface FeedbackSnapshot {
  submittedAt: string;
  sleep: string;
  soreness: string;
  adherence: string;
  painFlag: boolean;
  note: string;
}

export interface AlertSummary {
  id: string;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  detail: string;
}

export interface TimelineEvent {
  id: string;
  family: TimelineEventFamily;
  occurredAt: string;
  title: string;
  detail: string;
}

export interface DraftRecoveryState {
  enabled: boolean;
  status: "planned-phase-1" | "active" | "disabled";
  note: string;
}

export interface StudentWorkspaceSnapshot {
  student: StudentSummary;
  currentPhase: string;
  primaryRisk: string;
  latestExecution: ExecutionSnapshot;
  latestFeedback: FeedbackSnapshot;
  alerts: AlertSummary[];
  timeline: TimelineEvent[];
  draftRecovery: DraftRecoveryState;
}

