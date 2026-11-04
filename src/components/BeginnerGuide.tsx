import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Library, 
  Zap, 
  Layers, 
  Bot, 
  Database,
  Search,
  Scale
} from 'lucide-react';
import { PAPER_META } from '../data/paperContent.js';

interface BeginnerGuideProps {
  onGoToSimulator: () => void;
  onGoToPaper: () => void;
}

export const BeginnerGuide: React.FC<BeginnerGuideProps> = ({ onGoToSimulator, onGoToPaper }) => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: number]: number | null }>({
    1: null,
    2: null,
    3: null
  });

  const steps = [
    {
      title: "第一步：传统 RAG 到底痛在哪里？",
      subtitle: "『盲人摸象』式的向量压缩与不可逆的召回断层",
      badge: "痛点剖析",
      icon: Database,
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <p>
            平常大家听说的 <strong>RAG（检索增强生成）</strong>，工作流程通常是这样的：
          </p>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300">
            用户提问 ➔ <span className="text-amber-400">向量检索器 (向量数据库)</span> ➔ 抓取前100篇段落 ➔ 送给 <span className="text-emerald-400">大模型 (LLM)</span> 回答
          </div>
          <p>
            这里潜藏了一个巨大的隐患，论文称之为 <strong className="text-amber-300">『检索能力不对称性（Capability Asymmetry）』</strong>：
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/30">
              <span className="text-xs font-semibold text-red-400 flex items-center gap-1.5 mb-1">
                <XCircle className="w-3.5 h-3.5" /> 传统向量检索 (Retriever)
              </span>
              <p className="text-xs text-slate-400">
                把几百字的复杂长句强行压缩成一串几千个浮点数的『向量』。遇到否定句、多重约束条件或冷门专业词，向量距离经常算错，导致第一阶段就<strong>漏掉了正确答案所在的网页</strong>。
              </p>
            </div>
            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 下游大模型 (Generator)
              </span>
              <p className="text-xs text-slate-400">
                哪怕下游用的是智商极高的大模型，但它只能读上游喂给它的内容。如果上游漏掉了真实段落，大模型<strong>巧妇难为无米之炊</strong>，只能被迫瞎编（产生幻觉）或说“未找到”。
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "第二步：灵感来源 —— 图书馆借书隐喻",
      subtitle: "人类从不会把图书馆所有书撕碎，而是按分类目录顺藤摸瓜",
      badge: "范式突破",
      icon: Library,
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <p>
            康奈尔大学的研究团队提出了一个绝妙的反思：<strong>现实中人类到底是怎么检索海量资料的？</strong>
          </p>
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <strong className="text-slate-200 text-xs">大楼导览 (Domain)：</strong>
                <span className="text-slate-400 text-xs"> 进门先看楼层牌，科学技术在三楼，文学在二楼，直奔三楼。</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <strong className="text-slate-200 text-xs">书架分类 (Document)：</strong>
                <span className="text-slate-400 text-xs"> 走到物理专区，找到《石墨烯与新材料研究》这本书。</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <strong className="text-slate-200 text-xs">目录章节 (Section)：</strong>
                <span className="text-slate-400 text-xs"> 翻开书本目录，浏览『第三章：2010年诺贝尔物理学奖历程』。</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                4
              </div>
              <div>
                <strong className="text-slate-200 text-xs">目标正文 (Passage)：</strong>
                <span className="text-slate-400 text-xs"> 翻到对应页面，立刻读到了准确的获奖人和年份！</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-emerald-300 font-medium bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
            💡 <strong>启示：</strong>真正的知识从不是孤立的一维散装切块，而是天然具有层级树结构的。只要让大模型沿着树状结构逐层做选择题，就能直接定位到精准段落！
          </p>
        </div>
      )
    },
    {
      title: "第三步：DecisionRAG 的三大黑科技",
      subtitle: "免检索器、单步零Token打分与共享上下文横向对比",
      badge: "核心技术",
      icon: Zap,
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2.5">
                <Bot className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-slate-100 mb-1">1. 免检索器 (Retriever-Free)</h4>
              <p className="text-xs text-slate-400 leading-normal">
                彻底扔掉向量数据库、向量模型和倒排索引！不再由低智商的粗筛模型做第一步，而是直接由通用预训练大模型亲自操盘导航。
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2.5">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-slate-100 mb-1">2. 零 Token 生成 (Zero-Token)</h4>
              <p className="text-xs text-slate-400 leading-normal">
                无需等待大模型逐字吐出几百字的思考文字！把选项喂给大模型后，仅做 1 次前向计算直接读取选项的 Logit 分数，几十毫秒就能决定走向！
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2.5">
                <Scale className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-slate-100 mb-1">3. 共享上下文横向对比</h4>
              <p className="text-xs text-slate-400 leading-normal">
                把同级所有选项写在同一个题目里让大模型横向挑出最好的，利用自注意力机制让候选选项相互比较，彻底避免各打各分的偏误。
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "第四步：实测成绩 —— 碾压 8B 顶尖重排器",
      subtitle: "召回率暴涨 13.8~17.4 点，检索速度只要 0.7~1.8 秒",
      badge: "实测效果",
      icon: Layers,
      content: (
        <div className="space-y-4 text-slate-300 text-sm leading-relaxed">
          <p>
            在包含 <strong>268 万维基百科段落</strong>的大型知识库和美国政府法规数据集上，DecisionRAG 的战绩堪称震撼：
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30">
              <span className="text-[11px] text-emerald-400 font-semibold uppercase tracking-wider">MultiDoc2Dial 政策法规基准</span>
              <div className="text-2xl font-black text-white mt-1 mb-0.5 flex items-baseline gap-2">
                <span>+13.8</span>
                <span className="text-xs font-normal text-emerald-400">R@1 召回率提升</span>
              </div>
              <p className="text-xs text-slate-400">
                从 46.2% 直接跃升到 60.0%，超越了参数量高达 80 亿的重排大模型！
              </p>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-teal-950/40 to-slate-900 border border-teal-500/30">
              <span className="text-[11px] text-teal-400 font-semibold uppercase tracking-wider">Natural Questions 268万段落</span>
              <div className="text-2xl font-black text-white mt-1 mb-0.5 flex items-baseline gap-2">
                <span>+17.4</span>
                <span className="text-xs font-normal text-teal-400">Hit@1 命中率提升</span>
              </div>
              <p className="text-xs text-slate-400">
                第一发直接正中靶心的概率大幅攀升，抗噪音干扰能力展现统治级实力。
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">单次端到端检索耗时：</span>
            <span className="font-mono font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              ⚡ 0.7 秒 ~ 1.8 秒
            </span>
          </div>
        </div>
      )
    }
  ];

  const quiz = [
    {
      id: 1,
      question: "为什么说传统 RAG 存在『检索能力不对称性』？",
      options: [
        "因为生成模型太慢，而检索模型太快",
        "因为下游生成大模型很聪明，但上游向量检索容易粗筛丢关键文档，且大模型无法挽回丢失的内容",
        "因为向量数据库比大模型更贵",
        "因为大模型不需要任何外部知识就能完全答对"
      ],
      correctIndex: 1,
      explanation: "正确！传统 RAG 的上游检索器能力弱，一旦第一阶段把正确答案漏掉，下游生成大模型无论多么聪明也无法无中生有。"
    },
    {
      id: 2,
      question: "DecisionRAG 为什么能够把大模型检索的速度做到 0.7~1.8 秒？",
      options: [
        "因为它把大模型参数压缩到了 10KB",
        "因为它只检索 10 个单词的短句",
        "因为它采用『单步前向传播零Token生成』，直接看选项输出概率，不逐字生成任何废话文本",
        "因为它把所有大模型调用改为了传统百度搜索"
      ],
      correctIndex: 2,
      explanation: "完全正确！常规大模型慢是因为要逐字自回归吐出几百个词；DecisionRAG 只需要一次前向计算提取选项 Logit，几十毫秒就能完成一层决策！"
    },
    {
      id: 3,
      question: "DecisionRAG 中的『共享上下文打分（Shared-Context Scoring）』相比传统向量检索有什么核心优势？",
      options: [
        "可以同时给所有候选分支横向对比，利用自注意力机制避免各自关在小黑屋打分造成的偏差",
        "只能评估英文字符，不能评估中文",
        "可以把所有候选分支合并成一个单一文件保存",
        "不需要任何算力消耗"
      ],
      correctIndex: 0,
      explanation: "正解！将所有候选选项放到同一个上下文窗口里，模型能横向比对各自的优势与劣势，从而给出更客观准确的相对胜出概率。"
    }
  ];

  const handleSelectQuiz = (qId: number, optIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>面向初学者的 5 分钟通俗图文导览</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            什么是 DecisionRAG？为什么它被誉为下一代 RAG 的重大突破？
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            不用晦涩的数学公式，用通俗的比喻带你了解这篇来自康奈尔大学（Cornell）的重磅论文：它是如何彻底打破向量数据库的固有枷锁，让大模型像人类图书管理员一样精准找书的。
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onGoToSimulator}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <span>进入决策导航实验台亲自试玩</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onGoToPaper}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
            >
              <span>阅读完整论文翻译</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step by Step Visual Guide Carousel / Tabs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>四步掌握核心精髓</span>
            <span className="text-xs font-normal text-slate-400">(点击下方卡片依次解锁)</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {activeStep + 1} / {steps.length}
          </span>
        </div>

        {/* Tab selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            const isCurrent = activeStep === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-slate-800 border-emerald-500/60 shadow-md ring-1 ring-emerald-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isCurrent ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                  }`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isCurrent ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800/80 text-slate-500'
                  }`}>
                    STEP 0{idx + 1}
                  </span>
                </div>
                <div className="font-semibold text-xs text-slate-200 line-clamp-1">{st.badge}</div>
              </button>
            );
          })}
        </div>

        {/* Active Step Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                {steps[activeStep].badge}
              </span>
              <h4 className="text-lg font-bold text-white mt-0.5">
                {steps[activeStep].title}
              </h4>
              <p className="text-xs text-slate-400">{steps[activeStep].subtitle}</p>
            </div>
          </div>

          <div>{steps[activeStep].content}</div>

          <div className="pt-2 flex justify-between items-center text-xs text-slate-400 border-t border-slate-800/80">
            <button
              disabled={activeStep === 0}
              onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 cursor-pointer"
            >
              上一环节
            </button>
            <button
              disabled={activeStep === steps.length - 1}
              onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-slate-950 font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-500 cursor-pointer flex items-center gap-1"
            >
              <span>下一环节</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Comprehension Quiz */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">
            初学者即测即练：你掌握核心逻辑了吗？
          </h3>
        </div>

        <div className="space-y-6">
          {quiz.map((q, idx) => {
            const selected = quizAnswers[q.id];
            const isAnswered = selected !== null;
            const isCorrect = selected === q.correctIndex;

            return (
              <div key={q.id} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="font-medium text-slate-200 text-sm">{q.question}</div>
                </div>

                <div className="space-y-2 pl-7">
                  {q.options.map((opt, optIdx) => {
                    const isThisSelected = selected === optIdx;
                    let btnStyle = "bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800";

                    if (isAnswered) {
                      if (optIdx === q.correctIndex) {
                        btnStyle = "bg-emerald-950/40 border-emerald-500 text-emerald-300 font-medium";
                      } else if (isThisSelected && !isCorrect) {
                        btnStyle = "bg-red-950/40 border-red-500 text-red-300";
                      } else {
                        btnStyle = "bg-slate-900/40 border-slate-800/40 text-slate-500";
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isAnswered}
                        onClick={() => handleSelectQuiz(q.id, optIdx)}
                        className={`w-full p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                        {isAnswered && optIdx === q.correctIndex && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />
                        )}
                        {isAnswered && isThisSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div className={`mt-2 p-3 rounded-lg text-xs leading-relaxed ml-7 ${
                    isCorrect ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-800/30' : 'bg-amber-950/30 text-amber-300 border border-amber-800/30'
                  }`}>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
