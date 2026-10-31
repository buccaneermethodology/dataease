# DataEase 本地开发与调试环境

> 本文记录最近一次可用的环境盘点，供新需求开发和测试前参考。它不是实时健康探针。启动服务、连接数据库或使用登录账号前，请重新核对相应状态。密码、Token、密钥和连接串不写入本文。

## 环境概览

盘点信息最近更新：2026-10-20。运行状态是本次启动后的检查结果；每次新开发会话仍需重新确认。

| 项目 | 已安装或配置 | 最近一次运行状态 / 证据边界 |
| --- | --- | --- |
| macOS | Apple Silicon（arm64） | 不代表 DataEase 服务正在运行 |
| JDK | Homebrew OpenJDK 21.0.12.1，`/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home`；`~/.zshrc` 已设置 `JAVA_HOME` 和 PATH | 在新启动的交互式登录与非登录 zsh 中，`java -version` 和 Maven 均已验证使用 JDK 21。旧终端需刷新或重开；非交互进程需核对自身 `JAVA_HOME` |
| Maven | 3.9.11 | 上述新 zsh 会话中选择 Java 21；启动前仍建议执行 `mvn -version` 确认 |
| Node.js / npm | 前端项目内 `core/core-frontend/node`：Node 23.11.0、npm 10.9.2；全局 Node 24.21.0、npm 11.18.0 | DataEase 前端构建优先使用项目内版本；不要把全局版本当作项目版本 |
| MySQL | Homebrew MySQL 8.4.11_7；全局 `mysql` 命令解析为 9.5 客户端 | 本次使用隔离目录 `/Users/xiaomei/opt/dataease3.0/mysql` 启动 MySQL 8.4，监听 `127.0.0.1:3307`；用本机受限 root 配置通过 Unix socket 得到 `mysqld is alive`。应用已成功启动并响应 API；未另行确认库表数。Homebrew 默认 MySQL 8.4 服务曾因误用由 9.5 初始化的数据目录而启动失败，随后已停止；未删除或重建任何数据目录 |
| Redis | Homebrew Redis 8.10.2_1 | 本次启动隔离实例，监听 `127.0.0.1:6379`，`PING` 返回 `PONG`；配置为 protected mode、关闭 RDB/AOF、数据目录 `/tmp/dataease-redis`。不要将该实例用于共享或重要数据 |
| DataEase 前后端 | 前端依赖和构建产物存在 | 本次已启动 Vite 前端 `127.0.0.1:7070` 和后端 `127.0.0.1:8100`；前端页面、前端登录参数代理和后端登录参数 API 均返回 HTTP 200。浏览器页面未由自动化工具确认可视登录表单；未输入或提交账号密码 |
| Docker | 此前 Codex 终端未找到 `docker` 命令 | 最近一轮盘点未重新确认；需要容器运行时先执行 `docker --version` |

## 项目与工作区

- 仓库：`/Users/xiaomei/Documents/projects/dataease`
- 最近记录的分支：`pr@dev-v3@update_sge_governance_skill`
- 最近记录的 HEAD：`ea4e6eff312901af5cb89a2b0743dcb78c0f200c`（2026-10-14 19:25 -0700）。这是盘点时的版本，不保证仍是当前 HEAD。
- 盘点时工作区包含用户未提交/未跟踪的 Dashboard、KYM/TCO 内容。开始新任务前运行 `git status --short`；不要清理、覆盖、暂存或提交无关改动。
- 项目记录版本：DataEase 源码 3.2.0、前端 3.0.0。

## 本地配置与账号边界

- 外置应用配置文件：`/Users/xiaomei/opt/dataease3.0/config/application.yml`，盘点时权限为 `0600`。
- MySQL root 客户端配置：`mysql-root.cnf`（与部署配置同一配置目录），盘点时权限为 `0600`。不要把文件内容复制到聊天、日志或提交中。
- 现有配置记录中有数据库 `dataeasev3` 和受限应用用户 `dataease_dev`；最近的数据库认证检查未通过，因此不能据此确认账号当前有效、授权正确或库表存在。
- DataEase 应用用户记录为 `admin`。替代登录密码的来源是仓库根目录 `classpath:substitule.json` 中的 `pwd` 字段；Token 密钥也可能位于该配置文件。不要读取或输出这些值。该文件权限是否已收紧尚未确认。
- Redis 当前是否要求认证没有在最近盘点中单独验证。不要依据旧启动记录把“无密码”当成当前凭据结论。
- 当前虽有 DataEase 前后端进程，但未完成真实账号登录；没有经登录验证的应用会话或可确认的实时用户凭据。安装文档中的初始账号不代表本机实例已初始化。

## 构建产物与验证记录

- 前端 `node_modules` 与 `dist` 存在；后端 `core/core-backend/target/CoreApplication.jar` 存在。
- Jar 的已知修改时间为 2026-10-14 00:20:37；该次构建使用 `-DskipTests`，不能作为测试通过的证据。
- 过去曾记录 API 代理成功、数据库初始化 71 张表和 Redis `PONG`。这些是历史结果；由于当前前后端未运行且 MySQL root 认证未通过，不能推断这些状态仍成立。

## 开发会话开始前

1. 执行 `git status --short`，确认并保留已有工作区改动。
2. 在准备启动服务的终端执行 `java -version` 和 `mvn -version`，确认均使用 Java 21；旧终端可重开或刷新 shell。
3. 在 `core/core-frontend` 核对项目 Node/npm 版本，并确认本地依赖仍可用。
4. 先以不回显凭据的方式确认 MySQL 3307 的认证、`dataease_dev` 授权及 `dataeasev3` schema；不要直接把 root 凭据用于应用连接。
5. 确认 Redis 是本地隔离实例，再启动 DataEase。后端启动可能执行数据库迁移或写入元数据，只能指向专用开发库。
6. 启动后再核对 8100 / 7070 监听、API 代理、登录流程及测试所需数据。停止服务或重启前确认没有其他开发任务在使用同一实例。

## 状态声明边界

本文只汇总已记录的安装信息、配置位置和最近一次运行检查。HTTP 200 及数据库存活检查不证明账号可登录、数据完整或产品测试通过。对于密码、Token、真实连接串以及配置文件内容，以本机受限权限配置为准，始终不要将秘密复制到 Dashboard。

## 登录后自动启动

- macOS 当前使用 `~/Library/LaunchAgents/` 管理本地服务。用户登录后，MySQL `3307`、Redis `6379` 自动启动；随后登录启动项打开 Terminal 并执行 `~/opt/dataease3.0/start-dataease.command`，启动后端 `8100` 和前端 `7070`。
- 这是“用户登录后启动”，不是登录界面出现前就能访问。重启 Mac 后先登录该用户，再打开 [DataEase 工作台](http://127.0.0.1:7070/#/panel/index?dvId=985192741891870720)。
- 前后端通过 Terminal 启动，是因为 macOS 会阻止后台 LaunchAgent 直接读取 `Documents` 下的项目文件；当前配置无需给 Java 或 Node 授予全盘访问权限。
- 启动脚本：`/Users/xiaomei/opt/dataease3.0/start-dataease.command`。LaunchAgent：`com.xiaomei.dataease.mysql-dev`、`com.xiaomei.dataease.redis-dev`、`com.xiaomei.dataease.app-startup`。
- 检查服务监听：`lsof -nP -iTCP:3307 -iTCP:6379 -iTCP:8100 -iTCP:7070 -sTCP:LISTEN`。日志位于 `/Users/xiaomei/opt/dataease3.0/logs/`，包括 `backend-launchd.*.log`、`frontend-launchd.*.log` 和 MySQL/Redis 启动日志。
- 当前已验证四个端口监听，`http://127.0.0.1:7070/` 与 `http://127.0.0.1:8100/` 均返回 HTTP 200。完整关机再登录的周期尚未实测。
