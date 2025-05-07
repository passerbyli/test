### 🧱 元素清单（分组按边界）

#### 🌐 Internet（不可信区）

- `User`（External Interactor）
- `Third Party API Service`（Data Store，外部API市场）

#### 🛡️ DMZ（半可信区）

- `Authentication Service`（Process）
- `API Gateway`（Process）

#### 🔐 Internal (可信区)

- `Microservices`（Process）
- `Data Warehouse A (ODS)`（Data Store）
- `Data Warehouse B (DWD)`（Data Store）
- `Data Warehouse C (ADS)`（Data Store）
- `Redis Cluster`（Data Store）
- `Config Center`（Data Store）
- `Consul Service Discovery`（Process）
- `SOA Authentication Service`（Process）

### 🔄 数据流清单（含是否跨边界、加密、认证）

| 来源 ➔ 目标                                | 描述               | 是否跨边界 | 加密     | 认证 |
| ------------------------------------------ | ------------------ | ---------- | -------- | ---- |
| User ➔ Authentication Service              | 登录请求           | ✅         | ✅ HTTPS | ❌   |
| Authentication Service ➔ User              | 返回 Token         | ✅         | ✅       | ❌   |
| User ➔ API Gateway                         | 携带 Token 请求    | ✅         | ✅       | ✅   |
| API Gateway ➔ Microservices                | 网关转发业务请求   | ✅         | ✅       | ✅   |
| Microservices ➔ Data Warehouse A           | 查询 ODS 数据      | ❌         | ✅       | ✅   |
| Microservices ➔ Data Warehouse B           | 查询 DWD 数据      | ❌         | ✅       | ✅   |
| Microservices ➔ Data Warehouse C           | 查询 ADS 数据      | ❌         | ✅       | ✅   |
| Microservices ➔ Redis Cluster              | 查询缓存           | ❌         | ✅       | ✅   |
| Microservices ➔ Config Center              | 获取配置项         | ❌         | ✅       | ✅   |
| Microservices ↔ Consul Service Discovery  | 服务注册/发现      | ❌         | ✅       | ✅   |
| Microservices ➔ SOA Authentication Service | 获取访问 API Token | ❌         | ✅       | ✅   |
| Microservices ➔ Third Party API Service    | 外部 API 查询数据  | ✅         | ✅       | ✅   |

### 🗺️ DFD结构布局图（Markdown草图）

+------------------------------+
| 🌐 Internet (不可信区) |
| |
| [User] |
| ┌──────────────┐
| │Third Party │
| │API Service │
| └──────────────┘
+------------------------------+
↓
+------------------------------+
| 🛡️ DMZ（半可信区） |
| |
| ┌────────────────────┐ |
| │ Authentication │ |
| │ Service │ |
| └────────────────────┘ |
| ↓ |
| ┌────────────────────┐ |
| │ API Gateway │ |
| └────────────────────┘ |
+------------------------------+
↓
+------------------------------+
| 🔐 Internal Trusted Zone |
| |
| ┌────────────────────┐ |
| │ Microservices │ |
| └────────────────────┘ |
| ↓ ↓ ↓ ↓ |
| ┌────┐ ┌────┐ ┌────┐ ┌────┐ |
| │DW-A│ │DW-B│ │DW-C│ │Redis│ |
| └────┘ └────┘ └────┘ └────┘ |
| ↓ ↓ ↓ |
| [Config] [Consul] [SOA Auth]|
+------------------------------+

# STRIDE+P-per-Element 威胁建模表

适配：数据分析系统  
架构包括：认证系统、API网关、微服务、数据仓库、Redis、配置中心、Consul、外部API数据源

---

## 🌐 External Interactor

| 元素名称 | STRIDE/P威胁            | 威胁说明                             |
| -------- | ----------------------- | ------------------------------------ |
| User     | **S** Spoofing          | 攻击者伪造身份冒充合法用户           |
|          | **R** Repudiation       | 用户否认其查询、下载等行为           |
|          | **P** Privacy Violation | 用户数据被用于未授权目的，如行为画像 |

---

## ⚙️ Process

| 元素名称                   | STRIDE/P威胁                 | 威胁说明                       |
| -------------------------- | ---------------------------- | ------------------------------ |
| Authentication Service     | **S** Spoofing               | 弱认证逻辑被绕过               |
|                            | **T** Tampering              | 登录参数被篡改                 |
|                            | **R** Repudiation            | 缺乏登录审计日志               |
|                            | **I** Info Disclosure        | 返回包含邮箱、手机号等         |
|                            | **D** Denial of Service      | 登录接口被爆破瘫痪             |
|                            | **E** Elevation of Privilege | 提权为管理员                   |
|                            | **P** Privacy Violation      | 返回Token中泄露隐私字段        |
| API Gateway                | **T** Tampering              | 请求参数被篡改绕过鉴权         |
|                            | **R** Repudiation            | 网关日志缺失或篡改             |
|                            | **I** Info Disclosure        | 错误堆栈泄露内部逻辑           |
|                            | **D** Denial of Service      | 构造流量耗尽连接池             |
|                            | **E** Elevation of Privilege | 角色识别错误导致越权访问       |
|                            | **P** Privacy Violation      | 报文转发泄露身份证等敏感字段   |
| Microservices              | **T** Tampering              | 内部参数注入，数据误写         |
|                            | **R** Repudiation            | 接口请求无记录                 |
|                            | **I** Info Disclosure        | 查询接口泄露隐私字段           |
|                            | **D** Denial of Service      | 构造复杂条件查询耗尽内存       |
|                            | **E** Elevation of Privilege | 越权查询其他租户数据           |
|                            | **P** Privacy Violation      | 用户未授权信息被统计或导出     |
| SOA Authentication Service | **T** Tampering              | SOA Token 被伪造或替换         |
|                            | **R** Repudiation            | 无Token请求审计记录            |
|                            | **I** Info Disclosure        | 响应中泄露系统内部认证策略     |
|                            | **D** Denial of Service      | 频繁请求导致Token发不出来      |
|                            | **E** Elevation of Privilege | SOA Token越权访问              |
|                            | **P** Privacy Violation      | 将访问日志暴露给非授权部门     |
| Consul Service Discovery   | **T** Tampering              | 注册中心被注册恶意节点         |
|                            | **R** Repudiation            | 服务注册/下线无审计            |
|                            | **I** Info Disclosure        | 查询暴露所有服务端口/IP        |
|                            | **D** Denial of Service      | Consul心跳量暴涨拒绝新服务注册 |
|                            | **E** Elevation of Privilege | 注册为核心服务欺骗调用方       |
|                            | **P** Privacy Violation      | 注册信息中暴露公司内部结构信息 |

---

## 💾 Data Store

| 元素名称                | STRIDE/P威胁            | 威胁说明                         |
| ----------------------- | ----------------------- | -------------------------------- |
| Data Warehouse A/B/C    | **T** Tampering         | 数据被直接更新为错误值           |
|                         | **R** Repudiation       | 修改无版本记录                   |
|                         | **I** Info Disclosure   | 查询中返回敏感列如身份证、收入   |
|                         | **D** Denial of Service | 大范围Full Scan造成DB崩溃        |
|                         | **P** Privacy Violation | 未经脱敏即暴露报表/导出API       |
| Redis Cluster           | **T** Tampering         | 写入伪造缓存内容                 |
|                         | **R** Repudiation       | 改动缓存值无法回溯               |
|                         | **I** Info Disclosure   | 缓存中保留用户手机号明文         |
|                         | **D** Denial of Service | 热点Key被暴击导致线程阻塞        |
|                         | **P** Privacy Violation | Redis调试接口暴露隐私字段值      |
| Config Center           | **T** Tampering         | 配置项被恶意修改为错误值         |
|                         | **R** Repudiation       | 配置发布缺失操作记录             |
|                         | **I** Info Disclosure   | 配置包含Token、DB账号等          |
|                         | **D** Denial of Service | 配置中心宕机引发服务异常         |
|                         | **P** Privacy Violation | 配置中记录用户个人数据或行为标识 |
| Third Party API Service | **T** Tampering         | API返回结果被中间人篡改          |
|                         | **R** Repudiation       | 供应商否认返回问题数据           |
|                         | **I** Info Disclosure   | 返回字段过多包含隐私信息         |
|                         | **D** Denial of Service | API调用被限流或封禁              |
|                         | **P** Privacy Violation | 外部数据未经同意被引入分析流程   |

---

## 🔄 Data Flow

| 数据流          | STRIDE/P威胁            | 威胁说明                       |
| --------------- | ----------------------- | ------------------------------ |
| 任意接口/DB访问 | **T** Tampering         | 参数篡改、SQL注入、Token篡改   |
|                 | **I** Info Disclosure   | 请求或响应未加密被窃听         |
|                 | **D** Denial of Service | 大量恶意调用导致系统挂死       |
|                 | **P** Privacy Violation | 未加脱敏的查询结果通过接口返回 |

---

## ✅ STRIDE+P per Element 映射汇总

| 元素类型            | 适用威胁类型（STRIDE+P） |
| ------------------- | ------------------------ |
| External Interactor | S, R, **P**              |
| Process             | T, R, I, D, E, **P**     |
| Data Store          | T, R, I, D, **P**        |
| Data Flow           | T, I, D, **P**           |

---

# STRIDE+P 缓解建议表

## 🟡 S - Spoofing（身份伪造）

| 缓解策略                   | 说明                             |
| -------------------------- | -------------------------------- |
| 强身份认证机制             | 使用OAuth2、JWT、双因子认证等    |
| Token签名和生命周期限制    | 加密签名防伪造，设置短时效防重放 |
| IP绑定 / 设备指纹          | 限制Token只能在特定设备/IP上使用 |
| 身份认证服务和业务系统解耦 | 认证模块独立部署并集中审计       |

---

## 🔵 T - Tampering（数据篡改）

| 缓解策略                      | 说明                         |
| ----------------------------- | ---------------------------- |
| 参数校验 / 数据校验和（Hash） | 所有接口参数需验证完整性     |
| 只读查询接口限制写权限        | 对外暴露接口应只读、无状态   |
| 使用HTTPS / TLS加密传输       | 防止中间人篡改               |
| 数据库存储审计                | 所有数据写入操作需要审计记录 |

---

## 🟣 R - Repudiation（抵赖）

| 缓解策略                         | 说明                            |
| -------------------------------- | ------------------------------- |
| 操作审计日志（含用户ID/IP/时间） | 所有用户和系统操作留痕          |
| 日志防篡改 / 合规加密存储        | 使用日志服务/加密传输写入       |
| 访问请求/响应完整记录            | 对接口、导出等行为记录上下文    |
| 日志留存周期合理配置             | 满足监管合规要求（如6个月/1年） |

---

## 🔴 I - Information Disclosure（信息泄露）

| 缓解策略                | 说明                           |
| ----------------------- | ------------------------------ |
| 敏感字段脱敏 / 掩码处理 | 手机号、身份证等按策略模糊处理 |
| 最小权限访问原则        | 用户只能看到授权范围内数据     |
| 数据输出白名单机制      | 限定返回字段，防止过度暴露     |
| HTTPS加密所有传输       | 防止网络层数据被抓包           |

---

## 🟠 D - Denial of Service（拒绝服务）

| 缓解策略                  | 说明                                |
| ------------------------- | ----------------------------------- |
| 接口限频（IP/用户/Token） | 使用令牌桶、滑动窗口等限流算法      |
| 数据库查询行数/时间限制   | 设置超时时间和最大结果集            |
| 防刷机制 / CAPTCHA        | 登录、查询等入口加防刷识别          |
| 服务熔断/降级             | 使用断路器（如Hystrix）避免服务雪崩 |

---

## 🟢 E - Elevation of Privilege（权限提升）

| 缓解策略          | 说明                                   |
| ----------------- | -------------------------------------- |
| RBAC/ABAC权限模型 | 基于角色/属性动态授权控制接口访问      |
| 多租户数据隔离    | 查询时自动注入租户条件（如tenant_id）  |
| 分级接口认证      | 管理员接口必须额外认证或双认证         |
| 权限边界测试      | 定期进行越权访问安全测试（如接口跳转） |

---

## ⚪ P - Privacy Violation（隐私违规）

| 缓解策略                      | 说明                                   |
| ----------------------------- | -------------------------------------- |
| 明确数据使用目的并最小化采集  | 只采集使用所需字段，记录采集目的       |
| 建立敏感字段列表并分类分级    | 如手机号、身份证、邮箱、IP、行为标签等 |
| 对外接口合规检查              | 禁止返回未授权或脱敏处理不足的隐私字段 |
| 数据出境、数据共享评估机制    | 所有跨组织/云的行为必须评审合法性      |
| 合规审计机制（GDPR/等保/ISO） | 定期开展数据隐私审计与内部自查         |
| 用户数据访问日志              | 用户查看/导出/删除数据全量记录         |

---

# STRIDE+P 威胁分析矩阵（Markdown 格式）

## 元素：Authentication Service（Process）

| 威胁类型                 | 风险来源                     | 已有措施           | 威胁前提条件         | 可行建议                      | 风险等级 |
| ------------------------ | ---------------------------- | ------------------ | -------------------- | ----------------------------- | -------- |
| S - Spoofing             | 弱密码、认证绕过、Token伪造  | JWT签名校验        | 输入无校验或弱算法   | 启用MFA，缩短Token生命周期    | 高       |
| T - Tampering            | 登录参数被中途修改           | 使用HTTPS传输      | 存在中间人或无加密   | 强制HTTPS，Token加签验签      | 高       |
| R - Repudiation          | 用户否认登录行为             | 登录日志记录       | 日志字段不足         | 增加IP、UA、Token字段并防篡改 | 中       |
| I - Info Disclosure      | 错误响应包含用户名、调试信息 | 返回字段统一处理   | 未拦截异常堆栈       | 使用全局异常拦截器            | 中       |
| D - DoS                  | 爆破登录接口                 | 登录限流、锁定策略 | 验证码或速率限制缺失 | 增加验证码、频控机制          | 高       |
| E - Privilege Escalation | Token冒用权限绕过            | Token含角色信息    | 权限未强绑定         | Token权限字段与行为强绑定     | 高       |
| P - Privacy Violation    | Token结构中含敏感字段        | Token仅含user_id   | 字段含义未标准化     | 明确定义Token结构与脱敏字段   | 中       |

---

## 元素：API Gateway（Process）

| 威胁类型                 | 风险来源                   | 已有措施         | 威胁前提条件          | 可行建议                       | 风险等级 |
| ------------------------ | -------------------------- | ---------------- | --------------------- | ------------------------------ | -------- |
| T - Tampering            | 请求参数篡改绕过验证       | HTTPS开启        | 参数信任前端或内部    | 增加参数验签或统一校验逻辑     | 高       |
| R - Repudiation          | 请求无来源追踪             | 网关日志接入     | 缺乏Token/TraceId传递 | 引入TraceId/UserId统一日志结构 | 中       |
| I - Info Disclosure      | 异常返回含内部堆栈         | 默认异常输出     | 未统一异常处理        | 设置通用异常返回格式           | 中       |
| D - DoS                  | 单用户请求耗尽资源         | IP限流已启       | 缺乏细粒度控制        | 引入基于接口/Token限流         | 高       |
| E - Privilege Escalation | 权限未校验接口放行         | RBAC部分接口覆盖 | 配置缺失或遗漏        | 建立接口权限白名单机制         | 高       |
| P - Privacy Violation    | 请求体或日志中包含敏感字段 | 已有部分字段脱敏 | 无日志脱敏统一策略    | 接入日志脱敏中间件             | 高       |

---

### 元素：Microservices（Process）

| 威胁类型                   | 风险来源                               | 已有措施           | 威胁前提条件                 | 可行建议                                        | 风险等级 |
| -------------------------- | -------------------------------------- | ------------------ | ---------------------------- | ----------------------------------------------- | -------- |
| T - Tampering              | 接口参数被注入或拼接                   | 使用ORM绑定参数    | 未做字段校验                 | 加入字段白名单校验 + 接口签名校验               | 中       |
| R - Repudiation            | 日志无用户上下文信息                   | 统一日志框架       | 无token透传或traceId记录     | 引入TraceId与Token上下文联动日志                | 中       |
| I - Information Disclosure | 查询接口返回敏感字段（如手机号、卡号） | 部分字段控制       | DTO未隔离内部字段            | DTO白名单输出机制 + 字段标签化                  | 高       |
| D - Denial of Service      | 大分页、大数据查询拖慢服务             | 分页默认限制       | 无最大页数/导出限制          | 限制最大查询量/自动预警大查询                   | 高       |
| E - Privilege Escalation   | 用户访问不应有的数据                   | RBAC 接入部分服务  | 仅靠前端或Header传入权限参数 | 微服务层强制鉴权 + scope/role 二次验证          | 高       |
| **E - 横向越权**           | 普通用户访问他人数据（如 ID=其他人）   | 依赖前端隐藏ID     | 无强制数据所有者校验         | 所有敏感数据操作强制注入 user_id/tenant_id 比对 | 高       |
| **E - 纵向越权**           | 普通用户调用管理接口（如导出全部数据） | 后端未识别角色等级 | 只判断是否登录               | 接口添加权限等级 + 拦截器统一校验               | 高       |
| P - Privacy Violation      | 返回接口中含身份证号、手机号、邮箱等   | 敏感字段部分脱敏   | 命名不一致或无统一策略       | 敏感字段标签机制 + 响应拦截脱敏                 | 高       |

---

## 元素：Data Warehouse A/B/C（Data Store）

| 威胁类型              | 风险来源              | 已有措施         | 威胁前提条件       | 可行建议                     | 风险等级 |
| --------------------- | --------------------- | ---------------- | ------------------ | ---------------------------- | -------- |
| T - Tampering         | 误操作写入错误数据    | 限制只读账号     | 管理员权限误用     | 所有访问使用只读权限         | 中       |
| R - Repudiation       | 数据变更无痕迹        | 有备份           | 缺少字段级审计     | 增加字段变更日志机制         | 中       |
| I - Info Disclosure   | 查询含敏感字段        | RBAC控制部分生效 | 无字段级权限控制   | 字段权限控制 + 输出脱敏      | 高       |
| D - DoS               | 大SQL无索引、全表扫描 | SQL优化部分完成  | 异常SQL未拦截      | 接入慢查询日志分析与报警     | 中       |
| P - Privacy Violation | 整表导出泄露身份证等  | 导出工具支持脱敏 | 字段脱敏规则不统一 | 敏感字段分级 + 标记 + 脱敏器 | 高       |

---

## 元素：Redis / Config Center / Consul

| 元素          | 威胁类型 | 风险来源               | 已有措施     | 威胁前提条件       | 可行建议                  | 风险等级 |
| ------------- | -------- | ---------------------- | ------------ | ------------------ | ------------------------- | -------- |
| Redis         | T        | 热Key或缓存值被污染    | 内部访问控制 | Key结构可伪造      | 添加Key签名或ACL控制      | 中       |
| Redis         | I        | 缓存中含敏感明文       | 部分字段加密 | 直接缓存明文       | 敏感字段缓存加密          | 高       |
| Config Center | T        | 错误配置下发影响服务   | 有版本控制   | 缺审批/灰度流程    | 接入灰度审批 + 改动审计   | 中       |
| Config Center | I        | 配置暴露Token/密钥     | 敏感字段加密 | 开发误上传敏感配置 | 敏感字段强加密存储与分权  | 高       |
| Consul        | T        | 注册伪造服务欺骗调用方 | 启用ACL      | 服务注册未鉴权     | 注册服务前校验 + 证书认证 | 中       |

---

## 元素：SOA Auth Service / Third Party API

| 元素            | 威胁类型 | 风险来源                 | 已有措施        | 威胁前提条件       | 可行建议                        | 风险等级 |
| --------------- | -------- | ------------------------ | --------------- | ------------------ | ------------------------------- | -------- |
| SOA Auth        | T        | Token伪造或滥用          | 签名校验        | 没有来源信息绑定   | 加入Scope、系统ID等字段签名校验 | 中       |
| SOA Auth        | P        | 外部调用滥用内部用户信息 | Token短生命周期 | 无行为授权绑定     | 增加行为授权/用途绑定字段       | 中       |
| Third Party API | I        | 第三方返回数据过多       | 无字段过滤      | 接口透传           | 接入字段白名单机制              | 高       |
| Third Party API | P        | 数据使用超出用户授权     | 未经数据授权    | 数据拉取流程无评估 | 数据接入需审计与合法性证明      | 高       |

---

## 数据流分析示例（核心链路）

| 数据流           | 威胁类型 | 风险来源           | 已有措施       | 威胁前提条件              | 可行建议                         | 风险等级 |
| ---------------- | -------- | ------------------ | -------------- | ------------------------- | -------------------------------- | -------- |
| 用户 ➜ Auth      | S        | 用户伪造或撞库     | 弱密码保护     | 弱密码 + 验证码缺失       | 强密码+验证码+IP限流             | 高       |
| Auth ➜ 用户      | I        | Token响应字段过多  | 精简响应结构   | 包含user_name、角色等字段 | 控制响应字段 + 加密Token部分字段 | 中       |
| 用户 ➜ Gateway   | D        | 接口被刷爆         | IP限流部分存在 | Token未限流               | 多维限流策略（Token/IP/接口）    | 高       |
| Gateway ➜ 微服务 | E        | 权限字段未正确透传 | Token透传      | 接口未验证角色            | 网关鉴权+微服务权限重检          | 高       |
| 微服务 ➜ DB/API  | P        | 查询字段未脱敏     | 部分字段脱敏   | 响应结构动态映射          | 字段脱敏规则统一拦截器处理       | 高       |

electron-store
better-sqlite3
lowdb
