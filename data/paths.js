const PATHS = {
  /* --- 计算机 / AI / 数据 --- */
  ml:      {name:'机器学习（传统/经典）', field:'计算机/AI/数据', summary:'回归、分类、聚类、SVM、决策树等。补这些数学。',
    steps:[
      {id:'linalg', depth:'核心中的核心。矩阵运算、特征值、SVD要非常熟练。'},
      {id:'prob', depth:'分布、贝叶斯、期望方差——建模的语言。'},
      {id:'stats', depth:'极大似然、假设检验、偏差方差。'},
      {id:'calculus1', depth:'梯度、偏导用于优化。'},
      {id:'opt', depth:'梯度下降、凸优化。模型训练的引擎。'},
      {id:'infotheory', depth:'交叉熵损失、决策树的信息增益。'},
    ]},

  dl:      {name:'深度学习 / 神经网络', field:'计算机/AI/数据', summary:'CNN/RNN/Transformer。在机器学习基础上额外强调：',
    steps:[
      {id:'linalg', depth:'张量运算、矩阵求导——每天都在用。'},
      {id:'calculus1', depth:'链式法则=反向传播。必须扎实。'},
      {id:'calculus2', depth:'高维梯度。'},
      {id:'opt', depth:'SGD、Adam 等优化器原理。'},
      {id:'prob', depth:'概率输出、采样。'},
      {id:'linalg_adv', depth:'初始化、正交化、谱归一化用到。'},
    ]},

  rl:      {name:'强化学习', field:'计算机/AI/数据', summary:'AlphaGo、机器人、决策AI。核心是：',
    steps:[
      {id:'prob', depth:'期望、马尔可夫性。'},
      {id:'stochastic', depth:'马尔可夫决策过程（MDP）是RL的形式化基础。'},
      {id:'linalg', depth:'值函数、贝尔曼方程的矩阵形式。'},
      {id:'opt', depth:'策略梯度。'},
      {id:'calculus1', depth:'梯度估计。'},
    ]},

  datasci: {name:'数据科学 / 数据分析', field:'计算机/AI/数据', summary:'SQL、统计、可视化、业务洞察。侧重：',
    steps:[
      {id:'stats', depth:'描述统计、推断、假设检验——日常工具。'},
      {id:'prob', depth:'分布、抽样。'},
      {id:'linalg', depth:'PCA、回归的矩阵形式。'},
      {id:'settheory', depth:'关系数据库、SQL 的基础。'},
      {id:'infotheory', depth:'特征选择、互信息。'},
    ]},

  graphics:{name:'计算机图形学 / 游戏', field:'计算机/AI/数据', summary:'3D 渲染、物理引擎。重点：',
    steps:[
      {id:'linalg', depth:'矩阵=变换。旋转、投影、视角全靠它。'},
      {id:'geom_basic', depth:'空间几何直觉。'},
      {id:'anageom', depth:'二次曲面、曲线。'},
      {id:'calculus2', depth:'光照、物理模拟。'},
      {id:'vector', depth:'点积叉积的几何意义。'},
    ]},

  cv:      {name:'计算机视觉', field:'计算机/AI/数据', summary:'图像识别、检测。本质上是DL+几何+：',
    steps:[
      {id:'linalg', depth:'图像=矩阵、卷积=滤波。绝对核心。'},
      {id:'calculus1', depth:'梯度、边缘检测、反向传播。'},
      {id:'calculus2', depth:'高维梯度、多尺度。'},
      {id:'prob', depth:'检测的概率模型、贝叶斯推断。'},
      {id:'opt', depth:'训练视觉模型的优化器。'},
      {id:'linalg_adv', depth:'注意力/归一化中的谱方法。'},
    ]},

  nlp:     {name:'自然语言处理', field:'计算机/AI/数据', summary:'大模型、文本处理。今天的NLP=深度学习+：',
    steps:[
      {id:'linalg', depth:'注意力机制=矩阵运算，词向量。绝对核心。'},
      {id:'calculus1', depth:'链式法则=反向传播。'},
      {id:'prob', depth:'语言模型=条件概率分布。'},
      {id:'infotheory', depth:'交叉熵损失、困惑度。'},
      {id:'opt', depth:'大模型预训练的优化器。'},
      {id:'combo', depth:'分词、n-gram 计数。'},
    ]},

  /* --- 物理与工程 --- */
  classmech:{name:'经典力学', field:'物理与工程', summary:'牛顿、拉格朗日、哈密顿力学。',
    steps:[
      {id:'calculus1', depth:'速度加速度是导数。'},
      {id:'calculus2', depth:'多自由度系统。'},
      {id:'ode', depth:'运动方程=微分方程。核心。'},
      {id:'vector', depth:'力、动量是向量。'},
      {id:'linalg', depth:'刚体转动→矩阵。'},
      {id:'opt', depth:'最小作用量原理。'},
    ]},

  quantum: {name:'量子力学', field:'物理与工程', summary:'量子计算、量子化学的共同基础。数学要求高：',
    steps:[
      {id:'linalg', depth:'绝对核心：态=向量，可观测量=厄米算子，测量=投影。复数向量空间。'},
      {id:'calculus2', depth:'波函数是多元复函数。'},
      {id:'ode', depth:'薛定谔方程。'},
      {id:'pde', depth:'势场中的薛定谔方程。'},
      {id:'complex', depth:'复波函数。'},
      {id:'funchanalysis', depth:'严格框架：Hilbert 空间。'},
      {id:'abstractalg', depth:'对称性与守恒律（群论）。'},
      {id:'grouptheory', depth:'对称性与守恒律的数学语言。'},{id:'operator_theory', depth:'量子力学的数学框架：可观测量=自伴算子。'},
    ]},

  relativity:{name:'相对论（广义）', field:'物理与工程', summary:'引力、宇宙学。几何味很重：',
    steps:[
      {id:'diffgeom', depth:'绝对核心：时空=弯曲的黎曼流形，度规张量，曲率。'},
      {id:'calculus2', depth:'张量分析。'},
      {id:'linalg', depth:'张量代数。'},
      {id:'pde', depth:'爱因斯坦场方程。'},
    ]},

  statphys:{name:'统计物理 / 热力学', field:'物理与工程', summary:'大量粒子的统计行为。',
    steps:[
      {id:'prob', depth:'核心：系综、配分函数。'},
      {id:'stats', depth:'统计推断。'},
      {id:'stochastic', depth:'涨落、布朗运动。'},
      {id:'calculus2', depth:'配分函数的积分。'},
      {id:'infotheory', depth:'熵的物理意义。'},
    ]},

  signal:  {name:'信号处理 / 通信', field:'物理与工程', summary:'滤波、压缩、调制、5G。频域的天下：',
    steps:[
      {id:'fourier', depth:'绝对核心。傅里叶变换是整个领域的语言。'},
      {id:'complex', depth:'拉普拉斯变换、Z变换基于复分析。'},
      {id:'calculus2', depth:'连续信号。'},
      {id:'linalg', depth:'离散信号=向量、滤波器。'},
      {id:'prob', depth:'噪声、检测。'},
      {id:'infotheory', depth:'香农定理、编码。'},
    ]},

  control: {name:'控制论 / 自动化', field:'物理与工程', summary:'无人机、机器人、工业控制。',
    steps:[
      {id:'ode', depth:'系统建模=微分方程。'},
      {id:'linalg', depth:'状态空间表示。'},
      {id:'complex', depth:'稳定性判据（奈奎斯特、根轨迹）。'},
      {id:'calculus2', depth:'拉氏变换求解。'},
      {id:'opt', depth:'最优控制（LQR）。'},
      {id:'prob', depth:'卡尔曼滤波。'},
    ]},

  circuit: {name:'电路 / 电子工程', field:'物理与工程', summary:'模拟电路、电路分析。',
    steps:[
      {id:'ode', depth:'RLC 电路的暂态。'},
      {id:'complex', depth:'交流电路相量分析。'},
      {id:'linalg', depth:'节点/网孔分析。'},
      {id:'fourier', depth:'频域分析。'},
    ]},

  /* --- 密码学与安全 --- */
  crypto_classic:{name:'古典密码 / 对称密码', field:'密码学与安全', summary:'凯撒、AES、DES、流密码。',
    steps:[
      {id:'numtheory', depth:'模运算、同余基础。'},
      {id:'combo', depth:'密钥空间、攻击复杂度。'},
      {id:'infotheory', depth:'完美保密（一次性密码本）、熵。'},
      {id:'logic', depth:'布尔函数、S盒。'},
    ]},

  crypto_pubkey:{name:'公钥密码（RSA / ECC）', field:'密码学与安全', summary:'非对称加密、数字签名、密钥交换。',
    steps:[
      {id:'numtheory', depth:'绝对核心：欧拉定理、模逆、中国剩余定理、离散对数。'},
      {id:'abstractalg', depth:'有限域（伽罗瓦域），ECC 建立在椭圆曲线群上。'},
      {id:'grouptheory', depth:'椭圆曲线群、离散对数问题的群结构。'},{id:'fieldtheory', depth:'有限域（伽罗瓦域）是RSA和ECC的数学基础。'},
      {id:'poly', depth:'有限域上的多项式运算。'},
      {id:'combo', depth:'攻击复杂度估计。'},
      {id:'algtgeom', depth:'椭圆曲线方程形式（ECC 进阶）。'},
    ]},

  crypto_zkp:{name:'零知识证明', field:'密码学与安全', summary:'zk-SNARK / zk-STARK，区块链核心。',
    steps:[
      {id:'numtheory', depth:'离散对数假设。'},
      {id:'abstractalg', depth:'双线性配对、椭圆曲线。'},
      {id:'logic', depth:'把计算转为电路/多项式。'},
      {id:'infotheory', depth:'零知识性的信息论含义。'},
      {id:'combo', depth:'多项式承诺。'},
    ]},

  crypto_pq:{name:'后量子密码', field:'密码学与安全', summary:'抗量子计算机的密码（格密码等）。',
    steps:[
      {id:'linalg', depth:'格（lattice）=高维向量结构。核心。'},
      {id:'abstractalg', depth:'理想格、环结构。'},
      {id:'ringtheory', depth:'格密码/NTRU基于多项式环的结构。'},
      {id:'numtheory', depth:'模运算、NTRU。'},
      {id:'combo', depth:'最短向量问题复杂度。'},
    ]},

  hash:    {name:'哈希函数 / 消息认证', field:'密码学与安全', summary:'SHA、HMAC、Merkle 树。',
    steps:[
      {id:'combo', depth:'碰撞阻力、生日攻击。'},
      {id:'logic', depth:'布尔函数构造。'},
      {id:'infotheory', depth:'熵、随机性。'},
    ]},

  /* --- 理论计算机科学 --- */
  complexity:{name:'计算复杂性理论', field:'理论计算机科学', summary:'P vs NP、NP完全、各类复杂性类。',
    steps:[
      {id:'logic', depth:'图灵机、可判定性。'},
      {id:'combo', depth:'归约、计数。'},
      {id:'graph', depth:'很多 NP 完全问题在图上。'},
      {id:'infotheory', depth:'通信复杂性。'},
      {id:'numtheory', depth:'数论构造的密码假设。'},
    ]},

  computable:{name:'可计算性理论', field:'理论计算机科学', summary:'图灵机、停机问题、不可判定性。',
    steps:[
      {id:'logic', depth:'核心：可计算函数、对角线论证。'},
      {id:'settheory', depth:'可数/不可数、基数。'},
    ]},

  algo:    {name:'算法设计与分析', field:'理论计算机科学', summary:'排序、图算法、动态规划、近似算法。',
    steps:[
      {id:'combo', depth:'复杂度计数、生成函数。'},
      {id:'graph', depth:'图算法是半壁江山。'},
      {id:'prob', depth:'随机算法、概率分析。'},
      {id:'numtheory', depth:'数论算法（RSA的快速幂等）。'},
      {id:'opt', depth:'近似算法、贪心。'},
    ]},

  formal:  {name:'形式化方法 / 程序验证', field:'理论计算机科学', summary:'Coq、Isabelle、模型检测。',
    steps:[
      {id:'logic', depth:'核心：时序逻辑、霍尔逻辑、构造演算。'},
      {id:'settheory', depth:'形式语义。'},
      {id:'cattheory', depth:'Coq 的类型论背景。'},
      {id:'graph', depth:'模型检测的状态空间。'},
    ]},

  qcomp:   {name:'量子计算', field:'理论计算机科学', summary:'量子算法、量子纠错。',
    steps:[
      {id:'linalg', depth:'绝对核心：量子态=复向量，量子门=酉矩阵，张量积。'},
      {id:'complex', depth:'复振幅、相位。'},
      {id:'prob', depth:'测量=概率。'},
      {id:'numtheory', depth:'Shor 算法分解整数。'},
      {id:'infotheory', depth:'量子信息、纠错码。'},
      {id:'abstractalg', depth:'李群（量子门集合的对称性）。'},
    ]},

  typetheory:{name:'类型论 / 函数式编程理论', field:'理论计算机科学', summary:'Lambda 演算、依值类型、证明助手。',
    steps:[
      {id:'logic', depth:'柯里-霍华德对应：命题=类型，证明=程序。'},
      {id:'cattheory', depth:'函子、单子（Haskell）。'},
      {id:'settheory', depth:'类型语义。'},
    ]},

  /* --- 补全 leads 占位符对应的目标路径（原为悬空引用，现补为正式路径） --- */
  code:    {name:'编码理论 / 信息编码', field:'理论计算机科学', summary:'信道编码、数据压缩、检错纠错。通信与存储的数学根基。',
    steps:[
      {id:'infotheory', depth:'绝对核心：熵、互信息、信道容量。'},
      {id:'abstractalg', depth:'有限域上的编码（线性码、循环码）。'},
      {id:'combo', depth:'码字计数、组合设计。'},
      {id:'prob', depth:'噪声信道下的差错概率。'},
    ]},

  quant:   {name:'量化金融', field:'物理与工程', summary:'期权定价、风险管理、量化交易。用随机分析把不确定性定价。',
    steps:[
      {id:'stochastic', depth:'核心：布朗运动、随机微分方程。'},
      {id:'dynamical', depth:'非线性动力学在金融市场建模中的应用。'},
      {id:'prob', depth:'风险中性测度、鞅。'},
      {id:'pde', depth:'Black-Scholes 方程。'},
      {id:'stats', depth:'波动率估计、回归。'},
    ]},

  analytic_nt:{name:'解析数论', field:'密码学与安全', summary:'用分析方法研究素数分布（黎曼猜想、素数定理）。纯数论的现代前沿。',
    steps:[
      {id:'numtheory', depth:'基础：素数、同余、欧拉定理。'},
      {id:'complex', depth:'核心工具：黎曼 zeta 函数、复积分。'},
      {id:'stats', depth:'素数分布的统计性质。'},
    ]},
};
