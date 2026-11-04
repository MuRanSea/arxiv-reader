import React, { useState } from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Zap, 
  Database, 
  Cpu, 
  ShieldAlert, 
  Layers, 
  TrendingUp 
} from 'lucide-react';
import { PARADIGM_BENCHMARKS } from '../utils/treeNavigation.js';

export const ComparisonMatrix: React.FC = () => {
  const [selectedBenchmark, setSelectedBenchmark] = useState<'multidoc' | 'nq'>('multidoc');
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0);

  const scenarios = [
    {
      title: "案例一：复杂的附带前提条件查询 (MultiDoc2Dial 场景)",
      query: "未按期办理 Medicare Part B，在无豁免工作医保前提下，终身保费附加罚金如何计算？",
      bm25: {
        status: "失败",
        reason: "检索出上百个包含『Medicare』高频词的通识网页，完全忽略了『延迟登记罚金』的特定章节条款。"
      },
      dense: {
        status: "召回落榜",
        reason: "将长句压缩进 768 维向量后，『无豁免工作医保』与『每延误12个月加收10%』等微小数字限制被模糊化，正确段落仅排在第 142 名。"
      },
      reranker: {
        status: "无力回天 (漏检)",
        reason: "虽然拥有 8B 参数交叉注意力，但它只被输入了第一阶段召回的前 100 篇文档，目标段落在第 142 名，重排器压根没机会看到。"
      },
      decisionRag: {
        status: "精准命中 (Rank #1)",
        reason: "在层级树中：医疗保险体系 ➔ Part B 登记政策 ➔ 延迟登记罚金标准 ➔ 10%计算条款。每一步均在同级分支中明确胜出，一次性直击核心！"
      }
    },
    {
      title: "案例二：工业级技术文档专属指令排查 (MTRAG 场景)",
      query: "在 IBM Cloud Kubernetes 集群中，如何使用命令行刷新已过期的 Ingress TLS 证书？",
      bm25: {
        status: "召回混乱",
        reason: "命中了大量介绍 OpenShift 概念、TLS 基本原理的科普页，找不到 CLI 专属命令。"
      },
      dense: {
        status: "排名落后",
        reason: "『ibmcloud ks ingress secret refresh』技术命令在通用嵌入空间中被视为低频罕见词，权重严重不足。"
      },
      reranker: {
        status: "勉强排在第 8 名",
        reason: "重排后未能将具体 CLI 语法排至首位，被通用的 Ingress 概述文档反客为主。"
      },
      decisionRag: {
        status: "一击正中 (Rank #1)",
        reason: "直接顺着『容器平台 ➔ 集群证书管理 ➔ 更新过期 Secret ➔ 专属刷新命令』逐层剪枝，直接输出命令语法段落。"
      }
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>技术范式与权威基准深度横向对比</span>
              <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/15 text-emerald-300 rounded border border-emerald-500/30">
                涵盖四大 Benchmark
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              全面比较传统词法匹配（BM25）、双编码向量检索、两阶段重排（Dense + 8B Reranker）、智能体搜索与 DecisionRAG 在真实评测中的关键指标。
            </p>
          </div>
        </div>

        {/* Benchmark Switcher */}
        <div className="flex items-center gap-3 pt-3 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 font-medium">当前对比基准数据集：</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedBenchmark('multidoc')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedBenchmark === 'multidoc'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              MultiDoc2Dial (复杂政府政策问答)
            </button>
            <button
              onClick={() => setSelectedBenchmark('nq')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedBenchmark === 'nq'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Natural Questions (268万维基百科段落)
            </button>
          </div>
        </div>
      </div>

      {/* Visual Bar Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Metric 1: Accuracy (Recall@1 or Hit@1) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                {selectedBenchmark === 'multidoc' ? 'Top-1 召回率 (Recall@1)' : 'Top-1 命中率 (Hit@1)'}
              </h3>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-semibold">越高越好 (分值 %)</span>
          </div>

          <div className="space-y-3">
            {PARADIGM_BENCHMARKS.map((p) => {
              const val = selectedBenchmark === 'multidoc' ? p.recallAt1 : p.hitAt1;
              const isDecision = p.name.includes('DecisionRAG');

              return (
                <div key={p.name} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className={`font-medium ${isDecision ? 'text-emerald-300 font-bold' : 'text-slate-300'}`}>
                      {p.nameZh}
                    </span>
                    <span className={`font-mono font-bold ${isDecision ? 'text-emerald-400 text-sm' : 'text-slate-400'}`}>
                      {val.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isDecision
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/50'
                          : 'bg-slate-600'
                      }`}
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-xs text-emerald-300/90 leading-relaxed">
            💡 <strong>深度结论：</strong>DecisionRAG 在无需针对任务微调的前提下，比业内顶配『Dense + 8B Reranker』足足高出 
            <strong className="text-white font-bold font-mono"> {selectedBenchmark === 'multidoc' ? '+13.8%' : '+17.4%'}</strong>。直接证明了第一阶段树状决策能彻底避开粗筛漏检的木桶短板。
          </div>
        </div>

        {/* Metric 2: Latency & Generation Overhead */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" />
              <h3 className="text-sm font-bold text-white">端到端平均查询延迟 (Latency)</h3>
            </div>
            <span className="text-[10px] text-teal-400 font-mono font-semibold">越低越好 (毫秒 ms)</span>
          </div>

          <div className="space-y-3">
            {PARADIGM_BENCHMARKS.map((p) => {
              const isDecision = p.name.includes('DecisionRAG');
              const isAgent = p.name.includes('Agentic');

              return (
                <div key={p.name} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className={`font-medium ${isDecision ? 'text-emerald-300 font-bold' : 'text-slate-300'}`}>
                      {p.nameZh}
                    </span>
                    <span className={`font-mono ${isDecision ? 'text-emerald-400 font-bold' : isAgent ? 'text-red-400' : 'text-slate-400'}`}>
                      {p.avgLatencyMs >= 1000 ? `${(p.avgLatencyMs / 1000).toFixed(1)}s` : `${p.avgLatencyMs}ms`}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isDecision
                          ? 'bg-emerald-500'
                          : isAgent
                          ? 'bg-red-500'
                          : 'bg-slate-600'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, (p.avgLatencyMs / 15000) * 100))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-lg bg-teal-950/20 border border-teal-900/30 text-xs text-teal-300/90 leading-relaxed">
            ⚡ <strong>速度启示：</strong>Agentic Search 虽然也能让大模型做决策，但每次要吐出几百个 Token，单次延迟高达 15 秒；而 DecisionRAG 采用『单步前向传播零 Token 打分』，将时间压缩在 <strong>0.7 ~ 1.8 秒</strong>，完全满足实时生产交互标准！
          </div>
        </div>
      </div>

      {/* Comprehensive Feature Comparison Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>五大范式关键特性全景对照表</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60">
                <th className="py-3 px-3 font-semibold">检索技术范式</th>
                <th className="py-3 px-3 font-semibold">核心工作机理</th>
                <th className="py-3 px-3 font-semibold">评估对比模式</th>
                <th className="py-3 px-3 font-semibold">是否需要向量索引</th>
                <th className="py-3 px-3 font-semibold">是否存在能力不对称瓶颈</th>
                <th className="py-3 px-3 font-semibold">生成 Token 消耗</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {PARADIGM_BENCHMARKS.map((p) => {
                const isDecision = p.name.includes('DecisionRAG');
                return (
                  <tr
                    key={p.name}
                    className={`transition-colors ${
                      isDecision
                        ? 'bg-emerald-950/20 text-emerald-200 font-medium'
                        : 'text-slate-300 hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-semibold text-white">{p.nameZh}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{p.name}</div>
                    </td>
                    <td className="py-3 px-3 max-w-[200px] text-slate-400 leading-normal">
                      {p.mechanismZh}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                        p.evaluationMode === 'SharedContext'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : p.evaluationMode === 'Pairwise'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {p.evaluationMode === 'SharedContext' ? '共享上下文横向PK' :
                         p.evaluationMode === 'Pairwise' ? '双文档独立交叉' : '单点孤立计算'}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {p.requiresVectorIndex ? (
                        <span className="text-amber-400 flex items-center gap-1">
                          <Database className="w-3 h-3" /> 是 (庞大显存/磁盘)
                        </span>
                      ) : (
                        <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> 否 (免向量库)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {p.hasRetrievalAsymmetry ? (
                        <span className="text-red-400 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> 存在 (上游拖垮下游)
                        </span>
                      ) : (
                        <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="w-3 h-3" /> 已根除 (统一决策)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap font-mono font-bold">
                      {p.tokensGenerated === 0 ? (
                        <span className="text-emerald-400">0 Tokens (单步前向)</span>
                      ) : (
                        <span className="text-slate-400">{p.tokensGenerated}+ Tokens</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real Failure Scenarios Deep-Dive */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>真实查询解剖：为什么传统方案频频翻车，而 DecisionRAG 能够命中？</span>
            </h3>
            <p className="text-xs text-slate-400">
              通过具体真实测试用例，洞察『能力不对称性』是如何在上游悄无声息地毁掉整个答案的。
            </p>
          </div>

          <div className="flex items-center gap-2">
            {scenarios.map((sc, sIdx) => (
              <button
                key={sIdx}
                onClick={() => setActiveScenarioIdx(sIdx)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeScenarioIdx === sIdx
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                案例 0{sIdx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Active Scenario Card */}
        <div className="space-y-4 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[11px] text-slate-500 font-semibold block mb-1">测试查询 (Query)：</span>
            <div className="text-sm font-medium text-slate-200">
              "{scenarios[activeScenarioIdx].query}"
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* BM25 */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">BM25 词法检索</span>
                <span className="text-[10px] text-red-400 font-semibold flex items-center gap-0.5">
                  <XCircle className="w-3 h-3" /> {scenarios[activeScenarioIdx].bm25.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {scenarios[activeScenarioIdx].bm25.reason}
              </p>
            </div>

            {/* Dense */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">传统稠密向量检索</span>
                <span className="text-[10px] text-red-400 font-semibold flex items-center gap-0.5">
                  <XCircle className="w-3 h-3" /> {scenarios[activeScenarioIdx].dense.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {scenarios[activeScenarioIdx].dense.reason}
              </p>
            </div>

            {/* Reranker */}
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">两阶段 8B 重排器</span>
                <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-0.5">
                  <XCircle className="w-3 h-3" /> {scenarios[activeScenarioIdx].reranker.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {scenarios[activeScenarioIdx].reranker.reason}
              </p>
            </div>

            {/* DecisionRAG */}
            <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 space-y-1.5 ring-1 ring-emerald-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300">DecisionRAG (本文)</span>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3" /> {scenarios[activeScenarioIdx].decisionRag.status}
                </span>
              </div>
              <p className="text-xs text-emerald-200/80 leading-relaxed">
                {scenarios[activeScenarioIdx].decisionRag.reason}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
