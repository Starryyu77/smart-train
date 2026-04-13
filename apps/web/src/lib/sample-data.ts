import {
  type StudentWorkspaceSnapshot,
  type StudentSummary,
  type TimelineEvent,
  type Surface,
} from "@smart-train/domain";
import { buildObjectStorageKey, createAuditEvent, createSessionActor } from "@smart-train/platform";

export const activeSurfaces: Surface[] = ["coach", "student", "admin"];

export const coachActor = createSessionActor({
  id: "coach_001",
  orgId: "org_south-studio",
  role: "coach",
  surface: "coach",
  teamIds: ["team_a"],
});

export const studentSummaries: StudentSummary[] = [
  {
    id: "student_lin",
    orgId: "org_south-studio",
    coachId: "coach_001",
    name: "Lin Y.",
    currentGoal: "8 周内稳定增肌，同时控制腰背不适",
    activeProgramVersion: "2026 S1 / Week 4 / v3",
    lastSessionAt: "2026-04-12T19:20:00+08:00",
    latestFeedbackStatus: "late-signal",
    openAlerts: 2,
  },
  {
    id: "student_zhou",
    orgId: "org_south-studio",
    coachId: "coach_001",
    name: "Zhou M.",
    currentGoal: "恢复训练规律，每周完成 3 次力量训练",
    activeProgramVersion: "2026 S1 / Week 2 / v1",
    lastSessionAt: "2026-04-11T18:00:00+08:00",
    latestFeedbackStatus: "on-track",
    openAlerts: 0,
  },
];

const timeline: TimelineEvent[] = [
  {
    id: "evt_1",
    family: "feedback_submitted",
    occurredAt: "2026-04-13T08:30:00+08:00",
    title: "恢复反馈晚到 14 小时",
    detail: "睡眠 5/10，腰背疼痛从 1 级上升到 3 级，仍完成了 80% 训练量。",
  },
  {
    id: "evt_2",
    family: "session_logged",
    occurredAt: "2026-04-12T19:20:00+08:00",
    title: "下肢训练完成，RDL 实际负重下调 8%",
    detail: "教练记录为保留动作质量，主动下调最后两组负重。",
  },
  {
    id: "evt_3",
    family: "program_published",
    occurredAt: "2026-04-10T09:00:00+08:00",
    title: "发布 v3 计划版本",
    detail: "减少下肢总量，加入恢复观察点和疼痛阈值提醒。",
  },
];

export const workspaceSnapshots: Record<string, StudentWorkspaceSnapshot> = {
  student_lin: {
    student: studentSummaries[0],
    currentPhase: "Build / Week 4",
    primaryRisk: "腰背疼痛信号抬头",
    latestExecution: {
      title: "Lower A",
      completedAt: "2026-04-12T19:20:00+08:00",
      adherence: "92%",
      note: "最后两组 RDL 主动降重，动作质量保持稳定。",
    },
    latestFeedback: {
      submittedAt: "2026-04-13T08:30:00+08:00",
      sleep: "5/10",
      soreness: "6/10",
      adherence: "4/5",
      painFlag: true,
      note: "今早腰背有点顶，热身后缓解但还在。",
    },
    alerts: [
      {
        id: "alert_1",
        severity: "high",
        status: "open",
        title: "高疼痛反馈需要教练复核",
        detail: "在下一次提高负重前，需要确认症状是否连续两次出现。",
      },
      {
        id: "alert_2",
        severity: "medium",
        status: "open",
        title: "周复盘信号尚未确认",
        detail: "当前反馈为 late signal，复盘时需要标记有效时间窗。",
      },
    ],
    timeline,
    draftRecovery: {
      enabled: true,
      status: "planned-phase-1",
      note: "训练记录表单将优先支持低网草稿恢复。",
    },
  },
};

export const latestAuditPreview = createAuditEvent({
  actor: coachActor,
  action: "student.workspace.viewed",
  targetType: "student_workspace",
  targetId: "student_lin",
  outcome: "success",
  metadata: {
    surface: coachActor.surface,
    source: "seed",
  },
});

export const sampleUploadKey = buildObjectStorageKey({
  orgId: coachActor.orgId,
  studentId: "student_lin",
  area: "session-media",
  fileName: "lower-a-video.mp4",
  occurredAt: "2026-04-12T19:20:00+08:00",
});

