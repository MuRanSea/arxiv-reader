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

export interface CandidateBranch {
  nodeId: string;
  title: string;
  titleZh: string;
  summaryZh: string;
  rawLogit: number;
  normalizedProbability: number;
  matchedKeywords: string[];
  rationale: string;
}

export interface NavigationStep {
  stepIndex: number;
  levelName: string;
  parentNodeTitle: string;
  promptContext: string;
  candidates: CandidateBranch[];
  selectedNodeIds: string[];
  beamWidth: number;
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
 * Calculates simulated unnormalized logit for a candidate node given a query
 */
export function calculateBranchAffinity(query: string, node: DocumentNode): { logit: number; matched: string[]; rationale: string } {
  const qLower = query.toLowerCase();
  const matchedKeywords: string[] = [];

  let score = 0.5; // baseline prior

  // Match keywords
  for (const kw of node.keywords) {
    if (qLower.includes(kw.toLowerCase())) {
      matchedKeywords.push(kw);
      score += 2.5;
    }
  }

  // Title match
  if (qLower.includes(node.title.toLowerCase()) || qLower.includes(node.titleZh.toLowerCase())) {
    score += 3.0;
    matchedKeywords.push(node.titleZh);
  }

  // Summary / content matching
  const words = qLower.split(/[\s,，。？?！!]+/).filter(w => w.length > 1);
  for (const w of words) {
    if (node.titleZh.toLowerCase().includes(w) || node.summaryZh.toLowerCase().includes(w)) {
      score += 0.8;
      if (!matchedKeywords.includes(w)) matchedKeywords.push(w);
    }
  }

  // Specificity bonus for leaf passages with exact terms
  if (node.level === 'passage' && matchedKeywords.length > 0) {
    score += 1.2;
  }

  // Format rationale
  const rationale = matchedKeywords.length > 0
    ? `命中了关键概念【${matchedKeywords.slice(0, 3).join('、')}】，与查询意图强相关`
    : `语义上下文关联度较低（背景噪声先验）`;

  return {
    logit: Number(score.toFixed(2)),
    matched: matchedKeywords,
    rationale
  };
}

/**
 * Softmax normalization over raw logits in a shared context
 */
export function computeSoftmax(logits: number[]): number[] {
  if (logits.length === 0) return [];
  const maxLogit = Math.max(...logits);
  const exps = logits.map(l => Math.exp(l - maxLogit));
  const sumExps = exps.reduce((acc, curr) => acc + curr, 0);
  return exps.map(e => Number((e / sumExps).toFixed(4)));
}

/**
 * Simulates DecisionRAG Hierarchical Navigation with Beam Search
 */
export function runDecisionRagNavigation(
  query: string,
  rootNodes: DocumentNode[],
  beamWidth: number = 2
): NavigationResult {
  const steps: NavigationStep[] = [];
  let currentActiveNodes: DocumentNode[] = rootNodes;
  let currentPathMap = new Map<string, string[]>(); // nodeId -> path of titles
  let totalPruned = 0;
  let stepCount = 0;

  // Initialize paths for root level
  rootNodes.forEach(node => {
    currentPathMap.set(node.id, [node.titleZh]);
  });

  while (currentActiveNodes.length > 0) {
    // Check if we are at leaf passages already
    const isLeafLevel = currentActiveNodes.every(n => !n.children || n.children.length === 0);
    if (isLeafLevel) {
      break;
    }

    stepCount++;
    // Gather all candidate child branches from current active beam
    const candidateNodes: DocumentNode[] = [];
    const parentMap = new Map<string, DocumentNode>();

    currentActiveNodes.forEach(parent => {
      if (parent.children && parent.children.length > 0) {
        parent.children.forEach(child => {
          candidateNodes.push(child);
          parentMap.set(child.id, parent);
          const parentPath = currentPathMap.get(parent.id) || [parent.titleZh];
          currentPathMap.set(child.id, [...parentPath, child.titleZh]);
        });
      }
    });

    if (candidateNodes.length === 0) break;

    // Evaluate all candidates in a shared forward pass context
    const affinityScores = candidateNodes.map(c => calculateBranchAffinity(query, c));
    const rawLogits = affinityScores.map(a => a.logit);
    const probabilities = computeSoftmax(rawLogits);

    const candidatesWithScores: CandidateBranch[] = candidateNodes.map((node, idx) => ({
      nodeId: node.id,
      title: node.title,
      titleZh: node.titleZh,
      summaryZh: node.summaryZh,
      rawLogit: rawLogits[idx],
      normalizedProbability: probabilities[idx],
      matchedKeywords: affinityScores[idx].matched,
      rationale: affinityScores[idx].rationale
    }));

    // Sort descending by score
    candidatesWithScores.sort((a, b) => b.rawLogit - a.rawLogit);

    // Beam search selection
    const selectedBranches = candidatesWithScores.slice(0, beamWidth);
    const selectedIds = selectedBranches.map(b => b.nodeId);
    totalPruned += Math.max(0, candidatesWithScores.length - beamWidth);

    // Build representation of shared prompt context
    const promptContext = `[决策提示 Prompt] 查询: "${query}"\n候选分支(${candidatesWithScores.length}项):\n` +
      candidatesWithScores.map((c, i) => `  [选项 ${String.fromCharCode(65 + i)}] 《${c.titleZh}》- ${c.summaryZh.slice(0, 40)}...`).join('\n') +
      `\n[单次前向传播输出 logits] 评估注意力权重，无须自回归生成 Token。`;

    steps.push({
      stepIndex: stepCount,
      levelName: candidateNodes[0].level === 'document' ? '文档层 (Document)' :
                 candidateNodes[0].level === 'section' ? '章节层 (Section)' : '段落层 (Passage)',
      parentNodeTitle: currentActiveNodes.map(n => n.titleZh).join(', '),
      promptContext,
      candidates: candidatesWithScores,
      selectedNodeIds: selectedIds,
      beamWidth
    });

    // Update active nodes for next iteration
    currentActiveNodes = candidateNodes.filter(n => selectedIds.includes(n.id));
  }

  // Final leaf scoring
  const finalPassages = currentActiveNodes.map(node => {
    const affinity = calculateBranchAffinity(query, node);
    return {
      node,
      score: affinity.logit,
      path: currentPathMap.get(node.id) || [node.titleZh]
    };
  }).sort((a, b) => b.score - a.score);

  // Benchmarking stats based on the paper's reported metrics
  // Forward passes = number of steps (each step is 1 forward pass!)
  const totalForwardPasses = steps.length;
  // In paper: 0.7 - 1.8 seconds per query
  const estimatedLatencyMs = Math.round(700 + (totalForwardPasses * 180) + (beamWidth * 50));

  return {
    query,
    steps,
    finalPassages,
    stats: {
      totalForwardPasses,
      estimatedLatencyMs,
      tokensGenerated: 0, // Zero token generation!
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
  recallAt1: number; // e.g. on MultiDoc2Dial
  hitAt1: number;    // on Natural Questions
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
    hasRetrievalAsymmetry: true, // If dense missed it, reranker never sees it!
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
    recallAt1: 60.0, // +13.8 vs Dense+8B Reranker
    hitAt1: 71.0, // +17.4 vs Dense+8B Reranker
    avgLatencyMs: 1100, // 0.7s - 1.8s
    tokensGenerated: 0, // 0 token generation!
    memoryOverhead: '极低 (只需轻量树状结构，无需向量嵌入库)',
    hasRetrievalAsymmetry: false, // Unified decision directly by LLM
    requiresVectorIndex: false,
    evaluationMode: 'SharedContext'
  }
];
