import React, { useState, useMemo } from 'react';
import { 
  Play, 
  RotateCcw, 
  ChevronRight, 
  Cpu, 
  CheckCircle, 
  Sliders, 
  Zap, 
  Layers, 
  FileText, 
  Info,
  Terminal,
  Clock,
  Sparkles
} from 'lucide-react';
import { 
  runDecisionRagNavigation, 
  NavigationResult, 
  NavigationStep, 
  CandidateBranch 
} from '../utils/treeNavigation.js';
import { 
  CORPUS_PRESETS, 
  PRESET_QUERIES, 
  PredefinedQuery 
} from '../data/mockTreeCorpus.js';

export const NavigationSimulator: React.FC = () => {
  const [selectedCorpusId, setSelectedCorpusId] = useState<string>('wikipedia');
  const [queryInput, setQueryInput] = useState<string>(PRESET_QUERIES[0].query);
  const [beamWidth, setBeamWidth] = useState<number>(2);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [showPromptInspector, setShowPromptInspector] = useState<boolean>(false);

  const currentCorpus = useMemo(() => {
    return CORPUS_PRESETS.find(c => c.id === selectedCorpusId) || CORPUS_PRESETS[0];
  }, [selectedCorpusId]);

  // Run the pure navigation algorithm
  const navResult: NavigationResult = useMemo(() => {
    return runDecisionRagNavigation(queryInput, currentCorpus.rootNodes, beamWidth);
  }, [queryInput, currentCorpus, beamWidth]);

  const maxSteps = navResult.steps.length;

  const currentStep: NavigationStep | undefined = navResult.steps[activeStepIndex];

  const handleSelectPresetQuery = (pq: PredefinedQuery) => {
    setQueryInput(pq.query);
    setActiveStepIndex(0);
    // Find matching corpus
    if (pq.category.includes('维基')) setSelectedCorpusId('wikipedia');
    else if (pq.category.includes('IBM')) setSelectedCorpusId('ibm-cloud');
    else if (pq.category.includes('政策')) setSelectedCorpusId('multidoc');
  };

  const handleNextStep = () => {
    if (activeStepIndex < maxSteps - 1) {
      setActiveStepIndex(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setActiveStepIndex(0);
  };

  const handleRunToEnd = () => {
    setActiveStepIndex(maxSteps - 1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Simulator Header & Description */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>DecisionRAG 分层决策导航实验台</span>
                <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                  真实单步前向模拟
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                亲眼观察预训练决策模型如何在层级树中通过单步 Logits 打分、束搜索剪枝与共享上下文对比，直接精确定位目标正文。
              </p>
            </div>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-3 text-xs bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-medium">
              <Zap className="w-4 h-4" />
              <span>零Token生成 (0 Tokens)</span>
            </div>
            <span className="text-slate-700">|</span>
            <div className="flex items-center gap-1.5 text-slate-300 font-mono">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>预估延迟: ~{navResult.stats.estimatedLatencyMs}ms</span>
            </div>
          </div>
        </div>

        {/* Preset Query Chips */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>推荐预设测试问题（点击快速载入）：</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {PRESET_QUERIES.map((pq) => (
              <button
                key={pq.id}
                onClick={() => handleSelectPresetQuery(pq)}
                className={`text-xs px-3 py-1.5 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-2 ${
                  queryInput === pq.query
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 ring-1 ring-emerald-500/30'
                    : 'bg-slate-950/60 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                <span className="line-clamp-1">{pq.query}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Query & Configuration Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2">
          {/* Custom Query Input */}
          <div className="md:col-span-6 space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">检索查询意图 (Query):</label>
            <input
              type="text"
              value={queryInput}
              onChange={(e) => {
                setQueryInput(e.target.value);
                setActiveStepIndex(0);
              }}
              placeholder="输入查询内容，例如：石墨烯哪一年获诺贝尔奖？"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60"
            />
          </div>

          {/* Corpus Selector */}
          <div className="md:col-span-3 space-y-1">
            <label className="text-[11px] font-semibold text-slate-400">层级语料库选择:</label>
            <select
              value={selectedCorpusId}
              onChange={(e) => {
                setSelectedCorpusId(e.target.value);
                setActiveStepIndex(0);
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500/60 cursor-pointer"
            >
              {CORPUS_PRESETS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameZh}
                </option>
              ))}
            </select>
          </div>

          {/* Beam Width Slider */}
          <div className="md:col-span-3 space-y-1">
            <div className="flex justify-between items-center text-[11px]">
              <label className="font-semibold text-slate-400">束宽 Beam Width (B):</label>
              <span className="text-emerald-400 font-mono font-bold">{beamWidth}</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="range"
                min="1"
                max="3"
                step="1"
                value={beamWidth}
                onChange={(e) => {
                  setBeamWidth(Number(e.target.value));
                  setActiveStepIndex(0);
                }}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>B=1 (贪心)</span>
              <span>B=2 (标准)</span>
              <span>B=3 (宽束)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step Navigator Bar & Playback Controls */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400">导航步骤:</span>
          {navResult.steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStepIndex(idx)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeStepIndex === idx
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : idx < activeStepIndex
                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <span>第 {idx + 1} 步: {s.levelName}</span>
              {idx < activeStepIndex && <CheckCircle className="w-3 h-3" />}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs flex items-center gap-1 cursor-pointer"
            title="重置至初始步骤"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">重置</span>
          </button>
          <button
            disabled={activeStepIndex === 0}
            onClick={handlePrevStep}
            className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700 text-xs cursor-pointer"
          >
            上一步
          </button>
          <button
            disabled={activeStepIndex === maxSteps - 1}
            onClick={handleNextStep}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-semibold disabled:opacity-40 disabled:cursor-not-allowed text-xs cursor-pointer flex items-center gap-1"
          >
            <span>下一步</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRunToEnd}
            className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-slate-950 font-semibold text-xs cursor-pointer"
          >
            直达终点
          </button>
        </div>
      </div>

      {/* Step Visualization Area */}
      {currentStep && (
        <div className="space-y-6">
          {/* Active Level Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    STEP {currentStep.stepIndex} OF {maxSteps}
                  </span>
                  <h3 className="text-base font-bold text-white">
                    层级评估：{currentStep.levelName}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  当前父节点范围：<span className="text-slate-200 font-medium">{currentStep.parentNodeTitle}</span>
                </p>
              </div>

              <button
                onClick={() => setShowPromptInspector(!showPromptInspector)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 cursor-pointer self-start sm:self-auto"
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>{showPromptInspector ? '隐藏输入 Prompt' : '检查单步 Prompt 与 Logits'}</span>
              </button>
            </div>

            {/* Prompt Inspector Modal/Accordion */}
            {showPromptInspector && (
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between text-slate-400 text-[11px] pb-1 border-b border-slate-800">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Terminal className="w-3 h-3" />
                    <span>单次前向传播 (Single Forward Pass) Prompt 结构</span>
                  </span>
                  <span className="text-slate-500">Zero-Token Mode</span>
                </div>
                <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto text-[11px]">
                  {currentStep.promptContext}
                </pre>
                <div className="text-[10px] text-slate-500 pt-1">
                  * 说明：模型处理完该 Prompt 后无需自回归输出文字，直接提取词表中选项对应 Token（如 'A', 'B'）的未归一化对数概率（Logits）。
                </div>
              </div>
            )}

            {/* Candidate Branches Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>候选分支 ({currentStep.candidates.length} 个选项横向对比)</span>
                <span className="text-emerald-400">
                  束宽 B={beamWidth}，保留得分前 {Math.min(beamWidth, currentStep.candidates.length)} 项
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentStep.candidates.map((cand, cIdx) => {
                  const isSelected = currentStep.selectedNodeIds.includes(cand.nodeId);
                  const optionLetter = String.fromCharCode(65 + cIdx);

                  return (
                    <div
                      key={cand.nodeId}
                      className={`p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-slate-900/90 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                          : 'bg-slate-950/60 border-slate-800/80 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-md font-mono text-xs font-bold flex items-center justify-center ${
                            isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {optionLetter}
                          </span>
                          <span className="font-semibold text-slate-100 text-sm">
                            {cand.titleZh}
                          </span>
                        </div>

                        {isSelected ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>选中 (Beam 晋级)</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400">
                            剪枝淘汰
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                        {cand.summaryZh}
                      </p>

                      {/* Logits & Probability Bar */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs">
                        <div className="flex justify-between items-center text-[11px] font-mono">
                          <span className="text-slate-400">原始 Logit: {cand.rawLogit}</span>
                          <span className="text-emerald-400 font-bold">
                            相对概率: {(cand.normalizedProbability * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isSelected ? 'bg-emerald-500' : 'bg-slate-600'
                            }`}
                            style={{ width: `${Math.max(5, cand.normalizedProbability * 100)}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-slate-400 pt-0.5 italic">
                          决策依据：{cand.rationale}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Final Retrieved Passage Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/40 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              最终精确命中段落 (Final Retrieved Passage)
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Rank #1 (Recall@1 Success)
          </span>
        </div>

        {navResult.finalPassages.length > 0 ? (
          <div className="space-y-3">
            {/* Complete Hierarchy Breadcrumb Trail */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 flex-wrap">
              <span className="text-slate-500 font-medium">检索导航路径:</span>
              {navResult.finalPassages[0].path.map((segment, pIdx) => (
                <React.Fragment key={pIdx}>
                  <span className="text-slate-300 font-medium bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                    {segment}
                  </span>
                  {pIdx < navResult.finalPassages[0].path.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-500/60 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Content card */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
              <h4 className="text-sm font-bold text-emerald-300">
                {navResult.finalPassages[0].node.titleZh}
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed font-serif">
                {navResult.finalPassages[0].node.contentZh}
              </p>
            </div>

            {/* Performance Stats Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">总前向计算 (Forward Passes)</span>
                <span className="text-base font-mono font-bold text-white">
                  {navResult.stats.totalForwardPasses} 次
                </span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">每层仅需1步</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">生成 Token 消耗</span>
                <span className="text-base font-mono font-bold text-emerald-400">
                  0 Tokens
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">无需自回归解码</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">端到端估算延迟</span>
                <span className="text-base font-mono font-bold text-white">
                  {navResult.stats.estimatedLatencyMs} ms
                </span>
                <span className="text-[10px] text-teal-400 block mt-0.5">与论文实测一致</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">成功剪枝无效分支</span>
                <span className="text-base font-mono font-bold text-white">
                  {navResult.stats.prunedBranchesCount} 个
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5">避免无效噪音干扰</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 py-4 text-center">
            暂无检索结果，请尝试修改查询词。
          </div>
        )}
      </div>
    </div>
  );
};
