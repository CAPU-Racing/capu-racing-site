/**
 * 站点内容模型
 * ---------------------------------------------------------------------------
 * 这里集中存放「结构化内容」：学校与车队信息、四大组别、工程流程等。
 * 叙事型内容（Q&A、赛事动态）放在 content/ 目录下的 Markdown 中，
 * 由 src/lib/content.ts 读取，可在 /admin 后台编辑。
 *
 * ⚠️ 待车队确认真实数据的位置，全部用 PLACEHOLDER 注释标出。
 */

/* ========================= 学校信息 ========================= */
/* 均来自学校官方公开信息，请勿随意改动 */

export const school = {
  name: "成都航空职业技术大学",
  nameEn: "CHENGDU AERONAUTIC POLYTECHNIC UNIVERSITY",
  abbr: "成航",
  /** 建校年份 —— 校徽中的数字 */
  founded: 1965,
  /** 主校区（车队所在） */
  campus: "龙泉驿校区",
  address: "成都市龙泉驿区车城东七路699号",
  /** 校区所在地是成都经开区汽车产业带 */
  districtNote: "校区位于成都经开区（龙泉驿）汽车产业带，路名即为「车城东七路」",
  schoolUrl: "https://www.cap.edu.cn/",
} as const;

/* ========================= 车队信息 ========================= */

export const team = {
  name: "成航CAPU大学生方程式车队",
  nameEn: "CAPU RACING",
  slogan: "从设计到赛道，用工程实践定义大学时光",
  /** PLACEHOLDER —— 车队成立年份，待确认 */
  founded: 2017,
  /** PLACEHOLDER —— 参赛赛季数，待确认 */
  seasons: 6,
  /** PLACEHOLDER —— 现役成员规模，待确认（可写区间） */
  members: 60,
} as const;

/* ========================= 顶部公告 ========================= */
/**
 * 顶部公告条。
 * ---------------------------------------------------------------------------
 * - enabled 设为 false，整条公告就不显示。
 * - 换一条新公告时记得改 id（例如 "2026-race-result"），
 *   此前点过关闭的访客会重新看到新公告；id 不变则不会打扰他们。
 */

export const announcement = {
  enabled: true,
  /** 变更此值可让新公告重新对所有人展示 */
  id: "2026-recruit",
  label: "公告",
  /** 桌面端文案 */
  text: "2026 赛季招新进行中：电控、电池、线束、机械四个组别同时开放报名，不限专业与年级。",
  /** 移动端文案：窄屏会截断，因此单写一条短的 */
  textShort: "2026 赛季招新进行中，四个组别同时开放报名。",
  /** 整条公告可点击跳转 */
  href: "/join",
} as const;

/** 首页数据条：数字 + 单位 + 说明 */
export const teamStats = [
  {
    value: team.founded,
    label: "建队",
    labelEn: "Established",
    unit: "年",
    note: "依托成航航空工程背景组建",
    /** 年份不做滚动动效，避免出现无意义的中间值 */
    animated: false,
  },
  {
    value: 4,
    label: "技术组别",
    labelEn: "Systems",
    unit: "个",
    note: "电控 / 电池 / 线束 / 机械",
    animated: true,
  },
  {
    value: team.members,
    label: "现役成员",
    labelEn: "Members",
    unit: "人",
    note: "跨专业、跨年级协作",
    animated: true,
  },
  {
    value: team.seasons,
    label: "参赛赛季",
    labelEn: "Seasons",
    unit: "个",
    note: "从设计到整车联调的完整迭代",
    animated: true,
  },
] as const;

/* ========================= 导航 ========================= */

export type NavItem = {
  index: string;
  href: string;
  label: string;
  labelEn: string;
};

export const nav: NavItem[] = [
  { index: "01", href: "/", label: "首页", labelEn: "Home" },
  { index: "02", href: "/about", label: "车队介绍", labelEn: "About" },
  { index: "03", href: "/systems", label: "组别介绍", labelEn: "Systems" },
  { index: "04", href: "/qa", label: "Q&A", labelEn: "Questions" },
  { index: "05", href: "/news", label: "赛事动态", labelEn: "News" },
  { index: "06", href: "/contact", label: "联系我们", labelEn: "Contact" },
];

export const ctaNav: NavItem = {
  index: "07",
  href: "/join",
  label: "招新报名",
  labelEn: "Join Us",
};

/* ========================= 组别 ========================= */

export type SystemGlyph = "ecu" | "battery" | "harness" | "chassis";

export type System = {
  code: string;
  slug: string;
  name: string;
  nameEn: string;
  /** 一句话定位，出现在首页卡片 */
  role: string;
  /** 首页卡片上的一句话描述 */
  tagline: string;
  glyph: SystemGlyph;
  intro: string;
  work: { title: string; desc: string }[];
  stack: string[];
  path: { step: string; title: string; desc: string }[];
  /** 所需基础（对零基础同学最重要的一段） */
  basics: string[];
  faq: { q: string; a: string }[];
};

export const systems: System[] = [
  {
    code: "SYS-01",
    slug: "electronics",
    name: "电控组",
    nameEn: "ELECTRONICS & CONTROL",
    role: "控制中枢",
    tagline: "把驾驶意图翻译成整车能执行的指令",
    glyph: "ecu",
    intro:
      "如果说赛车是一台机器，电控组负责的是它的「判断力」。从驾驶员踩下踏板开始，到电机输出扭矩、仪表给出反馈，中间这一整条信号链路都由电控组设计和实现。",
    work: [
      {
        title: "VCU 整车控制器",
        desc: "定义整车状态机与控制逻辑，处理驾驶输入、扭矩分配、故障诊断与安全降级。",
      },
      {
        title: "BMS 电池管理",
        desc: "与电池组配合完成电芯电压/温度采集、均衡策略、SOC 估算与高压上下电时序。",
      },
      {
        title: "电机控制",
        desc: "整定电机控制器参数，标定扭矩映射，处理响应延迟与能量回收策略。",
      },
      {
        title: "CAN 通信",
        desc: "设计整车报文矩阵，连接 VCU、BMS、电机控制器、仪表与数据采集设备。",
      },
      {
        title: "传感器与仪表",
        desc: "选型与布置轮速、踏板、温度、IMU 等传感器，做数据记录与赛道复盘。",
      },
      {
        title: "嵌入式开发",
        desc: "在单片机/嵌入式平台上写驱动与应用代码，用 MATLAB/Simulink 做控制模型与仿真。",
      },
    ],
    stack: [
      "C / C++",
      "STM32",
      "CAN / CANopen",
      "MATLAB / Simulink",
      "FreeRTOS",
      "Python",
      "Altium Designer",
      "逻辑分析仪 / 示波器",
    ],
    path: [
      { step: "01", title: "C 语言基础", desc: "指针、结构体、位操作，能读懂一段嵌入式代码。" },
      { step: "02", title: "单片机入门", desc: "点亮 LED、读写寄存器、串口收发，搭起最小系统。" },
      { step: "03", title: "CAN 通信", desc: "理解报文帧结构，用两块板子互相收发数据。" },
      { step: "04", title: "嵌入式进阶", desc: "定时器、中断、任务调度，写出可靠的状态机。" },
      { step: "05", title: "VCU 开发", desc: "参与真实控制逻辑编写，接上台架做联动测试。" },
      { step: "06", title: "整车联调", desc: "上车调试，处理干扰、时序与实车标定问题。" },
    ],
    basics: [
      "会一点 C 语言即可，没写过单片机也没关系",
      "对电路、信号有兴趣，愿意动手焊板子、接线",
      "遇到问题时愿意自己查数据手册和资料",
    ],
    faq: [
      {
        q: "没有单片机基础可以进电控组吗？",
        a: "可以。组里大多数成员都是从零开始，先跟学长跑通一块最小系统板，再逐步参与 VCU 模块。关键是愿意花时间动手。",
      },
      {
        q: "电控组需要很强的数学吗？",
        a: "入门阶段基本不需要。涉及控制算法和标定时会用到一些信号与系统的基础，遇到再补完全来得及。",
      },
    ],
  },
  {
    code: "SYS-02",
    slug: "battery",
    name: "电池组",
    nameEn: "BATTERY & ENERGY",
    role: "能源管理",
    tagline: "整车的能量边界由这里决定",
    glyph: "battery",
    intro:
      "电池组负责整车的动力来源与高压安全。它既要在赛道上稳定输出大电流，也要在极限工况下保证不出意外——安全设计和性能设计在这里必须同时成立。",
    work: [
      {
        title: "电池系统设计",
        desc: "依据整车功率需求做电芯选型、串并数计算与模组结构排布。",
      },
      {
        title: "电池管理",
        desc: "设计采集电路与均衡方案，与电控组共同定义 BMS 与 VCU 的交互协议。",
      },
      {
        title: "安全保护",
        desc: "设计高压回路、熔断与继电器逻辑，落实绝缘、防护与紧急断电要求。",
      },
      {
        title: "测试与验证",
        desc: "完成电芯一致性测试、模组充放电、绝缘耐压与箱体密封测试。",
      },
    ],
    stack: [
      "电芯参数与选型",
      "BMS 硬件与固件",
      "高压安全规范",
      "热管理与仿真",
      "SolidWorks / CATIA",
      "充放电测试设备",
    ],
    path: [
      { step: "01", title: "电学基础", desc: "电压、电流、内阻、容量与串并联的关系。" },
      { step: "02", title: "电芯认知", desc: "认识不同体系的电芯，学会看数据手册。" },
      { step: "03", title: "模组装配", desc: "参与点焊、采样线布置与模组绝缘处理。" },
      { step: "04", title: "BMS 调试", desc: "读取采集数据，排查采样异常与均衡问题。" },
      { step: "05", title: "安全验证", desc: "参与高压上下电流程与绝缘测试，建立安全习惯。" },
    ],
    basics: [
      "对电有基本认知，最重要的是有安全意识",
      "愿意遵守高压作业规范，不凭感觉操作",
      "动手细致，能耐心做重复性测试与记录",
    ],
    faq: [
      {
        q: "电池组是不是很危险？",
        a: "正因为有风险，组内所有高压操作都有明确流程和双人复核，新生在前两年只参与低压测试与装配环节，逐步建立规范意识。",
      },
    ],
  },
  {
    code: "SYS-03",
    slug: "harness",
    name: "线束组",
    nameEn: "WIRING & CONNECTIVITY",
    role: "电气连接",
    tagline: "整车所有信号都要从这里走一遍",
    glyph: "harness",
    intro:
      "线束是赛车的「神经网络」。它把分散在整车各处的控制器、传感器、执行器连成一个整体，也往往是赛场上故障排查的第一现场。",
    work: [
      {
        title: "整车线束设计",
        desc: "根据电气原理图规划回路、选取线径与连接器，输出线束拓扑与加工图。",
      },
      {
        title: "线束制作",
        desc: "下料、压接、绞线、屏蔽、包裹，制作出可靠可维护的线束实物。",
      },
      {
        title: "布置与固定",
        desc: "在整车上规划走线路径，做防磨、防振、防水与热源避让。",
      },
      {
        title: "接口定义",
        desc: "维护全车连接器与针脚定义表，保证各组接线定义一致。",
      },
    ],
    stack: [
      "电气原理图识读",
      "连接器与线材选型",
      "压接与屏蔽工艺",
      "CATIA / SolidWorks 走线",
      "万用表 / 通断排查",
    ],
    path: [
      { step: "01", title: "看懂原理图", desc: "分清回路、净负与信号地，理解整车电气拓扑。" },
      { step: "02", title: "工艺上手", desc: "练压接、剥线、绞线，做出经得起振动的接头。" },
      { step: "03", title: "分段制作", desc: "负责一个子系统的线束制作与检验。" },
      { step: "04", title: "整车布线", desc: "参与整车走线规划与固定，处理干涉与防护。" },
      { step: "05", title: "故障排查", desc: "用万用表与示波器定位断路、短路与干扰问题。" },
    ],
    basics: [
      "细心、有条理，愿意做记录和表格",
      "手上不抖，愿意反复练习压接这类基本功",
      "对「整洁」有追求，能接受线束工艺的严格标准",
    ],
    faq: [
      {
        q: "线束组是不是只在打杂？",
        a: "恰恰相反。整车电气拓扑由线束组维护，故障排查时线束组通常是最能定义问题的人。做线束是对整车电气最系统的训练。",
      },
    ],
  },
  {
    code: "SYS-04",
    slug: "chassis",
    name: "机械组",
    nameEn: "CHASSIS & STRUCTURE",
    role: "结构设计制造",
    tagline: "赛车的几何与骨架从这里长出来",
    glyph: "chassis",
    intro:
      "机械组负责赛车的骨架与动态性能。底盘、悬架、转向、制动，决定了这台车能不能跑直、能不能进弯、能不能停下来。",
    work: [
      { title: "底盘与车架", desc: "车架结构设计、受力分析、焊接与定位夹具设计。" },
      { title: "悬架系统", desc: "悬架几何设计、弹簧阻尼匹配、四轮定位参数调整。" },
      { title: "转向系统", desc: "转向梯形设计、转向比与回正特性、方向盘与转向柱装配。" },
      { title: "制动系统", desc: "制动主缸与卡钳匹配、制动平衡调节、制动管路布置。" },
      { title: "加工与装配", desc: "零部件加工跟进、整车装配、公差控制与整车称重。" },
    ],
    stack: [
      "SolidWorks / CATIA",
      "ANSYS / 结构仿真",
      "机械原理与材料力学",
      "焊接 / 机加工工艺",
      "整车装配与调试",
    ],
    path: [
      { step: "01", title: "制图基础", desc: "看懂三视图与公差标注，会用三维软件建模。" },
      { step: "02", title: "零件设计", desc: "从支架、摇臂这类小件开始做设计与出图。" },
      { step: "03", title: "子系统", desc: "跟完一套子系统的设计、加工到装配全过程。" },
      { step: "04", title: "仿真验证", desc: "做受力分析与工况校核，学会用数据说服别人。" },
      { step: "05", title: "整车调校", desc: "参与赛道测试，读数据调悬架与转向参数。" },
    ],
    basics: [
      "对机械结构有兴趣，愿意长时间泡在车间",
      "能接受加工误差带来的反复返工",
      "愿意学软件（SolidWorks 等），但更重要的是肯动手",
    ],
    faq: [
      {
        q: "机械组是不是要很强的动手能力才能进？",
        a: "动手能力是练出来的。新生进来会先跟着做拆装和简单零件加工，一个赛季下来基本都能独立完成设计到装配的闭环。",
      },
    ],
  },
];

/* ========================= 工程流程 ========================= */

export const processSteps = [
  {
    step: "01",
    title: "设计",
    desc: "明确性能目标，做方案对比与结构设计，输出图纸与仿真校核结果。",
  },
  {
    step: "02",
    title: "开发",
    desc: "编写控制代码、搭建电气系统、定义接口协议，先在台架上把逻辑跑通。",
  },
  {
    step: "03",
    title: "制作",
    desc: "零件加工、车架焊接、线束制作、电池模组装配，把图纸变成实物。",
  },
  {
    step: "04",
    title: "调试",
    desc: "分系统上电、通信联调、参数标定，逐个解决干扰、时序与配合问题。",
  },
  {
    step: "05",
    title: "测试",
    desc: "静态检查、低速试车、赛道测试，采集数据评估整车状态。",
  },
  {
    step: "06",
    title: "改进",
    desc: "依据测试数据复盘，修改设计并进入下一轮迭代，把问题留在本赛季。",
  },
] as const;

/* ========================= 车队 vs 兴趣社团 ========================= */

export const comparison = [
  { topic: "产出物", club: "活动记录与推送", team: "一台可以上赛道跑的车" },
  { topic: "评价标准", club: "参与人数与活跃度", team: "整车性能数据与可靠性" },
  { topic: "时间节奏", club: "活动期集中投入", team: "全年推进，赛前进入密集期" },
  { topic: "技能来源", club: "兴趣自学为主", team: "有明确技术栈与传帮带路径" },
  { topic: "面对失败", club: "重办一次活动", team: "回到设计阶段找根因" },
  { topic: "能力沉淀", club: "组织与沟通", team: "工程方法 + 真实项目经历" },
] as const;

/* ========================= 适合什么样的人 ========================= */

export const traits = [
  {
    title: "愿意学",
    desc: "面对没接触过的知识不先否定自己，愿意从文档和教程里找答案。",
  },
  {
    title: "愿意做",
    desc: "接受了任务就推进到有结果，而不是停在「我试试看」。",
  },
  {
    title: "遇到问题愿意查",
    desc: "比赛现场没有标准答案，能自己定位问题的人成长最快。",
  },
  {
    title: "能接受不完美",
    desc: "工程是迭代出来的，第一版方案被推翻是常态。",
  },
] as const;

/* ========================= 使命愿景 ========================= */

export const missionVision = {
  mission:
    "让每一个愿意动手的学生，都能真实参与一台赛车从图纸到赛道的过程，并在其中获得可迁移的工程能力。",
  vision:
    "成为成航学生工程实践的入口——不是把知识讲一遍，而是把问题交给你，让你在解决它的过程中变成工程师。",
} as const;

/* ========================= 联系方式 ========================= */
/* PLACEHOLDER —— 以下均为待确认信息，请替换为车队真实联系方式 */

export const contact = {
  email: "capu-racing@example.com",
  /** 联系电话（对外咨询） */
  phone: "028-0000 0000",
  /** 工作室位置 */
  location: "成都航空职业技术大学 · 龙泉驿校区 · 车队工作室",
  address: school.address,
  channels: [
    { label: "微信公众号", value: "成航CAPU方程式车队", note: "招新通知首发渠道", qr: null },
    { label: "QQ 咨询群", value: "群号待公布", note: "日常答疑与资料分享", qr: null },
    { label: "B 站", value: "CAPU Racing", note: "整车测试与赛事记录", qr: null },
    { label: "邮箱", value: "capu-racing@example.com", note: "合作与赞助联系", qr: null },
  ],
  /** 位于学校的实验室/工作室描述 */
  visitNote: "校外来访请提前通过邮箱或公众号留言预约，由车队成员引导进入工作室。",
} as const;

/* ========================= 报名表单选项 ========================= */

export const gradeOptions = [
  "大一",
  "大二",
  "大三",
  "大四",
  "专升本",
  "研究生",
] as const;

export const intentOptions = [
  { value: "electronics", label: "电控组" },
  { value: "battery", label: "电池组" },
  { value: "harness", label: "线束组" },
  { value: "chassis", label: "机械组" },
  { value: "unsure", label: "暂不确定" },
] as const;

export const joinSteps = [
  { step: "01", title: "填写报名表", desc: "线上提交基本信息与意向组别，整个过程约 3 分钟。" },
  { step: "02", title: "收到确认", desc: "车队会在招新周期内通过电话或微信与你联系。" },
  { step: "03", title: "见面交流", desc: "一次轻松的交流，聊聊你的兴趣和想做的事情。" },
  { step: "04", title: "进入培养", desc: "分配到组别，跟着学长从第一个小任务开始。" },
] as const;

/** 站点元信息 */
export const siteMeta = {
  title: "成航CAPU大学生方程式车队",
  description:
    "成航CAPU大学生方程式车队官方站点。从设计到赛道，用工程实践定义大学时光。了解电控组、电池组、线束组、机械组的工作内容与学习路径，并在线报名加入。",
  keywords: [
    "成航CAPU",
    "大学生方程式",
    "FSAE",
    "成都航空职业技术大学",
    "方程式赛车队",
    "车队招新",
    "电控组",
    "电池组",
    "线束组",
    "机械组",
  ],
} as const;
