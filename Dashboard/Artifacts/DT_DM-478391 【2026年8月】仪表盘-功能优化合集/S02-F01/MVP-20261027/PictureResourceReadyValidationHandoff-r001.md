# 图片候选资源就绪独立验收交接

原始Goal是完整S02/F01；本次只裁定图片候选准备有界修复，不关闭38项义务或49类型。设计2/3轮已PASS。产品局部写入已有精确admission，通用cache未改。新runner r002同字节对旧SFC RED（9失败9通过）与当前SFC GREEN（18通过）执行；旧picture4组、paste20组与lint通过。早期宿主axios import失败不是RED；RED/GREEN-r001与宿主时序修正保留历史，不混写。

请独立复验摘要、完整局部diff与原始目标；复跑baseline RED、当前GREEN及回归，检查18实例是否确实覆盖冻结16case及所有调度。要一次尽量查全，不首个阻断就停；报告全部发现、已查无问题维度、未查原因、同类残余、修复后准入预测。当前测试不是浏览器和权限证据；真实UI待后续，不能因未做真实UI授予产品完成。

特别检查：稳定化helper与decode交错、cache clear/recreate、总10秒deadline、late无src写、相对URL原属性、对象源身份、取消与监听清理、empty/OFF、metadata。宿主未覆盖的schedule应标NOT_RUN或要求补齐，不能按case目录当全执行。既有shared cache/helper导出风险不在本次修改范围。没有KB更新或最终Goal closeout；Sessions及Stop Gate将在独立结果后追加绑定。
