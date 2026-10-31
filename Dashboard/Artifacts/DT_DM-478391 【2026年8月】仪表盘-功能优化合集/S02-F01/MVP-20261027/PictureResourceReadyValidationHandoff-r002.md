# 图片资源准备第二轮验证交接

本Validation第2/3轮，设计已在独立第2/3轮冻结，无新产品代码变化。消费首轮完整报告全部F1-F4：

- F1：新增独立r004 runner，37实例展开全部16case调度，包括扫描前占位load、扫描前成功/失败显式地址不等见证、门前load、重复dispose、decode stale、clear/recreate、source变化、断连及对象替换。旧runner、冻结与日志保留原字节。
- F2：src变化重置complete/naturalWidth和deferred decode；新增新地址未load/decode保持pending的断言。最终cache decode明确计数2。直接/外链/相对地址、真正cache最终decode reject均执行。真实helper只包before/after调度hook，内部仍执行生产代码；SFC编译仅追加测试状态/ref访问口，业务函数未替换。身份转换仍是显式provider替身，不能声称真实权限通过。
- F3：每个case在主动unmount前核finish监听/计时器、零共享write/query，销毁后再次核cleanup与settle一次。src写入历史与resolve时计数比较可抓迟到写；观察signal排除本case显式clear的预期abort，验证候选取消不abort共享请求。可控performance与timer同clock，9999/10000边界、timer不dispatch仍拒绝及多个资源阶段共享原10秒deadline均展开。
- F4：独立TraceabilityErrata关联Goal 06/08/12；旧错误映射仅保留历史，不修改Goal或旧冻结设计。BDD可读行为卡已同步。

同字节r004 runner：冻结旧SFC RED 18失败/19通过；当前SFC GREEN 37通过。非Builder独立第二轮须自己复跑及检查全部修复，不凭此交接相信通过。真实UI仍NOT_RUN；38项义务与49类型分母不变。当前源仍为首轮绑定的077c69a92610691ab4d1bfb8b088b942a8c7d93d65a5cc46604df860f9901ea0。
