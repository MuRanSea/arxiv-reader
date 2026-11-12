import { UniversalPaperData } from '../../../../src/shared/types/universalPaper.js';

export const TRANSFORMER_2017_DATA: UniversalPaperData = {
  id: 'transformer-2017',
  folderName: 'Attention-Is-All-You-Need',
  systemTitleZh: 'Transformer 开山论文精读与自注意力矩阵实验系统',
  venueBadge: 'NeurIPS 2017 (现代AI总基石)',
  arxivId: 'arXiv:1706.03762',
  absUrl: 'https://arxiv.org/abs/1706.03762',
  pdfUrl: 'https://arxiv.org/pdf/1706.03762',
  titleZh: '注意力就是你所需的一切：开创现代大模型的 Transformer 架构',
  titleEn: 'Attention Is All You Need',
  publishDate: '2017年6月 (NeurIPS 2017)',
  authors: [
    'Ashish Vaswani',
    'Noam Shazeer',
    'Niki Parmar',
    'Jakob Uszkoreit',
    'Llion Jones',
    'Aidan N. Gomez',
    'Łukasz Kaiser',
    'Illia Polosukhin'
  ],
  affiliations: ['Google Brain', 'Google Research', 'University of Toronto'],
  simulatorTabLabel: 'Transformer 注意力实验台',
  tldrZh:
    '人工智能历史引用量最高的里程碑论文之一！彻底摒弃了统治序列建模数十年的循环神经网络（RNN/LSTM）和卷积网络（CNN），首次提出完全仅基于「自注意力机制（Self-Attention）」的 Transformer 架构。通过缩放点积注意力（Scaled Dot-Product Attention）、多头注意力（Multi-Head Attention）与正余弦位置编码，将序列任意位置的交互距离缩短至 O(1) 并实现全序列并行训练，直接奠定了 BERT、GPT、ViT 等所有现代大模型的架构根基！',
  abstractZh:
    '主流的序列转导模型（Sequence Transduction Models）均基于复杂的循环神经网络或卷积神经网络，且包含一个编码器和一个解码器。表现最好的模型还通过注意力机制连接编码器和解码器。我们提出了一种全新的简单网络架构——Transformer，它完全基于注意力机制，彻底抛弃了循环（Recurrence）和卷积（Convolution）。在两个机器翻译任务上的实验表明，这些模型在质量上更加优越，同时具备更高的并行性，并且所需的训练时间显著减少。我们的模型在 WMT 2014 英译德任务上取得了 28.4 BLEU 的成绩，比包括集成模型在内的现有最佳结果提升了超过 2 个 BLEU。在 WMT 2014 英译法任务上，我们的模型在 8 块 GPU 上仅训练 3.5 天后，便创下了 41.8 的单模型最新 BLEU 记录，训练成本仅为文献中最佳模型的一小部分。此外，我们将 Transformer 成功应用于英语选区句法分析任务，证明了其良好的泛化能力。',
  abstractEn:
    'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train. Our model achieves 28.4 BLEU on the WMT 2014 English-to-German translation task, improving over the existing best results, including ensembles, by over 2 BLEU. On the WMT 2014 English-to-French translation task, our model establishes a new single-model state-of-the-art BLEU score of 41.8 after training for 3.5 days on eight GPUs, a small fraction of the training costs of the best models from the literature. We show that the Transformer generalizes well to other tasks by applying it successfully to English constituency parsing both with large and limited training data.',
  bibtex: `@inproceedings{vaswani2017attention,
  title={Attention is all you need},
  author={Vaswani, Ashish and Shazeer, Noam and Parmar, Niki and Uszkoreit, Jakob and Jones, Llion and Gomez, Aidan N and Kaiser, {\\L}ukasz and Polosukhin, Illia},
  booktitle={Advances in Neural Information Processing Systems (NeurIPS)},
  volume={30},
  year={2017}
}`,
  coreInnovations: [
    {
      title: '彻底抛弃 RNN/CNN 的纯自注意力架构',
      desc: '将任意两个序列位置间的信号传递最大路径长度从 RNN 的 O(n) 直接降为常数 O(1)，实现训练阶段全序列高度并行计算。'
    },
    {
      title: '缩放点积注意力 (Scaled Dot-Product Attention)',
      desc: '通过除以 √d_k 消除高维点积方差膨胀，防止 Softmax 落入梯度极小的饱和区，兼具矩阵乘法硬件加速优势。'
    },
    {
      title: '多头注意力机制 (Multi-Head Attention)',
      desc: '将 512 维表征拆分为 8 个 64 维子空间并行执行注意力，使模型能同时捕捉句法指代、语义关联与词法搭配。'
    },
    {
      title: '正余弦位置编码 (Sinusoidal Positional Encoding)',
      desc: '利用不同波长的正弦与余弦函数注入绝对与相对位置信息，无需循环结构即可感知词序且具备长序列外推潜力。'
    }
  ],
  beginnerSteps: [
    {
      badge: '第一步：为什么淘汰 RNN？',
      title: '打破“击鼓传花”式的顺序计算枷锁',
      subtitle: 'Sequential Bottleneck vs. O(1) Global Parallelism',
      contentParagraphs: [
        '在 Transformer 诞生前，处理一句话必须用 RNN（如 LSTM）：读完第 1 个词算完状态 h₁，才能读第 2 个词算 h₂……就像全班同学排成一排玩“击鼓传花”。',
        '这种模式有两个致命缺陷：① GPU 有几千个核心却只能干等着前一个词算完，无法并行；② 当句子长达 50 个词时，第 1 个词的信息传到最后早已被磨损殆尽（长距离遗忘）。',
        'Transformer 大胆砍掉了所有循环连接，让句子里的每一个词在同一瞬间直接与所有其他词“面对面连线对话”，路径长度永远是 O(1)！'
      ],
      highlightBox: {
        title: '序列建模三大架构核心指标对比（论文 Table 1）',
        points: [
          'RNN 循环层：顺序操作次数 O(n)，最大依赖路径 O(n) —— 无法并行且长程易遗忘。',
          'CNN 卷积层（核宽 k）：最大依赖路径 O(log_k(n)) —— 需要堆叠多层才能看清全句。',
          'Self-Attention 自注意力层：顺序操作次数 O(1)，最大依赖路径 O(1) —— 全并行且一步直达全句任意位置！'
        ]
      },
      takeawayCallout: '自注意力把“排队接力传话”变成了“全员同桌圆桌会议”，一举解放了现代 GPU 的算力！'
    },
    {
      badge: '第二步：理解 Q、K、V 与 √d_k',
      title: '缩放点积注意力：图书馆检索式的信息聚合',
      subtitle: 'Query, Key, Value & Why Divide by √d_k',
      contentParagraphs: [
        '自注意力如何运作？每个词都会通过三个线性矩阵生成三个身份向量：Query（查询 Q：我想找什么信息？）、Key（键 K：我身上有什么特征标签？）、Value（值 V：我实际携带的内容干货是什么？）。',
        '当前词的 Q 与句中所有词的 K 做点积 QKᵀ，算出匹配度分数；然后除以缩放因子 √d_k（论文中 d_k=64，所以除以 8），过一遍 Softmax 变成总和为 100% 的注意力权重，最后对 Value 加权求和！',
        '为什么要除以 √d_k？因为当维度 d_k 很大时，两个随机向量的点积方差会放大 d_k 倍，有的值变成 +30，有的变成 -30，送进 Softmax 后会变成极端的 0.999999 和 0.000001，导致反向传播梯度几乎为 0（梯度消失）！除以 √d_k 能把方差精准拉回 1。'
      ],
      highlightBox: {
        title: '缩放点积注意力四步口诀',
        points: [
          '① 算内积 (MatMul)：S = Q · Kᵀ（衡量任意两词的相关性）',
          '② 除缩放 (Scale)：S_scaled = S / √d_k（把方差拉回 1，保护 Softmax 梯度）',
          '③ 加掩码 (Mask，仅解码器)：遮挡未来词为 -∞，防止作弊偷看答案',
          '④ 归一化乘值 (Softmax × V)：用概率权重聚合所有词的 Value 向量'
        ]
      },
      takeawayCallout: '除以 √d_k 看似只是一个不起眼的常数，却是高维点积注意力能够稳定训练的救命稻草！'
    },
    {
      badge: '第三步：多头注意力机制',
      title: 'Multi-Head Attention：八位专家从不同角度审视同一句话',
      subtitle: '8 Parallel Attention Heads in 64-d Subspaces',
      contentParagraphs: [
        '如果整层只算一次 512 维的注意力（单头注意力），每个词的注意力权重会被“平均化”，难以同时兼顾语法、指代和修饰关系。',
        '作者提出「多头注意力（Multi-Head Attention）」：把 512 维拆成 h=8 个独立的注意力头，每个头只用 64 维（512 / 8 = 64）。',
        '正如论文可视化展示的那样：在处理“The animal didn\'t cross the street because it was too tired”时，第 1 个注意力头专门锁定代词 "it" 指代的是 "The animal"，而第 2 个注意力头则专门关注它的状态是 "tired"！最后把 8 个头的结果拼接起来过一次线性投影 W^O 即可。'
      ],
      takeawayCallout: '8 个 64 维注意力头的总计算量与 1 个 512 维单头几乎完全相同，却白赚了 8 倍的多视角表征能力！'
    },
    {
      badge: '第四步：Encoder-Decoder 与位置编码',
      title: '残差连接、LayerNorm 与正余弦时钟位置编码',
      subtitle: 'Positional Encoding & 6-Layer Stack Architecture',
      contentParagraphs: [
        '既然没有了 RNN 的先后顺序，“猫追狗”和“狗追猫”在纯自注意力眼里集合元素一模一样！怎么让模型知道词的先后位置？',
        '作者在底部词嵌入（Embedding）上直接相加了一组「正余弦位置编码（Sinusoidal Positional Encoding）」。不同维度对应不同频率的波长（从 2π 到 10000·2π），就像机械表的秒针、分针、时针组合一样，为每个位置打上独一无二且能通过线性变换推导相对距离的坐标印记。',
        '整个 Transformer 由 6 层编码器（Self-Attention + FFN）和 6 层解码器（Masked Self-Attention + Encoder-Decoder Cross-Attention + FFN）堆叠而成，每个子层都配有残差连接（Add）与层归一化（LayerNorm）。'
      ],
      takeawayCallout: 'Encoder 负责“通读全句双向理解”，Decoder 负责“掩码自回归 + 跨注意力生成”，这套积木直接衍生出了后来的 BERT（纯 Encoder）与 GPT（纯 Decoder）！'
    }
  ],
  beginnerQuiz: [
    {
      id: 1,
      question: '在缩放点积注意力公式 Attention(Q,K,V) = softmax(QKᵀ / √d_k)V 中，为什么要除以 √d_k？',
      options: [
        '为了减少矩阵乘法的浮点运算次数（FLOPs）',
        '因为当维度 d_k 较大时点积结果绝对值会很大，将 Softmax 推入梯度极小的饱和区，除以 √d_k 可使方差恢复为 1',
        '为了把向量的模长强制归一化为单位向量',
        '为了替代 LayerNorm 层归一化的功能'
      ],
      correctIndex: 1,
      explanation:
        '正确！假设 q 和 k 的分量是均值为 0、方差为 1 的独立随机变量，则它们的点积 q·k 的均值为 0，但方差会膨胀为 d_k。除以 √d_k 可以将点积标准差重新缩放回 1，避免 Softmax 饱和梯度消失。'
    },
    {
      id: 2,
      question: '相比于循环神经网络（RNN），自注意力层（Self-Attention）在捕捉序列中相距为 n 的两个词之间的依赖关系时，最大路径长度是多少？',
      options: [
        'O(n)，需要一步步按顺序传递',
        'O(log n)，需要按二叉树层级传递',
        'O(1)，任意两个位置在单层内直接计算内积交互，路径长度为常数 1',
        'O(n²)，路径长度随序列长度平方增长'
      ],
      correctIndex: 2,
      explanation:
        '完全正确！注意区分“计算复杂度 O(n²·d)”与“最大信号传递路径长度 O(1)”：自注意力的每个词在单层内直接与所有词做点积，因此任意两词间的交互路径长度仅为 O(1)，这也是它长距离建模能力远超 RNN O(n) 的核心原因。'
    },
    {
      id: 3,
      question: '在 Transformer 解码器（Decoder）的第一层“掩码多头自注意力（Masked Multi-Head Attention）”中，掩码（Mask）的作用是什么？',
      options: [
        '随机遮挡 15% 的词以进行完形填空训练',
        '把未来位置（j > i）的注意力得分设为 -∞（Softmax 后为 0），防止模型在预测第 i 个词时偷看后面的标准答案，保持自回归特性',
        '屏蔽掉不重要的停用词（如 the, a, is）',
        '减少一半的显存占用'
      ],
      correctIndex: 1,
      explanation:
        '正确！在训练阶段解码器虽然一次性并行输入完整目标句，但为了保证预测第 i 个词时只能依赖小于 i 的已知输出，必须用上三角负无穷掩码（-∞）阻断向左以外的未来信息流动。'
    }
  ],
  chapters: [
    {
      id: 'sec-1',
      chapterNumber: '1',
      titleZh: '引言与背景：序列建模的并行化危机',
      titleEn: 'Introduction & Background: The Sequential Bottleneck',
      summaryZh:
        '剖析 RNN/LSTM/GRU 顺序计算机制在长序列并行化与远距离依赖上的根本矛盾，阐明用纯自注意力替代循环与卷积的动机。',
      beginnerTakeaways: [
        {
          question: '既然 ByteNet 和 ConvS2S 已经用 CNN 实现了并行化，为什么还需要 Transformer？',
          answerZh:
            '虽然 CNN（如 ConvS2S）可以并行计算，但卷积核的感受野有限。两个相距很远的词要想产生联系，CNN 必须堆叠 O(n/k) 或 O(log_k(n)) 层才能把信号传过去；而 Transformer 的自注意力只需 1 层（O(1)）就能直接联通任意两个词！',
          analogyZh:
            'CNN 就像层层上报的科层制公司，两个基层员工沟通要跨好几级经理；Self-Attention 则是扁平化全员群聊，任何人直接 @ 任何人只需 1 步。'
        }
      ],
      contentZh: [
        '循环神经网络（RNN），特别是长短期记忆网络（LSTM）和门控循环单元（GRU），已被确立为序列建模和转导问题（如语言建模和机器翻译）的主流方法。此后大量研究致力于推动循环语言模型与编码器-解码器架构的边界。',
        '然而，循环模型通常沿着输入和输出序列的符号位置进行因子分解计算。这种将计算步骤与时间步对齐的机制，使得它们在生成位置 t 的隐藏状态 h_t 时，必须依赖前一位置的状态 h_{t-1} 和当前输入。这种**固有的顺序特性（Inherently Sequential Nature）**彻底阻碍了训练样本内部的并行化计算；当序列长度较大时，由于显存限制无法跨样本大批次训练，这一瓶颈尤为致命。',
        '注意力机制已成为各种任务中极具说服力的序列建模组件，它允许对依赖关系进行建模而无需考虑它们在输入或输出序列中的距离。然而，在除极少数情况外的所有以往研究中，这种注意力机制都是与循环网络（RNN）搭配使用的。在本文中，我们提出了 **Transformer**——一种完全摒弃循环、完全依赖注意力机制来绘制输入和输出之间全局依赖关系的模型架构，实现了前所未有的并行度并在短短数天训练内刷新了翻译质量记录。'
      ],
      contentEn: [
        'Recurrent neural networks, long short-term memory and gated recurrent neural networks in particular, have been firmly established as state of the art approaches in sequence modeling and transduction problems such as language modeling and machine translation.',
        'Recurrent models typically factor computation along the symbol positions of the input and output sequences. Aligning the positions to steps in computation time, they generate a sequence of hidden states h_t, as a function of the previous hidden state h_{t-1} and the input for position t. This inherently sequential nature precludes parallelization within training examples, which becomes critical at longer sequence lengths, as memory constraints limit batching across examples.',
        'In this work we propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies between input and output. The Transformer allows for significantly more parallelization and can reach a new state of the art in translation quality after being trained for as little as twelve hours on eight P100 GPUs.'
      ],
      keyInsights: [
        'RNN 的顺序计算 h_t = f(h_{t-1}, x_t) 是阻碍 GPU 大规模并行训练的根本原因。',
        'CNN 架构（ByteNet/ConvS2S）虽能并行，但远距离位置交互所需层数随距离增长。',
        'Transformer 首次证明：无需任何 RNN 或 CNN，仅靠自注意力即可完成高质量序列转导。'
      ]
    },
    {
      id: 'sec-2',
      chapterNumber: '2',
      titleZh: '模型整体架构：编码器-解码器堆叠与残差归一化',
      titleEn: 'Model Architecture: Encoder and Decoder Stacks',
      summaryZh:
        '详解 Transformer 的 6 层编码器（Encoder）与 6 层解码器（Decoder）对称堆叠结构，以及残差连接与 LayerNorm 的子层封装规范。',
      beginnerTakeaways: [
        {
          question: '编码器（Encoder）和解码器（Decoder）每一层分别包含几个子层（Sub-layers）？',
          answerZh:
            '编码器每层包含 2 个子层：① 多头自注意力层、② 逐位置前馈网络（FFN）。解码器每层包含 3 个子层：除了编码器的那两层外，中间还插入了一层“编码器-解码器交叉注意力层（Encoder-Decoder Attention）”，且底部的自注意力加了掩码（Masked）。',
          analogyZh:
            '编码器是“阅读理解专家”（反复精读原文 6 遍），解码器是“动笔翻译官”（一边看自己刚写出的上半句，一边抬头查阅编码器整理好的原文笔记）。'
        }
      ],
      contentZh: [
        '【编码器堆叠（Encoder Stack）】编码器由 $N = 6$ 个完全相同的层堆叠而成。每一层包含两个子层（Sub-layers）。第一个子层是多头自注意力机制（Multi-Head Self-Attention），第二个子层是一个简单的、逐位置全连接前馈神经网络（Position-wise Feed-Forward Network）。我们在每个子层周围采用残差连接（Residual Connection），随后进行层归一化（Layer Normalization）。即每个子层的输出为 $\\text{LayerNorm}(x + \\text{SubLayer}(x))$。为了便于残差连接，模型中的所有子层以及嵌入层均产生维度为 $d_{\\text{model}} = 512$ 的输出。',
        '【解码器堆叠（Decoder Stack）】解码器同样由 $N = 6$ 个完全相同的层堆叠而成。除了每个编码器层中的两个子层之外，解码器还插入了第三个子层，该子层对编码器堆栈的输出执行多头注意力（即交叉注意力 Cross-Attention，其中 Query 来自解码器上一层，Key 和 Value 来自编码器的最终输出）。与编码器类似，我们在每个子层周围使用残差连接并紧跟层归一化。',
        '此外，我们修改了解码器堆栈中的自注意力子层，通过掩码（Masking）结合输出嵌入偏移一个位置的设计，防止当前位置关注到后续未来位置，从而严格保证第 $i$ 个位置的预测仅依赖于小于 $i$ 的已知输出。'
      ],
      contentEn: [
        'Encoder: The encoder is composed of a stack of N = 6 identical layers. Each layer has two sub-layers. The first is a multi-head self-attention mechanism, and the second is a simple, position-wise fully connected feed-forward network. We employ a residual connection around each of the two sub-layers, followed by layer normalization. That is, the output of each sub-layer is LayerNorm(x + Sublayer(x)). To facilitate these residual connections, all sub-layers in the model, as well as the embedding layers, produce outputs of dimension d_model = 512.',
        'Decoder: The decoder is also composed of a stack of N = 6 identical layers. In addition to the two sub-layers in each encoder layer, the decoder inserts a third sub-layer, which performs multi-head attention over the output of the encoder stack. We also modify the self-attention sub-layer in the decoder stack to prevent positions from attending to subsequent positions.'
      ],
      formulas: [
        {
          latex: '\\text{SubLayerOutput}(x) = \\text{LayerNorm}\\left(x + \\text{SubLayer}(x)\\right)',
          explanationZh: 'Transformer 标准子层残差与层归一化公式（Post-LN 结构），保障 6 层深层网络的梯度畅通。'
        }
      ],
      keyInsights: [
        '全模型统一隐藏层维度 d_model = 512，使残差加法 x + SubLayer(x) 无需额外维度投影。',
        '解码器包含三种注意力机制的协同：掩码自注意力（防偷看未来）+ 编码器-解码器交叉注意力（对齐源语言）+ FFN。'
      ]
    },
    {
      id: 'sec-3',
      chapterNumber: '3',
      titleZh: '核心灵魂：缩放点积注意力与多头注意力机制',
      titleEn: 'Scaled Dot-Product Attention & Multi-Head Attention',
      summaryZh:
        '严格推导 Q/K/V 缩放点积注意力公式，解释 √d_k 缩放因子的数学机理，并剖析 8 头并行子空间投影与应用中三种不同的注意力连接方式。',
      beginnerTakeaways: [
        {
          question: '为什么不用加性注意力（Additive Attention，如 Bahdanau Attention），而要用点积注意力（Dot-Product Attention）？',
          answerZh:
            '加性注意力使用带单隐层的前馈网络计算兼容性，虽然理论复杂度相近，但点积注意力完全可以转化为高度优化的矩阵乘法（GEMM 算子），在 GPU 上运行速度快得多、显存效率也高得多！只要除以 √d_k 解决大维度下的梯度饱和问题，点积注意力就能全面胜出。',
          analogyZh:
            '加性注意力就像手工逐条核对账单，点积注意力则是直接调用 GPU 流水线矩阵批处理，加上 √d_k 稳压器后既快又准。'
        }
      ],
      contentZh: [
        '【缩放点积注意力（Scaled Dot-Product Attention）】注意力函数可以被描述为将一个查询（Query）和一组键值对（Key-Value pairs）映射到一个输出。输入由维度为 $d_k$ 的查询和键、以及维度为 $d_v$ 的值组成。我们计算查询与所有键的点积，将每个点积除以 $\\sqrt{d_k}$，并应用 Softmax 函数来获得值的权重。在实践中，我们将一组查询打包成一个矩阵 $Q$，键和值也打包成矩阵 $K$ 和 $V$ 进行并行矩阵运算。',
        '为什么要除以 $\\sqrt{d_k}$？最常用的两种注意力函数是加性注意力（Additive Attention）和点积注意力。对于较小的 $d_k$，两种机制表现相似；但当 $d_k$ 较大时，不加缩放的点积注意力表现明显劣于加性注意力。我们分析怀疑：当 $d_k$ 较大时，点积在数值上增长得很大（方差为 $d_k$），从而将 Softmax 函数推入梯度极小的饱和区域！为了抵消这种影响，我们将点积缩放 $\\frac{1}{\\sqrt{d_k}}$ 倍。',
        '【多头注意力（Multi-Head Attention）】相比于使用 $d_{\\text{model}}$ 维度的查询、键和值执行单个注意力函数，我们发现将查询、键和值分别用不同的、可学习的线性投影映射到 $d_k$、$d_k$ 和 $d_v$ 维度 $h$ 次是有益的。在这 $h$ 个投影版本上并行执行注意力函数，产生 $d_v$ 维的输出值，随后将它们拼接（Concatenate）并再次投影。在本文中，我们采用 $h = 8$ 个并行注意力头，每个头的维度设为 $d_k = d_v = d_{\\text{model}} / h = 64$。由于每个头的维度降低，总计算成本与全维度单头注意力十分接近。'
      ],
      contentEn: [
        'Scaled Dot-Product Attention: The input consists of queries and keys of dimension d_k, and values of dimension d_v. We compute the dot products of the query with all keys, divide each by sqrt(d_k), and apply a softmax function to obtain the weights on the values.',
        'We suspect that for large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions where it has extremely small gradients. To counteract this effect, we scale the dot products by 1 / sqrt(d_k).',
        'Multi-Head Attention allows the model to jointly attend to information from different representation subspaces at different positions. With a single attention head, averaging inhibits this. In this work we employ h = 8 parallel attention layers, or heads. For each of these we use d_k = d_v = d_model / h = 64.'
      ],
      formulas: [
        {
          latex: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V',
          explanationZh: '缩放点积注意力核心方程：通过除以 √d_k 抑制大维度内积方差膨胀，避免 Softmax 饱和梯度消失。'
        },
        {
          latex: '\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\dots, \\text{head}_h)W^O, \\quad \\text{head}_i = \\text{Attention}(QW_i^Q, KW_i^K, VW_i^V)',
          explanationZh: '多头注意力方程：h=8 个 64 维子空间并行计算注意力后拼接，再经 W^O (512×512) 线性融合。'
        }
      ],
      keyInsights: [
        '当 q, k 分量独立同分布（均值0、方差1）时，q·k 的均值为 0、方差为 d_k；除以 √d_k 使点积方差恒等于 1。',
        '多头注意力把 d_model=512 拆分为 8×64，在不增加总 FLOPs 的前提下解决了单头注意力权重平均化的问题。',
        'Transformer 内部在三处应用了多头注意力：编码器自注意力、解码器掩码自注意力、编码器-解码器交叉注意力。'
      ]
    },
    {
      id: 'sec-4',
      chapterNumber: '4',
      titleZh: '逐位置前馈网络与正余弦位置编码',
      titleEn: 'Position-wise Feed-Forward Networks & Positional Encoding',
      summaryZh:
        '解析两层非线性变换的 FFN（512→2048→512）、词嵌入 √d_model 缩放共享权重，以及正余弦位置编码的波长几何性质。',
      beginnerTakeaways: [
        {
          question: '有了自注意力层之后，为什么每一层还要加一个逐位置前馈网络（FFN）？',
          answerZh:
            '因为自注意力本质上只是对 Value 向量做“线性加权求和”，如果只有自注意力层，多层堆叠依然缺乏非线性变换能力！FFN 对每个位置独立施加两层线性变换加 ReLU 非线性激活（先放大 4 倍到 2048 维，再压缩回 512 维），承担了特征提取与记忆存储的重任。',
          analogyZh:
            '自注意力负责“开会收集大家的意见”，而 FFN 则是每个人回到自己座位上“独立深度思考消化刚刚听到的信息”。'
        }
      ],
      contentZh: [
        '【逐位置前馈网络（Position-wise Feed-Forward Networks）】除了注意力子层之外，我们的编码器和解码器中的每一层都包含一个全连接前馈网络，该网络分别且相同地应用于每个位置（相当于两个核大小为 1 的一维卷积）。这包括两个线性变换，中间有一个 ReLU 激活函数。输入和输出的维度为 $d_{\\text{model}} = 512$，而内部隐藏层的维度则扩大了 4 倍，达到 $d_{ff} = 2048$。',
        '【嵌入与 Softmax 权重共享】与其他序列转导模型类似，我们使用学习到的嵌入将输入词元和输出词元转换为维度为 $d_{\\text{model}}$ 的向量。在我们的模型中，我们在两个嵌入层和预 Softmax 线性变换之间共享相同的权重矩阵，并且在嵌入层中将这些权重乘以 $\\sqrt{d_{\\text{model}}}$。',
        '【正余弦位置编码（Positional Encoding）】由于我们的模型不包含任何循环和卷积，为了让模型利用序列的顺序信息，我们必须注入关于词元在序列中相对或绝对位置的信息。为此，我们将“位置编码”添加到编码器和解码器堆栈底部的输入嵌入中。位置编码具有与嵌入相同的维度 $d_{\\text{model}}$，因此两者可以直接相加。在本文中，我们使用不同频率的正弦和余弦函数：波长形成从 $2\\pi$ 到 $10000 \\cdot 2\\pi$ 的几何级数。我们选择这个函数是因为我们假设它允许模型轻松学习按相对位置进行关注，因为对于任何固定的偏移量 $k$，$PE_{pos+k}$ 都可以表示为 $PE_{pos}$ 的线性函数！此外，我们还对比了可学习的位置嵌入（Learned Positional Embeddings），发现两者产生了几乎完全相同的结果，但正余弦版本允许模型外推到比训练期间遇到的序列更长的序列。'
      ],
      contentEn: [
        'In addition to attention sub-layers, each of the layers in our encoder and decoder contains a fully connected feed-forward network, which is applied to each position separately and identically. This consists of two linear transformations with a ReLU activation in between.',
        'Since our model contains no recurrence and no convolution, in order for the model to make use of the order of the sequence, we must inject some information about the relative or absolute position of the tokens in the sequence. To this end, we add "positional encodings" to the input embeddings at the bottoms of the encoder and decoder stacks.',
        'We chose the sinusoidal function because we hypothesized it would allow the model to easily learn to attend by relative positions, since for any fixed offset k, PE_{pos+k} can be represented as a linear function of PE_{pos}.'
      ],
      formulas: [
        {
          latex: '\\text{FFN}(x) = \\max(0, xW_1 + b_1)W_2 + b_2',
          explanationZh: '逐位置前馈网络公式：先从 d_model=512 升维至 d_ff=2048 并经 ReLU 激活，再降维回 512。'
        },
        {
          latex: 'PE_{(pos, 2i)} = \\sin\\left(\\frac{pos}{10000^{2i/d_{\\text{model}}}}\\right), \\quad PE_{(pos, 2i+1)} = \\cos\\left(\\frac{pos}{10000^{2i/d_{\\text{model}}}}\\right)',
          explanationZh: '正余弦位置编码公式：偶数维度用正弦，奇数维度用余弦，波长呈几何级数分布。'
        }
      ],
      keyInsights: [
        'FFN 层参数量巨大（512×2048×2 ≈ 210万/层），后来研究证明 Transformer 的大量事实知识正是存储在 FFN 中。',
        '三角恒等式 sin(α+β) = sinα cosβ + cosα sinβ 保证了任意偏移 PE_{pos+k} 都是 PE_{pos} 的正交旋转线性变换。'
      ]
    },
    {
      id: 'sec-5',
      chapterNumber: '5',
      titleZh: '为什么选择自注意力？三大理论维度深度论证',
      titleEn: 'Why Self-Attention: Complexity, Parallelism & Path Length',
      summaryZh:
        '从每层计算复杂度、可并行化程度（最少顺序操作数）以及长程依赖信号路径长度三个维度，严格对比 Self-Attention、RNN、CNN 与受限自注意力。',
      beginnerTakeaways: [
        {
          question: '自注意力的复杂度是 O(n²·d)，而 RNN 是 O(n·d²)，为什么说在大多数 NLP 句子上自注意力反而更快？',
          answerZh:
            '因为隐藏层维度 d 通常是 512 或 1024，而常规自然语言句子的词数 n 通常只有几十个（n < d）！当序列长度 n 小于表征维度 d 时，O(n²·d) 的总计算量实际上比 O(n·d²) 更小，而且自注意力还能 100% 并行执行！',
          analogyZh:
            '当参会人数 n=30 人，而每人汇报材料厚达 d=512 页时，大家同时互发摘要（n²·d）比挨个排队背诵整本材料（n·d²）快得多！'
        }
      ],
      contentZh: [
        '我们将自注意力层与常用的循环层（Recurrent）和卷积层（Convolutional）在三个关键维度上进行对比：一是每层的总计算复杂度；二是可以并行化的计算量（以所需的最少顺序操作数衡量）；三是网络中长距离依赖关系之间的路径长度。',
        '影响学习长距离依赖能力的一个关键因素是前向和反向信号在网络中必须穿越的路径长度。输入和输出序列中任意位置组合之间的这些路径越短，学习长距离依赖关系就越容易！如论文 Table 1 所示，自注意力层用常数级 $O(1)$ 次顺序操作连接所有位置，最大路径长度同样为 $O(1)$；而循环层则需要 $O(n)$ 次顺序操作和 $O(n)$ 的最大路径长度。',
        '在计算复杂度方面，当序列长度 $n$ 小于表示维度 $d$ 时，自注意力层比循环层更快——这对于当今机器翻译中最先进的模型所使用的句子表示（如 word-piece 和 byte-pair 表示）来说绝大多数情况都成立。为了提高涉及极长序列任务的计算性能，可以将自注意力限制在仅考虑围绕相应输出位置大小为 $r$ 的邻域（Restricted Self-Attention），这会将最大路径长度增加到 $O(n/r)$。此外，自注意力还带来了更强的模型可解释性（Interpretability），各个注意力头清晰地学会了执行不同的语法与语义追踪任务。'
      ],
      contentEn: [
        'We motivate our use of self-attention by considering three desiderata: One is the total computational complexity per layer. Another is the amount of computation that can be parallelized, as measured by the minimum number of sequential operations required. The third is the path length between long-range dependencies in the network.',
        'A key factor affecting the ability to learn such dependencies is the length of the paths forward and backward signals have to traverse in the network. The shorter these paths between any combination of positions in the input and output sequences, the easier it is to learn long-range dependencies.',
        'As noted in Table 1, a self-attention layer connects all positions with a constant number of sequentially executed operations, whereas a recurrent layer requires O(n) sequential operations. In terms of computational complexity, self-attention layers are faster than recurrent layers when the sequence length n is smaller than the representation dimensionality d.'
      ],
      keyInsights: [
        '当序列长度 n < 维度 d（例如 n=50, d=512）时，Self-Attention 的每层复杂度 O(n²·d) 低于 RNN 的 O(n·d²)。',
        '信号传递路径越短，长距离依赖越容易学习：Self-Attention 路径长度为 O(1)，彻底战胜 RNN 的 O(n) 与 CNN 的 O(log_k(n))。'
      ]
    },
    {
      id: 'sec-6',
      chapterNumber: '6',
      titleZh: '训练机制、Noam 学习率预热与实验结果全解',
      titleEn: 'Training Regime, Warmup Schedule & Experimental Results',
      summaryZh:
        '详解 Adam 优化器配合著名的 Noam 逆平方根学习率预热公式、标签平滑正则化，以及在 WMT 2014 英德/英法翻译与句法分析上的统治级表现。',
      beginnerTakeaways: [
        {
          question: '为什么训练 Transformer 必须先进行“学习率预热（Warmup）”？',
          answerZh:
            '在训练刚开始时，模型参数全是随机初始化的，LayerNorm 和自注意力的梯度方差极大且不稳定。如果一开始就用很大的学习率，模型梯度会瞬间爆炸发散！因此前 warmup_steps=4000 步让学习率从 0 线性缓慢爬升，等参数分布稳定后再按步数的逆平方根逐步衰减。',
          analogyZh:
            '就像冬天发动高性能跑车，必须先怠速热车几分钟（Warmup）再踩油门加速，否则冷启动直接地板油会立刻拉缸熄火。'
        }
      ],
      contentZh: [
        '【硬件与训练时长】我们在配备 8 块 NVIDIA P100 GPU 的单机上训练模型。对于使用论文描述超参数的基础模型（Transformer Base，6500万参数），每个训练步耗时约 0.4 秒，共训练 10 万步（仅需 **12 小时**）。对于大型模型（Transformer Big，2.13亿参数，$d_{\\text{model}}=1024, h=16$），每步耗时 1.0 秒，训练 30 万步（耗时 **3.5 天**）。',
        '【优化器与 Noam 学习率调度器】我们使用 Adam 优化器，其中 $\\beta_1 = 0.9, \\beta_2 = 0.98, \\epsilon = 10^{-9}$。在训练过程中，我们根据以下公式动态调整学习率：在前 $\\text{warmup\\_steps} = 4000$ 个训练步中线性增加学习率，并且在此之后将其按步数的逆平方根（Inverse Square Root）成比例地减小。正则化方面，我们采用了残差 Dropout（$P_{\\text{drop}} = 0.1$）以及 $\\epsilon_{ls} = 0.1$ 的标签平滑（Label Smoothing）——虽然标签平滑会让模型降低盲目自信从而略微损害困惑度（Perplexity），但它显著提升了准确率和 BLEU 分数。',
        '【实验结果与消融分析】在 WMT 2014 英译德任务上，Transformer (Big) 取得了 **28.4 BLEU** 的优异成绩，比此前所有发表的最佳模型（包括多个模型的 Ensemble 集成）还要高出 2.0 BLEU 以上！在 WMT 2014 英译法任务上，Transformer (Big) 取得了 **41.8 BLEU**，训练算力消耗仅为此前 SOTA 模型的 1/4 不到。消融实验（Table 3）进一步证实：注意力头数过少（$h=1$ 掉 0.9 BLEU）或过多（$h=32$ 因每头维度仅 16 维过小而掉分）都会损害性能，$h=8$ 是最佳甜点。'
      ],
      contentEn: [
        'We trained our models on one machine with 8 NVIDIA P100 GPUs. For our base models, each training step took about 0.4 seconds. We trained the base models for a total of 100,000 steps or 12 hours. For our big models, step time was 1.0 seconds. The big models were trained for 300,000 steps (3.5 days).',
        'We used the Adam optimizer with beta_1 = 0.9, beta_2 = 0.98 and epsilon = 10^{-9}. This corresponds to increasing the learning rate linearly for the first warmup_steps = 4000 training steps, and decreasing it thereafter proportionally to the inverse square root of the step number.',
        'On the WMT 2014 English-to-German translation task, the big transformer model outperforms the best previously reported models (including ensembles) by more than 2.0 BLEU, establishing a new state-of-the-art BLEU score of 28.4.'
      ],
      formulas: [
        {
          latex: 'lrate = d_{\\text{model}}^{-0.5} \\cdot \\min\\left(step\\_num^{-0.5}, \\; step\\_num \\cdot warmup\\_steps^{-1.5}\\right)',
          explanationZh: '著名的 Transformer Noam 学习率调度公式：前 4000 步线性预热升温，4000 步后按步数的 -0.5 次方平滑衰减。'
        }
      ],
      keyInsights: [
        'Transformer Base 仅在 8 张 P100 上训练 12 小时（27.3 BLEU）就击败了此前所有单模型与许多集成模型。',
        '消融实验证明：减小键维度 d_k 会损害模型质量，说明衡量相关性需要足够丰富的子空间表征能力。',
        '这部作品直接开启了自然语言处理、计算机视觉与多模态大模型的黄金十年。'
      ]
    }
  ],
  benchmarks: [
    {
      id: 'wmt14-ende',
      nameZh: 'WMT 2014 英译德翻译质量对比 (BLEU)',
      nameEn: 'WMT 2014 English-to-German Translation (BLEU)',
      metricLabel: 'BLEU 得分',
      unit: ' BLEU',
      higherIsBetter: true,
      summaryConclusion:
        'Transformer (Big) 单模型以 28.4 BLEU 刷新世界纪录，不仅大幅击败 GNMT+RL 和 ConvS2S 单模型，甚至超越了它们的多模型集成（Ensemble），而训练算力仅需 2.3×10¹⁹ FLOPs！',
      items: [
        { modelName: 'ByteNet (Kalchbrenner et al.)', value: 23.75, maxScale: 32 },
        { modelName: 'GNMT + RL (Google 神经机器翻译)', value: 24.6, maxScale: 32 },
        { modelName: 'ConvS2S (Facebook 卷积序列模型)', value: 25.16, maxScale: 32 },
        { modelName: 'ConvS2S Ensemble (多模型集成)', value: 26.36, maxScale: 32 },
        {
          modelName: 'Transformer (Base Model, 12小时训练)',
          value: 27.3,
          maxScale: 32,
          isOurModel: true,
          badge: '超越所有历史集成'
        },
        {
          modelName: '🌟 Transformer (Big Model, 本文旗舰)',
          value: 28.4,
          maxScale: 32,
          isOurModel: true,
          badge: 'SOTA +2.04 BLEU'
        }
      ]
    },
    {
      id: 'wmt14-enfr',
      nameZh: 'WMT 2014 英译法翻译质量对比 (BLEU)',
      nameEn: 'WMT 2014 English-to-French Translation (BLEU)',
      metricLabel: 'BLEU 得分',
      unit: ' BLEU',
      higherIsBetter: true,
      summaryConclusion:
        '在规模更大的英译法数据集（3600万句对）上，Transformer (Big) 仅训练 3.5 天即斩获 41.8 BLEU，训练成本仅为 ConvS2S 和 GNMT 的一小部分。',
      items: [
        { modelName: 'GNMT + RL (单模型)', value: 39.92, maxScale: 45 },
        { modelName: 'Deep-Att + PosUnk (Zhou et al.)', value: 39.2, maxScale: 45 },
        { modelName: 'ConvS2S (单模型)', value: 40.46, maxScale: 45 },
        { modelName: 'Transformer (Base Model)', value: 38.1, maxScale: 45, isOurModel: true },
        {
          modelName: '🌟 Transformer (Big Model, 本文旗舰)',
          value: 41.8,
          maxScale: 45,
          isOurModel: true,
          badge: '单模型新纪录'
        }
      ]
    }
  ],
  comparisonTable: [
    {
      paradigmNameZh: '循环层 (Recurrent / RNN / LSTM)',
      paradigmNameEn: 'Recurrent Layer',
      mechanismZh: '沿时间步顺序递归更新隐藏状态 h_t',
      interactionMode: '每层复杂度 O(n · d²)',
      indexType: '最少顺序操作 O(n) (不可并行)',
      queryLatency: '最大依赖路径 O(n)',
      accuracyRank: '长序列慢且易遗忘'
    },
    {
      paradigmNameZh: '卷积层 (Convolutional / CNN, 核宽 k)',
      paradigmNameEn: 'Convolutional Layer',
      mechanismZh: '局部滑动窗口核宽 k 卷积特征提取',
      interactionMode: '每层复杂度 O(k · n · d²)',
      indexType: '最少顺序操作 O(1) (可并行)',
      queryLatency: '最大依赖路径 O(log_k(n))',
      accuracyRank: '需堆叠多层感知全局'
    },
    {
      paradigmNameZh: '受限自注意力 (Restricted Self-Attention)',
      paradigmNameEn: 'Restricted Self-Attention (Neighborhood r)',
      mechanismZh: '仅对每个位置周围窗口 r 内计算自注意力',
      interactionMode: '每层复杂度 O(r · n · d)',
      indexType: '最少顺序操作 O(1) (全并行)',
      queryLatency: '最大依赖路径 O(n / r)',
      accuracyRank: '适合超长文本折中'
    },
    {
      paradigmNameZh: '🌟 全局自注意力 (Self-Attention, 本文核心)',
      paradigmNameEn: 'Transformer Self-Attention',
      mechanismZh: '全序列 QKᵀ/√d_k 矩阵并行交互与多头子空间融合',
      interactionMode: '每层复杂度 O(n² · d)',
      indexType: '最少顺序操作 O(1) (全并行)',
      queryLatency: '最大依赖路径 O(1) (一步直达)',
      accuracyRank: '28.4 BLEU (全场最高)',
      isOurModel: true
    }
  ],
  caseStudies: [
    {
      title: '论文可视化经典案例：长距离指代消解（The animal ... because it was too tired）',
      query: 'The animal didn\'t cross the street because it was too tired.',
      cards: [
        {
          methodName: '传统 RNN / 单头注意力',
          status: '指代混淆 (Attention Averaging)',
          isSuccess: false,
          reason:
            '由于存在 "animal" 和 "street" 两个名词且相隔较远，单头注意力容易将权重分散在邻近词上，难以同时区分 "it...tired"（指动物）与 "it...wide"（指街道）。'
        },
        {
          methodName: 'Transformer 注意力头 #1 (指代追踪)',
          status: '精准锁定 "The animal"',
          isSuccess: true,
          reason:
            '第 5 层编码器的注意力头 #1 在编码代词 "it" 时，将超过 65% 的注意力权重直接投向句首的 "The animal"，完美完成跨距离共指消解！'
        },
        {
          methodName: 'Transformer 注意力头 #2 (语义原因绑定)',
          status: '精准锁定 "tired"',
          isSuccess: true,
          reason:
            '与此同时，另一个独立的 64 维注意力头将 "it" 的注意力聚焦在表语形容词 "tired" 上，双头协同使模型理解“是因为动物太累了”。'
        }
      ]
    }
  ],
  glossaryCategories: ['注意力核心机制', '网络组件与编码', '训练与优化策略'],
  glossaryItems: [
    {
      id: 'scaled-dot-attention',
      termZh: '缩放点积注意力',
      termEn: 'Scaled Dot-Product Attention',
      category: '注意力核心机制',
      summary: '通过计算查询与键的内积并除以 √d_k，经 Softmax 归一化后对值向量加权求和的注意力机制。',
      analogy:
        '就像相亲匹配：每个人拿着择偶标准（Query）去和全场嘉宾的名片（Key）打分，为了防止分数差距过大导致只看一个人，先把分数除以 √d_k 缓和一下，再按比例吸收各位嘉宾的真实长处（Value）。',
      technicalDetail:
        '当向量维度 d_k 较大时，点积 q·k 的方差随 d_k 线性增长，导致数值过大落入 Softmax 函数的平坦饱和区（梯度趋近于 0）。除以 √d_k 将点积方差严格归一化为 1。',
      paperApplication: '构成 Transformer 所有编码器与解码器注意力层的底层核心算子。',
      formula: '\\text{Attention}(Q,K,V) = \\text{softmax}\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V'
    },
    {
      id: 'multi-head-attention',
      termZh: '多头注意力机制',
      termEn: 'Multi-Head Attention (MHA)',
      category: '注意力核心机制',
      summary: '将 Q、K、V 线性投影到 h 个不同的低维子空间并行计算注意力，最后拼接并线性输出。',
      analogy:
        '就像请 8 位不同领域的评审专家（语法专家、指代专家、情感专家等）同时审阅同一份稿件，每人写一份 64 页的小报告，最后汇总成一份 512 页的全方位报告。',
      technicalDetail:
        '在 Transformer Base 中，d_model=512，头数 h=8，每个头维度 d_k=d_v=64。总计算量与单个 512 维注意力头相当，但避免了单头注意力因平均化导致的表征退化。',
      paperApplication: '使模型能够同时关注不同位置、不同语义子空间的特征。',
      formula: '\\text{MultiHead}(Q,K,V) = \\text{Concat}(\\text{head}_1,\\dots,\\text{head}_h)W^O'
    },
    {
      id: 'self-attention',
      termZh: '自注意力机制',
      termEn: 'Self-Attention (Intra-Attention)',
      category: '注意力核心机制',
      summary: 'Query、Key 和 Value 均来自同一个输入序列的注意力机制，用于捕捉序列内部各词元间的依赖关系。',
      analogy: '一句话里的所有单词围坐在一张圆桌旁互相交流，每个单词都根据上下文重新定义自己的准确含义。',
      technicalDetail:
        '在编码器中，Q=K=V 均来自上一层编码器的输出，任意两个位置间的交互路径长度为 O(1)。',
      paperApplication: '完全取代了传统 Seq2Seq 中的 RNN 循环层与 CNN 卷积层。'
    },
    {
      id: 'masked-attention',
      termZh: '掩码自注意力',
      termEn: 'Masked Self-Attention',
      category: '注意力核心机制',
      summary: '在解码器自注意力中屏蔽未来位置（设为 -∞），确保预测位置 i 时只能看到位置 i 之前的已知词元。',
      analogy: '就像做闭卷默写考试，用一张卡片遮住后面的答案，写第 3 个字时绝对不准偷看第 4 个字。',
      technicalDetail:
        '在 QKᵀ/√d_k 之后、Softmax 之前，加上一个上三角全为 -∞、下三角及对角线为 0 的掩码矩阵 M，使得未来位置经 Softmax 后权重严格为 0。',
      paperApplication: '使得解码器在训练阶段可以一次性并行输入整句目标文本，同时保持自回归因果性。'
    },
    {
      id: 'positional-encoding',
      termZh: '正余弦位置编码',
      termEn: 'Sinusoidal Positional Encoding',
      category: '网络组件与编码',
      summary: '利用不同频率的正弦和余弦函数生成位置向量并加到词嵌入上，为无循环的 Transformer 提供词序感知。',
      analogy: '给每个座位上的单词佩戴一块多指针手表（秒针、分针、时针分别对应不同波长的正余弦波），看一眼表盘就知道它坐在第几个位置。',
      technicalDetail:
        '波长从 2π 到 10000·2π 呈几何级数变化。由于 sin(pos+k) 和 cos(pos+k) 可表示为 sin(pos) 和 cos(pos) 的线性组合，模型极易学习相对距离偏移 k。',
      paperApplication: '在编码器和解码器最底层的输入 Embedding 上直接按元素相加。',
      formula: 'PE_{(pos,2i)} = \\sin(pos / 10000^{2i/d_{\\text{model}}})'
    },
    {
      id: 'ffn',
      termZh: '逐位置前馈网络',
      termEn: 'Position-wise Feed-Forward Network (FFN)',
      category: '网络组件与编码',
      summary: '紧跟在注意力层之后、对序列中每个位置独立施加相同两层线性变换与 ReLU 激活的子网络。',
      analogy: '开完圆桌会议（自注意力）后，每个单词回到自己的独立办公室，把收集到的信息升维展开深度加工，再整理成标准格式。',
      technicalDetail:
        '包含两个线性层：第一层从 d_model=512 扩展 4 倍到 d_ff=2048，经过 ReLU 后由第二层压缩回 512 维。',
      paperApplication: '为 Transformer 提供非线性变换能力与庞大的参数记忆容量。',
      formula: '\\text{FFN}(x) = \\max(0, xW_1 + b_1)W_2 + b_2'
    },
    {
      id: 'noam-warmup',
      termZh: 'Noam 学习率预热调度',
      termEn: 'Noam Learning Rate Warmup Schedule',
      category: '训练与优化策略',
      summary: '训练初期线性增大、达到 warmup_steps 后按步数逆平方根衰减的自适应学习率策略。',
      analogy: '冬天开车先低速热车 4000 步，等引擎温度正常后再全速前进，随后平稳减速巡航。',
      technicalDetail:
        '前 4000 步与 step_num 成正比线性上升，4000 步后按 step_num^{-0.5} 衰减，有效防止 Post-LN Transformer 在训练初期梯度发散。',
      paperApplication: '保障 Transformer 在 8 块 GPU 上稳定快速收敛的核心训练技巧。'
    }
  ]
};
