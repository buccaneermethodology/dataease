export type G2RenderCleanup = () => void

export interface G2RenderInstance {
  destroy(): void
}

export type G2RenderCreateResult<T extends G2RenderInstance> =
  | { kind: 'instance'; instance: T }
  | { kind: 'empty' }

export interface G2RenderScope<T extends G2RenderInstance> {
  readonly instance: T
  readonly closed: boolean
  isCurrent(): boolean
  replaceCleanup(key: string, cleanup: G2RenderCleanup): Error[]
  removeCleanup(key: string): Error[]
  dispose(): Error[]
}

export interface G2RenderAttemptOptions<T extends G2RenderInstance> {
  create(): G2RenderCreateResult<T> | Promise<G2RenderCreateResult<T>>
  isCurrent(): boolean
  setup(scope: G2RenderScope<T>): void
  render(scope: G2RenderScope<T>): void | Promise<void>
  afterRender(scope: G2RenderScope<T>): void | Promise<void>
  initialCleanups?: { key: string; cleanup: G2RenderCleanup }[]
  onCleanupErrors?(errors: Error[]): void
}

export type G2RenderAttemptResult<T extends G2RenderInstance> =
  | { status: 'ready'; scope: G2RenderScope<T>; cleanupErrors: Error[] }
  | { status: 'empty' | 'stale'; cleanupErrors: Error[] }

export class G2RenderAttemptFailure extends Error {
  readonly code: 'G2_RENDER_ATTEMPT_FAILED' | 'G2_RENDER_INSTANCE_MISSING'
  readonly originalError: unknown
  readonly cause: unknown
  readonly cleanupErrors: Error[]

  constructor(
    originalError: unknown,
    cleanupErrors: Error[],
    code: 'G2_RENDER_ATTEMPT_FAILED' | 'G2_RENDER_INSTANCE_MISSING' = 'G2_RENDER_ATTEMPT_FAILED'
  ) {
    super(
      code === 'G2_RENDER_INSTANCE_MISSING'
        ? 'G2 render attempt did not return an instance or an explicit empty result'
        : 'G2 render attempt failed'
    )
    this.name = 'G2RenderAttemptFailure'
    this.code = code
    this.originalError = originalError
    this.cause = originalError
    this.cleanupErrors = [...cleanupErrors]
  }
}

function cleanupError(error: unknown): Error {
  if (error instanceof Error) return error
  return Object.assign(new Error('G2 cleanup threw a non-Error value'), { cause: error })
}

export async function createG2RenderAttempt<T extends G2RenderInstance>(
  options: G2RenderAttemptOptions<T>
): Promise<G2RenderAttemptResult<T>> {
  const cleanups = new Map<string, G2RenderCleanup>()
  const attemptErrors: Error[] = []
  let instance: T | undefined
  let closed = false
  let finished = false
  let missingInstance = false

  const runCleanup = (cleanup: G2RenderCleanup): Error[] => {
    try {
      cleanup()
      return []
    } catch (error) {
      return [cleanupError(error)]
    }
  }

  // 通知只包含本次清理错误；通知自身的异常返回给调用者，不递归通知。
  const reportCleanupErrors = (errors: Error[]): Error[] => {
    if (!errors.length) return errors
    const reported = [...errors]
    try {
      options.onCleanupErrors?.([...errors])
    } catch (error) {
      reported.push(cleanupError(error))
    }
    if (!finished) attemptErrors.push(...reported)
    return reported
  }

  const dispose = (): Error[] => {
    if (closed) return []
    closed = true
    const pending = [...cleanups.values()].reverse()
    cleanups.clear()
    const errors: Error[] = []
    for (const cleanup of pending) errors.push(...runCleanup(cleanup))
    const ownedInstance = instance
    if (ownedInstance) errors.push(...runCleanup(() => ownedInstance.destroy()))
    return errors
  }

  const removeCleanup = (key: string): Error[] => {
    const cleanup = cleanups.get(key)
    if (!cleanup) return []
    // 先移除登记，cleanup 重入 remove/dispose 时不会重复执行本项。
    cleanups.delete(key)
    return reportCleanupErrors(runCleanup(cleanup))
  }

  const replaceCleanup = (key: string, cleanup: G2RenderCleanup): Error[] => {
    const errors: Error[] = []
    // 清旧项时可能重入并登记相同 key；外层接管前逐项释放，不能覆盖遗失。
    let previous = cleanups.get(key)
    while (previous) {
      cleanups.delete(key)
      errors.push(...runCleanup(previous))
      previous = cleanups.get(key)
    }
    // cleanup 也可能重入并关闭 scope，因此释放后再次判断 closed。
    if (closed) errors.push(...runCleanup(cleanup))
    else cleanups.set(key, cleanup)
    return reportCleanupErrors(errors)
  }

  const release = () => reportCleanupErrors(dispose())
  const terminal = (status: 'empty' | 'stale'): G2RenderAttemptResult<T> => {
    release()
    finished = true
    return { status, cleanupErrors: [...attemptErrors] }
  }
  const current = () => !closed && options.isCurrent()

  try {
    for (const initial of options.initialCleanups ?? []) {
      replaceCleanup(initial.key, initial.cleanup)
    }
    if (!current()) return terminal('stale')

    const created = await options.create()
    if (
      !created ||
      (created.kind !== 'empty' &&
        (created.kind !== 'instance' ||
          !created.instance ||
          typeof created.instance.destroy !== 'function'))
    ) {
      missingInstance = true
      throw new Error('G2 render instance is missing')
    }
    if (created.kind === 'instance') instance = created.instance
    if (!current()) return terminal('stale')
    if (created.kind === 'empty') return terminal('empty')

    const scope: G2RenderScope<T> = {
      instance: created.instance,
      get closed() {
        return closed
      },
      isCurrent: () => options.isCurrent(),
      replaceCleanup,
      removeCleanup,
      dispose
    }
    options.setup(scope)
    if (!current()) return terminal('stale')
    await options.render(scope)
    if (!current()) return terminal('stale')
    await options.afterRender(scope)
    if (!current()) return terminal('stale')

    finished = true
    return { status: 'ready', scope, cleanupErrors: [...attemptErrors] }
  } catch (originalError) {
    release()
    finished = true
    throw new G2RenderAttemptFailure(
      missingInstance ? undefined : originalError,
      attemptErrors,
      missingInstance ? 'G2_RENDER_INSTANCE_MISSING' : 'G2_RENDER_ATTEMPT_FAILED'
    )
  }
}
