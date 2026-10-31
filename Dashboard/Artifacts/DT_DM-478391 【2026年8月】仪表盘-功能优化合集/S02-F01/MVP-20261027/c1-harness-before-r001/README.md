# 图表 API 可选严格 outcome 的局部验证

在 `core/core-frontend` 执行：

```sh
node tests/filter-copy-mvp-api/check.mjs --mode green
```

重放写前源字节的有界 RED 时使用主控保全的 `baseline-source-r001/04-chart.ts`，显式传 `--api-source <保全文件绝对路径> --mode red`。此选项只读取指定完整 API 源文件；不改工作区源码、不复制被测函数。最终证据文件记录精确路径、原字节、编译字节、runner SHA 和案例身份。

Runner 将完整实际 `src/api/chart.ts` 和 `src/utils/CalculateFields.ts` 分别以内存 CJS 装载到每例新的 VM。网络 `request.post` 仅返回具名 envelope 或原异常；lodash 与 Base64 使用已安装实际库。解码函数只透明观察调用，并执行真实 CalculateFields 导出。没有启动服务、数据库或真实业务请求。

9 个用例覆盖严格成功、fulfilled 非零业务失败、网络 reject 原引用、stock-line 请求排序及入参不变、字符串 `"0"` 不当数值成功、成功空 DTO 不从 DTO 自身 code 猜成功，以及原默认接口三条兼容路径。输入中的两个过滤叶节点仅用于检测传递完整性，是模块测试数据，不是真实 UI serializer golden。

新增接口：

```ts
const outcome = await getData<MyChartDto>(candidateRequest, { reportOutcome: true })
if (outcome.ok) {
  // outcome.value 是既有解码完成后的原 DTO 引用。
} else {
  // outcome.error 是既有失败解码处理后的原 envelope，含 code/msg。
}
```

网络异常仍 reject。调用方必须处理它；API 不将 reject 变成成功。严格调用克隆输入后移除 clone.data，stock-line 的降序仅写请求副本。未传第二参数的 `getData(data)` 保持原 DTO/envelope 返回、原解码调用和既有 `delete data.data` 行为。

这是 API 适配器和真实解码模块的 focused 检查；网络 envelope 为测试桩，不证明真实 query、权限、候选渲染、目标发布、保存重开或 MVP 验收。案例全部执行，执行错误单独分类，不将导入或编译错误算有界 RED。
