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
  {
    id: "student_mei",
    orgId: "org_south-studio",
    coachId: "coach_001",
    name: "Mei T.",
    currentGoal: "重新建立训练节奏，并在两周内恢复计划连续性",
    activeProgramVersion: "2026 S1 / Reset / v0",
    lastSessionAt: "2026-04-09T17:30:00+08:00",
    latestFeedbackStatus: "needs-review",
    openAlerts: 1,
  },
];

export const coachHomeSummary = {
  reviewCount: 3,
  headline: "Keep today tight.",
  detail:
    "One pain signal, one late recovery survey, and one stale plan version need attention before tonight.",
};

export const coachQueue: Array<{
  studentId: string;
  name: string;
  phase: string;
  status: string;
  tone: "coral" | "ghost" | "default";
  summary: string;
}> = [
  {
    studentId: "student_lin",
    name: "Lin Y.",
    phase: "build / week 4",
    status: "review",
    tone: "coral",
    summary:
      "Pain signal rose after Lower A. Review the next load progression before the next session.",
  },
  {
    studentId: "student_zhou",
    name: "Zhou M.",
    phase: "return / week 2",
    status: "stable",
    tone: "ghost",
    summary:
      "Adherence is back on track. Likely safe to progress the next upper-body session.",
  },
  {
    studentId: "student_mei",
    name: "Mei T.",
    phase: "reset / week 1",
    status: "refresh",
    tone: "default",
    summary:
      "Plan version has not been refreshed for 12 days and needs a tighter next block.",
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
  student_zhou: {
    student: studentSummaries[1],
    currentPhase: "Return / Week 2",
    primaryRisk: "节奏恢复顺利，但还不适合增加太多复杂度",
    latestExecution: {
      title: "Upper A",
      completedAt: "2026-04-11T18:00:00+08:00",
      adherence: "88%",
      note: "动作完成度稳定，最后一组主观强度控制在计划内。",
    },
    latestFeedback: {
      submittedAt: "2026-04-12T08:10:00+08:00",
      sleep: "7/10",
      soreness: "4/10",
      adherence: "5/5",
      painFlag: false,
      note: "整体状态不错，没有明显不适。",
    },
    alerts: [],
    timeline: [
      {
        id: "evt_4",
        family: "feedback_submitted",
        occurredAt: "2026-04-12T08:10:00+08:00",
        title: "恢复反馈正常提交",
        detail: "睡眠和酸痛均回到稳定区间。",
      },
      {
        id: "evt_5",
        family: "session_logged",
        occurredAt: "2026-04-11T18:00:00+08:00",
        title: "上肢训练完成",
        detail: "计划执行基本完整，没有额外疼痛信号。",
      },
    ],
    draftRecovery: {
      enabled: true,
      status: "planned-phase-1",
      note: "低网草稿恢复将在 session logging 流中优先实现。",
    },
  },
  student_mei: {
    student: studentSummaries[2],
    currentPhase: "Reset / Week 1",
    primaryRisk: "计划已经停更 12 天，用户节奏可能会再次断掉",
    latestExecution: {
      title: "Full Body Reset",
      completedAt: "2026-04-09T17:30:00+08:00",
      adherence: "61%",
      note: "训练完成了一半后提前结束，主要原因是节奏中断后重新进入状态较慢。",
    },
    latestFeedback: {
      submittedAt: "2026-04-10T08:40:00+08:00",
      sleep: "6/10",
      soreness: "3/10",
      adherence: "3/5",
      painFlag: false,
      note: "不是疼痛问题，主要是最近有点难重新回到训练节奏。",
    },
    alerts: [
      {
        id: "alert_3",
        severity: "medium",
        status: "open",
        title: "计划版本需要刷新",
        detail: "当前计划已经停更 12 天，继续拖延会让复训节奏更弱。",
      },
    ],
    timeline: [
      {
        id: "evt_6",
        family: "feedback_submitted",
        occurredAt: "2026-04-10T08:40:00+08:00",
        title: "反馈提到训练节奏重新进入困难",
        detail: "问题不在疼痛，而在恢复训练连续性。",
      },
      {
        id: "evt_7",
        family: "session_logged",
        occurredAt: "2026-04-09T17:30:00+08:00",
        title: "Reset 课提前结束",
        detail: "完成度偏低，需要重新收窄下一次课的负担。",
      },
    ],
    draftRecovery: {
      enabled: true,
      status: "planned-phase-1",
      note: "草稿恢复同样适用于复训用户的低完成度记录。",
    },
  },
};

export const coachDecisionByStudentId: Record<
  string,
  {
    summary: string;
    action: string;
  }
> = {
  student_lin: {
    summary:
      "现在不需要更多图表，而是需要明确判断下一次下肢课是否还能继续上调负荷。",
    action:
      "下一次下肢训练前复核疼痛是否连续出现；若继续出现，暂停负荷上调并重做恢复判断。",
  },
  student_zhou: {
    summary: "当前证据支持小步进阶，但不需要切换到更复杂的动作结构。",
    action: "保留当前节奏，在下次上肢训练里只增加一个最小进阶变量。",
  },
  student_mei: {
    summary: "这里的核心不是强度，而是把训练连续性重新搭起来。",
    action: "把下一次课收窄成更容易完成的版本，并在 7 天内强制刷新计划版本。",
  },
};

export const studentCheckInDraft = {
  studentName: "Lin Y.",
  sessionLabel: "After Lower A",
  progressPercent: 68,
  guidance: "只收最必要的恢复信号，让教练能在下一次调整前看到真实状态。",
  prompts: [
    { label: "Sleep", value: "5 / 10", badge: "logged", tone: "ghost" as const },
    { label: "Soreness", value: "6 / 10", badge: "watch", tone: "coral" as const },
    { label: "Pain", value: "Lower back tight", badge: "watch", tone: "coral" as const },
  ],
  note: "今早腰背有点顶，热身后缓解但还在。",
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
