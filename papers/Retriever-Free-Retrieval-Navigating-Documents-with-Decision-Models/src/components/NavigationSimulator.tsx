import React, { useState, useMemo, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  Cpu,
  CheckCircle,
  Zap,
  Clock,
  Sparkles,
  Terminal,
  GitBranch,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Eye
} from 'lucide-react';
import {
  runDecisionRagNavigation,
  NavigationResult,
  NavigationStep,
  DocumentNode,
  CandidateBranch
} from '../utils/treeNavigation.js';
import {
  CORPUS_PRESETS,
  PRESET_QUERIES,
  PredefinedQuery
} from '../data/mockTreeCorpus.js';

type TraceNodeStatus = 'router' | 'domain-active' | 'domain-idle' | 'target-hit' | 'active-beam' | 'evaluated-pruned' | 'unvisited';

interface TraceTreeDatum {
  id: string;
  titleZh: string;
  titleEn: string;
  level: 'router' | 'domain' | 'document' | 'section' | 'passage';
  summaryZh: string;
  keywords: string[];
  stepIndex?: number; // 1-indexed step where this node is evaluated
  status: TraceNodeStatus;
  rawLogit?: number;
  probability?: number;
  rationale?: string;
  children?: TraceTreeDatum[];
}

export const NavigationSimulator: React.FC = () => {
  const [selectedCorpusId, setSelectedCorpusId] = useState<string>('wikipedia');
  const [queryInput, setQueryInput] = useState<string>(PRESET_QUERIES[0].query);
  const [beamWidth, setBeamWidth] = useState<number>(2);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [traceViewMode, setTraceViewMode] = useState<'step' | 'panorama'>('step');
  const [showPromptInspector, setShowPromptInspector] = useState<boolean>(false);
  const [inspectedNodeId, setInspectedNodeId] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const currentCorpus = useMemo(() => {
    return CORPUS_PRESETS.find((c) => c.id === selectedCorpusId) || CORPUS_PRESETS[0];
  }, [selectedCorpusId]);

  // Run the pure navigation algorithm
  const navResult: NavigationResult = useMemo(() => {
    return runDecisionRagNavigation(queryInput, currentCorpus.rootNodes, beamWidth);
  }, [queryInput, currentCorpus, beamWidth]);

  const maxSteps = navResult.steps.length;
  const currentStep: NavigationStep | undefined = navResult.steps[activeStepIndex];

  // Auto-play timer for real-time D3 trace animation
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = window.setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < maxSteps - 1) {
          return prev + 1;
        }
        setIsAutoPlaying(false);
        return prev;
      });
    }, 1300);
    return () => window.clearInterval(timer);
  }, [isAutoPlaying, maxSteps]);

  // Build annotated hierarchy data for D3 tree layout
  const { hierarchyRootData, nodeLookupMap } = useMemo(() => {
    const effectiveMaxStepIdx = traceViewMode === 'panorama' ? maxSteps - 1 : activeStepIndex;
    const candidateMap = new Map<string, { stepIdx: number; cand: CandidateBranch; isSelected: boolean }>();

    navResult.steps.forEach((step, sIdx) => {
      if (sIdx <= effectiveMaxStepIdx) {
        step.candidates.forEach((cand) => {
          candidateMap.set(cand.nodeId, {
            stepIdx: sIdx,
            cand,
            isSelected: step.selectedNodeIds.includes(cand.nodeId),
          });
        });
      }
    });

    const topFinalId = navResult.finalPassages[0]?.node.id;
    const lookup = new Map<string, TraceTreeDatum>();

    const convertNode = (node: DocumentNode, depth: number): TraceTreeDatum => {
      const evalInfo = candidateMap.get(node.id);
      const convertedChildren = node.children?.map((ch) => convertNode(ch, depth + 1));

      let status: TraceNodeStatus = 'unvisited';
      if (node.level === 'domain') {
        const hasActiveChild = convertedChildren?.some(
          (c) => c.status === 'active-beam' || c.status === 'target-hit'
        );
        status = hasActiveChild ? 'domain-active' : 'domain-idle';
      } else if (evalInfo) {
        if (
          effectiveMaxStepIdx === maxSteps - 1 &&
          node.id === topFinalId &&
          evalInfo.isSelected
        ) {
          status = 'target-hit';
        } else if (evalInfo.isSelected) {
          status = 'active-beam';
        } else {
          status = 'evaluated-pruned';
        }
      }

      const datum: TraceTreeDatum = {
        id: node.id,
        titleZh: node.titleZh,
        titleEn: node.title,
        level: node.level,
        summaryZh: node.summaryZh,
        keywords: node.keywords,
        stepIndex: evalInfo ? evalInfo.stepIdx + 1 : depth >= 2 ? depth - 1 : undefined,
        status,
        rawLogit: evalInfo?.cand.rawLogit,
        probability: evalInfo?.cand.normalizedProbability,
        rationale: evalInfo?.cand.rationale,
        children: convertedChildren,
      };
      lookup.set(node.id, datum);
      return datum;
    };

    const rootDatum: TraceTreeDatum = {
      id: 'query-router-root',
      titleZh: '免检索器查询路由 (Query Router)',
      titleEn: 'Retriever-Free Decision Router',
      level: 'router',
      summaryZh: `接收用户查询：「${queryInput}」，无需向量数据库索引，直接对文档树逐层执行单步前向传播打分。`,
      keywords: ['Zero-Token', 'Shared-Context', 'Beam Search'],
      status: 'router',
      children: currentCorpus.rootNodes.map((rn) => convertNode(rn, 1)),
    };
    lookup.set(rootDatum.id, rootDatum);

    return { hierarchyRootData: rootDatum, nodeLookupMap: lookup };
  }, [currentCorpus, navResult, activeStepIndex, traceViewMode, maxSteps, queryInput]);

  const inspectedNode: TraceTreeDatum = useMemo(() => {
    if (inspectedNodeId && nodeLookupMap.has(inspectedNodeId)) {
      return nodeLookupMap.get(inspectedNodeId)!;
    }
    // Default to top selected candidate in current step
    const currentTopId = currentStep?.selectedNodeIds[0];
    if (currentTopId && nodeLookupMap.has(currentTopId)) {
      return nodeLookupMap.get(currentTopId)!;
    }
    return hierarchyRootData;
  }, [inspectedNodeId, nodeLookupMap, currentStep, hierarchyRootData]);

  // Render D3.js Interactive Tree Trace Graph
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const width = 980;
    const height = 430;
    const margin = { top: 44, right: 175, bottom: 26, left: 115 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    // Root zoomable group
    const zoomGroup = svg.append('g').attr('class', 'd3-zoom-canvas');
    const mainGroup = zoomGroup
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Configure D3 Zoom & Pan
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.65, 2.2])
      .on('zoom', (event) => {
        zoomGroup.attr('transform', event.transform.toString());
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    // Build D3 Hierarchy & Tree layout
    const root = d3.hierarchy<TraceTreeDatum>(hierarchyRootData);
    const treeLayout = d3.tree<TraceTreeDatum>().size([innerHeight, innerWidth]);
    const treeData = treeLayout(root);

    // Draw Hierarchy Level Column Guides
    const levelGuides = [
      { depth: 0, label: 'L0: 查询路由入口' },
      { depth: 1, label: 'L1: 领域层 (Domain)' },
      { depth: 2, label: 'L2: 文档层 (Step 1)' },
      { depth: 3, label: 'L3: 章节层 (Step 2)' },
      { depth: 4, label: 'L4: 段落层 (Step 3)' },
    ];

    const depthPositions = new Map<number, number>();
    treeData.descendants().forEach((d) => {
      if (!depthPositions.has(d.depth)) {
        depthPositions.set(d.depth, d.y);
      }
    });

    const guideGroup = mainGroup.append('g').attr('class', 'd3-level-guides');
    levelGuides.forEach((lg) => {
      const colX = depthPositions.get(lg.depth);
      if (colX === undefined) return;
      const isCurrentStepCol =
        traceViewMode === 'step' && lg.depth >= 2 && lg.depth - 2 === activeStepIndex;

      guideGroup
        .append('line')
        .attr('x1', colX)
        .attr('y1', -18)
        .attr('x2', colX)
        .attr('y2', innerHeight + 12)
        .attr('stroke', isCurrentStepCol ? 'var(--color-emerald-500)' : 'var(--app-grid-line)')
        .attr('stroke-width', isCurrentStepCol ? 1.5 : 1)
        .attr('stroke-dasharray', '4 4')
        .attr('opacity', isCurrentStepCol ? 0.65 : 0.4);

      guideGroup
        .append('text')
        .attr('x', colX)
        .attr('y', -24)
        .attr('text-anchor', 'middle')
        .attr('fill', isCurrentStepCol ? 'var(--color-emerald-400)' : 'var(--app-text-muted)')
        .attr('font-size', '10px')
        .attr('font-family', 'monospace')
        .attr('font-weight', isCurrentStepCol ? '700' : '500')
        .text(lg.label);
    });

    // Horizontal cubic bezier link generator
    const linkGenerator = d3
      .linkHorizontal<d3.HierarchyPointLink<TraceTreeDatum>, d3.HierarchyPointNode<TraceTreeDatum>>()
      .x((d) => d.y)
      .y((d) => d.x);

    // Draw Links
    const linkGroup = mainGroup.append('g').attr('class', 'd3-links');
    linkGroup
      .selectAll('path.trace-link')
      .data(treeData.links())
      .join('path')
      .attr('class', 'trace-link')
      .attr('d', (d) => linkGenerator(d) || '')
      .attr('fill', 'none')
      .attr('stroke', (d) => {
        const st = d.target.data.status;
        if (st === 'target-hit') return 'var(--color-emerald-400)';
        if (st === 'active-beam' || st === 'domain-active') return 'var(--color-emerald-500)';
        if (st === 'evaluated-pruned') return 'var(--color-amber-500)';
        return 'var(--app-grid-line)';
      })
      .attr('stroke-width', (d) => {
        const st = d.target.data.status;
        if (st === 'target-hit') return 3.4;
        if (st === 'active-beam' || st === 'domain-active') return 2.5;
        if (st === 'evaluated-pruned') return 1.5;
        return 1.1;
      })
      .attr('stroke-dasharray', (d) => {
        const st = d.target.data.status;
        if (st === 'evaluated-pruned') return '5 4';
        if (st === 'unvisited') return '2 3';
        return 'none';
      })
      .attr('opacity', (d) => {
        const st = d.target.data.status;
        if (st === 'target-hit' || st === 'active-beam' || st === 'domain-active') return 0.95;
        if (st === 'evaluated-pruned') return 0.65;
        return 0.32;
      });

    // Draw Nodes
    const nodeGroup = mainGroup.append('g').attr('class', 'd3-nodes');
    const nodes = nodeGroup
      .selectAll('g.trace-node')
      .data(treeData.descendants())
      .join('g')
      .attr('class', 'trace-node')
      .attr('transform', (d) => `translate(${d.y},${d.x})`)
      .style('cursor', 'pointer')
      .on('click', (_event, d) => {
        setInspectedNodeId(d.data.id);
        if (d.depth >= 2 && d.depth - 2 < maxSteps) {
          setActiveStepIndex(d.depth - 2);
        }
      })
      .on('mouseenter', (_event, d) => {
        setInspectedNodeId(d.data.id);
      });

    // Outer Halo for Active Beam / Target Hit / Inspected Node
    nodes
      .filter(
        (d) =>
          d.data.status === 'target-hit' ||
          d.data.status === 'active-beam' ||
          d.data.id === inspectedNode.id
      )
      .append('circle')
      .attr('r', (d) => (d.data.status === 'target-hit' ? 14 : 11))
      .attr('fill', (d) =>
        d.data.status === 'target-hit' ? 'var(--color-emerald-500)' : 'var(--color-teal-500)'
      )
      .attr('opacity', 0.22);

    // Main Node Circle
    nodes
      .append('circle')
      .attr('r', (d) => {
        if (d.data.status === 'router') return 8.5;
        if (d.data.status === 'target-hit') return 8.5;
        if (d.data.status === 'active-beam' || d.data.status === 'domain-active') return 7;
        return 5.5;
      })
      .attr('fill', (d) => {
        const st = d.data.status;
        if (st === 'router') return 'var(--color-teal-500)';
        if (st === 'target-hit') return 'var(--color-emerald-500)';
        if (st === 'active-beam' || st === 'domain-active') return 'var(--color-emerald-500)';
        if (st === 'evaluated-pruned') return 'var(--color-amber-500)';
        return 'var(--app-surface-elevated)';
      })
      .attr('stroke', (d) => {
        if (d.data.id === inspectedNode.id) return 'var(--app-text)';
        const st = d.data.status;
        if (st === 'target-hit' || st === 'active-beam' || st === 'domain-active')
          return 'var(--color-emerald-300)';
        if (st === 'evaluated-pruned') return 'var(--color-amber-400)';
        return 'var(--app-border-strong)';
      })
      .attr('stroke-width', (d) => (d.data.id === inspectedNode.id ? 2.5 : 1.6));

    // Node Title Label
    nodes
      .append('text')
      .attr('dy', (d) => (d.children && d.children.length > 0 ? -12 : -3))
      .attr('x', (d) => (d.children && d.children.length > 0 ? 0 : 12))
      .attr('text-anchor', (d) => (d.children && d.children.length > 0 ? 'middle' : 'start'))
      .attr('fill', (d) => {
        const st = d.data.status;
        if (st === 'target-hit' || st === 'active-beam' || st === 'domain-active' || st === 'router') {
          return 'var(--app-text)';
        }
        return 'var(--app-text-muted)';
      })
      .attr('font-size', '11px')
      .attr('font-weight', (d) =>
        d.data.status === 'target-hit' || d.data.status === 'active-beam' ? '700' : '500'
      )
      .text((d) =>
        d.data.titleZh.length > 13 ? `${d.data.titleZh.slice(0, 13)}…` : d.data.titleZh
      );

    // Probability / Status Sub-Label (Logits & Beam Routing Badge)
    nodes
      .filter((d) => d.depth >= 2)
      .append('text')
      .attr('dy', (d) => (d.children && d.children.length > 0 ? 18 : 11))
      .attr('x', (d) => (d.children && d.children.length > 0 ? 0 : 12))
      .attr('text-anchor', (d) => (d.children && d.children.length > 0 ? 'middle' : 'start'))
      .attr('font-size', '9.5px')
      .attr('font-family', 'monospace')
      .attr('font-weight', '600')
      .attr('fill', (d) => {
        const st = d.data.status;
        if (st === 'target-hit' || st === 'active-beam') return 'var(--color-emerald-400)';
        if (st === 'evaluated-pruned') return 'var(--color-amber-400)';
        return 'var(--app-text-muted)';
      })
      .text((d) => {
        if (d.data.probability !== undefined && d.data.rawLogit !== undefined) {
          const pct = (d.data.probability * 100).toFixed(1);
          const tag =
            d.data.status === 'target-hit'
              ? '★命中'
              : d.data.status === 'active-beam'
              ? '✓晋级'
              : '✕剪枝';
          return `${tag} P=${pct}% (L:${d.data.rawLogit})`;
        }
        return '免扫描跳过 (0 FLOPs)';
      });
  }, [hierarchyRootData, activeStepIndex, traceViewMode, maxSteps, inspectedNode.id]);

  const handleZoom = (factor: number) => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(220).call(zoomBehaviorRef.current.scaleBy, factor);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current)
      .transition()
      .duration(250)
      .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
  };

  const handleSelectPresetQuery = (pq: PredefinedQuery) => {
    setIsAutoPlaying(false);
    setQueryInput(pq.query);
    setActiveStepIndex(0);
    setInspectedNodeId(null);
    if (pq.category.includes('维基')) setSelectedCorpusId('wikipedia');
    else if (pq.category.includes('IBM')) setSelectedCorpusId('ibm-cloud');
    else if (pq.category.includes('政策')) setSelectedCorpusId('multidoc');
  };

  const handleNextStep = () => {
    setIsAutoPlaying(false);
    if (activeStepIndex < maxSteps - 1) {
      setActiveStepIndex((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setIsAutoPlaying(false);
    if (activeStepIndex > 0) {
      setActiveStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsAutoPlaying(false);
    setActiveStepIndex(0);
  };

  const handleRunToEnd = () => {
    setIsAutoPlaying(false);
    setActiveStepIndex(maxSteps - 1);
  };

  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      setIsAutoPlaying(false);
    } else {
      if (activeStepIndex >= maxSteps - 1) {
        setActiveStepIndex(0);
      }
      setTraceViewMode('step');
      setIsAutoPlaying(true);
    }
  };

  return (
    <div className="paper-simulator-stage max-w-6xl mx-auto px-4 py-8 space-y-8">
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
                  D3.js 实时链路追踪 + 单步前向模拟
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                亲眼观察「免检索器」决策模型如何在无显式向量索引的情况下，通过单步 Logits 打分、束搜索剪枝与共享上下文对比，在文档层级树中实时路由定位目标正文。
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
            <span>推荐预设测试问题（点击快速载入并刷新 D3 路由树）：</span>
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
                setIsAutoPlaying(false);
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
                setIsAutoPlaying(false);
                setSelectedCorpusId(e.target.value);
                setActiveStepIndex(0);
                setInspectedNodeId(null);
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
                  setIsAutoPlaying(false);
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
              onClick={() => {
                setIsAutoPlaying(false);
                setActiveStepIndex(idx);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeStepIndex === idx
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : idx < activeStepIndex
                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <span>
                第 {idx + 1} 步: {s.levelName}
              </span>
              {idx < activeStepIndex && <CheckCircle className="w-3 h-3" />}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={toggleAutoPlay}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              isAutoPlaying
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
            }`}
          >
            {isAutoPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>暂停动态追踪</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>动态回放路由链路</span>
              </>
            )}
          </button>
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

      {/* NEW: D3.js Interactive Hierarchy & Query Routing Trace Graph */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-emerald-400" />
              <span>D3.js 免检索器文档树实时链路追踪图 (Zero-Index Hierarchical Trace)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              点击或悬停树中任意节点可检视其实时 Logit 得分与束搜索状态；支持拖拽平移与缩放，直观展示决策模型如何跳过无关子树直达目标段落。
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Trace Mode Switch */}
            <div className="inline-flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setTraceViewMode('step')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  traceViewMode === 'step'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                逐步路由追踪 (Step {activeStepIndex + 1}/{maxSteps})
              </button>
              <button
                type="button"
                onClick={() => setTraceViewMode('panorama')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  traceViewMode === 'panorama'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                全链路全景视图
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="inline-flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-1">
              <button
                type="button"
                onClick={() => handleZoom(1.25)}
                className="p-1 rounded hover:bg-slate-800 text-slate-300 cursor-pointer"
                title="放大链路图"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleZoom(0.8)}
                className="p-1 rounded hover:bg-slate-800 text-slate-300 cursor-pointer"
                title="缩小链路图"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="p-1 rounded hover:bg-slate-800 text-slate-300 cursor-pointer"
                title="重置缩放与位置"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Legend Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 bg-slate-950/60 px-3.5 py-2 rounded-xl border border-slate-800/80">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block ring-2 ring-emerald-500/30" />
              <strong className="text-slate-200">Beam 晋级 / 最终命中路径</strong> (实线高亮)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <strong className="text-slate-300">共享上下文淘汰分支</strong> (虚线剪枝)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-700 inline-block" />
              <strong className="text-slate-400">免扫描跳过子树</strong> (0 次前向传播，彻底省去索引开销)
            </span>
          </div>
          <span className="font-mono text-emerald-400">
            当前束宽 B={beamWidth} · 已剪枝 {navResult.stats.prunedBranchesCount} 条分支
          </span>
        </div>

        {/* D3 Canvas + Node Telemetry Inspector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <div className="lg:col-span-8 bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
            <svg
              ref={svgRef}
              viewBox="0 0 980 430"
              className="w-full h-[380px] sm:h-[420px] select-none"
              aria-label="DecisionRAG D3.js 交互式文档层级导航链路图"
            />
          </div>

          {/* Interactive Node Telemetry Inspector */}
          <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>节点路由遥测检查器</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {inspectedNode.level.toUpperCase()}
                </span>
              </div>

              <div>
                <div className="text-sm font-bold text-white">{inspectedNode.titleZh}</div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  {inspectedNode.titleEn}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                {inspectedNode.summaryZh}
              </p>

              {inspectedNode.rawLogit !== undefined && inspectedNode.probability !== undefined ? (
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">单步前向 Logit</span>
                    <span className="text-sm font-mono font-bold text-emerald-400">
                      {inspectedNode.rawLogit.toFixed(2)}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">共享上下文 Softmax</span>
                    <span className="text-sm font-mono font-bold text-teal-400">
                      {(inspectedNode.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
                  {inspectedNode.level === 'router' || inspectedNode.level === 'domain'
                    ? '顶层路由入口/领域根节点：负责分发初始候选文档集。'
                    : '由于父节点已在上一层被束搜索剪枝（或当前步骤尚未到达该层），决策模型无需对该子树执行任何前向计算！'}
                </div>
              )}

              {inspectedNode.rationale && (
                <div className="p-2.5 rounded-lg bg-emerald-950/25 border border-emerald-500/30 text-[11px] text-emerald-300 leading-relaxed">
                  <strong>决策路由依据：</strong>
                  {inspectedNode.rationale}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800 flex flex-wrap gap-1.5">
              {inspectedNode.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-800"
                >
                  #{kw}
                </span>
              ))}
            </div>
          </div>
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
                  * 说明：模型处理完该 Prompt 后无需自回归输出文字，直接提取词表中选项对应 Token（如 &apos;A&apos;, &apos;B&apos;）的未归一化对数概率（Logits）。
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
                      onClick={() => setInspectedNodeId(cand.nodeId)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900/90 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                          : 'bg-slate-950/60 border-slate-800/80 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-md font-mono text-xs font-bold flex items-center justify-center ${
                              isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                            }`}
                          >
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
