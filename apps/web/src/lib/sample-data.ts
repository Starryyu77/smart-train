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
    activeProgramVersion: "2026 第 1 阶段 / 第 4 周 / v3",
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
    activeProgramVersion: "2026 第 1 阶段 / 第 2 周 / v1",
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
    activeProgramVersion: "2026 第 1 阶段 / 重启 / v0",
    lastSessionAt: "2026-04-09T17:30:00+08:00",
    latestFeedbackStatus: "needs-review",
    openAlerts: 1,
  },
];

export const coachHomeSummary = {
  reviewCount: 3,
  headline: "把今天的判断收紧。",
  detail:
    "一个疼痛信号、一个延迟恢复反馈和一个过期计划版本，都需要在今晚前处理。",
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
    phase: "增肌 / 第 4 周",
    status: "待复核",
    tone: "coral",
    summary:
      "下肢 A 后疼痛信号抬头，下一次训练前先复核是否还能继续上调负荷。",
  },
  {
    studentId: "student_zhou",
    name: "Zhou M.",
    phase: "回归 / 第 2 周",
    status: "稳定",
    tone: "ghost",
    summary:
      "完成度已经回稳，下一次上肢课大概率可以做小步进阶。",
  },
  {
    studentId: "student_mei",
    name: "Mei T.",
    phase: "重启 / 第 1 周",
    status: "待刷新",
    tone: "default",
    summary:
      "计划版本已经 12 天没刷新，需要一个更收窄的下一阶段。",
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
    currentPhase: "增肌 / 第 4 周",
    primaryRisk: "腰背疼痛信号抬头",
    latestExecution: {
      title: "下肢 A",
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
        detail: "当前反馈为延迟信号，复盘时需要标记有效时间窗。",
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
    currentPhase: "回归 / 第 2 周",
    primaryRisk: "节奏恢复顺利，但还不适合增加太多复杂度",
    latestExecution: {
      title: "上肢 A",
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
    currentPhase: "重启 / 第 1 周",
    primaryRisk: "计划已经停更 12 天，用户节奏可能会再次断掉",
    latestExecution: {
      title: "全身重启课",
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
        title: "重启课提前结束",
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
    focus: string;
    decision: string;
    nextStep: string;
    ifTriggered: string;
  }
> = {
  student_lin: {
    focus: "先判断这次腰背信号会不会连续出现。",
    decision: "下一次下肢课先不要加重量。",
    nextStep: "按当前重量再做一次，并继续看训练后和第二天早上的疼痛反馈。",
    ifTriggered: "如果下一次还疼，就暂停上调负荷，先重做恢复判断。",
  },
  student_zhou: {
    focus: "当前状态稳定，可以试一次最小进阶。",
    decision: "下次上肢课只加一个小变量。",
    nextStep: "保持动作不变，只小幅增加一次重量或组数。",
    ifTriggered: "如果完成度下降，就回到当前版本，不继续加。",
  },
  student_mei: {
    focus: "现在先把训练连续性救回来，不追求强度。",
    decision: "下一次课做一个更容易完成的缩短版。",
    nextStep: "把胜利条件改成完成前 2 个动作块，而不是做完整节课。",
    ifTriggered: "如果 7 天内还没完成，就必须刷新计划版本。",
  },
};

export const studentCheckInDraft = {
  studentName: "Lin Y.",
  sessionLabel: "Lower A 训练后",
  progressPercent: 68,
  guidance: "只收最必要的恢复信号，让教练能在下一次调整前看到真实状态。",
  prompts: [
    { label: "睡眠", value: "5 / 10", badge: "已记录", tone: "ghost" as const },
    { label: "酸痛", value: "6 / 10", badge: "关注", tone: "coral" as const },
    { label: "疼痛", value: "下背发紧", badge: "关注", tone: "coral" as const },
  ],
  note: "今早腰背有点顶，热身后缓解但还在。",
};

export const sessionLogDraftByStudentId: Record<string, SessionLogDraft> = {
  student_lin: {
    studentId: "student_lin",
    sessionLabel: "下肢 A",
    startedAt: "2026-04-12T19:02:00+08:00",
    progressPercent: 82,
    loggedSets: 11,
    plannedSets: 13,
    syncStatus: "2 分钟前恢复草稿",
    painRaised: true,
    painStatus: "需关注",
    loadDecision: "先暂停进阶",
    draftRecovered: true,
    readinessBadge: "已关联延迟信号",
    targetRpe: "7.5",
    actualRpe: "8.0",
    loadChange: "最后一段 -8%",
    intensityNote: "负荷不是问题，真正要记录的是疼痛信号是否和 RDL 收尾阶段同步出现。",
    coachNote: "保留动作质量，下次同动作先不进阶，等恢复反馈确认后再决定。",
    handoffNote: "保存本次记录后立即推送恢复反馈，确保今天晚上前能拿到睡眠和疼痛信号。",
    blocks: [
      {
        id: "block_1",
        title: "六角杠硬拉",
        planned: "4 x 5 @ 92.5kg",
        actual: "4 x 5 @ 92.5 / 92.5 / 85 / 85kg",
        status: "adjusted",
        note: "最后两组主动降重，动作速度恢复正常。",
      },
      {
        id: "block_2",
        title: "后脚抬高分腿蹲",
        planned: "3 x 8 /侧",
        actual: "3 x 8 /侧",
        status: "on-plan",
        note: "完成度稳定，没有新增不适。",
      },
      {
        id: "block_3",
        title: "节奏腿弯举",
        planned: "3 x 10",
        actual: "2 x 10",
        status: "cut-short",
        note: "因腰背紧张提前结束最后一组。",
      },
    ],
  },
  student_zhou: {
    studentId: "student_zhou",
    sessionLabel: "上肢 A",
    startedAt: "2026-04-11T17:35:00+08:00",
    progressPercent: 91,
    loggedSets: 10,
    plannedSets: 11,
    syncStatus: "已保存在本地",
    painRaised: false,
    painStatus: "稳定",
    loadDecision: "可以小步进阶",
    draftRecovered: false,
    readinessBadge: "按时返回",
    targetRpe: "7.0",
    actualRpe: "7.0",
    loadChange: "主项 +2.5kg",
    intensityNote: "这一节最重要的是确认节奏已经回稳，而不是急着扩大动作复杂度。",
    coachNote: "保留当前动作结构，下次只增加一个最小进阶变量。",
    handoffNote: "如果今晚恢复反馈按时返回，就允许在下一次上肢课继续小步进阶。",
    blocks: [
      {
        id: "block_4",
        title: "哑铃卧推",
        planned: "4 x 6 @ 26kg",
        actual: "4 x 6 @ 26 / 26 / 28 / 28kg",
        status: "adjusted",
        note: "最后两组状态稳定，允许小步增加负重。",
      },
      {
        id: "block_5",
        title: "胸托划船",
        planned: "3 x 10",
        actual: "3 x 10",
        status: "on-plan",
        note: "执行质量稳定。",
      },
      {
        id: "block_6",
        title: "地雷杆推举",
        planned: "4 x 8 /侧",
        actual: "3 x 8 /侧",
        status: "cut-short",
        note: "时间窗口不足，最后一组未完成。",
      },
    ],
  },
  student_mei: {
    studentId: "student_mei",
    sessionLabel: "全身重启课",
    startedAt: "2026-04-09T17:08:00+08:00",
    progressPercent: 57,
    loggedSets: 6,
    plannedSets: 10,
    syncStatus: "草稿已陈旧 12 天",
    painRaised: false,
    painStatus: "无疼痛",
    loadDecision: "降低下一次负担",
    draftRecovered: true,
    readinessBadge: "需要跟进",
    targetRpe: "6.0",
    actualRpe: "5.0",
    loadChange: "总量下调",
    intensityNote: "这次没有疼痛，但训练进入成本太高，下一次课应该先把完成率救回来。",
    coachNote: "把下一次课收窄成 30 分钟内完成的版本，先恢复连续性。",
    handoffNote: "记录完成后不急着问更多问题，优先刷新计划版本并约定下一次训练窗口。",
    blocks: [
      {
        id: "block_7",
        title: "高举壶铃深蹲",
        planned: "3 x 10",
        actual: "3 x 8",
        status: "adjusted",
        note: "为了保持节奏主动减少次数。",
      },
      {
        id: "block_8",
        title: "上斜俯卧撑",
        planned: "3 x 12",
        actual: "2 x 12",
        status: "cut-short",
        note: "提前结束，意图是保证可完成感。",
      },
      {
        id: "block_9",
        title: "负重行走收尾",
        planned: "4 轮",
        actual: "1 轮",
        status: "cut-short",
        note: "本次不再追求完整收尾。",
      },
    ],
  },
};

export const planAdjustmentDraftByStudentId: Record<string, PlanAdjustmentDraft> = {
  student_lin: {
    studentId: "student_lin",
    basedOnSession: "下肢 A",
    baseVersion: "2026 第 1 阶段 / 第 4 周 / v3",
    nextVersion: "2026 第 1 阶段 / 第 4 周 / v4",
    publishStatus: "可发布",
    reasonHeadline: "下肢主项先保质量，不继续顶负荷。",
    reasonDetail: "疼痛信号和 RDL 收尾阶段对齐出现，当前目标不是更猛推进，而是验证信号是否会连续出现。",
    evidenceSummary: "本次训练完成度 92%，但最后两组主项主动降重，今早恢复反馈继续提示腰背紧张。",
    focusArea: "保留刺激，削减多余疲劳",
    reviewWindow: "下一次下肢课后再复核",
    publishNote: "发布后让学员继续走恢复反馈，下一次下肢课前不再追加额外变量。",
    checklist: [
      "主项不再继续上调负荷",
      "辅助动作总量略降，保留训练感",
      "恢复反馈继续绑定到本版本",
    ],
    changes: [
      {
        id: "plan_change_1",
        sessionLabel: "下肢 A",
        exerciseLabel: "六角杠硬拉",
        fromValue: "4 x 5 @ 92.5kg + 继续进阶",
        toValue: "4 x 5 @ 85-90kg，不再进阶",
        tone: "decrease",
        reason: "先确认疼痛信号是否连续出现，再决定是否恢复进阶。",
      },
      {
        id: "plan_change_2",
        sessionLabel: "下肢 A",
        exerciseLabel: "节奏腿弯举",
        fromValue: "3 x 10",
        toValue: "2 x 10",
        tone: "decrease",
        reason: "减少收尾疲劳，让主项后的恢复窗口更干净。",
      },
      {
        id: "plan_change_3",
        sessionLabel: "热身门槛",
        exerciseLabel: "疼痛检查提示",
        fromValue: "无",
        toValue: "加入起杠前疼痛门槛",
        tone: "focus",
        reason: "把模糊不适变成可记录的判断门槛。",
      },
    ],
  },
  student_zhou: {
    studentId: "student_zhou",
    basedOnSession: "上肢 A",
    baseVersion: "2026 第 1 阶段 / 第 2 周 / v1",
    nextVersion: "2026 第 1 阶段 / 第 2 周 / v2",
    publishStatus: "可发布",
    reasonHeadline: "节奏已经回稳，但只允许一个最小进阶变量。",
    reasonDetail: "这类学员当前最怕的不是强度不够，而是因为一次加太多复杂度又把节奏打断。",
    evidenceSummary: "恢复反馈按时返回，睡眠和酸痛都在稳定区间，主项主观强度控制在计划内。",
    focusArea: "缓慢进阶，保住节奏",
    reviewWindow: "1 周后复核",
    publishNote: "发布后保持其余动作结构不动，只观察主项进阶后的承接感。",
    checklist: [
      "只增加一个主项变量",
      "不引入新的动作复杂度",
      "下周继续看完成度是否稳住",
    ],
    changes: [
      {
        id: "plan_change_4",
        sessionLabel: "上肢 A",
        exerciseLabel: "哑铃卧推",
        fromValue: "4 x 6 @ 26kg",
        toValue: "4 x 6 @ 28kg",
        tone: "increase",
        reason: "状态允许小步进阶，但不需要改动作结构。",
      },
      {
        id: "plan_change_5",
        sessionLabel: "上肢 A",
        exerciseLabel: "地雷杆推举",
        fromValue: "4 x 8 /侧",
        toValue: "3 x 8 /侧",
        tone: "hold",
        reason: "控制总复杂度，让本周主变化点只有一个。",
      },
    ],
  },
  student_mei: {
    studentId: "student_mei",
    basedOnSession: "全身重启课",
    baseVersion: "2026 第 1 阶段 / 重启 / v0",
    nextVersion: "2026 第 1 阶段 / 重启 / v1",
    publishStatus: "需教练复核",
    reasonHeadline: "下一个版本的目标不是刺激，而是重新建立可完成感。",
    reasonDetail: "当前问题不在疼痛，而在训练连续性已经断裂，所以下一个版本必须明显更容易完成。",
    evidenceSummary: "训练完成度只有 61%，没有明显疼痛，但重新进入训练节奏的成本很高。",
    focusArea: "降低阻力，恢复连续性",
    reviewWindow: "7 天后复核",
    publishNote: "发布后优先约定下一次固定训练窗口，不再同时推多余反馈问题。",
    checklist: [
      "把整节课压到 30 分钟内",
      "保留完成感而不是堆量",
      "七天内强制回看版本效果",
    ],
    changes: [
      {
        id: "plan_change_6",
        sessionLabel: "重启课",
        exerciseLabel: "整节课时长",
        fromValue: "45-50 分钟",
        toValue: "25-30 分钟",
        tone: "decrease",
        reason: "先把回到训练的门槛降下来。",
      },
      {
        id: "plan_change_7",
        sessionLabel: "重启课",
        exerciseLabel: "负重行走收尾",
        fromValue: "4 轮",
        toValue: "移除这个动作块",
        tone: "decrease",
        reason: "去掉最容易让用户提早退出的收尾段。",
      },
      {
        id: "plan_change_8",
        sessionLabel: "重启课",
        exerciseLabel: "完成目标",
        fromValue: "完成整节课",
        toValue: "完成前 2 个动作块",
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
