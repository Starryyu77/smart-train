import {
  type PlanAdjustmentDraft,
  type SessionLogDraft,
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

export const sessionLogDraftByStudentId: Record<string, SessionLogDraft> = {
  student_lin: {
    studentId: "student_lin",
    sessionLabel: "Lower A",
    startedAt: "2026-04-12T19:02:00+08:00",
    progressPercent: 82,
    loggedSets: 11,
    plannedSets: 13,
    syncStatus: "draft restored 2m ago",
    painRaised: true,
    painStatus: "watch",
    loadDecision: "hold progression",
    draftRecovered: true,
    readinessBadge: "late signal linked",
    targetRpe: "7.5",
    actualRpe: "8.0",
    loadChange: "-8% on final block",
    intensityNote: "负荷不是问题，真正要记录的是疼痛信号是否和 RDL 收尾阶段同步出现。",
    coachNote: "保留动作质量，下次同动作先不进阶，等恢复反馈确认后再决定。",
    handoffNote: "保存本次记录后立即推送恢复反馈，确保今天晚上前能拿到睡眠和疼痛信号。",
    blocks: [
      {
        id: "block_1",
        title: "Trap Bar Deadlift",
        planned: "4 x 5 @ 92.5kg",
        actual: "4 x 5 @ 92.5 / 92.5 / 85 / 85kg",
        status: "adjusted",
        note: "最后两组主动降重，动作速度恢复正常。",
      },
      {
        id: "block_2",
        title: "Rear Foot Elevated Split Squat",
        planned: "3 x 8 / side",
        actual: "3 x 8 / side",
        status: "on-plan",
        note: "完成度稳定，没有新增不适。",
      },
      {
        id: "block_3",
        title: "Tempo Hamstring Curl",
        planned: "3 x 10",
        actual: "2 x 10",
        status: "cut-short",
        note: "因腰背紧张提前结束最后一组。",
      },
    ],
  },
  student_zhou: {
    studentId: "student_zhou",
    sessionLabel: "Upper A",
    startedAt: "2026-04-11T17:35:00+08:00",
    progressPercent: 91,
    loggedSets: 10,
    plannedSets: 11,
    syncStatus: "saved locally",
    painRaised: false,
    painStatus: "stable",
    loadDecision: "small progression okay",
    draftRecovered: false,
    readinessBadge: "on time",
    targetRpe: "7.0",
    actualRpe: "7.0",
    loadChange: "+2.5kg on main press",
    intensityNote: "这一节最重要的是确认节奏已经回稳，而不是急着扩大动作复杂度。",
    coachNote: "保留当前动作结构，下次只增加一个最小进阶变量。",
    handoffNote: "如果今晚恢复反馈按时返回，就允许在下一次上肢课继续小步进阶。",
    blocks: [
      {
        id: "block_4",
        title: "DB Bench Press",
        planned: "4 x 6 @ 26kg",
        actual: "4 x 6 @ 26 / 26 / 28 / 28kg",
        status: "adjusted",
        note: "最后两组状态稳定，允许小步增加负重。",
      },
      {
        id: "block_5",
        title: "Chest Supported Row",
        planned: "3 x 10",
        actual: "3 x 10",
        status: "on-plan",
        note: "执行质量稳定。",
      },
      {
        id: "block_6",
        title: "Landmine Press",
        planned: "4 x 8 / side",
        actual: "3 x 8 / side",
        status: "cut-short",
        note: "时间窗口不足，最后一组未完成。",
      },
    ],
  },
  student_mei: {
    studentId: "student_mei",
    sessionLabel: "Full Body Reset",
    startedAt: "2026-04-09T17:08:00+08:00",
    progressPercent: 57,
    loggedSets: 6,
    plannedSets: 10,
    syncStatus: "draft stale 12d",
    painRaised: false,
    painStatus: "no pain",
    loadDecision: "reduce next session load",
    draftRecovered: true,
    readinessBadge: "follow-up needed",
    targetRpe: "6.0",
    actualRpe: "5.0",
    loadChange: "volume reduced",
    intensityNote: "这次没有疼痛，但训练进入成本太高，下一次课应该先把完成率救回来。",
    coachNote: "把下一次课收窄成 30 分钟内完成的版本，先恢复连续性。",
    handoffNote: "记录完成后不急着问更多问题，优先刷新计划版本并约定下一次训练窗口。",
    blocks: [
      {
        id: "block_7",
        title: "Goblet Squat",
        planned: "3 x 10",
        actual: "3 x 8",
        status: "adjusted",
        note: "为了保持节奏主动减少次数。",
      },
      {
        id: "block_8",
        title: "Incline Push-up",
        planned: "3 x 12",
        actual: "2 x 12",
        status: "cut-short",
        note: "提前结束，意图是保证可完成感。",
      },
      {
        id: "block_9",
        title: "Carry Finisher",
        planned: "4 rounds",
        actual: "1 round",
        status: "cut-short",
        note: "本次不再追求完整收尾。",
      },
    ],
  },
};

export const planAdjustmentDraftByStudentId: Record<string, PlanAdjustmentDraft> = {
  student_lin: {
    studentId: "student_lin",
    basedOnSession: "Lower A",
    baseVersion: "2026 S1 / Week 4 / v3",
    nextVersion: "2026 S1 / Week 4 / v4",
    publishStatus: "ready to publish",
    reasonHeadline: "下肢主项先保质量，不继续顶负荷。",
    reasonDetail: "疼痛信号和 RDL 收尾阶段对齐出现，当前目标不是更猛推进，而是验证信号是否会连续出现。",
    evidenceSummary: "本次训练完成度 92%，但最后两组主项主动降重，今早恢复反馈继续提示腰背紧张。",
    focusArea: "keep stimulus, cut unnecessary fatigue",
    reviewWindow: "review again after next Lower A",
    publishNote: "发布后让学员继续走恢复反馈，下一次下肢课前不再追加额外变量。",
    checklist: [
      "主项不再继续上调负荷",
      "辅助动作总量略降，保留训练感",
      "恢复反馈继续绑定到本版本",
    ],
    changes: [
      {
        id: "plan_change_1",
        sessionLabel: "Lower A",
        exerciseLabel: "Trap Bar Deadlift",
        fromValue: "4 x 5 @ 92.5kg + progression",
        toValue: "4 x 5 @ 85-90kg, no progression",
        tone: "decrease",
        reason: "先确认疼痛信号是否连续出现，再决定是否恢复进阶。",
      },
      {
        id: "plan_change_2",
        sessionLabel: "Lower A",
        exerciseLabel: "Tempo Hamstring Curl",
        fromValue: "3 x 10",
        toValue: "2 x 10",
        tone: "decrease",
        reason: "减少收尾疲劳，让主项后的恢复窗口更干净。",
      },
      {
        id: "plan_change_3",
        sessionLabel: "Warm-up Gate",
        exerciseLabel: "Pain check prompt",
        fromValue: "none",
        toValue: "add pre-lift pain gate",
        tone: "focus",
        reason: "把模糊不适变成可记录的判断门槛。",
      },
    ],
  },
  student_zhou: {
    studentId: "student_zhou",
    basedOnSession: "Upper A",
    baseVersion: "2026 S1 / Week 2 / v1",
    nextVersion: "2026 S1 / Week 2 / v2",
    publishStatus: "ready to publish",
    reasonHeadline: "节奏已经回稳，但只允许一个最小进阶变量。",
    reasonDetail: "这类学员当前最怕的不是强度不够，而是因为一次加太多复杂度又把节奏打断。",
    evidenceSummary: "恢复反馈按时返回，睡眠和酸痛都在稳定区间，主项主观强度控制在计划内。",
    focusArea: "progress slowly, preserve rhythm",
    reviewWindow: "review in 1 week",
    publishNote: "发布后保持其余动作结构不动，只观察主项进阶后的承接感。",
    checklist: [
      "只增加一个主项变量",
      "不引入新的动作复杂度",
      "下周继续看 adherence 是否稳住",
    ],
    changes: [
      {
        id: "plan_change_4",
        sessionLabel: "Upper A",
        exerciseLabel: "DB Bench Press",
        fromValue: "4 x 6 @ 26kg",
        toValue: "4 x 6 @ 28kg",
        tone: "increase",
        reason: "状态允许小步进阶，但不需要改动作结构。",
      },
      {
        id: "plan_change_5",
        sessionLabel: "Upper A",
        exerciseLabel: "Landmine Press",
        fromValue: "4 x 8 / side",
        toValue: "3 x 8 / side",
        tone: "hold",
        reason: "控制总复杂度，让本周主变化点只有一个。",
      },
    ],
  },
  student_mei: {
    studentId: "student_mei",
    basedOnSession: "Full Body Reset",
    baseVersion: "2026 S1 / Reset / v0",
    nextVersion: "2026 S1 / Reset / v1",
    publishStatus: "needs coach review",
    reasonHeadline: "下一个版本的目标不是刺激，而是重新建立可完成感。",
    reasonDetail: "当前问题不在疼痛，而在训练连续性已经断裂，所以下一个版本必须明显更容易完成。",
    evidenceSummary: "训练完成度只有 61%，没有明显疼痛，但重新进入训练节奏的成本很高。",
    focusArea: "reduce friction, restore consistency",
    reviewWindow: "review after 7 days",
    publishNote: "发布后优先约定下一次固定训练窗口，不再同时推多余反馈问题。",
    checklist: [
      "把整节课压到 30 分钟内",
      "保留完成感而不是堆量",
      "七天内强制回看版本效果",
    ],
    changes: [
      {
        id: "plan_change_6",
        sessionLabel: "Reset Day",
        exerciseLabel: "Total session length",
        fromValue: "45-50 min",
        toValue: "25-30 min",
        tone: "decrease",
        reason: "先把回到训练的门槛降下来。",
      },
      {
        id: "plan_change_7",
        sessionLabel: "Reset Day",
        exerciseLabel: "Carry Finisher",
        fromValue: "4 rounds",
        toValue: "remove this block",
        tone: "decrease",
        reason: "去掉最容易让用户提早退出的收尾段。",
      },
      {
        id: "plan_change_8",
        sessionLabel: "Reset Day",
        exerciseLabel: "Completion target",
        fromValue: "finish full plan",
        toValue: "finish first 2 blocks",
        tone: "focus",
        reason: "把胜利条件改成更可达成的版本。",
      },
    ],
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
