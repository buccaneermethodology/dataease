# Manual2 纯 helper controlled failure injection r001

状态：`CONTROLLED_RED_OBSERVED`。本次运行显式设置 `MANUAL2_PURE_FORCE_UNIMPLEMENTED=1`，使用冻结合同和同一 28 个 case identity，强制 runner 走 `UNIMPLEMENTED` stub。此记录是可复现的 runner 失败敏感性证据，**不是历史 source-missing RED 的原始日志**，不关闭历史 RED stdout/退出码缺失限制。

## 绑定

- Goal：`Goal.final.json` SHA-256 `f562da2eb14b84dc8083e138dd2eb8718a58041f01d08163eddf5fb2c71daef0`
- 冻结合同：`QueryTextSingleSelectManual2PureContract-r001.md` SHA-256 `4b930a4461fa5e91de1d57bf77b21d496705f1d909a4c22991c293976b214863
- Cases：`QueryTextSingleSelectManual2PureCases-r001.json` SHA-256 `5497a5b8fff2761b52b0035ba7a4f9c531cfdceb3e23be622f89294c89e729a1
- Runner：`core/core-frontend/tests/filter-copy-query-reference/query-single-select-manual2-pure.test.ts` SHA-256 `ed61301c2a932437a4cf426f639323d96b5f11c05c5dcdb4334b2c8083b1a151
- Helper source：`core/core-frontend/src/custom-component/filter-copy/query-single-select-manual2-pure.ts` SHA-256 `8b2b892de636e59e0ca0ba3c7e7e752cb9edb1027244d28bfb4597fa25bcef23
- Lane Card canonical SHA-256：`cc852be9808e9ef26bc01002486e0a93ba7f51bf56efbea21bb34231d2f30790`；Context Bootstrap validate、Card validate/render 与 target Builder admission 均通过。

## 执行结果

命令：`MANUAL2_PURE_FORCE_UNIMPLEMENTED=1 node tests/filter-copy-query-reference/query-single-select-manual2-pure.test.ts`

工作目录：`core/core-frontend`
退出码：`1`
观察：`contract_valid=true`、`execution_ok=true`、`execution_errors=[]`；28 个冻结用例及 5 项扩展行为断言共 33 项失败，全部观察到 `UNIMPLEMENTED` 与预期 `OK`/`REJECTED` 不符；case identity 未变化。source 元信息仍为真实文件 `exists=true`、SHA `8b2b892de636e59e0ca0ba3c7e7e752cb9edb1027244d28bfb4597fa25bcef23`、状态 `LOADED`。

该控制实验只说明 runner 能检测显式注入的未实现返回值。它不是正常实现的行为验证，也不是生产入口测试、权限测试或Goal验收。

## 原始输出

### stdout

```text
contract_valid=true
{"suite":"MANUAL2-PURE-HELPER","contract_valid":true,"execution_ok":true,"execution_errors":[],"source":{"path":"core/core-frontend/src/custom-component/filter-copy/query-single-select-manual2-pure.ts","exists":true,"fingerprint":"8b2b892de636e59e0ca0ba3c7e7e752cb9edb1027244d28bfb4597fa25bcef23","status":"LOADED"},"frozen_case_ids":["M2P-001","M2P-002","M2P-003","M2P-004","M2P-005","M2P-006","M2P-007","M2P-008","M2P-009","M2P-010","M2P-011","M2P-012","M2P-013","M2P-014","M2P-015","M2P-016","M2P-017","M2P-018","M2P-019","M2P-020","M2P-021","M2P-022","M2P-023","M2P-024","M2P-025","M2P-026","M2P-027","M2P-028"],"p2_checks":["own_defaultValue_undefined","mapValue_sparse_hole","array_extra_descriptor_symbol_accessor_getter_count_zero"],"behavior_checks":33,"behavior_failures":33}
```

### stderr

```text
(node:16720) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/xiaomei/Documents/projects/dataease/core/core-frontend/tests/filter-copy-query-reference/query-single-select-manual2-pure.test.ts is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /Users/xiaomei/Documents/projects/dataease/core/core-frontend/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
BEHAVIOR_FAILURE M2P-001: M2P-001
+ actual - expected

  {
+   carrier: null,
+   runtime: null,
+   status: 'UNIMPLEMENTED'
-   carrier: {
-     design: {
-       defaultValue: 'A',
-       defaultValueCheck: true,
-       defaultValueFirstItem: false,
-       valueSource: [
-         'A',
-         'B'
-       ]
-     },
-     schemaVersion: 1,
-     shape: {
-       displayType: '0',
-       multiple: false,
-       optionValueSource: 2
-     }
-   },
-   runtime: {
-     mapValue: [],
-     selectValue: 'A'
-   },
-   status: 'OK'
  }

BEHAVIOR_FAILURE M2P-002: M2P-002
+ actual - expected

  {
+   carrier: null,
+   runtime: null,
+   status: 'UNIMPLEMENTED'
-   carrier: {
-     design: {
-       defaultValueCheck: false,
-       defaultValueFirstItem: false,
-       valueSource: [
-         'A',
-         'B'
-       ]
-     },
-     schemaVersion: 1,
-     shape: {
-       displayType: '0',
-       multiple: false,
-       optionValueSource: 2
-     }
-   },
-   runtime: {
-     mapValue: [],
-     selectValue: {
-       '$js': 'undefined'
-     }
-   },
-   status: 'OK'
  }

BEHAVIOR_FAILURE M2P-003: M2P-003
+ actual - expected

  {
    carrier: null,
    runtime: null,
+   status: 'UNIMPLEMENTED'
-   status: 'REJECTED'
  }

BEHAVIOR_FAILURE M2P-004: M2P-004
+ actual - expected

  {
    carrier: null,
    runtime: null,
+   status: 'UNIMPLEMENTED'
-   status: 'REJECTED'
  }

BEHAVIOR_FAILURE M2P-005: M2P-005
+ actual - expected

  {
    carrier: null,
    runtime: null,
+   status: 'UNIMPLEMENTED'
-   status: 'REJECTED'
  }

BEHAVIOR_FAILURE M2P-006: M2P-006
+ actual - expected

  {
    carrier: null,
    runtime: null,
+   status: 'UNIMPLEMENTED'
-   status: 'REJECTED'
  }

BEHAVIOR_FAILURE M2P-007: M2P-007
+ actual - expected

  {
+   carrier: null,
+   runtime: null,
+   status: 'UNIMPLEMENTED'
-   carrier: {
-     design: {
-       defaultValue: 'A',
-       defaultValueCheck: true,
-       defaultValueFirstItem: false,
-       valueSource: [
-         'A',
-         'B'
-       ]
-     },
-     schemaVersion: 1,
-     shape: {
-       displayType: '0',
-       multiple: false,
-       optionValueSource: 2
-     }
-   },
-   runtime: {
-     mapValue: [],
-     selectValue: 'A'
-   },
-   status: 'OK'
  }

BEHAVIOR_FAILURE M2P-008: M2P-008
+ actual - expected

  {
    carrier: null,
    runtime: null,
+   status: 'UNIMPLEMENTED'
-   status: 'REJECTED'
  }

BEHAVIOR_FAILURE M2P-009: M2P-009
+ actual - expected

  {
    carrier: null,
    runtime: null,
+   status: 'UNIMPLEMENTED'
-   status: 'REJECTED'
  }

BEHAVIOR_FAILURE M2P-010: M2P-010
+ actual - expected

  {
    carrier: null,
    runtime: null,
+   status: 'UNIMPLEMENTED'
-   status: 'REJECTED'
  }

BEHAVIOR_FAILURE M2P-011: M2P-011
+ actual - expected

  {
    carrier: null,
    runtime: null,
+   status: 'UNIMPLEMENTED'
-   status: 'REJECTED'
  }

BEHAVIOR_FAILURE M2P-012: M2P-012
+ actual - expected

  {
    carrier: null,
    runtime: null,
+   status: 'UNIMPLEMENTED'
-   status: 'REJECTED'
  }

BEHAVIOR_FAILURE M2P-013: M2P-013
+ actual - expected

  {
    carrier: null,
    runtime: null,
+   status: 'UNIMPLEMENTED'
-   status: 'REJECTED'
  }

BEHAVIOR_FAILURE M2P-014: M2P-014
+ actual - expected

  {
    carrier: null,
    runtime: null,
+   status: 'UNIMPLEMENTED'
-   status: 'REJECTED'
  }

BEHAVIOR_FAILURE M2P-015: M2P-015
+ actual - expected

  {
    carrier: null,
    runtime: null,
+   status: 'UNIMPLEMENTED'
-   status: 'REJECTED'
  }

BEHAVIOR_FAILURE M2P-016: M2P-016
+ actual - expected

  {
    carrier: null,
    runtime: null,
+   status: 'UNIMPLEMENTED'
-   status: 'REJECTED'
  }

BEHAVIOR_FAILURE M2P-017: M2P-017
+ actual - expected

  {
    carrier: null,
    runtime: null,
+   status: 'UNIMPLEMENTED'
-   status: 'REJECTED'
  }

BEHAVIOR_FAILURE M2P-018: M2P-018
+ actual - expected

  {
+   carrier: null,
+   runtime: null,
+   status: 'UNIMPLEMENTED'
-   carrier: {
-     design: {
-       defaultValueCheck: false,
-       defaultValueFirstItem: false,
-       valueSource: [
-         'A',
-         'B'
-       ]
-     },
-     schemaVersion: 1,
-     shape: {
-       displayType: '0',
-       multiple: false,
-       optionValueSource: 2
-     }
-   },
-   runtime: {
-     mapValue: [],
-     selectValue: {
-       '$js': 'undefined'
-     }
-   },
-   status: 'OK'
  }

BEHAVIOR_FAILURE M2P-019: M2P-019
+ actual - expected

  {
+   carrier: null,
+   runtime: null,
+   status: 'UNIMPLEMENTED'
-   carrier: {
-     design: {
-       defaultValue: ' A ',
-       defaultValueCheck: true,
-       defaultValueFirstItem: false,
-       valueSource: [
-         ' A ',
-         'B'
-       ]
-     },
-     schemaVersion: 1,
-     shape: {
-       displayType: '0',
-       multiple: false,
-       optionValueSource: 2
-     }
-   },
-   runtime: {
-     mapValue: [],
-     selectValue: ' A '
-   },
-   status: 'OK'
  }

BEHAVIOR_FAILURE M2P-020: M2P-020
+ actual - expected

  {
    carrier: null,
    runtime: null,
+   status: 'UNIMPLEMENTED'
-   status: 'REJECTED'
  }

BEHAVIOR_FAILURE M2P-021: M2P-021
+ actual - expected

  {
    carrier: null,
    runtime: null,
+   status: 'UNIMPLEMENTED'
-   status: 'REJECTED'
  }

BEHAVIOR_FAILURE M2P-022: M2P-022
+ actual - expected

  {
    carrier: null,
    runtime: null,
+   status: 'UNIMPLEMENTED'
-   status: 'REJECTED'
  }

BEHAVIOR_FAILURE M2P-023: M2P-023
+ actual - expected

  {
    carrier: null,
    runtime: null,
+   status: 'UNIMPLEMENTED'
-   status: 'REJECTED'
  }

BEHAVIOR_FAILURE M2P-024: M2P-024
+ actual - expected

  {
+   carrier: null,
+   runtime: null,
+   status: 'UNIMPLEMENTED'
-   carrier: {
-     design: {
-       defaultValue: 'A',
-       defaultValueCheck: true,
-       defaultValueFirstItem: false,
-       valueSource: [
-         'A',
-         'B'
-       ]
-     },
-     schemaVersion: 1,
-     shape: {
-       displayType: '0',
-       multiple: false,
-       optionValueSource: 2
-     }
-   },
-   runtime: {
-     mapValue: [],
-     selectValue: 'A'
-   },
-   status: 'OK'
  }

BEHAVIOR_FAILURE M2P-025: M2P-025
+ actual - expected

  {
    carrier: null,
    runtime: null,
+   status: 'UNIMPLEMENTED'
-   status: 'REJECTED'
  }

BEHAVIOR_FAILURE M2P-026: M2P-026
+ actual - expected

  {
    carrier: null,
    runtime: null,
+   status: 'UNIMPLEMENTED'
-   status: 'REJECTED'
  }

BEHAVIOR_FAILURE M2P-027: M2P-027
+ actual - expected

  {
    carrier: null,
    runtime: null,
+   status: 'UNIMPLEMENTED'
-   status: 'REJECTED'
  }

BEHAVIOR_FAILURE M2P-028: M2P-028
+ actual - expected

  {
    carrier: null,
    runtime: null,
+   status: 'UNIMPLEMENTED'
-   status: 'REJECTED'
  }

BEHAVIOR_FAILURE detached-carrier-runtime-and-cross-call-mutation-isolation: Expected values to be strictly equal:
+ actual - expected

+ 'UNIMPLEMENTED'
- 'OK'

BEHAVIOR_FAILURE rejected-result-across-call-mutation-isolation: Expected values to be strictly deep-equal:
+ actual - expected

  {
    carrier: null,
    runtime: null,
+   status: 'UNIMPLEMENTED'
-   status: 'REJECTED'
  }

BEHAVIOR_FAILURE P2-own-defaultValue-undefined-is-treated-as-absent: Expected values to be strictly equal:
+ actual - expected

+ 'UNIMPLEMENTED'
- 'OK'

BEHAVIOR_FAILURE P2-mapValue-sparse-hole-is-rejected: Expected values to be strictly deep-equal:
+ actual - expected

  {
    carrier: null,
    runtime: null,
+   status: 'UNIMPLEMENTED'
-   status: 'REJECTED'
  }

BEHAVIOR_FAILURE P2-array-extra-own-property-symbol-and-accessor-are-rejected-without-getter-call: Expected values to be strictly deep-equal:
+ actual - expected

  {
    carrier: null,
    runtime: null,
+   status: 'UNIMPLEMENTED'
-   status: 'REJECTED'
  }
```

## 原分母与限制

保留 Goal 10 项 AC / 26 项 must-have / 16 项产品义务，`Scope Delta: none`。历史 source-missing RED 的原始 stdout/退出码仍未保存；当前控制注入不将其补造。产品来源认证/接线、真实权限、保存/历史及完整 S02 Goal 仍未验收。
