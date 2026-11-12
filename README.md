# AI Paper Lab · 顶级 AI 论文中文精读与交互式算法实验平台

本项目采用**「一个论文一个文件夹（One Paper, One Folder）」**的模块化架构设计。每篇收录的论文均存放在 `papers/<论文英文全名>/` 独立子目录下，拥有专属的中文 `README.md`、完整结构化精读数据以及可交互的算法模拟器实验台；根目录 `index.html` 与 `src/portal/PaperHub.tsx` 负责统一路由分发、分类检索、全局字号调节（`小 / 中 / 大`）与双主题切换（`亮色 / 暗色`）。

---

## 一、 已收录全功能论文名录（共 13 篇奠基与前沿巨著）

### 1. 大模型架构基石（LLM Architecture）
| 序号 | 论文简称 | 论文原名与发表会议 | 独立文件夹路径 (`papers/...`) | 专属交互实验台 |
| :--- | :--- | :--- | :--- | :--- |
| 01 | **Transformer** | *Attention Is All You Need* (Vaswani et al., NeurIPS 2017, `arXiv:1706.03762`) | `papers/Attention-Is-All-You-Need/` | Q/K/V 缩放点积 $\div\sqrt{d_k}$ 梯度保护与因果掩码模拟器 |
| 02 | **BERT** | *BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding* (Devlin et al., NAACL 2019, `arXiv:1810.04805`) | `papers/BERT-Pre-training-of-Deep-Bidirectional-Transformers-for-Language-Understanding/` | 双向 vs 单向语境消歧、80-10-10 MLM 策略与三合一嵌入模拟器 |
| 03 | **GPT (GPT-1~3)** | *Language Models are Few-Shot Learners* (Brown, Radford, Sutskever et al., NeurIPS 2020, `arXiv:2005.14165`) | `papers/Language-Models-are-Few-Shot-Learners-GPT/` | Zero/One/Few-Shot 上下文学习与 $125\text{M}\to 175\text{B}$ 规模涌现模拟器 |

### 2. 参数高效微调（PEFT & Low-Rank Adaptation）
| 序号 | 论文简称 | 论文原名与发表会议 | 独立文件夹路径 (`papers/...`) | 专属交互实验台 |
| :--- | :--- | :--- | :--- | :--- |
| 04 | **LoRA** | *LoRA: Low-Rank Adaptation of Large Language Models* (Hu et al., ICLR 2022, `arXiv:2106.09685`) | `papers/LoRA-Low-Rank-Adaptation-of-Large-Language-Models/` | 低秩矩阵分解 $\Delta W=BA$、显存计算器与零延迟权重合并模拟器 |
| 05 | **PEFT / Adapter** | *Parameter-Efficient Transfer Learning for NLP* & *Unified View* (Houlsby et al., ICML 2019 / He et al., ICLR 2022, `arXiv:1902.00751`) | `papers/Parameter-Efficient-Transfer-Learning-for-NLP/` | 五大 PEFT 范式（Serial/Parallel Adapter、Prefix、Prompt、MAM）与近恒等初始化模拟器 |

### 3. 视觉与深度生成模型（Vision & Generative Models）
| 序号 | 论文简称 | 论文原名与发表会议 | 独立文件夹路径 (`papers/...`) | 专属交互实验台 |
| :--- | :--- | :--- | :--- | :--- |
| 06 | **ViT** | *An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale* (Dosovitskiy et al., ICLR 2021, `arXiv:2010.11929`) | `papers/An-Image-is-Worth-16x16-Words-Transformers-for-Image-Recognition-at-Scale/` | $16\times 16$ 图像切块序列化、2D 位置编码相似度与数据规模反超模拟器 |
| 07 | **VAE** | *Auto-Encoding Variational Bayes* (Kingma & Welling, ICLR 2014, `arXiv:1312.6114`) | `papers/Auto-Encoding-Variational-Bayes/` | 重参数化技巧 $z=\mu+\sigma\odot\epsilon$ 梯度流、ELBO 权衡与二维流形插值模拟器 |
| 08 | **GAN** | *Generative Adversarial Nets* (Goodfellow et al., NeurIPS 2014, `arXiv:1406.2661`) | `papers/Generative-Adversarial-Nets/` | 极小极大博弈四阶段演化（复现 Figure 1）与非饱和梯度模拟器 |
| 09 | **Stable Diffusion** | *High-Resolution Image Synthesis with Latent Diffusion Models* (Rombach et al., CVPR 2022 Oral, `arXiv:2112.10752`) | `papers/High-Resolution-Image-Synthesis-with-Latent-Diffusion-Models/` | 感知压缩下采样率 $f\in\{1,4,8,32\}$、潜空间逆向去噪与 Cross-Attention 模拟器 |

### 4. RAG 与现代信息检索（RAG & Neural IR）
| 序号 | 论文简称 | 论文原名与发表会议 | 独立文件夹路径 (`papers/...`) | 专属交互实验台 |
| :--- | :--- | :--- | :--- | :--- |
| 10 | **RAG** | *Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks* (Lewis et al., NeurIPS 2020, `arXiv:2005.11401`) | `papers/Retrieval-Augmented-Generation-for-Knowledge-Intensive-NLP-Tasks/` | RAG-Sequence vs RAG-Token 逐词边缘化与零训练索引热插拔模拟器 |
| 11 | **DPR** | *Dense Passage Retrieval for Open-Domain Question Answering* (Karpukhin et al., EMNLP 2020, `arXiv:2004.04906`) | `papers/Dense-Passage-Retrieval-for-Open-Domain-Question-Answering/` | 双塔编码器批内负样本（In-Batch Negatives）与 BM25 困难负样本对比学习模拟器 |
| 12 | **ColBERT** | *ColBERT: Efficient and Effective Passage Search via Contextualized Late Interaction over BERT* (Khattab & Zaharia, SIGIR 2020, `arXiv:2004.12832`) | `papers/ColBERT-Efficient-and-Effective-Passage-Search-via-Contextualized-Late-Interaction-over-BERT/` | 延迟交互 MaxSim 词元对齐矩阵与 `[MASK]` 查询软扩展模拟器 |
| 13 | **DecisionRAG** | *Retriever-Free Retrieval: Navigating Documents with Decision Models* (`arXiv:2610.35868`) | `papers/Retriever-Free-Retrieval-Navigating-Documents-with-Decision-Models/` | 免检索器文档层级树 Beam Search 零 Token 导航实验台 |

---

## 二、 项目目录结构

```text
/
├── index.html                                 # 平台统一入口 HTML
├── README.md                                  # 平台架构说明与 13 篇论文总目录（本文件）
├── src/
│   ├── App.tsx                                # 顶层 Hash 路由控制器 (#/ 与 #/paper/<id>)
│   ├── index.css                              # Tailwind v4 语义化颜色变量与全局字号/选中高亮引擎
│   ├── portal/
│   │   └── PaperHub.tsx                       # 论文探索大厅主页（分类筛选、搜索、卡片导览）
│   └── shared/
│       ├── components/
│       │   ├── PaperExplorerLayout.tsx        # 通用五合一论文精读与实验台骨架
│       │   └── ThemeToggle.tsx                # 亮色 / 暗色 主题切换器
│       └── types/
│           ├── paper.ts                       # 注册中心元数据类型定义
│           └── universalPaper.ts              # 论文数据结构与自动归一化适配器
└── papers/
    ├── registry.ts                            # 13 篇论文统一注册表
    ├── Attention-Is-All-You-Need/
    ├── BERT-Pre-training-of-Deep-Bidirectional-Transformers-for-Language-Understanding/
    ├── Language-Models-are-Few-Shot-Learners-GPT/
    ├── LoRA-Low-Rank-Adaptation-of-Large-Language-Models/
    ├── Parameter-Efficient-Transfer-Learning-for-NLP/
    ├── An-Image-is-Worth-16x16-Words-Transformers-for-Image-Recognition-at-Scale/
    ├── Auto-Encoding-Variational-Bayes/
    ├── Generative-Adversarial-Nets/
    ├── High-Resolution-Image-Synthesis-with-Latent-Diffusion-Models/
    ├── Retrieval-Augmented-Generation-for-Knowledge-Intensive-NLP-Tasks/
    ├── Dense-Passage-Retrieval-for-Open-Domain-Question-Answering/
    ├── ColBERT-Efficient-and-Effective-Passage-Search-via-Contextualized-Late-Interaction-over-BERT/
    └── Retriever-Free-Retrieval-Navigating-Documents-with-Decision-Models/
```
