# Sublimation for Sublimation —— 用 Sublimation 形式化 Sublimation

用 Sublimation 语言本身，形式化描述 Sublimation 语言自身的语法、类型系统、语义与编译管道，
在**严格限定于有限可构造层**的前提下尽可能多地完成形式化。

## 工程纪律（由用户在语言设计层陈述，本工程执行）
- 不在系统内陈述/证明自身的**一致性**（λ 一致性、Γ 一致性）。
- 不构造指向自身的**可证性谓词**，不做任何系统强度/覆盖度元陈述。
- 证明器自身的设计性质**不作为形式化目标**。
- 只形式化**有限可构造层**：语法域、推导规则、算法步骤、局部元定理（每条证明都是有限推导树）。

## 计划分层
1. 语法层：AST 域 + 结构性质（自由变量、替换、子项封闭性）
2. 静态语义：Γ ⊢ e : τ 规则族 + 可变拷贝 4 规则 + 命题/程序分野（→ vs =>）
3. 动态语义：小步语义规则 + progress/preservation 的有限实例
4. 管道层：模块树/符号收集/注解处理器/13 通道饱和的算法规格
5. 附录：不形式化清单 + 每项的精确理由（哪条纪律挡住了）

## 现状（2026-10-26，第一轮完成，队长已验收：check exit=0「模块检查通过」）

- **ast.subl**：Expr/Ty/Ctx 有限构造域；值层可执行规格（weight/subst/fvOf/cCopy，
  编译到 JS 实跑）；形状谓词（isVarX/natTy/funT/substN 等 16 个）把构造子形状外化为名位原子。
- **statics.subl**：T-Var/Num/Txt/Bol/Lam/App/If 七条定型规则 + 弱化/代换元定理 + ctx 规则；
  →/=> 命题/程序分野三规则；C-COPY 拷贝规则族（①a1/①a2/③/④ 四条 + 值层镜像 cCopy）。
- **dynamics.subl**：值规则 4 条；β/app-left/app-right/if-true/if-false 单步规则；
  steps 自反-传递闭包；progress num / preservation step 局部元定理。
- **pipeline.subl**：阶段序（7 阶段传递）；通道序（13 通道短路语义 + 命中即证）；
  饱和闭包 R-AXIOM/R-INST/R-MP/R-MT + 不动点陈述；注解处理器 4 阶段管线；模块树根可见性。
- **main.subl**：6 个真定理搜索命中（A 组：refl/tertium/析取引入/蕴含自反/自家 ctx-refl
  共 5 条；B 组：channelAcc 命中即证），全部编译可执行。

> 注：本工程的完整 README 由队长于第一轮验收后改写为工程语言版；边界条件的原始表述
> （语言设计层陈述）由用户保留，见语言设计会议纪要。
