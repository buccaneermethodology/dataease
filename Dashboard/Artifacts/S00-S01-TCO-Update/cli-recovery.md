# CLI 路径恢复

首轮结构检查通过，但verify/package引用了旧0.4.2虚拟环境路径，已不存在；失败未产生成功声明。读取当前tco shebang确认0.4.4安装解释器为bm-kym-tco/bin/python，修正本次命令后重跑。未安装或升级工具。
原三个历史结构命令已保存到historical-verification-commands.json及写前配置；当前配置仅登记r004一致性验证，未移除产品验证，因为原命令也均为旧候选结构验证。
