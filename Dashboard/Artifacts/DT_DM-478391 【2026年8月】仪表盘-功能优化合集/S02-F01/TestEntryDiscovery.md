# 纯合同测试入口调查 r001

状态：测试执行入口候选，不是产品测试包、可信RED或实现准入。

## 发现

- `core/core-frontend/package.json` 没有 `test`、Vitest、Jest、tsx、ts-node 或 vite-node 脚本/依赖。
- `core/core-frontend/tests/map-legend-format/check.mjs` 展示了现有可复用模式：直接运行Node脚本，用仓库已有esbuild bundle实际生产TypeScript模块，仅在浏览器/图形边界加stub，并以断言失败作为运行结果。
- 本机前端工作区 `node -e "import('esbuild')..."` 返回可用；当前本机Node为v24.21.0。此证据只适用于当前开发环境，不声明团队/CI Node版本。未安装依赖。

## 候选执行方式

目标测试路径建议 `core/core-frontend/tests/filter-copy-pure-guards/check.mjs`，入口 `node tests/filter-copy-pure-guards/check.mjs`。测试应bundle一处明确的生产纯函数模块，并沿用Node内置assert或node:test；如需esbuild仅捆绑TS模块，复用现有依赖。权限、浏览器共享、真实时钟、完整envelope schema、查询组件与保存链不能stub后计作对应验收。

## 进入可信RED前必须补齐

1. 只选择r002允许的有限子合同，并确定其真实产品函数的精确源码路径、导出与调用方；不能在测试脚本里重新实现预期函数。
2. 固定同一17项case identity的运行绑定、命令、稳定失败指纹，并验证失败来自业务断言而不是缺模块/编译错误/环境缺失。
3. 形成当前源码revision、合同与Cases摘要、Design预审、实际topology的lane card，并按SP-010通过execution_admission_v1；Builder写入范围不得含冻结合同/用例。

本文件仅为入口调查与测试设计准备；没有创建测试源码、没有运行产品RED/GREEN、没有修改产品实现。
