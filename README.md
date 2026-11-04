# 🏛️ AI Paper Lab ｜ 顶级 AI 论文精读与交互探索平台

<div align="center">

**一个论文一个独立文件夹 · 主页统一路由调度 · 亮色/暗色双套学术主题 · 可交互算法实验台**

[![Architecture](https://img.shields.io/badge/Architecture-One%20Paper%20One%20Folder-10b981?style=flat-square)](#)
[![Theme](https://img.shields.io/badge/Theme-Light%20%26%20Dark%20Mode-f59e0b?style=flat-square)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square)](#)
[![Tests](https://img.shields.io/badge/Unit%20Tests-Passing-22c55e?style=flat-square)](#)

</div>

---

## 🌟 项目愿景与设计理念

传统的论文阅读往往受限于静态枯燥的 PDF 文档：初学者面对密集的数学符号和生僻术语望而却步，而资深研究者也缺乏直观验证算法中间状态（如注意力分布、树搜索剪枝、Logits 概率变化）的交互工具。

**AI Paper Lab** 旨在将每一篇改变领域走向的重磅 AI 论文，转化为一套**“可读、可玩、可测、可对比”**的交互式 Web 探索系统：

1. **🎯 零门槛与高保真兼得**：既提供适合初学者的**「5分钟通俗白话导览 + 生活化比喻 + 即测即练小问答」**，又完整保留**「中英双语逐段对照精读 + 严谨数学推导 + 实验基准全表」**，绝不丢失任何学术细节。
2. **🔬 在线算法实验台（Interactive Simulator）**：将论文的核心算法提炼为纯 TypeScript 引擎，支持在网页端实时输入 Query、调整超参数（如 Beam Width）、单步观察 Prompt 构造与模型打分。
3. **🌗 亮色 / 暗色双套主题（Dual Theme System）**：
   - **☀️ 亮色模式（Light Scholarly Paper）**：模拟温暖高对比度的学术纸张质感，适合长时间沉浸式精读与做笔记。
   - **🌙 暗色模式（Dark Geek Terminal）**：深邃极客暗黑配色，凸显代码终端、数学公式与概率分布图表的层次感。
   - 支持一键无缝切换并自动记忆用户偏好（`localStorage` 持久化）。
4. **📦 “一个论文一个文件夹”插件化架构**：主页大厅（`PaperHub`）统一负责论文检索、分类过滤与 Hash 路由分发；每篇论文拥有完全独立的子目录，互不耦合、即插即用。

---

## 📂 项目目录结构与模块职责

```text
/                                                           # 仓库根目录 (全局门户与构建宿主)
├── index.html                                              # 🌐 全局门户入口 HTML
├── README.md                                               # 📖 平台总览、架构规范与新论文接入指南 (本文档)
├── package.json                                            # 📦 全局依赖管理与一键脚本 (dev / build / test)
├── vite.config.ts                                          # ⚙️ Vite 构建配置与路径别名 (@, @papers)
├── tsconfig.json                                           # ⚙️ TypeScript 严格模式与模块映射
│
├── src/                                                    # 💻 全局门户与共享基础设施层
│   ├── main.tsx                                            # 挂载入口
│   ├── index.css                                           # 🎨 全局样式表与【亮色/暗色双套主题】自适应引擎
│   ├── App.tsx                                             # 🧭 动态路由调度器 (根据 URL Hash 动态挂载对应论文模块)
│   ├── portal/
│   │   └── PaperHub.tsx                                    # 🏛️ 论文探索大厅 (论文卡片矩阵、分类筛选、全文检索)
│   └── shared/                                             # 🧩 跨论文共享核心库
│       ├── types/
│       │   └── paper.ts                                    # 统一的论文注册表接口与模块 Props 契约
│       ├── theme/
│       │   └── ThemeContext.tsx                            # 全局亮色/暗色主题 Context 状态管理与持久化
│       └── components/
│           └── ThemeToggle.tsx                             # 通用亮色/暗色主题切换组件
│
└── papers/                                                 # 📚 论文独立模块仓库 (One Paper, One Folder)
    ├── registry.ts                                         # 📋 全局论文注册表 (集中登记所有论文元数据与组件入口)
    │
    ├── Retriever-Free-Retrieval-Navigating-Documents-with-Decision-Models/  # 📁 [已上线] 论文 01: DecisionRAG
    │   ├── README.md                                       # 📄 该论文专属中文深度解析文档
    │   ├── index.html                                      # 🌐 该论文独立入口页
    │   ├── package.json                                    # 📦 该论文独立包描述文件
    │   └── src/                                            # 💻 该论文完整交互系统源码
    │       ├── App.tsx                                     # 论文内部主视图控制器
    │       ├── components/                                 # 五大交互模块组件
    │       │   ├── Header.tsx                              # 论文顶栏 (含返回大厅、导航Tab、语种、字号、主题切换)
    │       │   ├── BeginnerGuide.tsx                       # 模块1：5分钟通俗图文导览与互动自测问答
    │       │   ├── PaperReader.tsx                         # 模块2：全文7大章节精读 (中文/双语/英文 + 白话拆解)
    │       │   ├── NavigationSimulator.tsx                 # 模块3：DecisionRAG 分层决策树导航在线实验台
    │       │   ├── ComparisonMatrix.tsx                    # 模块4：五大检索范式与四大 Benchmark 对比矩阵
    │       │   └── GlossaryView.tsx                        # 模块5：核心概念双解词典 (生活比喻 + 严谨定义)
    │       ├── data/                                       # 结构化学术数据集
    │       │   ├── paperContent.ts                         # 论文完整中英对照译文、公式与要点
    │       │   ├── mockTreeCorpus.ts                       # 维基百科、IBM Cloud、政府政策三级模拟语料树
    │       │   └── glossary.ts                             # 11+ 核心学术概念双解词库
    │       └── utils/                                      # 纯算法逻辑与单元测试
    │           ├── treeNavigation.ts                       # 单步前向传播 Logit 打分、Softmax 与 Beam Search 引擎
    │           └── treeNavigation.test.ts                  # Node.js 原生单元测试套件
    │
    ├── GraphRAG-Unifying-Retrieval-and-Knowledge-Graphs/   # 📁 [规划中] 论文 02: GraphRAG
    └── Self-RAG-Learning-to-Retrieve-Generate-and-Critique/# 📁 [规划中] 论文 03: Self-RAG
```

---

## 🔌 如何添加一篇新论文？（3 步标准化接入规范）

得益于**动态注册表路由（Dynamic Registry Routing）**与**全局双主题自适应引擎**，往平台中添加第 2 篇、第 10 篇新论文时，**完全不需要修改根目录路由代码**，只需遵循以下 3 个步骤：

### 第一步：在 `papers/` 下新建以论文英文标题命名的文件夹

```bash
mkdir -p papers/Your-New-Paper-Title/src/{components,data,utils}
```

### 第二步：实现论文内部模块与专属 `README.md`

在 `papers/Your-New-Paper-Title/src/App.tsx` 中导出默认组件，接收标准 `PaperModuleProps`（包含 `onBackToHub` 回调与 `initialView` 初始子视图）：

```tsx
import React from 'react';
import { PaperModuleProps } from '../../../src/shared/types/paper.js';
import { ThemeToggle } from '../../../src/shared/components/ThemeToggle.js';

export default function YourNewPaperApp({ onBackToHub, initialView }: PaperModuleProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="p-4 border-b border-slate-800 flex justify-between items-center">
        <button onClick={onBackToHub}>← 返回大厅</button>
        <ThemeToggle />
      </header>
      {/* 你的论文精读、概念拆解与交互实验台 */}
    </div>
  );
}
```

> 💡 **主题适配小贴士**：编写新论文组件时，只需使用标准 Tailwind 类名（如 `bg-slate-950`、`bg-slate-900`、`text-white`、`text-slate-300`、`border-slate-800`），根目录的 `src/index.css` 主题引擎会自动将其无缝映射为**亮色/暗色两套高对比度配色**！

### 第三步：在 `papers/registry.ts` 中注册登记

打开 `papers/registry.ts`，导入你的论文组件并在 `REGISTERED_PAPERS` 数组中添加一条记录：

```typescript
import YourNewPaperApp from './Your-New-Paper-Title/src/App.js';

// 在 REGISTERED_PAPERS 数组末尾追加：
{
  id: 'your-paper-slug',
  folderName: 'Your-New-Paper-Title',
  titleZh: '论文中文完整译名',
  titleEn: 'Original English Paper Title',
  arxivId: 'arXiv:26XX.XXXXX',
  doi: 'https://doi.org/10.48550/arXiv.26XX.XXXXX',
  authors: ['Author A', 'Author B'],
  affiliations: ['University / Lab'],
  publishDate: '2026年X月',
  category: 'RAG与检索', // 可选：'RAG与检索' | '大模型架构' | '智能体与推理' | '知识图谱'
  tags: ['Tag1', 'Tag2'],
  status: 'active',
  tldrZh: '用一段通俗精炼的话总结这篇论文解决的核心痛点与取得的突破性指标...',
  keyMetrics: [
    { label: '核心指标提升', value: '+15.2%', highlight: true }
  ],
  features: ['5分钟速通', '双语精读', '交互实验台'],
  component: YourNewPaperApp
}
```

保存后，主页大厅会自动渲染该论文的展示卡片、支持分类与搜索，并自动开启 `#/paper/your-paper-slug` 路由访问！

---

## 🔥 首篇精读论文详解：DecisionRAG (arXiv:2610.35868)

| 属性 | 详情 |
| :--- | :--- |
| **英文标题** | *Retriever-Free Retrieval: Navigating Documents with Decision Models* |
| **中文译名** | 免检索器的检索架构：利用决策模型在文档层级树中智能导航 |
| **作者团队** | Chao Wan (万超), Paul Jünger, Beixi Du (杜北希), Bodong Liu (刘博东), Navaneetha Krishnan, Kilian Q. Weinberger |
| **研究机构** | 康奈尔大学 (Cornell University) & ASAPP Research |
| **原文链接** | [https://doi.org/10.48550/arXiv.2610.35868](https://doi.org/10.48550/arXiv.2610.35868) |
| **专属目录** | [`papers/Retriever-Free-Retrieval-Navigating-Documents-with-Decision-Models/`](./papers/Retriever-Free-Retrieval-Navigating-Documents-with-Decision-Models/README.md) |

### 核心思想一图流对比

```text
【传统两阶段向量 RAG 管线】
用户提问 ──► 向量数据库粗筛 (易漏检关键段落!) ──► 8B 重排器 (巧妇难为无米之炊) ──► 下游 LLM 被迫幻觉

【DecisionRAG 免检索器层级导航】
用户提问 ──► 预训练决策模型 (LLM) 沿着文档天然层级树逐层下钻：
            [第1层: 领域 Domain] ──(单次前向传播 + 共享上下文 PK + 束搜索剪枝)──►
            [第2层: 文档 Document] ──(0 Token 生成，直接读取选项 Logits)──►
            [第3层: 章节 Section] ──(耗时仅 0.7~1.8 秒)──►
            [第4层: 精准命中目标段落 Passage!] (MultiDoc2Dial R@1 +13.8%, NQ Hit@1 +17.4%)
```

---

## 🛠️ 快速开始与常用命令

```bash
# 1. 安装依赖
npm install

# 2. 启动本地开发服务器 (默认监听 http://localhost:3000)
npm run dev

# 3. 运行纯逻辑算法单元测试 (Node.js 原生测试运行器)
npm test

# 4. TypeScript 类型安全检查
npm run lint

# 5. 构建生产环境静态包
npm run build
```

---

## 📝 学术引用 (BibTeX)

```bibtex
@article{wan2026decisionrag,
  title={Retriever-Free Retrieval: Navigating Documents with Decision Models},
  author={Wan, Chao and J{\"u}nger, Paul and Du, Beixi and Liu, Bodong and Krishnan, Navaneetha and Weinberger, Kilian Q.},
  journal={arXiv preprint arXiv:2610.35868},
  year={2026},
  doi={10.48550/arXiv.2610.35868}
}
```
