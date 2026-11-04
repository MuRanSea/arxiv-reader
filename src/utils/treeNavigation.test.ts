import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBranchAffinity,
  computeSoftmax,
  runDecisionRagNavigation,
  DocumentNode,
  PARADIGM_BENCHMARKS
} from './treeNavigation.js';

const mockCorpusTree: DocumentNode[] = [
  {
    id: 'domain-ai',
    title: 'Artificial Intelligence',
    titleZh: '人工智能与机器学习',
    level: 'domain',
    summaryZh: '涵盖大语言模型、检索增强生成(RAG)、深度学习架构等领域。',
    contentZh: '人工智能顶级领域，包含决策模型、Transformer架构、检索系统。',
    keywords: ['AI', '大模型', 'LLM', 'RAG', '检索', '向量'],
    children: [
      {
        id: 'doc-rag',
        title: 'Retrieval-Augmented Generation Systems',
        titleZh: '检索增强生成 (RAG) 体系',
        level: 'document',
        summaryZh: '详细分析传统向量检索与免检索器新型决策导航架构。',
        contentZh: '比较密集向量检索(Dense Retrieval)与DecisionRAG层级导航的区别。',
        keywords: ['RAG', '检索增强', 'DecisionRAG', '向量检索', '重排器'],
        children: [
          {
            id: 'sec-decisionrag',
            title: 'DecisionRAG Navigation Mechanism',
            titleZh: 'DecisionRAG 决策模型导航机制',
            level: 'section',
            summaryZh: '解释单步前向传播、共享上下文注意力打分与束搜索。',
            contentZh: '无需生成任何Token，依靠预训练模型Logits进行分支判别。',
            keywords: ['单步前向传播', 'Logits', '束搜索', '免检索器', 'Zero-token'],
            children: [
              {
                id: 'pas-forward-pass',
                title: 'Single Forward Pass Zero-Token Evaluation',
                titleZh: '单次前向传播零Token打分原理',
                level: 'passage',
                summaryZh: '在单次forward pass中评估所有同级候选，节约90%以上推理延迟。',
                contentZh: '通过将所有候选分支拼接至提示词末尾，模型直接输出各选项标识符的Logit值，完全规避了传统自回归文本生成的巨大计算开销。',
                keywords: ['单次前向传播', '零Token', 'forward pass', 'Logit', '延迟']
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'domain-physics',
    title: 'Condensed Matter Physics',
    titleZh: '凝聚态物理与材料科学',
    level: 'domain',
    summaryZh: '涉及超导、石墨烯二维材料、拓扑绝缘体等物理研究。',
    contentZh: '探讨固态物质的电子结构与量子力学特性。',
    keywords: ['物理', '石墨烯', '超导', '量子'],
    children: []
  }
];

test('calculateBranchAffinity accurately scores keyword matches and rationales', () => {
  const node = mockCorpusTree[0];
  const affinity = calculateBranchAffinity('如何在RAG中应用检索决策模型？', node);
  assert.ok(affinity.logit > 1.0, 'Logit should be positive and elevated for matched keywords');
  assert.ok(affinity.matched.length >= 2, 'Should match keywords like RAG and 检索');
  assert.match(affinity.rationale, /命中了关键概念/);
});

test('computeSoftmax normalizes logits to valid probability distribution summing to ~1', () => {
  const logits = [3.5, 1.2, 0.4];
  const probs = computeSoftmax(logits);
  assert.equal(probs.length, 3);
  const sum = probs.reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(sum - 1.0) < 0.01, `Softmax should sum to approximately 1, got ${sum}`);
  assert.ok(probs[0] > probs[1] && probs[1] > probs[2], 'Probabilities must preserve order of logits');
});

test('runDecisionRagNavigation executes beam search down to passage level with 0 tokens generated', () => {
  const result = runDecisionRagNavigation('单次前向传播与零Token如何降低延迟？', mockCorpusTree, 1);
  assert.equal(result.stats.tokensGenerated, 0, 'DecisionRAG must generate 0 tokens during retrieval');
  assert.ok(result.steps.length >= 2, 'Should traverse multiple hierarchy levels');
  assert.ok(result.finalPassages.length > 0, 'Must retrieve target leaf passage');
  assert.equal(result.finalPassages[0].node.id, 'pas-forward-pass', 'Should retrieve the exact passage');
});

test('PARADIGM_BENCHMARKS contains correct relative superiority for DecisionRAG', () => {
  const decisionRag = PARADIGM_BENCHMARKS.find(p => p.name.includes('DecisionRAG'));
  const denseReranker = PARADIGM_BENCHMARKS.find(p => p.name.includes('8B Reranker'));
  assert.ok(decisionRag && denseReranker);
  assert.ok(decisionRag.recallAt1 > denseReranker.recallAt1, 'DecisionRAG should beat Dense+8B Reranker on Recall@1');
  assert.ok(decisionRag.avgLatencyMs < denseReranker.avgLatencyMs, 'DecisionRAG should have lower latency than 8B cross-encoder');
  assert.equal(decisionRag.tokensGenerated, 0, 'DecisionRAG generates 0 tokens');
});
