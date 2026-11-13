export interface DocumentNode {
  id: string;
  title: string;
  titleZh: string;
  level: 'domain' | 'document' | 'section' | 'passage';
  summaryZh: string;
  contentZh: string;
  contentEn?: string;
  keywords: string[];
  children?: DocumentNode[];
}

export interface TokenAttentionSignal {
  token: string;
  weight: number; // 0 ~ 1 normalized attention weight
  logitContribution: number;
  source: 'keyword' | 'title' | 'context' | 'baseline';
  matchedTarget: string;
}

export interface DecisionWeightBreakdown {
  priorWeight: number;
  keywordWeight: number;
  titleWeight: number;
  contextSummaryWeight: number;
  leafSpecificityWeight: number;
  totalLogit: number;
  dimensionShares: {
    keywordPct: number;
    titlePct: number;
    contextPct: number;
    priorAndLeafPct: number;
  };
  tokenSignals: TokenAttentionSignal[];
}

export interface CandidateBranch {
  nodeId: string;
  parentNodeId?: string;
  parentNodeTitleZh?: string;
  rank: number;
  title: string;
  titleZh: string;
  summaryZh: string;
  rawLogit: number;
  normalizedProbability: number;
  matchedKeywords: string[];
  rationale: string;
  logitDeltaVsTop: number;
  logitMarginVsCutoff: number;
  decisionBreakdown: DecisionWeightBreakdown;
}

export interface StepDecisionSummary {
  topWinnerId: string;
  topWinnerTitleZh: string;
  runnerUpTitleZh: string;
  logitGapTopVsRunnerUp: number;
  beamConfidenceShare: number; // 0 ~ 1 cumulative probability of selected beam
  shannonEntropyBits: number;
  contextSignalToNoiseRatio: number;
  hopConclusionZh: string;
}

export interface NavigationStep {
  stepIndex: number;
  levelName: string;
  parentNodeTitle: string;
  promptContext: string;
  candidates: CandidateBranch[];
  selectedNodeIds: string[];
  beamWidth: number;
  decisionSummary: StepDecisionSummary;
}

export interface NavigationResult {
  query: string;
  steps: NavigationStep[];
  finalPassages: {
    node: DocumentNode;
    score: number;
    path: string[];
  }[];
  stats: {
    totalForwardPasses: number;
    estimatedLatencyMs: number;
    tokensGenerated: number;
    prunedBranchesCount: number;
    accuracyRank: number;
  };
}

/**
 * Calculates simulated unnormalized logit and detailed multi-dimensional weight breakdown
 * for a candidate node given a query
 */
export function calculateBranchAffinity(
  query: string,
  node: DocumentNode
): {
  logit: number;
  matched: string[];
  rationale: string;
  breakdown: DecisionWeightBreakdown;
} {
  const qLower = query.toLowerCase();
  const matchedKeywords: string[] = [];
  const tokenSignals: TokenAttentionSignal[] = [];

  const priorWeight = 0.5; // baseline structural prior
  let keywordWeight = 0;
  let titleWeight = 0;
  let contextSummaryWeight = 0;
  let leafSpecificityWeight = 0;

  // 1. Match explicit node keywords
  for (const kw of node.keywords) {
    if (qLower.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
      keywordWeight += 2.5;
      tokenSignals.push({
        token: kw,
        weight: 0.92,
        logitContribution: 2.5,
        source: 'keyword',
        matchedTarget: `节点核心词条 [${kw}]`
      });
    }
  }

  // 2. Title holistic match
  if (qLower.includes(node.title.toLowerCase()) || qLower.includes(node.titleZh.toLowerCase())) {
    titleWeight += 3.0;
    if (!matchedKeywords.includes(node.titleZh)) {
      matchedKeywords.push(node.titleZh);
    }
    tokenSignals.push({
      token: node.titleZh,
      weight: 0.98,
      logitContribution: 3.0,
      source: 'title',
      matchedTarget: `节点标题全匹配《${node.titleZh}》`
    });
  }

  // 3. Query term / sub-segment matching against Title and Summary Context
  const words = qLower
    .split(/[\s,，。？?！!、：:；;（）()]+/)
    .filter((w) => w.length > 1);

  for (const w of words) {
    const inTitle = node.titleZh.toLowerCase().includes(w) || node.title.toLowerCase().includes(w);
    const inSummary =
      node.summaryZh.toLowerCase().includes(w) || node.contentZh.toLowerCase().includes(w);

    if (inTitle) {
      titleWeight += 0.8;
      if (!matchedKeywords.includes(w)) matchedKeywords.push(w);
      if (!tokenSignals.some((ts) => ts.token.toLowerCase() === w && ts.source === 'title')) {
        tokenSignals.push({
          token: w,
          weight: 0.78,
          logitContribution: 0.8,
          source: 'title',
          matchedTarget: `层级标题语义命中「${node.titleZh}」`
        });
      }
    } else if (inSummary) {
      contextSummaryWeight += 0.8;
      if (!matchedKeywords.includes(w)) matchedKeywords.push(w);
      if (!tokenSignals.some((ts) => ts.token.toLowerCase() === w && ts.source === 'context')) {
        tokenSignals.push({
          token: w,
          weight: 0.68,
          logitContribution: 0.8,
          source: 'context',
          matchedTarget: `上下文摘要交叉注意力命中`
        });
      }
    }
  }

  // Also check 2-char Chinese n-grams from query if no explicit split tokens matched yet
  const cjkChars = query.replace(/[^\u4e00-\u9fa5]/g, '');
  if (cjkChars.length >= 2) {
    for (let i = 0; i < cjkChars.length - 1; i++) {
      const bigram = cjkChars.slice(i, i + 2);
      const alreadyRecorded = matchedKeywords.some(
        (mk) => mk.includes(bigram) || bigram.includes(mk)
      );
      if (alreadyRecorded) continue;

      if (node.titleZh.includes(bigram)) {
        titleWeight += 0.6;
        matchedKeywords.push(bigram);
        tokenSignals.push({
          token: bigram,
          weight: 0.72,
          logitContribution: 0.6,
          source: 'title',
          matchedTarget: `标题二元词根对齐「${bigram}」`
        });
      } else if (node.summaryZh.includes(bigram)) {
        contextSummaryWeight += 0.5;
        matchedKeywords.push(bigram);
        tokenSignals.push({
          token: bigram,
          weight: 0.58,
          logitContribution: 0.5,
          source: 'context',
          matchedTarget: `摘要上下文词根对齐「${bigram}」`
        });
      }
    }
  }

  // 4. Specificity bonus for leaf passages with exact terms
  if (node.level === 'passage' && matchedKeywords.length > 0) {
    leafSpecificityWeight = 1.2;
  }

  // Always include baseline structural prior signal if no tokens matched
  if (tokenSignals.length === 0) {
    tokenSignals.push({
      token: '背景先验 (Prior)',
      weight: 0.12,
      logitContribution: priorWeight,
      source: 'baseline',
      matchedTarget: '无显式查询词元对齐，仅保留文档树基础先验'
    });
  }

  const totalLogit = Number(
    (
      priorWeight +
      keywordWeight +
      titleWeight +
      contextSummaryWeight +
      leafSpecificityWeight
    ).toFixed(2)
  );

  const safeTotal = Math.max(totalLogit, 0.01);
  const keywordPct = Math.round((keywordWeight / safeTotal) * 100);
  const titlePct = Math.round((titleWeight / safeTotal) * 100);
  const contextPct = Math.round((contextSummaryWeight / safeTotal) * 100);
  const priorAndLeafPct = Math.max(0, 100 - keywordPct - titlePct - contextPct);

  const rationale =
    matchedKeywords.length > 0
      ? `命中了关键概念【${matchedKeywords.slice(0, 3).join('、')}】，与查询意图强相关`
      : `语义上下文关联度较低（背景噪声先验）`;

  return {
    logit: totalLogit,
    matched: matchedKeywords,
    rationale,
    breakdown: {
      priorWeight: Number(priorWeight.toFixed(2)),
      keywordWeight: Number(keywordWeight.toFixed(2)),
      titleWeight: Number(titleWeight.toFixed(2)),
      contextSummaryWeight: Number(contextSummaryWeight.toFixed(2)),
      leafSpecificityWeight: Number(leafSpecificityWeight.toFixed(2)),
      totalLogit,
      dimensionShares: {
        keywordPct,
        titlePct,
        contextPct,
        priorAndLeafPct
      },
      tokenSignals: tokenSignals.slice(0, 6)
    }
  };
}

/**
 * Softmax normalization over raw logits in a shared context
 */
export function computeSoftmax(logits: number[]): number[] {
  if (logits.length === 0) return [];
  const maxLogit = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - maxLogit));
  const sumExps = exps.reduce((acc, curr) => acc + curr, 0);
  return exps.map((e) => Number((e / sumExps).toFixed(4)));
}

/**
 * Simulates DecisionRAG Hierarchical Navigation with Beam Search
 * and generates hop-by-hop Decision Step Inspector telemetry.
 */
export function runDecisionRagNavigation(
  query: string,
  rootNodes: DocumentNode[],
  beamWidth: number = 2
): NavigationResult {
  const steps: NavigationStep[] = [];
  let currentActiveNodes: DocumentNode[] = rootNodes;
  const currentPathMap = new Map<string, string[]>(); // nodeId -> path of titles
  let totalPruned = 0;
  let stepCount = 0;

  // Initialize paths for root level
  rootNodes.forEach((node) => {
    currentPathMap.set(node.id, [node.titleZh]);
  });

  while (currentActiveNodes.length > 0) {
    // Check if we are at leaf passages already
    const isLeafLevel = currentActiveNodes.every((n) => !n.children || n.children.length === 0);
    if (isLeafLevel) {
      break;
    }

    stepCount++;
    // Gather all candidate child branches from current active beam
    const candidateNodes: DocumentNode[] = [];
    const parentMap = new Map<string, DocumentNode>();

    currentActiveNodes.forEach((parent) => {
      if (parent.children && parent.children.length > 0) {
        parent.children.forEach((child) => {
          candidateNodes.push(child);
          parentMap.set(child.id, parent);
          const parentPath = currentPathMap.get(parent.id) || [parent.titleZh];
          currentPathMap.set(child.id, [...parentPath, child.titleZh]);
        });
      }
    });

    if (candidateNodes.length === 0) break;

    // Evaluate all candidates in a shared forward pass context
    const affinityScores = candidateNodes.map((c) => calculateBranchAffinity(query, c));
    const rawLogits = affinityScores.map((a) => a.logit);
    const probabilities = computeSoftmax(rawLogits);

    const preliminaryCandidates = candidateNodes.map((node, idx) => {
      const parentNode = parentMap.get(node.id);
      return {
        nodeId: node.id,
        parentNodeId: parentNode?.id,
        parentNodeTitleZh: parentNode?.titleZh || '根节点',
        rank: 1,
        title: node.title,
        titleZh: node.titleZh,
        summaryZh: node.summaryZh,
        rawLogit: rawLogits[idx],
        normalizedProbability: probabilities[idx],
        matchedKeywords: affinityScores[idx].matched,
        rationale: affinityScores[idx].rationale,
        logitDeltaVsTop: 0,
        logitMarginVsCutoff: 0,
        decisionBreakdown: affinityScores[idx].breakdown
      };
    });

    // Sort descending by score
    preliminaryCandidates.sort((a, b) => b.rawLogit - a.rawLogit);

    const topLogit = preliminaryCandidates[0]?.rawLogit ?? 0;
    const cutoffIdx = Math.min(beamWidth - 1, preliminaryCandidates.length - 1);
    const prunedFirstIdx = Math.min(beamWidth, preliminaryCandidates.length - 1);
    const referenceCutoffLogit =
      preliminaryCandidates.length > beamWidth
        ? preliminaryCandidates[prunedFirstIdx].rawLogit
        : preliminaryCandidates[cutoffIdx].rawLogit;

    const candidatesWithScores: CandidateBranch[] = preliminaryCandidates.map((cand, idx) => ({
      ...cand,
      rank: idx + 1,
      logitDeltaVsTop: Number((cand.rawLogit - topLogit).toFixed(2)),
      logitMarginVsCutoff: Number((cand.rawLogit - referenceCutoffLogit).toFixed(2))
    }));

    // Beam search selection
    const selectedBranches = candidatesWithScores.slice(0, beamWidth);
    const selectedIds = selectedBranches.map((b) => b.nodeId);
    totalPruned += Math.max(0, candidatesWithScores.length - beamWidth);

    // Compute StepDecisionSummary
    const topWinner = candidatesWithScores[0];
    const runnerUp = candidatesWithScores[1] || candidatesWithScores[0];
    const logitGapTopVsRunnerUp = Number((topWinner.rawLogit - runnerUp.rawLogit).toFixed(2));
    const beamConfidenceShare = Number(
      selectedBranches.reduce((acc, b) => acc + b.normalizedProbability, 0).toFixed(4)
    );
    const shannonEntropyBits = Number(
      (
        -candidatesWithScores.reduce((acc, c) => {
          const p = Math.max(c.normalizedProbability, 1e-6);
          return acc + p * Math.log2(p);
        }, 0)
      ).toFixed(2)
    );
    const prunedAvgLogit =
      candidatesWithScores.length > beamWidth
        ? candidatesWithScores
            .slice(beamWidth)
            .reduce((acc, c) => acc + c.rawLogit, 0) /
          (candidatesWithScores.length - beamWidth)
        : 0.5;
    const contextSignalToNoiseRatio = Number(
      (topWinner.rawLogit / Math.max(0.5, prunedAvgLogit)).toFixed(2)
    );

    const levelLabel =
      candidateNodes[0].level === 'document'
        ? '文档层 (Document)'
        : candidateNodes[0].level === 'section'
        ? '章节层 (Section)'
        : '段落层 (Passage)';

    const hopConclusionZh = `在${levelLabel}共享上下文窗口中，首选节点《${topWinner.titleZh}》凭关键词对齐(+${topWinner.decisionBreakdown.keywordWeight.toFixed(1)})与标题/上下文权重(+${(topWinner.decisionBreakdown.titleWeight + topWinner.decisionBreakdown.contextSummaryWeight).toFixed(1)})取得最高 Logit=${topWinner.rawLogit.toFixed(2)}（领先次位 Δz=+${logitGapTopVsRunnerUp.toFixed(2)}），Top-${beamWidth} 束搜索累计捕获 ${(beamConfidenceShare * 100).toFixed(1)}% 路由置信度。`;

    // Build representation of shared prompt context
    const promptContext =
      `[决策提示 Prompt] 查询: "${query}"\n候选分支(${candidatesWithScores.length}项):\n` +
      candidatesWithScores
        .map(
          (c, i) =>
            `  [选项 ${String.fromCharCode(65 + i)}] 《${c.titleZh}》- ${c.summaryZh.slice(0, 40)}...`
        )
        .join('\n') +
      `\n[单次前向传播输出 logits] 评估注意力权重，无须自回归生成 Token。`;

    steps.push({
      stepIndex: stepCount,
      levelName: levelLabel,
      parentNodeTitle: currentActiveNodes.map((n) => n.titleZh).join(', '),
      promptContext,
      candidates: candidatesWithScores,
      selectedNodeIds: selectedIds,
      beamWidth,
      decisionSummary: {
        topWinnerId: topWinner.nodeId,
        topWinnerTitleZh: topWinner.titleZh,
        runnerUpTitleZh: runnerUp.titleZh,
        logitGapTopVsRunnerUp,
        beamConfidenceShare,
        shannonEntropyBits,
        contextSignalToNoiseRatio,
        hopConclusionZh
      }
    });

    // Update active nodes for next iteration
    currentActiveNodes = candidateNodes.filter((n) => selectedIds.includes(n.id));
  }

  // Final leaf scoring
  const finalPassages = currentActiveNodes
    .map((node) => {
      const affinity = calculateBranchAffinity(query, node);
      return {
        node,
        score: affinity.logit,
        path: currentPathMap.get(node.id) || [node.titleZh]
      };
    })
    .sort((a, b) => b.score - a.score);

  // Benchmarking stats based on the paper's reported metrics
  const totalForwardPasses = steps.length;
  const estimatedLatencyMs = Math.round(700 + totalForwardPasses * 180 + beamWidth * 50);

  return {
    query,
    steps,
    finalPassages,
    stats: {
      totalForwardPasses,
      estimatedLatencyMs,
      tokensGenerated: 0,
      prunedBranchesCount: totalPruned,
      accuracyRank: 1
    }
  };
}

/**
 * Paradigm comparison metrics based on paper findings
 */
export interface ParadigmComparison {
  name: string;
  nameZh: string;
  mechanismZh: string;
  recallAt1: number;
  hitAt1: number;
  avgLatencyMs: number;
  tokensGenerated: number;
  memoryOverhead: string;
  hasRetrievalAsymmetry: boolean;
  requiresVectorIndex: boolean;
  evaluationMode: 'Isolated' | 'Pairwise' | 'SharedContext';
}

export const PARADIGM_BENCHMARKS: ParadigmComparison[] = [
  {
    name: 'BM25 (Lexical)',
    nameZh: 'BM25 词法检索',
    mechanismZh: '倒排索引与词频-逆文档频率（TF-IDF）关键词硬匹配',
    recallAt1: 22.4,
    hitAt1: 31.2,
    avgLatencyMs: 120,
    tokensGenerated: 0,
    memoryOverhead: '低 (磁盘倒排表)',
    hasRetrievalAsymmetry: true,
    requiresVectorIndex: false,
    evaluationMode: 'Isolated'
  },
  {
    name: 'Dense Bi-Encoder (Contriever/DPR)',
    nameZh: '传统稠密向量检索 (双编码器)',
    mechanismZh: '两端分别投影至固定低维向量空间，独立计算余弦距离',
    recallAt1: 34.8,
    hitAt1: 42.1,
    avgLatencyMs: 280,
    tokensGenerated: 0,
    memoryOverhead: '极高 (需要庞大的 HNSW 向量索引常驻显存/内存)',
    hasRetrievalAsymmetry: true,
    requiresVectorIndex: true,
    evaluationMode: 'Isolated'
  },
  {
    name: 'Two-Stage Dense + 8B Reranker',
    nameZh: '两阶段检索 (稠密初检 + 8B 交叉重排器)',
    mechanismZh: '向量召回 Top-100，再由大模型逐对进行交叉注意力打分',
    recallAt1: 46.2,
    hitAt1: 53.6,
    avgLatencyMs: 2450,
    tokensGenerated: 0,
    memoryOverhead: '极高 (向量索引 + 8B 重排器显存)',
    hasRetrievalAsymmetry: true,
    requiresVectorIndex: true,
    evaluationMode: 'Pairwise'
  },
  {
    name: 'Agentic Search (ReAct / WebGPT style)',
    nameZh: '智能体循环搜索 (Agentic Search)',
    mechanismZh: 'LLM 逐步自回归生成查询、调用工具、阅读整页、反复反思',
    recallAt1: 49.0,
    hitAt1: 58.2,
    avgLatencyMs: 14800,
    tokensGenerated: 450,
    memoryOverhead: '中 (无需预建密集索引，但显存KV Cache巨大)',
    hasRetrievalAsymmetry: false,
    requiresVectorIndex: false,
    evaluationMode: 'SharedContext'
  },
  {
    name: 'DecisionRAG (Ours)',
    nameZh: 'DecisionRAG (论文免检索器导航)',
    mechanismZh: '利用预训练语言模型在文档层级树中逐层单步决策，共享上下文打分',
    recallAt1: 60.0,
    hitAt1: 71.0,
    avgLatencyMs: 1100,
    tokensGenerated: 0,
    memoryOverhead: '极低 (只需轻量树状结构，无需向量嵌入库)',
    hasRetrievalAsymmetry: false,
    requiresVectorIndex: false,
    evaluationMode: 'SharedContext'
  }
];
