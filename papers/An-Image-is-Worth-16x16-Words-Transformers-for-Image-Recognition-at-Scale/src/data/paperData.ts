import { UniversalPaperData } from '../../../../src/shared/types/universalPaper.js';

export const VIT_2020_DATA: UniversalPaperData = {
  id: 'vit-2020',
  folderName: 'An-Image-is-Worth-16x16-Words-Transformers-for-Image-Recognition-at-Scale',
  systemTitleZh: 'ViT 视觉 Transformer 论文精读与图像块序列化实验系统',
  venueBadge: 'ICLR 2021 (视觉大模型奠基)',
  arxivId: 'arXiv:2010.11929',
  absUrl: 'https://arxiv.org/abs/2010.11929',
  pdfUrl: 'https://arxiv.org/pdf/2010.11929',
  titleZh: '一张图抵得上 16x16 的词：大规模图像识别中的视觉 Transformer (ViT)',
  titleEn: 'An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale',
  publishDate: '2020年10月 / ICLR 2021',
  authors: [
    'Alexey Dosovitskiy',
    'Lucas Beyer',
    'Alexander Kolesnikov',
    'Dirk Weissenborn',
    'Xiaohua Zhai (翟晓华)',
    'Thomas Unterthiner',
    'Mostafa Dehghani',
    'Matthias Minderer',
    'Georg Heigold',
    'Sylvain Gelly',
    'Jakob Uszkoreit',
    'Neil Houlsby'
  ],
  affiliations: ['Google Research, Brain Team (谷歌大脑苏黎世/柏林团队)'],
  simulatorTabLabel: 'ViT 图像切块实验台',
  tldrZh:
    '打破计算机视觉被卷积神经网络（CNN）长期垄断、打通视觉与自然语言大模型大一统架构的里程碑论文！作者证明完全无需依赖卷积层，只需将一张 224×224 的图像切分为 14×14=196 个尺寸为 16×16 的图像块（Patches），将其线性映射为向量序列并直接送入原汁原味的 NLP 标准 Transformer 编码器。论文揭示了著名的「大规模预训练战胜归纳偏置」定律：当在 1400 万至 3 亿张图像上预训练时，ViT-H/14 以 88.55% ImageNet Top-1 准确率全面超越最强 CNN，而所需的预训练算力仅为其 1/4！',
  abstractZh:
    '虽然 Transformer 架构已成为自然语言处理领域的事实标准，但其在计算机视觉中的应用仍然有限。在视觉领域，注意力机制要么与卷积网络结合使用，要么用于替换卷积网络的某些组件，同时保持其整体结构不变。我们证明这种对 CNN 的依赖是没有必要的，直接应用于图像块序列（Sequences of Image Patches）的纯 Transformer 可以在图像分类任务上表现得非常出色。当在大量数据上进行预训练并迁移到多个中型或小型图像识别基准（ImageNet、CIFAR-100、VTAB 等）时，视觉 Transformer（Vision Transformer, ViT）与最先进的卷积网络相比取得了极其优异的结果，同时训练所需的计算资源大大减少。',
  abstractEn:
    'While the Transformer architecture has become the de-facto standard for natural language processing tasks, its applications to computer vision remain limited. In vision, attention is either applied in conjunction with convolutional networks, or used to replace certain components of convolutional networks while keeping their overall structure in place. We show that this reliance on CNNs is not necessary and a pure transformer applied directly to sequences of image patches can perform very well on image classification tasks. When pre-trained on large amounts of data and transferred to multiple mid-sized or small image recognition benchmarks (ImageNet, CIFAR-100, VTAB, etc.), Vision Transformer (ViT) attains excellent results compared to state-of-the-art convolutional networks while requiring substantially fewer computational resources to train.',
  bibtex: `@inproceedings{dosovitskiy2021an,
  title={An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale},
  author={Dosovitskiy, Alexey and Beyer, Lucas and Kolesnikov, Alexander and Weissenborn, Dirk and Zhai, Xiaohua and Unterthiner, Thomas and Dehghani, Mostafa and Minderer, Matthias and Heigold, Georg and Gelly, Sylvain and Uszkoreit, Jakob and Houlsby, Neil},
  booktitle={International Conference on Learning Representations (ICLR)},
  year={2021}
}`,
  coreInnovations: [
    {
      title: '16×16 图像块序列化 (Patch Tokenization)',
      desc: '将 H×W×C 图像切分为 N = HW/P² 个 P×P 图像块（如 196 个 16×16 块），彻底解决像素级自注意力 O((HW)²) 算力爆炸难题。'
    },
    {
      title: '零视觉魔改的标准 Transformer 编码器',
      desc: '完全复用 Vaswani (2017) 与 BERT 的标准 Transformer Encoder（含 [CLS] 分类词元与 1D 可学习位置编码），直接享受 NLP 硬件工程红利。'
    },
    {
      title: '“大规模训练战胜归纳偏置”科学定律',
      desc: '系统阐明：在小数据集上 CNN 凭局部性与平移等变性占优；但在 14M~300M 大数据集上，无先验束缚的 ViT 全面反超 CNN。'
    },
    {
      title: '高分辨率微调与 2D 位置编码插值',
      desc: '微调时通过增大图像分辨率（保持 Patch 尺寸 P 不变以延长有效序列 N），并对预训练位置编码执行 2D 双三次插值，显著提振精度。'
    }
  ],
  beginnerSteps: [
    {
      badge: '第一步：为什么不能直接把像素喂给 Transformer？',
      title: '从 50,176 个像素到 196 个“拼图块（Patches）”的降维奇迹',
      subtitle: 'Solving the Quadratic O(N²) Pixel Explosion',
      contentParagraphs: [
        '一张普通的 224 × 224 彩色照片有 50,176 个像素点。如果把每个像素当成一个“单词”塞进 Transformer，计算两两像素之间的自注意力矩阵需要 50176 × 50176 ≈ 25 亿次运算——连最顶级的 GPU 都会瞬间爆显存！',
        'Google 大脑团队想出了一个极其优雅的办法：像切豆腐或玩拼图一样，把 224 × 224 的照片切成 14 × 14 = **196 个小方块（Patch）**，每个小方块的尺寸是 16 × 16 像素！',
        '把每个 16 × 16 × 3（共 768 个像素值）的小方块拉平，过一个线性投影层变成 1 个词向量。这样一来，一张照片就变成了一句只有 **196 个“视觉单词”** 的句子，自注意力计算量瞬间缩小了 **65,536 倍**！'
      ],
      takeawayCallout: '“把 16×16 的图像块当成一个单词”，一句话就打通了计算机视觉（CV）与自然语言处理（NLP）的次元壁！'
    },
    {
      badge: '第二步：完全照搬 BERT 的极简流程',
      title: 'Patch Embedding + [CLS] 词元 + 1D 位置编码',
      subtitle: 'Pure Transformer Encoder Without Vision-Specific Hacks',
      contentParagraphs: [
        '切成 196 个视觉词向量后，后面的步骤和 NLP 里的 BERT 一模一样：',
        '① 在第 1 个图像块前面，塞入一个可学习的特殊分类词元 **`[CLS]`（Class Token）**，序列总长度变成 197；',
        '② 为了让模型知道每个拼图块原本在照片的第几行第几列，给这 197 个向量加上**可学习的 1D 位置编码（Position Embedding）**；',
        '③ 送进 L 层标准 Transformer 编码器（Pre-LN 结构：LayerNorm → 多头自注意力 → 残差 → LayerNorm → MLP → 残差），最后只取出 `[CLS]` 词元的输出送进分类头预测图片类别！'
      ],
      takeawayCallout: '作者发现甚至不需要复杂的 2D 坐标编码，直接用最简单的 1D 位置编码，ViT 就能自己学会 2D 网格的行列结构！'
    },
    {
      badge: '第三步：为什么小数据不如 ResNet，大数据却吊打？',
      title: '核心洞见：归纳偏置（Inductive Bias）是一把双刃剑',
      subtitle: 'Inductive Bias vs. Data Scale Crossover (Figure 3 & 4)',
      contentParagraphs: [
        '当你只在 130 万张图的 ImageNet-1k 上从头训练 ViT 时，你会惊讶地发现：它竟然打不过老牌的 ResNet！为什么？',
        '因为 CNN 天生自带两大“出厂作弊器（归纳偏置 Inductive Bias）”：① **局部性（Locality）**：相邻像素一定先由 3×3 卷积核聚在一起；② **平移等变性（Translation Equivariance）**：猫在左上角和右下角提取的特征一样。而 ViT 出厂时是一张白纸，它连“第 1 个拼图块和第 2 个拼图块挨着”都不知道，必须全靠自己在数据里摸索，所以在小数据上容易过拟合！',
        '然而，当预训练数据扩大到 **ImageNet-21k（1400万张图）** 或 **JFT-300M（3亿张图）** 时，惊天逆转发生了：CNN 的固定局部窗口反而限制了它的上限，而无拘无束的 ViT 从第 1 层就能纵览全图全局信息，全面反超并碾压了所有 CNN！'
      ],
      highlightBox: {
        title: '数据规模与模型架构的黄金交叉点法则',
        points: [
          '小/中数据集（~1M 图像，无强正则）：CNN (ResNet) > ViT（先验规则帮助小数据快速收敛）。',
          '超大规模数据集（14M ~ 300M 图像）：ViT ≫ CNN（大规模数据本身就是最好的老师，过多的人工先验反而成为天花板）。'
        ]
      },
      takeawayCallout: '“先验规则（归纳偏置）帮你在起点跑得快，但去掉先验规则才能在大规模数据下飞得高！”'
    },
    {
      badge: '第四步：打开 ViT 的黑盒看内部视觉机制',
      title: '第 1 层就能看全图！注意力距离堪比 CNN 的感受野',
      subtitle: 'Inspecting Position Similarity & Attention Distance (Figure 7)',
      contentParagraphs: [
        '作者对训练好的 ViT 进行了三大可视化解剖（论文 Figure 7）：',
        '① **底层线性投影 E 学到了什么？** 学到了和人类视觉皮层以及 CNN 第 1 层高度一致的色彩与边缘滤波器（Gabor-like filters）！',
        '② **1D 位置编码学到了什么？** 计算 196 个位置编码的余弦相似度，画面上自动浮现出了无比规整的 **14×14 二维网格同行同列高亮图案**！',
        '③ **自注意力的“感受野”有多大？** 在 CNN 中，底层只能看 3×3 的极小局部，要到第几十层才能看全图；而在 ViT 中，**早从第 1 层开始，就已经有一半的注意力头在看跨越整张图片的全局信息**，而另一半注意力头则自发学会了关注局部邻域！'
      ],
      takeawayCallout: 'ViT 并没有丢失局部感知能力，它只是把“局部还是全局”的选择权交给了不同的注意力头自由分工！'
    }
  ],
  beginnerQuiz: [
    {
      id: 1,
      question: '给定一张分辨率为 224 × 224 的彩色图像，如果使用 ViT-B/16（即 Patch 尺寸 P = 16 × 16），加上 1 个 [CLS] 词元后，输入给 Transformer 编码器的总序列长度是多少？',
      options: [
        '50,176 个词元',
        '196 + 1 = 197 个词元（因为 (224/16) × (224/16) = 14 × 14 = 196 个图像块，外加 1 个 [CLS] 词元）',
        '16 个词元',
        '512 个词元'
      ],
      correctIndex: 1,
      explanation:
        '完全正确！图像块数量 N = (H × W) / P² = (224 × 224) / 16² = 14 × 14 = 196。在序列开头拼接 1 个可学习的 [CLS] token 后，总序列长度为 197。'
    },
    {
      id: 2,
      question: '为什么 ViT 在中小型数据集（如未加额外数据增强的 ImageNet-1k）上从头训练时，表现往往不如同等规模的 ResNet？',
      options: [
        '因为 ViT 的参数量太少了',
        '因为 ViT 缺乏 CNN 内置的图像归纳偏置（如局部邻域相关性与平移等变性），必须完全从数据中从零学习二维空间拓扑关系，在小数据上容易过拟合',
        '因为 ViT 没有使用激活函数',
        '因为 ViT 不能在 GPU 上运行'
      ],
      correctIndex: 1,
      explanation:
        '正确！CNN 的二维局部卷积核天然编码了“相邻像素强相关”和“平移等变”的图像先验；而 ViT 中只有 MLP 是局部的，自注意力是全局的，二维位置关系必须在大规模数据（14M~300M）或强正则化下才能充分学出。'
    },
    {
      id: 3,
      question: '当把预训练好的 ViT（例如在 224×224 分辨率上预训练）迁移到更高分辨率（如 384×384）进行下游微调时，ViT 是如何处理的？',
      options: [
        '把 Patch 尺寸 P 从 16×16 放大到 27×27，保持序列长度 196 不变',
        '保持 Patch 尺寸 P=16×16 不变（使微调投影矩阵 E 无需改变），序列长度自然增加到 (384/16)² = 576，并对预训练好的位置编码做 2D 插值',
        '直接把多余的边缘像素裁剪掉',
        '重新随机初始化整个模型'
      ],
      correctIndex: 1,
      explanation:
        '完全正确！保持 Patch 尺寸 P=16 不变可以完美复用预训练好的线性投影权重 E；虽然序列长度从 196 变成了 576，但 Transformer 天然支持可变长度序列，只需对预训练的 14×14 位置编码网格做 2D 插值扩展为 24×24 即可！'
    }
  ],
  chapters: [
    {
      id: 'sec-1',
      chapterNumber: '1',
      titleZh: '引言：打破计算机视觉对卷积架构的依赖',
      titleEn: 'Introduction: Beyond Convolutional Inductive Biases',
      summaryZh:
        '回顾 NLP 领域的 Transformer 浪潮与 CV 领域的注意力探索，提出将图像直接切块序列化并采用原版 Transformer 的极简核心思想。',
      beginnerTakeaways: [
        {
          question: '在 ViT 之前，为什么大家把注意力机制用到视觉上都没能完全取代 ResNet？',
          answerZh:
            '此前的研究要么是在 ResNet 内部加几层自注意力，要么是做局部滑动窗口的像素级自注意力（如 Axial-Attention 或 Stand-Alone Self-Attention）。那些复杂的局部滑动窗口算子在理论上有理，但在现代 GPU/TPU 硬件上极难高效加速！而 ViT 干脆不搞局部窗口，直接切成 16×16 大块用最标准的全局 Transformer，硬件效率反而高出几倍！',
          analogyZh:
            '别人都在试图把火车改装成能在山路拐弯的越野车（复杂低效），而 ViT 直接把山路铺成标准铁轨（图像切块成词序列），让现成的高铁（标准 Transformer）全速飞驰！'
        }
      ],
      contentZh: [
        '基于自注意力的架构，特别是 Transformer（Vaswani et al., 2017），已成为自然语言处理（NLP）的首选模型。主流方法是在大型文本语料库上进行预训练，然后在较小的任务特定数据集上进行微调。得益于 Transformer 的计算效率和可扩展性，训练超过 1000 亿参数的空前规模模型已成为可能。',
        '然而在计算机视觉领域，卷积架构（CNN）仍然占据主导地位。受 NLP 成功的启发，多项研究尝试将类似 CNN 的架构与自注意力相结合，有些甚至完全替换了卷积。后一类模型虽然在理论上有效，但由于使用了专门的局部注意力模式（Specialized Attention Patterns），尚未在现代硬件加速器上得到有效扩展。',
        '受 NLP 中架构扩展成功的启发，我们尝试将**标准的 Transformer 直接应用于图像，并尽可能少地进行任何修改**。为此，我们将图像拆分为多个图像块（Patches），并将这些图像块的线性嵌入序列作为 Transformer 的输入。图像块的处理方式与 NLP 应用中的词元（Tokens）完全相同！'
      ],
      contentEn: [
        'Self-attention-based architectures, in particular Transformers, have become the model of choice in natural language processing (NLP). In computer vision, however, convolutional architectures remain dominant.',
        'Inspired by the Transformer scaling success in NLP, we experiment with applying a standard Transformer directly to images, with the fewest possible modifications. To do so, we split an image into patches and provide the sequence of linear embeddings of these patches as an input to a Transformer. Image patches are treated the same way as tokens (words) in an NLP application.'
      ],
      keyInsights: [
        '像素级局部注意力在硬件上难以扩展，而 16×16 图像块全局注意力完美契合现代 GPU/TPU 矩阵加速引擎。',
        'ViT 证明了跨模态（文本与视觉）可以共享完全相同的底层骨干网络架构。'
      ]
    },
    {
      id: 'sec-2',
      chapterNumber: '2',
      titleZh: 'ViT 核心方法论：图像块嵌入、位置编码与编码器方程',
      titleEn: 'Method: Vision Transformer (ViT) Architecture & Equations',
      summaryZh:
        '完整推导二维图像切块重塑、线性投影矩阵 E、[CLS] 词元、1D/2D/相对位置编码消融、Pre-LN 编码器以及 Hybrid CNN-ViT 混合变体。',
      beginnerTakeaways: [
        {
          question: '代码实现里，怎么把一张图瞬间切成 196 个 16×16 的图像块并完成线性投影？',
          answerZh:
            '在工程代码（如 PyTorch）中，甚至不需要写循环切图！直接使用一层卷积核大小为 16×16、步长（Stride）也为 16×16、输出通道数为 D=768 的二维卷积 `nn.Conv2d(3, 768, kernel_size=16, stride=16)`，一步操作就同时完成了“16×16 不重叠切块 + 线性投影 E”！',
          analogyZh:
            '就像用一个 14×14 格子的华夫饼模具咔嚓一下按在面团上，一秒钟就把整块面团切成了 196 块标准小方格。'
        }
      ],
      contentZh: [
        '【图像块嵌入（Patch Embeddings）】标准 Transformer 接收一维词元嵌入序列作为输入。为了处理二维图像，我们将图像 $x \\in \\mathbb{R}^{H \\times W \\times C}$ 重塑（Reshape）为一系列展平的二维图像块序列 $x_p \\in \\mathbb{R}^{N \\times (P^2 \\cdot C)}$，其中 $(H, W)$ 是原始图像的分辨率，$C$ 是通道数，$(P, P)$ 是每个图像块的分辨率，而 $N = HW / P^2$ 是由此产生的图像块数量——它同时也作为 Transformer 的有效输入序列长度！Transformer 在其所有层中使用恒定的潜在向量大小 $D$，因此我们将图像块展平并使用可训练的线性投影 $E \\in \\mathbb{R}^{(P^2 \\cdot C) \\times D}$ 将其映射到 $D$ 维（称为 Patch Embeddings）。',
        '【[CLS] 分类词元与位置嵌入】与 BERT 的 `[class]` 词元类似，我们在嵌入的图像块序列前拼接一个可学习的嵌入 $z_0^0 = x_{\\text{class}}$，其在 Transformer 编码器输出端的状态 $z_L^0$ 即作为整张图像的全局表征 $y$。为了保留位置信息，我们将位置嵌入 $E_{\\text{pos}} \\in \\mathbb{R}^{(N+1) \\times D}$ 添加到图像块嵌入中。我们对比了无位置编码、标准可学习 1D 位置编码、2D 感知位置编码以及相对位置编码（Table 8）：无位置编码准确率暴跌超过 3 个点（61.3% vs 64.2%），而 1D、2D 和相对位置编码表现几乎完全一致！因为操作的对象是 14×14 的图像块而非像素，学习 196 个网格的空间关系非常容易，1D 编码已完全足够。',
        '【归纳偏置（Inductive Bias）与高分辨率微调】值得注意的是，视觉 Transformer 的图像特定归纳偏置比 CNN 少得多。在 CNN 中，局部性（Locality）、二维邻域结构和等变性（Translation Equivariance）被烘焙进整个模型的每一层中。而在 ViT 中，只有 MLP 层是局部和平移等变的，而自注意力层则是完全全局的！二维邻域结构仅在两个地方被非常克制地使用：模型切分图像块时，以及在微调时调整不同分辨率图像的位置嵌入（执行 2D 插值）时。'
      ],
      contentEn: [
        'To handle 2D images, we reshape the image x in R^{H x W x C} into a sequence of flattened 2D patches x_p in R^{N x (P^2 C)}, where (H, W) is the resolution of the original image, C is the number of channels, (P, P) is the resolution of each image patch, and N = HW/P^2 is the resulting number of patches, which also serves as the effective input sequence length for the Transformer.',
        'Similar to BERT\'s [class] token, we prepend a learnable embedding to the sequence of embedded patches (z_0^0 = x_class), whose state at the output of the Transformer encoder (z_L^0) serves as the image representation y.',
        'Vision Transformer has much less image-specific inductive bias than CNNs. In CNNs, locality, two-dimensional neighborhood structure, and translation equivariance are baked into each layer throughout the whole model. In ViT, only MLP layers are local and translationally equivariant, while the self-attention layers are global.'
      ],
      formulas: [
        {
          latex: 'z_0 = \\left[ x_{\\text{class}}; \\, x_p^1 E; \\, x_p^2 E; \\, \\dots; \\, x_p^N E \\right] + E_{\\text{pos}}, \\quad E \\in \\mathbb{R}^{(P^2 \\cdot C) \\times D}, \\; E_{\\text{pos}} \\in \\mathbb{R}^{(N+1) \\times D}',
          explanationZh: 'ViT 底层输入构建方程：N 个展平图像块经矩阵 E 线性投影后，在句首拼接 x_class 并加上位置编码 E_pos。'
        },
        {
          latex: 'z\'_\\ell = \\text{MSA}(\\text{LN}(z_{\\ell-1})) + z_{\\ell-1}, \\quad z_\\ell = \\text{MLP}(\\text{LN}(z\'_\\ell)) + z\'_\\ell, \\quad y = \\text{LN}(z_L^0)',
          explanationZh: 'ViT 编码器递推方程（采用 Pre-LN 结构：先做 LayerNorm 再进 MSA/MLP，MLP 采用 GELU 激活函数）。'
        }
      ],
      keyInsights: [
        '模型命名规范：例如 ViT-L/16 代表 Large 规模（24层，D=1024）且采用 16×16 图像块尺寸；Patch 尺寸越小（如 /14），序列 N 越长，精度越高但计算量越大。',
        'Pre-LN（把 LayerNorm 放在残差分支内部子层之前）配合 GELU 激活函数，成为了现代视觉与语言 Transformer 的标准配置。'
      ]
    },
    {
      id: 'sec-3',
      chapterNumber: '3',
      titleZh: '实验与规模定律：从 ImageNet-1k 到 JFT-300M 的逆袭',
      titleEn: 'Experiments: Scaling Pre-Training Data & Compute Efficiency',
      summaryZh:
        '展示 ViT-Base / Large / Huge 在各大视觉基准上的表现，剖析数据规模扩大如何扭转 ViT 与 ResNet 的胜负关系，以及预训练算力效率对比。',
      beginnerTakeaways: [
        {
          question: '有人说 Transformer 训练成本比 CNN 高，但在论文里为什么说 ViT 比 CNN 更省算力？',
          answerZh:
            '这是一个极大的认知误区！论文 Figure 5 的算力-精度曲线铁证如山：在达到完全相同的下游迁移准确率时，ViT 所需的预训练总算力（TPUv3-core-days）只有最先进 CNN（BiT ResNet）的 1/4 到 1/2！因为固定大小的不重叠 Patch 极大压缩了特征图空间分辨率。',
          analogyZh:
            'ResNet 是一层层细嚼慢咽处理高分辨率特征图，而 ViT 在入口处直接把 16×16 像素打包成 1 个词元，主干道畅通无阻，算力性价比反而高出数倍！'
        }
      ],
      contentZh: [
        '我们设计了三种不同规模的模型配置（参考 BERT）：**ViT-Base**（12层，$D=768$，86M 参数）、**ViT-Large**（24层，$D=1024$，307M 参数）和 **ViT-Huge**（32层，$D=1280$，632M 参数），并与当时最强的卷积网络 **BiT（Big Transfer，基于大型 ResNet）** 和 **Noisy Student（EfficientNet-L2）** 进行全面对比。',
        '【全面刷新视觉 SOTA（论文 Table 2）】在 JFT-300M 上预训练后，**ViT-H/14** 在 ImageNet 上取得了 **88.55%** 的 Top-1 准确率，在 ImageNet ReaL 上达到 **90.72%**，在 CIFAR-100 上达到 **94.55%**，在 VTAB（19 个多样化视觉任务套件）上达到 **77.63%**，全面超越了 BiT-L（ResNet152x4）和 Noisy Student！而更关键的是算力开销：Noisy Student 需要 **12,300 TPUv3-core-days**，BiT-L 需要 **9,900 TPUv3-core-days**，而夺冠的 ViT-H/14 仅需 **2,500 TPUv3-core-days（节省了约 75% 的算力）**！',
        '【数据规模交叉实验（论文 Figure 3）】为了探究预训练数据集规模的影响，我们分别在 ImageNet-1k（130万图）、ImageNet-21k（1400万图）和 JFT-300M（3亿图）上预训练模型。结果清晰揭示了规律：在最小的 ImageNet-1k 上，哪怕加上权重衰减、Dropout 和 Label Smoothing，ViT-Large 的表现仍然不如 ViT-Base，且均落后于 BiT ResNet；在中等规模的 ImageNet-21k 上，两者旗鼓相当；而一旦进入 JFT-300M，大模型 ViT-Large 和 ViT-Huge 的潜力彻底爆发，大幅甩开所有规模的 ResNet！'
      ],
      contentEn: [
        'When pre-trained on JFT-300M, ViT-Large and ViT-Huge outperform ResNet-based baselines on all datasets, while taking substantially less computational resources to pre-train.',
        'On the smallest dataset, ImageNet, ViT-Large models underperform compared to ViT-Base models, despite (moderate) regularization. With ImageNet-21k pre-training, their performances are similar. Only with JFT-300M, do we see the full benefit of larger models.',
        'Vision Transformers use approximately 2x-4x less compute to attain the same performance as ResNets (BiT) on average over 5 datasets.'
      ],
      keyInsights: [
        'ViT-H/14 以 2500 TPUv3-core-days 的算力击败了耗时 9900~12300 core-days 的 BiT-L 与 EfficientNet-L2。',
        '在小数据上，CNN 的归纳偏置极其有用；在大规模数据上，直接从数据中学习相关模式完全足够且上限更高。'
      ]
    },
    {
      id: 'sec-4',
      chapterNumber: '4',
      titleZh: '内部机制解剖：滤波器、2D 位置拓扑与全局注意力距离',
      titleEn: 'Inspecting Vision Transformer: Filters, Position & Attention Distance',
      summaryZh:
        '通过可视化底层 RGB 投影主成分、位置嵌入余弦相似度矩阵以及各层自注意力的平均空间跨度（Attention Distance），揭示 ViT 如何理解图像。',
      beginnerTakeaways: [
        {
          question: '什么是 ViT 的“平均注意力距离（Mean Attention Distance）”，它和 CNN 的感受野有什么关系？',
          answerZh:
            '对于某个注意力头，如果一个图像块主要关注距离它 100 像素远的另一个图像块，它的注意力距离就是 100 像素（相当于 CNN 里的感受野大小）。作者统计发现：在 ViT 的第 1 层，有些头的平均距离只有 10~20 像素（专门看局部细节），而另一些头的平均距离一上来就超过 100 像素（直接看全图）！到了高层，所有头都具备全局超过 100 像素的视野！',
          analogyZh:
            'CNN 就像爬楼梯，第 1 层只能看脚尖，爬到第 50 层才能看清整座城市；而 ViT 在第 1 层就同时配备了“放大镜专员”和“直升机航拍员”！'
        }
      ],
      contentZh: [
        '为了理解 ViT 如何处理图像数据，我们对训练好的模型内部表示进行了深入剖析（Figure 7）：',
        '【1. 线性投影层 $E$ 的主成分滤波器】第 1 层将展平的 Patch 投影到 $D$ 维空间。该学习到的嵌入矩阵前 28 个主成分的可视化显示，它们高度类似于用低维基函数对每个图像块内的精细结构进行局部边缘、方向和颜色对比度分解。',
        '【2. 位置嵌入自发涌现 2D 网格拓扑】模型原本使用的是毫无二维空间概念的 1D 位置编码。然而，当我们计算每个图像块的位置嵌入与其他所有块位置嵌入的余弦相似度时，每个块的相似度矩阵清晰地呈现出**同一行与同一列高相关性**的二维网格结构！这说明模型无需手工设计 2D 位置编码，就能从图像块序列中自主恢复出二维空间坐标。',
        '【3. 自注意力的全局与局部协同（Attention Distance）】自注意力允许 ViT 即使在最底层也能整合并跨越整张图像的信息。我们根据注意力权重计算了信息整合的平均空间像素距离（这类似于 CNN 中的感受野大小）。我们发现：**早从网络的第 1 层开始，某些注意力头就已经关注了整张图像的大部分区域（平均距离 > 100 像素）**，证明全局信息整合能力确实被模型实际使用了！与此同时，其他的注意力头在底层保持了较小的注意力距离（高度局部化）。而且，这种底层局部化在先用 ResNet 提取特征再接 ViT 的 Hybrid 混合模型中显著减弱，说明纯 ViT 的局部注意力头完美承担了类似早期卷积层的功能。'
      ],
      contentEn: [
        'The learned position embeddings show that the model learns to encode distance within the image in the similarity of position embeddings, i.e. closer patches tend to have more similar position embeddings, and row-column structure appears.',
        'We find that some heads attend to most of the image already in the lowest layers, showing that the ability to integrate information globally is indeed used by the model. Other attention heads have consistently small attention distances in the low layers. This highly localized attention is less pronounced in hybrid models that apply a ResNet before the Transformer, suggesting that it may serve a similar function as early convolutional layers in CNNs.'
      ],
      keyInsights: [
        '1D 位置编码经训练后，其内积相似度自然涌现出 14×14 的行-列二维坐标系。',
        'ViT 在第 1 层就同时具备了“局部卷积式感受野（小距离头）”与“全图上下文感受野（大距离头）”。'
      ]
    }
  ],
  benchmarks: [
    {
      id: 'imagenet-sota',
      nameZh: 'ImageNet Top-1 准确率巅峰对决 (%)',
      nameEn: 'ImageNet Top-1 Accuracy (%)',
      metricLabel: 'Top-1 准确率',
      unit: '%',
      higherIsBetter: true,
      summaryConclusion:
        '在大规模预训练下，ViT-H/14 取得了 88.55% 的 ImageNet Top-1 准确率（ReaL 达 90.72%），全面超越最强卷积网络 BiT-L (ResNet152x4) 和 Noisy Student (EfficientNet-L2)！',
      items: [
        { modelName: 'BiT-L (ResNet152x4, JFT-300M 预训练)', value: 87.54, maxScale: 92 },
        { modelName: 'Noisy Student (EfficientNet-L2, JFT-300M)', value: 88.4, maxScale: 92 },
        { modelName: 'ViT-B/16 (ImageNet-21k 开源预训练)', value: 84.0, maxScale: 92, isOurModel: true },
        { modelName: 'ViT-L/16 (ImageNet-21k 开源预训练)', value: 85.3, maxScale: 92, isOurModel: true },
        { modelName: '🌟 ViT-L/16 (JFT-300M 预训练)', value: 87.76, maxScale: 92, isOurModel: true },
        {
          modelName: '🌟 ViT-H/14 (本文旗舰, JFT-300M)',
          value: 88.55,
          maxScale: 92,
          isOurModel: true,
          badge: 'SOTA 视觉新王'
        }
      ]
    },
    {
      id: 'pretrain-compute',
      nameZh: '达到 SOTA 所需预训练算力开销对比 (越低越好)',
      nameEn: 'Pre-training Compute Cost (TPUv3-core-days, Lower is Better)',
      metricLabel: '预训练算力 (TPUv3-core-days)',
      unit: ' days',
      higherIsBetter: false,
      summaryConclusion:
        '得益于 16×16 图像块序列化带来的特征图分辨率压缩，ViT-L/16 仅需 680 TPUv3-core-days 即可超越耗费 9900 core-days 的 BiT-L，算力开销节省了 4 ~ 14 倍！',
      items: [
        { modelName: 'Noisy Student (EfficientNet-L2, 88.4% Acc)', value: 12300, maxScale: 13000 },
        { modelName: 'BiT-L (ResNet152x4, 87.54% Acc)', value: 9900, maxScale: 13000 },
        {
          modelName: '🌟 ViT-H/14 (88.55% Acc, 精度最高)',
          value: 2500,
          maxScale: 13000,
          isOurModel: true,
          badge: '省75%算力'
        },
        {
          modelName: '🌟 ViT-L/16 (87.76% Acc, 超越 BiT-L)',
          value: 680,
          maxScale: 13000,
          isOurModel: true,
          badge: '比BiT省14倍算力!'
        }
      ]
    }
  ],
  comparisonTable: [
    {
      paradigmNameZh: '传统卷积神经网络 (CNN / ResNet / BiT)',
      paradigmNameEn: 'Convolutional Neural Networks (ResNet)',
      mechanismZh: '逐层 3×3 局部滑动窗口卷积与空间下采样池化',
      interactionMode: '强归纳偏置 (局部性 + 平移等变性)',
      indexType: '底层仅局部感受野，深层才全局',
      queryLatency: '高算力消耗 (BiT-L 需 9900 核天)',
      accuracyRank: '小数据占优，大数据受限 (87.54%)'
    },
    {
      paradigmNameZh: '像素级局部自注意力 (Stand-Alone Attention)',
      paradigmNameEn: 'Pixel-level Local Self-Attention',
      mechanismZh: '在每个像素周围局部窗口内计算自注意力',
      interactionMode: '中等归纳偏置 (局部窗口)',
      indexType: '不规则内存访问，硬件加速极慢',
      queryLatency: '难以扩展至超大数据集',
      accuracyRank: '中等'
    },
    {
      paradigmNameZh: 'CNN-Transformer 混合架构 (Hybrid ViT)',
      paradigmNameEn: 'ResNet + ViT Hybrid',
      mechanismZh: '先用 ResNet 提取特征图，再把 1×1 特征网格送入 ViT',
      interactionMode: '兼具早期卷积偏置与后期全局注意力',
      indexType: '第1层起直接融合中等感受野',
      queryLatency: '中等算力预算下优于纯 ViT',
      accuracyRank: '中等规模优秀，超大模型被纯ViT追平'
    },
    {
      paradigmNameZh: '🌟 纯视觉 Transformer (ViT, 本文核心)',
      paradigmNameEn: 'Pure Vision Transformer (ViT)',
      mechanismZh: '图像切分为 16×16 图像块序列，直接送入标准 Transformer',
      interactionMode: '极弱归纳偏置 (直接从数据学习2D空间)',
      indexType: '第1层即同时拥有局部与全图全局视野',
      queryLatency: '极高硬件吞吐 (算力节省 4x~14x)',
      accuracyRank: '88.55% (大数据统治级 SOTA)',
      isOurModel: true
    }
  ],
  caseStudies: [
    {
      title: '论文 Figure 3 经典规律：训练数据集规模从 1M 扩大到 300M 时的“归纳偏置逆转”',
      query: '为什么在小数据集上输给 ResNet 的 ViT，到了 3 亿张图像上却能彻底反超？',
      cards: [
        {
          methodName: '阶段 1：ImageNet-1k (130万张图)',
          status: 'ViT 77.9% < BiT ResNet 82.5%',
          isSuccess: false,
          reason:
            '在 130 万张图的小规模预训练下，由于缺乏局部性与平移等变性先验，ViT-Large 甚至发生了严重过拟合，准确率落后于内置卷积先验的 ResNet。'
        },
        {
          methodName: '阶段 2：ImageNet-21k (1400万张图)',
          status: 'ViT 85.3% ≈ BiT ResNet 85.1% (交叉点!)',
          isSuccess: true,
          isWarning: true,
          reason:
            '当预训练图像扩大 10 倍达到 1400 万张时，ViT 已经从海量图像块共现中充分学到了二维空间拓扑，追平并略微反超了同规模的 ResNet！'
        },
        {
          methodName: '阶段 3：JFT-300M (3亿张图)',
          status: 'ViT-H/14 88.55% ≫ BiT-L 87.54% (全面统治)',
          isSuccess: true,
          reason:
            '在 3 亿张图像规模下，CNN 固定的局部卷积核反而限制了跨区域长程建模；无先验束缚的 ViT 彻底释放全局自注意力潜能，以 1/4 算力创下视觉最高纪录！'
        }
      ]
    }
  ],
  glossaryCategories: ['图像序列化核心概念', '视觉先验与规模定律', '微调与内部机制'],
  glossaryItems: [
    {
      id: 'patch-embedding',
      termZh: '图像块线性嵌入',
      termEn: 'Patch Embedding',
      category: '图像序列化核心概念',
      summary: '将图像切分为 P×P 大小的不重叠小块，展平后通过线性矩阵 E 映射为 D 维词元向量。',
      analogy:
        '把一幅马赛克壁画拆成一块块 16×16 的正方形瓷砖，给每块瓷砖编成一串 768 维的数字密码，当作一个“单词”喂给语言模型。',
      technicalDetail:
        '对于 224×224×3 图像与 P=16，产生 N = (224/16)² = 196 个块，每块展平为 16×16×3 = 768 维，经 E ∈ R^{768×D} 投影为视觉 token。',
      paperApplication: '成功将二维视觉输入转化为标准一维 Transformer 序列，避免了像素级自注意力的平方爆炸。',
      formula: 'x_p \\in \\mathbb{R}^{N \\times (P^2 \\cdot C)}, \\quad N = HW / P^2'
    },
    {
      id: 'inductive-bias',
      termZh: '视觉归纳偏置',
      termEn: 'Image-Specific Inductive Bias',
      category: '视觉先验与规模定律',
      summary: '模型架构中预先人为设定的关于图像数据分布规律的假设（如 CNN 的局部相关性与平移等变性）。',
      analogy:
        '就像给刚学画画的新手提供印好格子的描红纸（CNN 先验），新手很快能画得规整；但对于修炼了千万幅画的大师（大数据 ViT），白纸才能画出超越描红纸的神作。',
      technicalDetail:
        'CNN 在每一层都强制执行局部邻域卷积和权重共享；而 ViT 除切块和 MLP 外均为全局自注意力，所有二维空间关系均由数据驱动学习。',
      paperApplication: '解释了为什么 ViT 在小数据上弱于 CNN、而在 14M~300M 大数据上显著强于 CNN。'
    },
    {
      id: 'translation-equivariance',
      termZh: '平移等变性',
      termEn: 'Translation Equivariance',
      category: '视觉先验与规模定律',
      summary: '当输入图像中的物体发生空间平移时，网络提取出的特征图也随之发生完全相同的空间平移。',
      analogy: '不论一只猫出现在照片左上角还是右下角，用同一个卷积放大镜扫过去提取出的胡须特征完全一样。',
      technicalDetail:
        '满足 f(T(x)) = T(f(x))。CNN 因滑动窗口共享卷积核而天然具备该性质，而 ViT 因加上了绝对位置编码且采用全局注意力，需从数据中学习位置不变性。',
      paperApplication: 'CNN 与 ViT 最核心的理论性质分野之一。'
    },
    {
      id: 'attention-distance',
      termZh: '平均注意力空间距离',
      termEn: 'Mean Attention Distance',
      category: '微调与内部机制',
      summary: '注意力头在图像平面上所关注的各个 Patch 之间的加权平均像素距离，等价于视觉感受野半径。',
      analogy: '测量一位观察员在看照片时，目光是只盯在方寸之间（短距离局部头），还是眼观六路横跨整张照片（长距离全局头）。',
      technicalDetail:
        '将注意力权重 a_{ij} 与图像块 i 和 j 在 2D 平面上的欧氏像素距离 d_{ij} 相乘求和。ViT 在第 1 层即展现出从 10 像素到 120 像素的宽广跨度。',
      paperApplication: '论文 Figure 7 用其证明 ViT 从最底层起就具备整合全图全局信息的能力。'
    },
    {
      id: '2d-pos-interpolation',
      termZh: '位置编码二维插值',
      termEn: '2D Interpolation of Position Embeddings',
      category: '微调与内部机制',
      summary: '当微调分辨率高于预训练分辨率导致 Patch 数量 N 增加时，将预训练 1D 位置编码还原为 2D 网格进行双三次插值。',
      analogy: '把原本 14×14 的座位表按比例平滑拉伸成 24×24 的座位表，让多出来的座位也能获得准确的坐标编号。',
      technicalDetail:
        '例如从 224×224 (14×14=196 块) 迁移到 384×384 (24×24=576 块) 时，保持 P=16 不变，将 196 个位置向量重排为 14×14×D 张量并插值为 24×24×D。',
      paperApplication: '支持 ViT 在下游任务上进行高分辨率微调（如 ViT-L/16 @ 512px）的核心技巧。'
    }
  ]
};
