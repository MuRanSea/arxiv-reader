import React, { useState, useMemo } from 'react';
import { Sparkles, Terminal, TrendingUp, Cpu } from 'lucide-react';

interface TaskPreset {
  id: string;
  name: string;
  instruction: string;
  demos: { x: string; y: string }[];
  queryX: string;
  expectedY: string;
  // Accuracy [Zero-Shot, One-Shot, Few-Shot (K=3)] for 4 model scales
  accByScale: {
    scale: string;
    params: string;
    scores: [number, number, number];
  }[];
}

const TASKS: TaskPreset[] = [
  {
    id: 'neologism',
    name: '即兴新造词推理 (Word Scrambling / Neologism)',
    instruction: '根据给定假想新词的定义，造出一个符合语境与词性的英文句子：',
    demos: [
      {
        x: '词条："farduddle" 的意思是「因为兴奋而快速原地跳跃」。',
        y: '造句：When the dog saw the leash, it began to farduddle around the hallway.',
      },
      {
        x: '词条："blitherington" 的意思是「假装认真听讲但实际上在发呆的人」。',
        y: '造句：Half the attendees in the Monday morning meeting were complete blitheringtons.',
      },
      {
        x: '词条："snorflax" 的意思是「把吃剩的披萨塞进冰箱最底层」。',
        y: '造句：He decided to snorflax the last two slices for tomorrow.',
      },
    ],
    queryX: '词条："glimmerwane" 的意思是「日落十分海面上逐渐消逝的最后一缕金光」。',
    expectedY: '造句：We stood silently on the cliff watching the glimmerwane fade into the dark ocean.',
    accByScale: [
      { scale: 'GPT-3 Small', params: '125M', scores: [8, 14, 21] },
      { scale: 'GPT-3 XL', params: '1.3B', scores: [24, 38, 52] },
      { scale: 'GPT-3 13B', params: '13B', scores: [46, 65, 79] },
      { scale: 'GPT-3 175B', params: '175B', scores: [68, 86, 95] },
    ],
  },
  {
    id: 'arithmetic',
    name: '三位数加法与算术泛化 (3-Digit Addition)',
    instruction: '计算下列算术表达式并直接输出精确整数结果：',
    demos: [
      { x: 'Q: What is 428 plus 351?', y: 'A: 779' },
      { x: 'Q: What is 194 plus 627?', y: 'A: 821' },
      { x: 'Q: What is 509 plus 384?', y: 'A: 893' },
    ],
    queryX: 'Q: What is 746 plus 238?',
    expectedY: 'A: 984',
    accByScale: [
      { scale: 'GPT-3 Small', params: '125M', scores: [1, 1, 2] },
      { scale: 'GPT-3 XL', params: '1.3B', scores: [2, 4, 8] },
      { scale: 'GPT-3 13B', params: '13B', scores: [9, 15, 28] },
      { scale: 'GPT-3 175B', params: '175B', scores: [58, 74, 81] },
    ],
  },
  {
    id: 'translation',
    name: '英法机器翻译 (Unseen Translation)',
    instruction: '将下列英文短语准确翻译为地道法语：',
    demos: [
      { x: 'English: sea otter', y: 'French: loutre de mer' },
      { x: 'English: peppermint', y: 'French: menthe poivrée' },
      { x: 'English: plush giraffe', y: 'French: girafe en peluche' },
    ],
    queryX: 'English: cheese',
    expectedY: 'French: fromage',
    accByScale: [
      { scale: 'GPT-3 Small', params: '125M', scores: [18, 29, 36] },
      { scale: 'GPT-3 XL', params: '1.3B', scores: [42, 58, 66] },
      { scale: 'GPT-3 13B', params: '13B', scores: [59, 74, 82] },
      { scale: 'GPT-3 175B', params: '175B', scores: [72, 85, 92] },
    ],
  },
];

export const GptInContextSimulator: React.FC = () => {
  const [taskIdx, setTaskIdx] = useState<number>(0);
  const [shotMode, setShotMode] = useState<0 | 1 | 3>(3); // 0 = Zero-Shot, 1 = One-Shot, 3 = Few-Shot

  const activeTask = TASKS[taskIdx];
  const scoreColIdx = shotMode === 0 ? 0 : shotMode === 1 ? 1 : 2;

  const activeDemos = useMemo(() => {
    return activeTask.demos.slice(0, shotMode);
  }, [activeTask, shotMode]);

  return (
    <div className="space-y-6">
      {/* Top Controls: Task Selection & Shot Mode */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              实验一：上下文学习（In-Context Learning）提示词构造器与零梯度推理
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              切换示例个数 <span className="font-mono text-emerald-400">K ∈ &#123;0, 1, 3&#125;</span>（论文 Figure 2.1 复现），全程零梯度更新（<span className="font-mono text-amber-400">∇Θ = 0</span>），观察自回归条件概率变化
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {TASKS.map((t, idx) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTaskIdx(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  taskIdx === idx
                    ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Shot Selector Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <button
            type="button"
            onClick={() => setShotMode(0)}
            className={`p-3 rounded-xl border text-left transition-all ${
              shotMode === 0
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold">Zero-Shot (零样本 K=0)</div>
            <div className="text-[11px] opacity-80 mt-0.5">仅提供自然语言任务指令，无任何示例</div>
          </button>

          <button
            type="button"
            onClick={() => setShotMode(1)}
            className={`p-3 rounded-xl border text-left transition-all ${
              shotMode === 1
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold">One-Shot (单样本 K=1)</div>
            <div className="text-[11px] opacity-80 mt-0.5">任务指令 + 1 个标准输入输出演示对</div>
          </button>

          <button
            type="button"
            onClick={() => setShotMode(3)}
            className={`p-3 rounded-xl border text-left transition-all ${
              shotMode === 3
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="text-xs font-bold">Few-Shot (少样本 K=3)</div>
            <div className="text-[11px] opacity-80 mt-0.5">任务指令 + 多个上下文示例激活归纳头</div>
          </button>
        </div>

        {/* Constructed Prompt Window & Scale Accuracy Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* Prompt Context Window */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 pb-1.5 border-b border-slate-800">
                <span className="flex items-center gap-1.5 font-sans font-bold text-slate-200">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  送入 GPT-3 上下文窗口 (n_ctx = 2048) 的完整序列：
                </span>
                <span className="text-emerald-400">权重更新: 0 次</span>
              </div>

              {/* Task Description */}
              <div className="p-2 rounded bg-blue-950/30 border border-blue-500/30 text-blue-300">
                <span className="text-[10px] uppercase tracking-wider text-blue-400 block mb-0.5">
                  [Task Description 任务描述]
                </span>
                {activeTask.instruction}
              </div>

              {/* K Demonstrations */}
              {activeDemos.length > 0 ? (
                <div className="space-y-1.5">
                  {activeDemos.map((d, i) => (
                    <div key={i} className="p-2 rounded bg-purple-950/30 border border-purple-500/30 text-purple-200">
                      <span className="text-[10px] text-purple-400 block">
                        [Demonstration 示例 #{i + 1}]
                      </span>
                      <div>{d.x}</div>
                      <div className="text-purple-300 font-bold">{d.y}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-2.5 rounded border border-dashed border-slate-800 text-slate-500 text-center font-sans">
                  （当前为 Zero-Shot 模式：未插入任何示例，直接进行测试提问）
                </div>
              )}

              {/* Final Query + Autoregressive Completion */}
              <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-500/40 text-emerald-200">
                <span className="text-[10px] text-emerald-400 block mb-0.5">
                  [Inference Query 测试输入 → 自回归续写生成]
                </span>
                <div>{activeTask.queryX}</div>
                <div className="text-emerald-400 font-bold mt-1 flex items-center gap-1.5">
                  <span>▸ {activeTask.expectedY}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Model Scale Emergent Accuracy Bars (125M -> 175B) */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <h5 className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                实验二：参数规模涌现曲线 (125M → 175B)
              </h5>
              <p className="text-[11px] text-slate-400 mb-3">
                观察在当前 <strong className="text-emerald-400">{shotMode}-Shot</strong> 模式下，不同参数量级的准确率跃升：
              </p>

              <div className="space-y-3">
                {activeTask.accByScale.map((m) => {
                  const currentAcc = m.scores[scoreColIdx];
                  const zeroAcc = m.scores[0];
                  const iclGain = currentAcc - zeroAcc;
                  return (
                    <div key={m.scale} className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-slate-200 flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-blue-400" />
                          {m.scale} <span className="font-mono text-slate-400">({m.params})</span>
                        </span>
                        <div className="flex items-center gap-2 font-mono">
                          {iclGain > 0 && (
                            <span className="text-[10px] text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded">
                              +{iclGain}% ICL增益
                            </span>
                          )}
                          <span className="font-bold text-amber-400">{currentAcc}%</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-300"
                          style={{ width: `${currentAcc}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              💡 <strong className="text-slate-200">规律洞察：</strong>小模型（125M）即使给再多示例也几乎无法理解算术与新词规则；而当参数达到 <strong className="text-amber-400">175B</strong> 时，仅靠 1~3 个示例就能在激活空间触发强烈的元学习跃升！
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
