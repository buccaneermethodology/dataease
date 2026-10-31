# SH-SELECT-TEXT 来源 oracle 设计修复证据 r001

- Finding：`F-ST-SRC-ORACLE-001` (P2)，来自独立Review `QueryProductAdapterSelectTextSourceOracleDesignReview-r001.md`。
- 采用处置：Option 2，仅验证 handler 状态转移；移除ST-SRC-004 CANCEL的真实JavaScript Promise rejection要求。测试适配器记录取消信号且不调用确认回调，预期只检查dataset/cascade/buffer和零发布/请求。
- Promise rejection与Element/UI未捕获错误处理保持 `NOT_RUN / UNKNOWN`；不改产品代码。
- 其他case、身份、分母及状态保持：001..005仍候选未运行、006/007 NOT_READY；Goal 10/26/16不变，Scope Delta none。
