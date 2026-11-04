import { DocumentNode } from '../utils/treeNavigation.js';

export interface PredefinedQuery {
  id: string;
  category: string;
  query: string;
  expectedTargetId: string;
  expectedPath: string;
  difficulty: '入门 (Easy)' | '标准 (Medium)' | '复杂交叉 (Hard)';
  explanation: string;
}

export const CORPUS_PRESETS: { id: string; nameZh: string; descZh: string; rootNodes: DocumentNode[] }[] = [
  {
    id: 'wikipedia',
    nameZh: '维基百科科学与技术知识库 (Wikipedia NQ Benchmark)',
    descZh: '模拟 Natural Questions 评测环境：涵盖物理前沿、计算机科学与世界历史。',
    rootNodes: [
      {
        id: 'wiki-physics',
        title: 'Physics & Materials Science',
        titleZh: '物理学与材料前沿',
        level: 'domain',
        summaryZh: '研究物质基本组成、量子力学、高能物理与低维纳米材料。',
        contentZh: '现代物理学核心领域，包括凝聚态物理学、微观粒子与天体物理。',
        keywords: ['物理', '量子', '石墨烯', '材料', '诺贝尔', '超导', '凝聚态'],
        children: [
          {
            id: 'doc-graphene',
            title: 'Graphene and 2D Materials',
            titleZh: '石墨烯与二维晶体材料',
            level: 'document',
            summaryZh: '由碳原子构成的单层二维蜂窝状晶格，具备极高导电与导热率。',
            contentZh: '石墨烯由安德烈·海姆和康斯坦丁·诺沃肖洛夫于2004年在曼彻斯特大学分离成功。',
            keywords: ['石墨烯', '碳原子', '曼彻斯特', '二维材料', '诺贝尔奖'],
            children: [
              {
                id: 'sec-graphene-discovery',
                title: 'Discovery and Nobel Prize in Physics',
                titleZh: '分离发现历程与诺贝尔物理学奖',
                level: 'section',
                summaryZh: '记录利用胶带剥离石墨的方法及其带来的2010年诺贝尔奖荣耀。',
                contentZh: '研究人员使用微机械剥离法（透明胶带法）成功从石墨分离出单层碳原子结构。',
                keywords: ['胶带剥离', '2010年', '诺贝尔奖', '海姆', '诺沃肖洛夫'],
                children: [
                  {
                    id: 'pas-graphene-nobel-year',
                    title: '2010 Nobel Prize Award Ceremony',
                    titleZh: '2010年诺贝尔物理学奖颁奖细节与获奖理由',
                    level: 'passage',
                    summaryZh: '瑞典皇家科学院正式公布2010年物理学奖授予石墨烯突破先驱。',
                    contentZh: '2010年诺贝尔物理学奖正式授予安德烈·海姆（Andre Geim）与康斯坦丁·诺沃肖洛夫（Konstantin Novoselov），以表彰他们“在二维石墨烯材料方面的突破性实验研究”。',
                    keywords: ['2010年', '诺贝尔物理学奖', '海姆', '曼彻斯特', '获奖理由', '突破性实验']
                  },
                  {
                    id: 'pas-graphene-scotch-tape',
                    title: 'Scotch Tape Cleaving Technique',
                    titleZh: '微机械剥离法（胶带剥离技术）',
                    level: 'passage',
                    summaryZh: '介绍用日常普通胶带反复粘拉高定向热解石墨（HOPG）的操作实验。',
                    contentZh: '研究人员利用普通3M Scotch胶带在石墨晶体上反复折叠粘贴，使石墨层逐层减薄，最终在硅晶圆氧化层上捕获了单个原子厚度的石墨烯片层。',
                    keywords: ['胶带剥离', 'HOPG', '硅晶圆', '原子厚度', '实验步骤']
                  }
                ]
              },
              {
                id: 'sec-graphene-properties',
                title: 'Electronic & Thermal Properties',
                titleZh: '电子传输特性与超高导热机制',
                level: 'section',
                summaryZh: '狄拉克费米子特有的无质量色散关系与极低电阻特性。',
                contentZh: '在室温下石墨烯的载流子迁移率超过 200,000 cm^2/(V·s)。',
                keywords: ['导电', '迁移率', '狄拉克锥', '导热', '室温'],
                children: [
                  {
                    id: 'pas-graphene-dirac',
                    title: 'Dirac Cone and Zero Effective Mass',
                    titleZh: '狄拉克锥与零有效质量载流子',
                    level: 'passage',
                    summaryZh: '石墨烯电子在布里渊区角落遵从相对论狄拉克方程。',
                    contentZh: '石墨烯的能带在六角布里渊区的K点和K\'点相交形成狄拉克锥，载流子呈现零有效质量的相对论性行为，费米速度约为光速的1/300。',
                    keywords: ['狄拉克锥', '有效质量', '光速', '布里渊区', '费米速度']
                  }
                ]
              }
            ]
          },
          {
            id: 'doc-superconductivity',
            title: 'High-Temperature Superconductivity',
            titleZh: '高温超导与量子磁通钉扎',
            level: 'document',
            summaryZh: '铜氧化物与铁基超导体的宏观量子相干性与迈斯纳效应。',
            contentZh: '探讨突破BCS理论极限的铜氧化物超导体机制。',
            keywords: ['超导', '迈斯纳效应', '零电阻', '铜氧化物'],
            children: []
          }
        ]
      },
      {
        id: 'wiki-cs',
        title: 'Computer Science & AI',
        titleZh: '计算机科学与人工智能理论',
        level: 'domain',
        summaryZh: '算法复杂性、神经网络自注意力机制与分布式系统。',
        contentZh: '包含现代深度学习架构、信息检索、大语言模型推理优化。',
        keywords: ['计算机', 'AI', '大模型', 'RAG', '注意力', 'Transformer', '检索'],
        children: [
          {
            id: 'doc-rag-architecture',
            title: 'Retrieval-Augmented Generation Evolution',
            titleZh: '检索增强生成(RAG)演进与决策模型',
            level: 'document',
            summaryZh: '传统稠密向量检索的缺陷与 DecisionRAG 免检索器范式。',
            contentZh: '详尽对比 BM25、Contriever、8B Cross-Encoder 与 DecisionRAG 的本质不同。',
            keywords: ['RAG', 'DecisionRAG', '向量数据库', '免检索器', '重排器', 'Cornell'],
            children: [
              {
                id: 'sec-rag-asymmetry',
                title: 'The Retrieval Capability Asymmetry Bottleneck',
                titleZh: '传统 RAG 的检索能力不对称瓶颈',
                level: 'section',
                summaryZh: '揭示传统向量检索作为漏斗瓶颈的结构性痛点。',
                contentZh: '若第一阶段向量检索未能将正确段落捞入 Top-K，下游即便使用最顶尖推理模型也完全无法挽回上下文信息缺失。',
                keywords: ['不对称', '瓶颈', '召回率', '漏检', '第一阶段'],
                children: [
                  {
                    id: 'pas-asymmetry-detail',
                    title: 'Mathematical Proof of Retriever Bottleneck',
                    titleZh: '能力不对称性详细成因与实验观测',
                    level: 'passage',
                    summaryZh: '实验证实 downstream LLM 的上限被 upstream retriever 死死锚定。',
                    contentZh: '论文 arXiv:2610.35868 实验表明，传统密集检索无论后续接入多大的 Reranker，若首阶段召回率上限仅有 40%，下游生成模型的准确率即被彻底锁死在该上限之内。',
                    keywords: ['arXiv:2610.35868', '能力不对称', '上限', '首阶段召回', '实验观测']
                  }
                ]
              },
              {
                id: 'sec-decisionrag-eval',
                title: 'Single-Pass Logit-Based Tree Search',
                titleZh: '单步前向传播 Logit 分支评估',
                level: 'section',
                summaryZh: '无需自回归生成任何 Token，单步获取各选项的预测得分。',
                contentZh: 'DecisionRAG 将同层所有分支候选拼入提示词，一次前向计算提取输出层各分支标识符的 Logits，利用共享上下文完成横向对比。',
                keywords: ['单步前向', 'Logit', '零Token', '共享上下文', '横向对比'],
                children: [
                  {
                    id: 'pas-logit-forward',
                    title: 'DecisionRAG Latency and Forward Pass Design',
                    titleZh: 'DecisionRAG 低延迟与单步前向计算机制',
                    level: 'passage',
                    summaryZh: '单步前向传播如何在0.7~1.8秒内完成多层级检索。',
                    contentZh: '相比于传统基于 Agent 的自回归生成搜索（需逐字生成几百个 token，单次查询耗时10秒以上），DecisionRAG 在每个层级仅需执行一次标准模型前向传播即可读取分支得分，整体端到端延迟仅为 0.7~1.8 秒。',
                    keywords: ['0.7秒', '低延迟', '单步前向', 'Token生成', '自回归耗时']
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ibm-cloud',
    nameZh: 'IBM Cloud 企业级云技术文档库 (MTRAG Benchmark)',
    descZh: '真实企业云原生场景：包含 Kubernetes 集群配置、安全证书轮换与存储桶权限。',
    rootNodes: [
      {
        id: 'ibm-containers',
        title: 'Containers and Red Hat OpenShift',
        titleZh: '容器平台与 OpenShift 集群运维',
        level: 'domain',
        summaryZh: '管理托管式 Kubernetes (IKS) 与 Red Hat OpenShift 企业集群。',
        contentZh: '涵盖高可用控制平面、Ingress 负载均衡与 In-Cluster 安全凭证。',
        keywords: ['Kubernetes', 'IKS', 'OpenShift', '证书', 'SSL', '密钥', '容器', '集群'],
        children: [
          {
            id: 'doc-iks-security',
            title: 'Cluster Certificate and Ingress Management',
            titleZh: 'IKS 集群证书轮换与 Ingress 控制器配置',
            level: 'document',
            summaryZh: '管理 Let\'s Encrypt 证书自动续订与集群主控节点证书重置流程。',
            contentZh: '详细排查 Ingress 子域证书过期及一键证书刷新命令。',
            keywords: ['证书过期', 'SSL', 'Ingress', '轮换', '刷新', 'CLI'],
            children: [
              {
                id: 'sec-cert-renew',
                title: 'Renewing Expired Ingress Subdomain Secrets',
                titleZh: '更新已过期的 Ingress 子域 TLS Secret',
                level: 'section',
                summaryZh: '操作指导：使用 ibmcloud ks CLI 重新同步集群 TLS 证书密钥。',
                contentZh: '当 Ingress 控制器报 SSL 证书失效时，需通过 CLI 触发 Secrets Manager 同步。',
                keywords: ['ibmcloud ks', 'ingress', 'secret', 'TLS', '更新', '过期'],
                children: [
                  {
                    id: 'pas-cert-cmd',
                    title: 'Command Line: ibmcloud ks ingress secret refresh',
                    titleZh: '证书刷新专属命令与生效状态检查',
                    level: 'passage',
                    summaryZh: '使用命令行刷新 Ingress TLS 密钥的权威操作步骤。',
                    contentZh: '运行命令 `ibmcloud ks ingress secret refresh --cluster <cluster_name_or_ID> --secret <secret_name>`。该命令将迫使集群向证书颁发机构申请新签名，并在 5 分钟内完成所有 Envoy 代理的热更新，无需重启 Pod。',
                    keywords: ['ibmcloud ks ingress secret refresh', 'cluster_name', '证书命令', '热更新', 'TLS证书']
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'ibm-storage',
        title: 'Cloud Object Storage (COS)',
        titleZh: 'IBM 云对象存储 (COS) 权限与加密',
        level: 'domain',
        summaryZh: '海量非结构化数据存储、Key Protect 密钥管理与跨区域复制。',
        contentZh: '为企业合规数据提供不可变存储桶及 IAM 细粒度角色控制。',
        keywords: ['COS', '存储桶', 'Bucket', 'Key Protect', '加密', '权限'],
        children: []
      }
    ]
  },
  {
    id: 'multidoc',
    nameZh: '政府与公共服务政策事务库 (MultiDoc2Dial Benchmark)',
    descZh: '复杂民生政策文件：社会保险、老年医疗医保 Part B 申请与驾驶资格。',
    rootNodes: [
      {
        id: 'gov-medicare',
        title: 'Centers for Medicare & Medicaid Services',
        titleZh: '医疗保险体系 (Medicare 申请政策)',
        level: 'domain',
        summaryZh: '美国联邦医疗保险项目：A/B/C/D 部分的资格、保费与登记期。',
        contentZh: '包括65岁及以上老年人和特定残疾人士的医疗福利规程。',
        keywords: ['Medicare', '医保', 'Part B', '申请', '65岁', '保费', '登记期', '罚金'],
        children: [
          {
            id: 'doc-medicare-b',
            title: 'Medicare Part B Enrollment Rules',
            titleZh: 'Medicare Part B (门诊与医生服务) 登记政策',
            level: 'document',
            summaryZh: '详细列出初始登记期(IEP)、特殊登记期(SEP)以及晚登记延迟罚金计算。',
            contentZh: '解释满 65 岁前后 7 个月的法定窗口期以及若延误登记需终身承担的保费上浮。',
            keywords: ['Part B', '初始登记期', 'IEP', '延迟罚金', '7个月', '保费上浮'],
            children: [
              {
                id: 'sec-late-penalty',
                title: 'Part B Late Enrollment Penalty Calculations',
                titleZh: 'Part B 延迟登记终身附加罚金计算标准',
                level: 'section',
                summaryZh: '针对逾期未参加 Part B 者的惩罚性百分比计算公式。',
                contentZh: '若在符合资格时没有登记且无免责雇主医保，每延误整整12个月，月度保费将永久上涨 10%。',
                keywords: ['延迟罚金', '10%', '12个月', '终身罚款', '额外费用'],
                children: [
                  {
                    id: 'pas-penalty-calc',
                    title: 'Exact Late Penalty Formula: 10% per 12-month delay',
                    titleZh: 'Part B 罚金终身附加规则具体条款',
                    level: 'passage',
                    summaryZh: '联邦法规规定延期12个月增加10%基础保费，终身有效。',
                    contentZh: '根据联邦医疗保险法规，对于每一个完整的12个月延误期（期间本应享有资格但未参保且无工作雇主保险），投保人的每月 Part B 标准保费必须终身增加 10%。例如延迟3年参保者，此后每月必须多支付 30% 的附加罚金。',
                    keywords: ['10%', '12个月', '终身增加', '延迟3年', '附加罚金', '标准保费']
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];

export const PRESET_QUERIES: PredefinedQuery[] = [
  {
    id: 'q-graphene-year',
    category: '维基百科科学',
    query: '石墨烯是哪一年获得诺贝尔物理学奖的？获奖原因是什么？',
    expectedTargetId: 'pas-graphene-nobel-year',
    expectedPath: '物理学与材料前沿 > 石墨烯与二维晶体材料 > 分离发现历程与诺贝尔物理学奖 > 2010年诺贝尔物理学奖颁奖细节与获奖理由',
    difficulty: '入门 (Easy)',
    explanation: '决策模型从物理域识别到石墨烯材料，再锁定发现历程，最终精准降落至2010年诺贝尔奖颁奖段落。'
  },
  {
    id: 'q-ibm-cert-cmd',
    category: 'IBM Cloud 技术文档',
    query: '在 IBM Cloud Kubernetes 集群中，如何使用命令行刷新已过期的 Ingress TLS 证书？',
    expectedTargetId: 'pas-cert-cmd',
    expectedPath: '容器平台与 OpenShift 集群运维 > IKS 集群证书轮换与 Ingress 控制器配置 > 更新已过期的 Ingress 子域 TLS Secret > 证书刷新专属命令与生效状态检查',
    difficulty: '标准 (Medium)',
    explanation: '精准区分存储服务与容器服务，在安全证书章节中找到专属刷新 CLI 命令：`ibmcloud ks ingress secret refresh`。'
  },
  {
    id: 'q-medicare-penalty',
    category: '公共政策 MultiDoc2Dial',
    query: '若推迟办理 Medicare Part B，延迟登记罚金是如何按年限终身计算的？',
    expectedTargetId: 'pas-penalty-calc',
    expectedPath: '医疗保险体系 > Medicare Part B 登记政策 > Part B 延迟登记终身附加罚金计算标准 > Part B 罚金终身附加规则具体条款',
    difficulty: '复杂交叉 (Hard)',
    explanation: '直接穿透复杂的联邦医保条款目录，精确定位“每延迟12个月终身加收10%保费”的核心量化条款。'
  },
  {
    id: 'q-decisionrag-latency',
    category: '论文核心机制',
    query: '为什么 DecisionRAG 的单步前向传播（Zero-Token）可以将检索延迟压缩在 0.7~1.8 秒？',
    expectedTargetId: 'pas-logit-forward',
    expectedPath: '计算机科学与人工智能理论 > 检索增强生成(RAG)演进与决策模型 > 单步前向传播 Logit 分支评估 > DecisionRAG 低延迟与单步前向计算机制',
    difficulty: '标准 (Medium)',
    explanation: '测试 DecisionRAG 自反思理解自身的架构设计：零自回归 Token 生成与单次 Forward Pass 的速度优势。'
  }
];
