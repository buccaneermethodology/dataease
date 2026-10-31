import { projectQueryReferenceInput } from './query-schema-projection'
import { resolveTargetComponentMap } from './query-target-component-map'
import {
  prepareQueryReferences,
  type QueryReferenceInput,
  type QueryReferencePlan
} from './query-reference-plan'
import type { ProjectionReason } from './query-schema-projection'
import type { QueryTargetComponentMapFailureReason } from './query-target-component-map'
import type { QueryReferenceFailureReason } from './query-reference-plan'

export interface QueryReferencePipelineInput {
  propValue: unknown
  cascade?: unknown
  sourceComponents: unknown
  targetComponents: unknown
  maps: {
    conditionMap: unknown
    nodeMap: unknown
  }
}

export type QueryReferencePipelineResult =
  | { ok: true; value: QueryReferencePlan }
  | { ok: false; stage: 'QPROJ'; reason: ProjectionReason }
  | { ok: false; stage: 'QMAP'; reason: QueryTargetComponentMapFailureReason }
  | { ok: false; stage: 'QPREP'; reason: QueryReferenceFailureReason }

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)

export const prepareQueryReferencePipeline = (input: unknown): QueryReferencePipelineResult => {
  const raw = isRecord(input) ? input : {}
  const maps = isRecord(raw.maps) ? raw.maps : {}
  const projection = projectQueryReferenceInput({
    propValue: raw.propValue,
    cascade: raw.cascade,
    sourceComponents: raw.sourceComponents,
    maps: {
      conditionMap: maps.conditionMap,
      nodeMap: maps.nodeMap,
      componentMap: {}
    }
  })
  if (!projection.ok) return { ok: false, stage: 'QPROJ', reason: projection.reason }

  const mapping = resolveTargetComponentMap({
    references: projection.value.conditions.flatMap(condition => condition.targetRefs),
    sourceComponents: raw.sourceComponents,
    targetComponents: raw.targetComponents
  })
  if (!mapping.ok) return { ok: false, stage: 'QMAP', reason: mapping.reason }

  const prepared = prepareQueryReferences({
    ...projection.value,
    componentMap: mapping.componentMap
  } as QueryReferenceInput)
  if (!prepared.ok) return { ok: false, stage: 'QPREP', reason: prepared.reason }
  return { ok: true, value: prepared.value }
}
