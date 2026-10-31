import { prepareTextSingleSelectValueState } from '../../src/custom-component/filter-copy/query-text-single-select-value-state'

const plainJson = {
  snapshot: { revision: 8, resourceId: 'dashboard-1', componentId: 'q1' },
  expectedBinding: { revision: 8, resourceId: 'dashboard-1', componentId: 'q1' },
  valueState: {
    displayType: '0',
    multiple: false,
    optionValueSource: 0,
    defaultValueCheck: true,
    defaultValueFirstItem: false,
    defaultValue: 'A'
  }
}

// @ts-expect-error Plain JSON cannot satisfy the opaque verified provenance types.
prepareTextSingleSelectValueState(plainJson)
