# app/limits.md —— 不形式化清单

本工程的边界：哪些东西**形式化了**、哪些**故意没形式化**、每项被什么挡住。
所有条目都是工程事实（编译器行为实测 / 算法上限 / 表达力缺口），不含元数学论证。

## 0. 已形式化的层（executive summary）

| 层 | 文件 | 内容 |
|---|---|---|
| 1 语法域 | ast.subl | Expr/Ty/Ctx 三组有限构造域 + 值层可执行函数（weight/subst/fvOf/cCopy）+ 形状谓词 |
| 2 静态语义 | statics.subl | T-Var/Num/Txt/Bol/Lam/App/If 七规则 + 弱化/代换元定理 + →/=> 分野 + C-COPY 规则族 |
| 3 动态语义 | dynamics.subl | 值规则 4 条 + β/app-left/app-right/if 单步 + steps 自反-传递闭包 + progress/preservation |
| 4 编译管道 | pipeline.subl | 阶段序 / 通道序（13 通道短路）/ 饱和闭包 R 规则 / 处理器管线 / 模块树 |
| 5 集成演示 | main.subl | 6 个真搜索命中 + 完整类型推导链 + β 链 + 管道链 + by 断言 + 值层冒烟 |

机器核对通过：`check .` → 模块检查通过；`compile . -o out.js` → 42041 字节；`node out.js` → 输出与规格一致。

## 1. 边界执行清单（工程事实）

本层只做有限可构造对象：语法域、推导规则、算法步骤、局部元定理。
不涉完备性论证；没有层叠依赖之外的跨层回路——层间关系就是工程分层
（类型层命题 ⟹ 词法层命题这种单向依赖），每条机器核对的都是有限推导树。

## 2. 归纳不机械化（受信元定理 + 机器核对实例）

- 弱化、代换、progress、preservation 写成「前提集 → 结论」的**规则式陈述**：
  机器核对的是每个具体实例（有限推导树），归纳步骤本身受信。
- 例：`preservation step`[g, n, r, t]: (typed(g, n, t) & step(n, r)) → typed(g, r, t)
  ——这是「每步保持」的单步规则；多步保持的归纳链不机械化（main.subl 用分阶段 ∴ 检查点模拟有限步）。
- 代换正确性同理：substN(b, x, v, r) 把「r = b[x:=v]」外化为原子谓词，真值由值层 subst 计算（H 组冒烟对核）。

## 3. 饱和闭包的算法上限

- **maxRounds = 3**（普通模式；Checker.kt:41）：一条 ∴ 一次最多放电 3 步 MP 链。
  实测：R-MP 二跳链（r axiom → r mp → r mp）在一次 ∴ 内证不出。
  **工程对策**：分阶段 ∴ 检查点——每条 ∴ 成功后结论注入 Γ（Checker.kt:661），下一阶段的 MP 以它为前提。
  main.subl 的阶段序链因此是 5 个检查点（phBefore(1,3)→(1,4)→…→(1,7)），不是一条 5 步链。
- **析取事实不分解**：Γ 中的 (P ∨ Q) 事实推不出 P 或 Q（无析取消去通道）→ 演示不依赖析取事实。

## 4. 规则书写约束（实测的编译器行为）

- **angle 参数只代入名位**：传 NameRef 才替换元变量；StrLit/CallExpr 不替换，angle 内留下自由名，
  MP 闭包无法放电。实测：`t var`<CBind(g0,"x",TNat()), "x", TNat>() 注入的事实含自由 g/x/y。
  → 全部规则写成**名位式**（形状外化到 isVarX/isLamX/natTy/funT 等原子谓词），ctor 只出现在
  shape 数据库 axiom 里。
- **定理调用不核对前提**：实测 `rr`<v>() 在前提 p(v) 不在 Γ 时仍通过（无 E-PRE-UNPROVEN）；
  前提核对由 MP 闭包负责（前提须在 Γ 中才放电）。→ 所有前提都以 axiom 供给。
- **CallExpr 不入定理搜索合一**：searchTheorems 的 termUnifies 对 CallExpr 无递归分支、toStr 回退不等
  → 结论带 ctor 构造的定理（如 Var(s1) = Var(s2)）对具体项目标永不命中；这类定理只经调用注入使用。

## 5. 搜索命中的可靠性分层（实测）

- **项级元变量带一致性 env**：refl[a]: a=a、ctx refl[g]、steps refl[n] 对具体项目标命中可靠（A1/A5/A6 用之）。
- **命题元变量无一致性 env**：postUnifies 对「PAtom 空项 + 头部在 vars」的命题元变量直接 true，
  不查重复位置一致性 → `∴ (X ∨ ¬Y)`（X≠Y）会被 core.classic tertiumNonDatur 放过（实测复现）。
  → 本工程所有 ∴/by 目标只取**对称形态**（T ∨ ¬T）或蕴含形态；建议编译器侧给命题元变量加 env。
- 13 通道的前 11 道（常量原子/类型判断/实数/算术/饱和闭包）先于搜索；搜索是最后手段，不滥用。

## 6. t31 五项编译器表达力缺口的落地后果

1. **P-2 容器成员**（x ∈ xs 未实现）：fvOf 的集合语义（去重/成员）不能命题化 → fvOf 只作值层函数，
   不作为定理前提使用。
2. **普通模式命题维实例化**（@P 的 ∀ 不在普通模式供给）：定理的命题维参数不用于演示；
   可关闭系統命题维相关的通道一律未用。
3. **P-3 去重**：形状谓词在 ast（声明）与 statics/dynamics（使用）间手工保持一致，无 def 等价去重。
4. **def 两限**：stdlib def 等价式不展开 + def 体禁量词（E-UNBOUND-NAME）
   → 本工程全部谓词用 **def 原子形态**（不写 def p<a,b> ↔ prop 等价式）。
5. **函数符号不入定理合一**：weight/subst/cCopy 等值层函数在命题层是不可解释符号
   → 计算事实靠 axiom（substN/funT 数据库，值层 oracle 对核）或 by 断言；未来「反射」特性可连通此缺口。

## 7. t30 ByExpr 断言队列语义的实测

- `expr by [prop]`：prop 经 proveOrDeep 核对（不注入 Γ）；失败报 E-CANNOT-PROVE（建议改 axiom）。
- main.subl G 组：`Num(3) by [typed(...)]`（Γ 成员证）与 `Num(1) by [(vapp = vapp)]`（refl 搜索命中）均通过。
- by 断言取受控形态：不用非对称 ∨（见 §5），不用裸原子用户定理后件（前提不查的过度匹配风险，见 §4/§5）。

## 8. 语法域是简化域（非全语言覆盖）

- Expr 7 个构造子（Var/Num/Txt/Bol/Lam/App/If）；真实语言还有模块、注解、类型类、async、模式匹配等。
- Ctx 是链表式（CEmpty/CBind），无命名空间层叠 / 作用域幕。
- subst 为朴素实现（Lam 同名遮蔽），α-等价与捕获避免未形式化（需要绑定深度的归纳，同 §2 的边界）。
- 处理器管线只形式化 4 阶段序（PReg/PScan/PXform/PPost2），无具体的处理器注册表。

## 9. 证明器自身的性质不是目标

证明器的可靠性/完备性元陈述不在本工程目标内（同 §1）；形式化的对象是**对象语言层**
（语法域、规则、算法步骤），不是证明器自身。饱和闭包的终止只作算法级陈述
（monoR + boundR → termR：单调 + 有界 ⟹ 不动点），不作完备性陈述。
