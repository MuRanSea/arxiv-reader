# Auto-Encoding Variational Bayes (VAE 变分自编码器奠基论文)

> **论文原名**：*Auto-Encoding Variational Bayes*  
> **作者**：Diederik P. Kingma, Max Welling (University of Amsterdam)  
> **发表会议**：ICLR 2014  
> **论文编号**：[arXiv:1312.6114](https://arxiv.org/abs/1312.6114) | [PDF 直链](https://arxiv.org/pdf/1312.6114.pdf)

---

## 一、 核心贡献

1. **SGVB（随机梯度变分贝叶斯）估计器**：针对含有连续隐变量且后验分布 $p_\theta(z|x)$ 无法解析求取的有向概率图模型，提出可扩展至大规模数据集的变分推断算法。
2. **重参数化技巧（Reparameterization Trick）**：将随机采样过程 $z \sim q_\phi(z|x)$ 解耦为确定性变换 $z = g_\phi(\epsilon, x) = \mu_\phi(x) + \sigma_\phi(x) \odot \epsilon$（其中 $\epsilon \sim \mathcal{N}(0, I)$），使得梯度能够低方差地穿越随机节点进行反向传播。
3. **变分下界（ELBO）闭式正则项**：在先验与近似后验均为高斯分布的假设下，推导出无需蒙特卡洛估计的解析 KL 散度项，结合神经网络编码器与解码器构成 **Variational Auto-Encoder (VAE)**。

---

## 二、 目录结构

```text
Auto-Encoding-Variational-Bayes/
├── README.md                              # 本说明文档
└── src/
    ├── App.tsx                            # 论文详情页入口
    ├── components/
    │   └── VaeLatentSimulator.tsx         # 重参数化技巧、ELBO 权衡与二维流形交互模拟器
    └── data/
        └── paperData.ts                   # 论文结构化数据、公式、实验与精读解析
```
