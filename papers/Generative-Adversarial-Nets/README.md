# Generative Adversarial Nets (GAN 生成对抗网络奠基论文)

> **论文原名**：*Generative Adversarial Nets*  
> **作者**：Ian J. Goodfellow, Jean Pouget-Abadie, Mehdi Mirza, Bing Xu, David Warde-Farley, Sherjil Ozair, Aaron Courville, Yoshua Bengio (Université de Montréal)  
> **发表会议**：NeurIPS 2014 (NIPS 2014)  
> **论文编号**：[arXiv:1406.2661](https://arxiv.org/abs/1406.2661) | [PDF 直链](https://arxiv.org/pdf/1406.2661.pdf)

---

## 一、 核心贡献

1. **对抗博弈生成范式（Adversarial Framework）**：彻底抛弃显式密度函数近似、马尔可夫链蒙特卡洛（MCMC）与变分下界，让生成器 $G$ 与判别器 $D$ 在二人极小极大（Minimax）博弈中同步进化。
2. **全局最优纳什均衡严格证明**：理论证明当生成分布完美拟合并等于真实数据分布 $p_g = p_{\text{data}}$ 时，最优判别器无法区分真假（恒输出 $D^*(x) = \frac{1}{2}$），此时价值函数等价于最小化 Jensen-Shannon (JS) 散度并达到全局最小值 $-\log 4$。
3. **非饱和生成器损失（Non-Saturating Heuristic）**：指出训练初期 $\log(1 - D(G(z)))$ 梯度饱和问题，提出最大化 $\log D(G(z))$ 以在初期提供强劲梯度。

---

## 二、 目录结构

```text
Generative-Adversarial-Nets/
├── README.md                              # 本说明文档
└── src/
    ├── App.tsx                            # 论文详情页入口
    ├── components/
    │   └── GanMinimaxSimulator.tsx        # Minimax 博弈演化 (Figure 1 复现) 与梯度饱和模拟器
    └── data/
        └── paperData.ts                   # 论文结构化数据、公式、证明与实验解析
```
